import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { CATEGORIES, getCategory } from "@/lib/categories";
import { mapConfig } from "@/lib/mapConfig";
import { hotelOf } from "@/lib/cities";
import { walking, walkingLabel } from "@/lib/geo";
import { MapView } from "@/components/MapView";

export default async function MapPage({
  params,
  searchParams,
}: {
  params: Promise<{ dest: string }>;
  searchParams: Promise<{ tipp?: string; kat?: string }>;
}) {
  const { dest } = await params;
  const { tipp, kat } = await searchParams;
  await requireUser();
  const maps = mapConfig();
  if (!maps) notFound();
  const destination = await db.destination.findUniqueOrThrow({ where: { code: dest } });
  const hotel = hotelOf(destination);
  const category = kat && getCategory(kat) ? kat : null;
  const rows = await db.entry.findMany({
    where: { destinationCode: dest, lat: { not: null }, lng: { not: null }, ...(category ? { category } : {}) },
    select: { id: true, title: true, category: true, lat: true, lng: true, ratings: { select: { stars: true } } },
  });
  const tips = rows
    .map((r) => {
      const pos = { lat: r.lat!, lng: r.lng! };
      const cat = getCategory(r.category);
      const avg = r.ratings.length ? r.ratings.reduce((s, x) => s + x.stars, 0) / r.ratings.length : 0;
      return {
        id: r.id,
        ...pos,
        title: r.title,
        icon: cat?.icon ?? "📍",
        href: `/${dest}/${r.category}#${r.id}`,
        sub: [cat?.label, avg ? `★ ${avg.toFixed(1)}` : null, hotel ? walkingLabel(hotel, pos) : null].filter(Boolean).join(" · "),
        meters: hotel ? walking(hotel, pos).meters : 0,
      };
    })
    .sort((a, b) => a.meters - b.meters || a.title.localeCompare(b.title, "de"));
  const usedCats = CATEGORIES.filter((c) => c.slug === category || rows.some((r) => r.category === c.slug));

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">🗺️ Karte {destination.city}</h1>
        <p className="text-sm text-gray-500">
          {hotel ? "🏨 = Crew-Hotel. Gehzeiten sind geschätzt (Luftlinie mit Umwegen)." : "Sobald ein Admin das Crew-Hotel einträgt, siehst du hier auch die Gehzeiten."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Link href={`/${dest}/karte`} className={`rounded-full px-3 py-1.5 text-sm ring-1 ${!category ? "bg-brand text-brand-contrast ring-brand" : "bg-white ring-black/10"}`}>
          Alle
        </Link>
        {usedCats.map((c) => (
          <Link
            key={c.slug}
            href={`/${dest}/karte?kat=${c.slug}`}
            className={`rounded-full px-3 py-1.5 text-sm ring-1 ${category === c.slug ? "bg-brand text-brand-contrast ring-brand" : "bg-white ring-black/10"}`}
          >
            {c.icon} {c.label}
          </Link>
        ))}
      </div>
      <MapView config={maps} hotel={hotel} points={tips} focusId={tipp} className="h-[60vh] min-h-[320px]" />
      {tips.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-center text-gray-500 shadow-sm ring-1 ring-black/5">
          Noch keine Tipps mit Position. Beim Erstellen oder Bearbeiten eines Tipps kannst du den Ort auf der Karte setzen.
        </p>
      ) : (
        <ol className="divide-y rounded-lg bg-white shadow-sm ring-1 ring-black/5">
          {tips.map((t) => (
            <li key={t.id}>
              <Link href={t.href} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50">
                <span className="text-xl" aria-hidden>
                  {t.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{t.title}</span>
                  <span className="block text-sm text-gray-500">{t.sub}</span>
                </span>
                <span aria-hidden>→</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
