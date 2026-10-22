import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getCategory } from "@/lib/categories";
import { EntryCard, type EntryView } from "@/components/EntryCard";
import { hotelOf } from "@/lib/cities";
import { walking, walkingLabel } from "@/lib/geo";
import { openState, WEEKDAYS } from "@/lib/time";
import { MAX_PHOTOS_PER_ENTRY } from "@/lib/photos";
import { mapConfig } from "@/lib/mapConfig";

const SORTS = [
  { key: "az", label: "A–Z", short: "A–Z" },
  { key: "rating", label: "★ Bewertung", short: "★" },
  { key: "new", label: "Neueste", short: "Neu" },
  { key: "near", label: "🚶 Nähe", short: "🚶" },
  { key: "fav", label: "♥ Favoriten", short: "♥" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];

type Filters = { price: number | null; open: boolean; veg: boolean };

function hoursLabel(from: string | null, until: string | null, closed: number[]) {
  if (!from || !until) return null;
  const days = closed.length ? ` · Ruhetag: ${[...closed].sort().map((d) => WEEKDAYS[d]).join(", ")}` : "";
  return `${from}–${until} Uhr${days}`;
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ dest: string; category: string }>;
  searchParams: Promise<{ sort?: string; q?: string; price?: string; open?: string; veg?: string }>;
}) {
  const { dest, category } = await params;
  const { sort: sortParam, q, price, open, veg } = await searchParams;
  const cat = getCategory(category);
  if (!cat) notFound();
  const user = await requireUser();
  const sort: SortKey = SORTS.some((s) => s.key === sortParam) ? (sortParam as SortKey) : "az";
  const query = q?.trim().slice(0, 100) ?? "";
  const filters: Filters = {
    price: ["1", "2", "3"].includes(price ?? "") ? Number(price) : null,
    open: open === "1",
    veg: veg === "1",
  };
  const destination = await db.destination.findUniqueOrThrow({ where: { code: dest } });
  const hotel = hotelOf(destination);
  const maps = mapConfig();

  const rows = await db.entry.findMany({
    where: {
      destinationCode: dest,
      category,
      ...(sort === "fav" ? { favorites: { some: { userId: user.id } } } : {}),
      ...(filters.price ? { priceLevel: filters.price } : {}),
      ...(filters.veg ? { veggie: true } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" as const } },
              { description: { contains: query, mode: "insensitive" as const } },
              { address: { contains: query, mode: "insensitive" as const } },
              { comments: { some: { text: { contains: query, mode: "insensitive" as const } } } },
            ],
          }
        : {}),
    },
    include: {
      createdBy: { select: { name: true, email: true } },
      ratings: { select: { stars: true, userId: true } },
      favorites: { where: { userId: user.id }, select: { userId: true } },
      comments: { orderBy: { createdAt: "asc" }, include: { user: { select: { name: true, email: true } } } },
      photos: { orderBy: { createdAt: "asc" }, select: { id: true, userId: true } },
    },
  });
  const now = new Date();

  let entries: (EntryView & { meters: number | null })[] = rows.map((r) => {
    const pos = r.lat != null && r.lng != null ? { lat: r.lat, lng: r.lng } : null;
    const count = r.ratings.length;
    const avg = count ? r.ratings.reduce((s, x) => s + x.stars, 0) / count : 0;
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      address: r.address,
      phone: r.phone,
      mapsUrl: r.mapsUrl,
      website: r.website,
      createdAt: r.createdAt,
      authorName: r.createdBy.name ?? r.createdBy.email.split("@")[0],
      avg,
      count,
      myRating: r.ratings.find((x) => x.userId === user.id)?.stars ?? 0,
      isFavorite: r.favorites.length > 0,
      canEdit: r.createdById === user.id || user.isAdmin,
      editHref: `/${dest}/${category}/${r.id}/edit`,
      mapHref: pos && maps ? `/${dest}/karte?tipp=${r.id}` : null,
      priceLevel: r.priceLevel,
      open: openState(r.openFrom, r.openUntil, r.closedDays, destination.timezone, now),
      hours: hoursLabel(r.openFrom, r.openUntil, r.closedDays),
      veggie: r.veggie,
      walk: pos && hotel ? walkingLabel(hotel, pos) : null,
      meters: pos && hotel ? walking(hotel, pos).meters : null,
      photos: r.photos.map((p) => ({ id: p.id, canDelete: p.userId === user.id || r.createdById === user.id || user.isAdmin })),
      photoSlots: MAX_PHOTOS_PER_ENTRY - r.photos.length,
      comments: r.comments.map((c) => ({
        id: c.id,
        authorName: c.user.name ?? c.user.email.split("@")[0],
        text: c.text,
        createdAt: c.createdAt,
        stars: r.ratings.find((x) => x.userId === c.userId)?.stars ?? 0,
        canDelete: c.userId === user.id || user.isAdmin,
      })),
    };
  });

  if (filters.open) entries = entries.filter((e) => e.open?.open);

  const byTitle = (a: EntryView, b: EntryView) => a.title.localeCompare(b.title, "de", { sensitivity: "base" });
  entries.sort((a, b) => {
    if (sort === "rating") return b.avg - a.avg || b.count - a.count || byTitle(a, b);
    if (sort === "new") return b.createdAt.getTime() - a.createdAt.getTime();
    if (sort === "near") return (a.meters ?? Infinity) - (b.meters ?? Infinity) || byTitle(a, b);
    return byTitle(a, b);
  });

  const href = (s: SortKey, f: Filters = filters) => {
    const p = new URLSearchParams();
    if (s !== "az") p.set("sort", s);
    if (query) p.set("q", query);
    if (f.price) p.set("price", String(f.price));
    if (f.open) p.set("open", "1");
    if (f.veg) p.set("veg", "1");
    const str = p.toString();
    return `/${dest}/${category}${str ? `?${str}` : ""}`;
  };
  const anyFilter = !!(filters.price || filters.open || filters.veg);
  const sorts = SORTS.filter((s) => s.key !== "near" || hotel);
  const chip = (active: boolean) =>
    `touch-target rounded-full px-3 py-1.5 text-sm ring-1 ${active ? "bg-brand text-brand-contrast ring-brand" : "bg-white ring-black/10 hover:bg-gray-50"}`;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">
          {dest}: {cat.label}
        </h1>
        <Link
          href={`/${dest}/${category}/new`}
          className="shrink-0 rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-contrast hover:opacity-90"
        >
          + Neuer Tipp
        </Link>
      </div>

      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
        <div
          className="grid flex-1 overflow-hidden rounded-md bg-white text-sm shadow-sm ring-1 ring-black/5"
          style={{ gridTemplateColumns: `repeat(${sorts.length}, minmax(0, 1fr))` }}
        >
          {sorts.map((s) => (
            <Link
              key={s.key}
              href={href(s.key)}
              className={`touch-target px-2 py-2.5 text-center whitespace-nowrap ${sort === s.key ? "bg-gray-600 text-white" : "hover:bg-gray-50"}`}
            >
              <span className="sm:hidden">{s.short}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </Link>
          ))}
        </div>
        <form className="xl:w-56">
          {sort !== "az" && <input type="hidden" name="sort" value={sort} />}
          {filters.price && <input type="hidden" name="price" value={filters.price} />}
          {filters.open && <input type="hidden" name="open" value="1" />}
          {filters.veg && <input type="hidden" name="veg" value="1" />}
          <input
            name="q"
            defaultValue={query}
            placeholder="Suchen…"
            className="w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-sm ring-1 ring-black/5"
          />
        </form>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2" aria-label="Filter">
        {[1, 2, 3].map((n) => (
          <Link key={n} href={href(sort, { ...filters, price: filters.price === n ? null : n })} className={chip(filters.price === n)}>
            {"€".repeat(n)}
          </Link>
        ))}
        <Link href={href(sort, { ...filters, open: !filters.open })} className={chip(filters.open)}>
          🟢 Jetzt offen
        </Link>
        <Link href={href(sort, { ...filters, veg: !filters.veg })} className={chip(filters.veg)}>
          🌱 Vegetarisch
        </Link>
        {anyFilter && (
          <Link href={href(sort, { price: null, open: false, veg: false })} className="px-2 text-sm text-gray-500 underline">
            Filter zurücksetzen
          </Link>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm ring-1 ring-black/5">
          {sort === "fav"
            ? "Du hast hier noch keine Favoriten. Tippe auf ♥ bei einem Eintrag."
            : query || anyFilter
              ? "Keine Treffer. Versuch es mit weniger Filtern."
              : "Noch keine Tipps in dieser Kategorie. Sei die erste Person, die einen teilt!"}
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((e) => (
            <EntryCard key={e.id} e={e} />
          ))}
        </div>
      )}
    </div>
  );
}
