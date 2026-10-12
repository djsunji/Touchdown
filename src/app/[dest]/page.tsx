import Link from "next/link";
import type { CSSProperties } from "react";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { CATEGORIES } from "@/lib/categories";
import { CITY_STYLE } from "@/lib/cityArt";
import { updateDestinationInfo } from "@/app/actions";

const FEATURED = CATEGORIES.filter((c) => c.featured);
const OTHERS = CATEGORIES.filter((c) => !c.featured);
const FALLBACK_SKY = ["#0a2148", "#2f7fd0"];

export default async function DestinationPage({ params }: { params: Promise<{ dest: string }> }) {
  const { dest } = await params;
  const user = await getCurrentUser();
  const destination = await db.destination.findUniqueOrThrow({ where: { code: dest } });
  const entries = await db.entry.findMany({
    where: { destinationCode: dest },
    select: { id: true, title: true, category: true, ratings: { select: { stars: true } } },
  });

  const countBy = (slug: string) => entries.filter((e) => e.category === slug).length;
  // Best rated tips per category, for the preview on the big tiles
  const topTips = (slug: string) =>
    entries
      .filter((e) => e.category === slug && e.ratings.length > 0)
      .map((e) => ({ ...e, avg: e.ratings.reduce((s, r) => s + r.stars, 0) / e.ratings.length }))
      .sort((a, b) => b.avg - a.avg || b.ratings.length - a.ratings.length)
      .slice(0, 2);

  const sky = CITY_STYLE[dest]?.sky ?? FALLBACK_SKY;
  const tipLabel = (n: number) => `${n} ${n === 1 ? "Tipp" : "Tipps"}`;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="space-y-3">
        <div className="flex items-center gap-4">
          <span className="dest-code">{destination.code}</span>
          <div>
            <h1 className="text-2xl font-bold">{destination.city}</h1>
            <p className="text-gray-500">
              {destination.country} · {tipLabel(entries.length)} von Kolleg:innen
            </p>
          </div>
        </div>
        {destination.info && (
          <p className="rounded-lg bg-white p-4 whitespace-pre-line text-gray-700 shadow-sm ring-1 ring-black/5">{destination.info}</p>
        )}
        {user?.isAdmin && (
          <details>
            <summary className="cursor-pointer text-sm text-brand underline">Destinations-Info bearbeiten (Admin)</summary>
            <form action={updateDestinationInfo.bind(null, dest)} className="mt-2 space-y-2">
              <textarea
                name="info"
                defaultValue={destination.info}
                rows={4}
                placeholder="z. B. Crew-Hotel, Transfer, Besonderheiten"
                className="w-full rounded-md border p-2 text-sm"
              />
              <button className="rounded-md bg-brand px-3 py-1.5 text-sm text-brand-contrast">Speichern</button>
            </form>
          </details>
        )}
      </section>

      <section className="feat-grid">
        {FEATURED.map((c, i) => {
          const n = countBy(c.slug);
          const tops = topTips(c.slug);
          const style = { "--c1": sky[0], "--c2": sky[1], "--rot": `${135 + i * 20}deg` } as CSSProperties;
          return (
            <Link key={c.slug} href={`/${dest}/${c.slug}`} className="feat" style={style}>
              <span className="feat-head">
                <span className="feat-ico">{c.icon}</span>
                <span className="feat-n">{tipLabel(n)}</span>
              </span>
              <span className="feat-lbl">{c.label}</span>
              <span className="feat-hint">{c.hint}</span>
              <span className="feat-tops">
                {tops.length > 0 ? (
                  tops.map((t) => (
                    <span key={t.id} className="feat-top">
                      <b>★ {t.avg.toFixed(1)}</b> {t.title}
                    </span>
                  ))
                ) : (
                  <span className="feat-top muted">{n ? "Noch keine Bewertungen" : "Noch keine Tipps. Teile den ersten!"}</span>
                )}
              </span>
            </Link>
          );
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Weitere Kategorien</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {OTHERS.map((c) => {
            const n = countBy(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/${dest}/${c.slug}`}
                className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5 hover:shadow-md"
              >
                <div className="text-2xl">{c.icon}</div>
                <div className="mt-1 text-sm font-medium">{c.label}</div>
                <div className="text-xs text-gray-400">{n ? tipLabel(n) : "Noch leer"}</div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
