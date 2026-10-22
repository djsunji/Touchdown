import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { CATEGORIES } from "@/lib/categories";
import { CITY_STYLE, cityArt } from "@/lib/cityArt";
import { UserMenu } from "@/components/UserMenu";
import { Brand } from "@/components/Brand";
import { digestFor, SEVEN_DAYS } from "@/lib/digest";

export default async function Home() {
  const user = await requireUser();
  const destinations = await db.destination.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { entries: true } } },
  });
  const total = destinations.reduce((sum, d) => sum + d._count.entries, 0);
  // Chat activity in the last 24 hours, shown on the city cards
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const chatActivity = await db.chatMessage.groupBy({ by: ["destinationCode"], where: { createdAt: { gte: since } }, _count: true });
  const chatCount = Object.fromEntries(chatActivity.map((c) => [c.destinationCode, c._count]));
  // "Für dich": the user's nightstops in the next 14 days with tips added in the last week
  const forYou = await digestFor(user.id, new Date(Date.now() - SEVEN_DAYS));
  const day = (d: Date) => d.toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "numeric", timeZone: "UTC" });

  return (
    <div className="min-h-dvh">
      <header className="bg-brand text-brand-contrast">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Brand />
          <UserMenu user={user} />
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <span className="eyebrow">Crew Nightstops</span>
          <h1>Wohin geht&apos;s heute Nacht?</h1>
          <p>Restaurants, Ausflüge und Insidertipps von Kolleg:innen, für jede Destination auf einen Blick.</p>
          <div className="stats">
            <span><b>{destinations.length}</b>Destinationen</span>
            <span><b>{total}</b>{total === 1 ? "Tipp" : "Tipps"}</span>
            <span><b>{CATEGORIES.length}</b>Kategorien</span>
          </div>
        </div>
      </section>

      <main className="dest-wrap">
        {forYou.length > 0 && (
          <section className="mb-5 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5" aria-labelledby="foryou-h">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 id="foryou-h" className="font-semibold">
                ✨ Für deine nächsten Nightstops
              </h2>
              <Link href="/meine-nightstops" className="text-sm text-brand underline">
                Bearbeiten
              </Link>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {forYou.map((s) => (
                <li key={s.id} className="rounded-lg bg-gray-50 p-3">
                  <Link href={`/${s.code}`} className="font-medium hover:underline">
                    <b className="font-mono">{s.code}</b> {s.city} <span className="text-sm font-normal text-gray-500">· {day(s.date)}</span>
                  </Link>
                  {s.tips.length ? (
                    <ul className="mt-1 space-y-0.5 text-sm">
                      {s.tips.slice(0, 4).map((t) => (
                        <li key={t.id} className="truncate">
                          <Link href={`/${s.code}/${t.category}#${t.id}`} className="text-brand hover:underline">
                            {t.title}
                          </Link>{" "}
                          <span className="text-gray-500">· {t.categoryLabel}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">Diese Woche keine neuen Tipps.</p>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
        <div className="dest-grid">
          {destinations.map((d) => {
            const n = d._count.entries;
            return (
              <Link key={d.code} href={`/${d.code}`} className="dest" aria-label={`${d.city}, ${n} Tipps`}>
                {/* Static artwork generated in src/lib/cityArt.ts, no user input */}
                <span className="art-wrap" dangerouslySetInnerHTML={{ __html: cityArt(d.code) }} />
                {chatCount[d.code] ? (
                  <span className="chat-live" title="Nachrichten im Crew-Chat in den letzten 24 Stunden">
                    💬 {chatCount[d.code]}
                  </span>
                ) : null}
                <span className="top-txt">
                  <span className="code">{d.code}</span>
                  <span className="city">{d.city}</span>
                  <span className="country">{d.country}</span>
                </span>
                <span className="bottom-txt">
                  <span className="pill">
                    {n} {n === 1 ? "Tipp" : "Tipps"}
                  </span>
                  <span className="landmark">{CITY_STYLE[d.code]?.tag}</span>
                  <span className="go">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
