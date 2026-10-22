import Link from "next/link";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { digestFor, SEVEN_DAYS, todayUtc } from "@/lib/digest";
import { mailEnabled } from "@/lib/mail";
import { removeNightstop, setDigest } from "@/app/actions";
import { Brand } from "@/components/Brand";
import { UserMenu } from "@/components/UserMenu";
import { NightstopForm } from "@/components/NightstopForm";

export const metadata = { title: "Meine Nightstops · Touchdown" };

const card = "rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5";
const day = (d: Date) => d.toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "long", timeZone: "UTC" });

export default async function MyNightstops() {
  const user = await requireUser();
  const today = todayUtc();
  const [stops, destinations, me] = await Promise.all([
    db.nightstop.findMany({
      where: { userId: user.id, date: { gte: today } },
      orderBy: { date: "asc" },
      include: { destination: { select: { city: true } } },
    }),
    db.destination.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" }, select: { code: true, city: true } }),
    db.user.findUniqueOrThrow({ where: { id: user.id }, select: { digestEnabled: true } }),
  ]);
  // Fresh tips for each upcoming stop, same logic as the weekly email
  const fresh = new Map((await digestFor(user.id, new Date(Date.now() - SEVEN_DAYS), 366)).map((s) => [s.id, s.tips.length]));
  const mail = mailEnabled();

  return (
    <div className="min-h-dvh">
      <header className="bg-brand text-brand-contrast">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4">
          <Link href="/" aria-label="Startseite">
            <Brand />
          </Link>
          <UserMenu user={user} />
        </div>
      </header>
      <main className="mx-auto max-w-2xl space-y-5 px-4 py-6">
        <Link href="/" className="back-btn">
          ← Alle Destinationen
        </Link>
        <div>
          <h1 className="text-2xl font-bold">📅 Meine Nightstops</h1>
          <p className="mt-1 text-sm text-gray-600">Trag deine nächsten Nightstops ein. Neue Tipps dafür siehst du auf der Startseite und auf Wunsch einmal pro Woche per Mail.</p>
        </div>

        <section className={card}>
          <NightstopForm destinations={destinations} today={today.toISOString().slice(0, 10)} />
        </section>

        <section className={card}>
          <h2 className="mb-2 font-semibold">Geplant</h2>
          {stops.length === 0 ? (
            <p className="text-sm text-gray-500">Noch keine Nightstops eingetragen.</p>
          ) : (
            <ul className="divide-y">
              {stops.map((s) => {
                const n = fresh.get(s.id) ?? 0;
                return (
                  <li key={s.id} className="flex items-center justify-between gap-3 py-2.5">
                    <Link href={`/${s.destinationCode}`} className="min-w-0 hover:underline">
                      <b className="font-mono">{s.destinationCode}</b> {s.destination.city}
                      <span className="block text-sm text-gray-500">
                        {day(s.date)}
                        {n > 0 && <span className="ml-2 font-medium text-green-700">✨ {n} neue Tipps</span>}
                      </span>
                    </Link>
                    <form action={removeNightstop.bind(null, s.id)}>
                      <button className="rounded-md px-2 py-1 text-sm text-gray-500 hover:bg-gray-50 hover:text-red-600" aria-label={`${s.destinationCode} am ${day(s.date)} entfernen`}>
                        Entfernen
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className={card}>
          <h2 className="mb-1 font-semibold">✉️ Wochen-Digest</h2>
          <p className="mb-3 text-sm text-gray-600">Einmal pro Woche eine Mail mit neuen Tipps für deine Nightstops der nächsten zwei Wochen. Ohne neue Tipps kommt keine Mail.</p>
          {mail ? (
            <form action={setDigest.bind(null, !me.digestEnabled)} className="flex items-center gap-3">
              <span className={`badge ${me.digestEnabled ? "badge-open" : ""}`}>{me.digestEnabled ? "eingeschaltet" : "ausgeschaltet"}</span>
              <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">{me.digestEnabled ? "Ausschalten" : "Einschalten"}</button>
            </form>
          ) : (
            <p className="text-sm text-gray-500">Der Mailversand ist auf diesem Server noch nicht eingerichtet. Neue Tipps siehst du trotzdem auf der Startseite.</p>
          )}
        </section>
      </main>
    </div>
  );
}
