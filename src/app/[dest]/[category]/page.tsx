import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { getCategory } from "@/lib/categories";
import { EntryCard, type EntryView } from "@/components/EntryCard";

const SORTS = [
  { key: "az", label: "A–Z", short: "A–Z" },
  { key: "rating", label: "★ Bewertung", short: "★" },
  { key: "new", label: "Neueste", short: "Neu" },
  { key: "fav", label: "♥ Favoriten", short: "♥" },
] as const;
type SortKey = (typeof SORTS)[number]["key"];

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ dest: string; category: string }>;
  searchParams: Promise<{ sort?: string; q?: string }>;
}) {
  const { dest, category } = await params;
  const { sort: sortParam, q } = await searchParams;
  const cat = getCategory(category);
  if (!cat) notFound();
  const user = await requireUser();
  const sort: SortKey = SORTS.some((s) => s.key === sortParam) ? (sortParam as SortKey) : "az";
  const query = q?.trim() ?? "";

  const rows = await db.entry.findMany({
    where: {
      destinationCode: dest,
      category,
      ...(sort === "fav" ? { favorites: { some: { userId: user.id } } } : {}),
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
    },
  });

  const entries: EntryView[] = rows.map((r) => {
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

  const byTitle = (a: EntryView, b: EntryView) => a.title.localeCompare(b.title, "de", { sensitivity: "base" });
  entries.sort((a, b) => {
    if (sort === "rating") return b.avg - a.avg || b.count - a.count || byTitle(a, b);
    if (sort === "new") return b.createdAt.getTime() - a.createdAt.getTime();
    return byTitle(a, b);
  });

  const href = (s: SortKey) => {
    const p = new URLSearchParams();
    if (s !== "az") p.set("sort", s);
    if (query) p.set("q", query);
    const str = p.toString();
    return `/${dest}/${category}${str ? `?${str}` : ""}`;
  };

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

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="grid flex-1 grid-cols-4 overflow-hidden rounded-md bg-white text-sm shadow-sm ring-1 ring-black/5">
          {SORTS.map((s) => (
            <Link
              key={s.key}
              href={href(s.key)}
              className={`px-2 py-2.5 text-center ${sort === s.key ? "bg-gray-600 text-white" : "hover:bg-gray-50"}`}
            >
              <span className="sm:hidden">{s.short}</span>
              <span className="hidden sm:inline">{s.label}</span>
            </Link>
          ))}
        </div>
        <form className="sm:w-56">
          {sort !== "az" && <input type="hidden" name="sort" value={sort} />}
          <input
            name="q"
            defaultValue={query}
            placeholder="Suchen…"
            className="w-full rounded-md bg-white px-3 py-2.5 text-sm shadow-sm ring-1 ring-black/5"
          />
        </form>
      </div>

      {entries.length === 0 ? (
        <div className="rounded-lg bg-white p-8 text-center text-gray-500 shadow-sm ring-1 ring-black/5">
          {sort === "fav"
            ? "Du hast hier noch keine Favoriten. Tippe auf ♥ bei einem Eintrag."
            : query
              ? "Keine Treffer."
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
