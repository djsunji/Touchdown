import Link from "next/link";
import type { CSSProperties } from "react";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { CATEGORIES } from "@/lib/categories";
import { styleFor } from "@/lib/cityArt";
import { loadChat } from "@/lib/chat";
import { ChatTeaser } from "@/components/ChatRoom";
import { Meetups } from "@/components/Meetups";
import { PracticalInfo } from "@/components/PracticalInfo";
import { OfflineSave } from "@/components/OfflineSave";
import { defaultMeetupTime, loadMeetups } from "@/lib/meetups";
import { mapConfig } from "@/lib/mapConfig";

const FEATURED = CATEGORIES.filter((c) => c.featured);
const OTHERS = CATEGORIES.filter((c) => !c.featured);

export default async function DestinationPage({ params }: { params: Promise<{ dest: string }> }) {
  const { dest } = await params;
  const user = await requireUser();
  const destination = await db.destination.findUniqueOrThrow({ where: { code: dest } });
  const entries = await db.entry.findMany({
    where: { destinationCode: dest },
    select: { id: true, title: true, category: true, lat: true, ratings: { select: { stars: true } }, photos: { select: { id: true } } },
  });

  const lastMessages = await loadChat(dest, user, undefined, 1);
  const meetups = await loadMeetups(dest, destination.timezone, user);
  const maps = mapConfig();
  const onMap = entries.filter((e) => e.lat != null).length;
  // Pages (and photo thumbnails) stored by "Für offline speichern"
  const offlineUrls = [
    `/${dest}`,
    `/${dest}/karte`,
    ...CATEGORIES.filter((c) => countBy(c.slug) > 0).map((c) => `/${dest}/${c.slug}`),
    ...entries.flatMap((e) => e.photos.map((p) => `/api/photos/${p.id}?size=thumb`)),
  ];


  // Best rated tips per category, for the preview on the big tiles
  const topTips = (slug: string) =>
    entries
      .filter((e) => e.category === slug && e.ratings.length > 0)
      .map((e) => ({ ...e, avg: e.ratings.reduce((s, r) => s + r.stars, 0) / e.ratings.length }))
      .sort((a, b) => b.avg - a.avg || b.ratings.length - a.ratings.length)
      .slice(0, 2);

  const sky = styleFor(dest, destination.artSeed).sky;
  function countBy(slug: string) {
    return entries.filter((e) => e.category === slug).length;
  }
  const tipLabel = (n: number) => `${n} ${n === 1 ? "Tipp" : "Tipps"}`;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/" className="back-btn">
        ← Alle Destinationen
      </Link>
      <section className="space-y-2">
        <div className="flex items-center gap-4">
          <span className="dest-code">{destination.code}</span>
          <div>
            <h1 className="text-2xl font-bold">{destination.city}</h1>
            <p className="text-gray-500">
              {destination.country} · {tipLabel(entries.length)} von Kolleg:innen
            </p>
          </div>
        </div>
        {destination.hotelName && (
          <p className="text-sm text-gray-600">
            🏨 Crew-Hotel: <b>{destination.hotelName}</b>
            {destination.hotelAddress && <>, {destination.hotelAddress}</>}
          </p>
        )}
      </section>

      <ChatTeaser dest={dest} city={destination.city} initial={lastMessages} />

      <Meetups dest={dest} meetups={meetups} defaultTime={defaultMeetupTime(destination.timezone)} city={destination.city} />

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

      {maps && (
        <Link href={`/${dest}/karte`} className="map-teaser">
          <span className="text-3xl" aria-hidden>
            🗺️
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">Karte {destination.city}</span>
            <span className="block text-sm text-white/80">
              {onMap ? `${onMap} ${onMap === 1 ? "Tipp" : "Tipps"} auf der Karte` : "Noch keine Tipps mit Position"}
              {destination.hotelLat != null ? ", mit Fussweg ab dem Crew-Hotel" : ""}
            </span>
          </span>
          <span aria-hidden>→</span>
        </Link>
      )}

      <PracticalInfo d={destination} isAdmin={user.isAdmin} />

      <OfflineSave urls={offlineUrls} city={destination.city} />

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
