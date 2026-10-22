import Link from "next/link";
import { db } from "@/lib/db";
import { requireAdmin, isBootstrapAdmin } from "@/lib/session";
import { getCategory } from "@/lib/categories";
import { REPORT_TYPE_LABEL, type ReportType } from "@/lib/reports";
import { mapConfig } from "@/lib/mapConfig";
import { mapCenter } from "@/lib/cities";
import { Brand } from "@/components/Brand";
import { UserMenu } from "@/components/UserMenu";
import { DestinationForm } from "@/components/DestinationForm";
import { deleteReportedContent, resolveReport, setUserRole } from "./actions";

export const metadata = { title: "Admin · Touchdown" };

const TABS = [
  { key: "meldungen", label: "⚑ Meldungen" },
  { key: "rollen", label: "👥 Rollen" },
  { key: "destinationen", label: "🌍 Destinationen" },
] as const;

const card = "rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5";
const fmt = (d: Date) => d.toLocaleString("de-CH", { dateStyle: "short", timeStyle: "short", timeZone: "Europe/Zurich" });

type Preview = { text: string; by: string; href: string | null; photoId?: string } | null;

async function previews(reports: { targetType: string; targetId: string }[]) {
  const ids = (t: string) => reports.filter((r) => r.targetType === t).map((r) => r.targetId);
  const [entries, comments, chats, photos] = await Promise.all([
    db.entry.findMany({ where: { id: { in: ids("entry") } }, include: { createdBy: true } }),
    db.comment.findMany({ where: { id: { in: ids("comment") } }, include: { user: true, entry: true } }),
    db.chatMessage.findMany({ where: { id: { in: ids("chat") } }, include: { user: true } }),
    db.photo.findMany({ where: { id: { in: ids("photo") } }, select: { id: true, user: true, entry: true } }),
  ]);
  const map = new Map<string, Preview>();
  const name = (u: { name: string | null; email: string }) => u.name ?? u.email;
  const entryHref = (e: { id: string; destinationCode: string; category: string }) => `/${e.destinationCode}/${getCategory(e.category) ? e.category : ""}#${e.id}`;
  for (const e of entries) map.set(`entry:${e.id}`, { text: `${e.title}: ${e.description}`, by: name(e.createdBy), href: entryHref(e) });
  for (const c of comments) map.set(`comment:${c.id}`, { text: c.text, by: name(c.user), href: entryHref(c.entry) });
  for (const m of chats) map.set(`chat:${m.id}`, { text: m.text, by: name(m.user), href: `/${m.destinationCode}/chat` });
  for (const p of photos) map.set(`photo:${p.id}`, { text: `Foto zu «${p.entry.title}»`, by: name(p.user), href: entryHref(p.entry), photoId: p.id });
  return map;
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ tab?: string; alle?: string }> }) {
  const user = await requireAdmin();
  const sp = await searchParams;
  const tab = TABS.some((t) => t.key === sp.tab) ? sp.tab! : "meldungen";
  const openCount = await db.report.count({ where: { status: "open" } });

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
      <main className="mx-auto max-w-4xl space-y-5 px-4 py-6">
        <Link href="/" className="back-btn">
          ← Alle Destinationen
        </Link>
        <h1 className="text-2xl font-bold">Admin</h1>
        <nav className="flex flex-wrap gap-2" aria-label="Admin-Bereiche">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`/admin?tab=${t.key}`}
              aria-current={tab === t.key ? "page" : undefined}
              className={`rounded-full px-4 py-1.5 text-sm font-medium ${tab === t.key ? "bg-brand text-brand-contrast" : "bg-white ring-1 ring-black/10 hover:bg-gray-50"}`}
            >
              {t.label}
              {t.key === "meldungen" && openCount > 0 && <span className="ml-1.5 rounded-full bg-red-500 px-1.5 text-xs font-bold text-white">{openCount}</span>}
            </Link>
          ))}
        </nav>
        {tab === "meldungen" && <Reports showDone={sp.alle === "1"} />}
        {tab === "rollen" && <Roles selfId={user.id} />}
        {tab === "destinationen" && <Destinations />}
      </main>
    </div>
  );
}

async function Reports({ showDone }: { showDone: boolean }) {
  const reports = await db.report.findMany({
    where: showDone ? {} : { status: "open" },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { reporter: { select: { name: true, email: true } } },
  });
  // One card per reported item, newest report first
  const groups = new Map<string, typeof reports>();
  for (const r of reports) {
    const key = `${r.targetType}:${r.targetId}`;
    groups.set(key, [...(groups.get(key) ?? []), r]);
  }
  const preview = await previews(reports);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-600">{showDone ? "Alle Meldungen (die letzten 200)" : "Offene Meldungen"}</p>
        <Link href={showDone ? "/admin?tab=meldungen" : "/admin?tab=meldungen&alle=1"} className="text-brand underline">
          {showDone ? "Nur offene zeigen" : "Auch erledigte zeigen"}
        </Link>
      </div>
      {groups.size === 0 && <p className={`${card} text-sm text-gray-500`}>Keine offenen Meldungen. 🎉</p>}
      {[...groups.entries()].map(([key, rs]) => {
        const first = rs[0];
        const p = preview.get(key);
        const open = rs.some((r) => r.status === "open");
        return (
          <article key={key} className={card}>
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="badge">{REPORT_TYPE_LABEL[first.targetType as ReportType] ?? first.targetType}</span>
              <span className={`badge ${open ? "badge-closed" : "badge-open"}`}>{open ? "offen" : "erledigt"}</span>
              <span className="text-gray-500">
                {rs.length} {rs.length === 1 ? "Meldung" : "Meldungen"}
              </span>
            </div>
            {p ? (
              <div className="flex gap-3">
                {p.photoId && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/api/photos/${p.photoId}?size=thumb`} alt="" className="h-20 w-20 shrink-0 rounded-md object-cover" />
                )}
                <div className="min-w-0">
                  <p className="line-clamp-3 text-sm break-words whitespace-pre-line text-gray-800">{p.text}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    von {p.by}
                    {p.href && (
                      <>
                        {" · "}
                        <Link href={p.href} className="text-brand underline">
                          ansehen
                        </Link>
                      </>
                    )}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">Inhalt wurde bereits gelöscht.</p>
            )}
            <ul className="mt-3 space-y-1 border-t pt-2 text-sm">
              {rs.map((r) => (
                <li key={r.id} className="text-gray-700">
                  <b>{r.reason}</b>
                  {r.note && <span className="break-words">: {r.note}</span>}
                  <span className="text-xs text-gray-500">
                    {" "}
                    · {r.reporter.name ?? r.reporter.email}, {fmt(r.createdAt)}
                    {r.status === "done" && r.resolvedBy && ` · erledigt von ${r.resolvedBy}`}
                  </span>
                </li>
              ))}
            </ul>
            {open && (
              <div className="mt-3 flex flex-wrap gap-2">
                <form action={resolveReport.bind(null, first.id)}>
                  <button className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50">✓ Ist in Ordnung</button>
                </form>
                {p && (
                  <details className="group">
                    <summary className="cursor-pointer list-none rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50">🗑 Inhalt löschen…</summary>
                    <form action={deleteReportedContent.bind(null, first.id)} className="mt-2">
                      <button className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700">Endgültig löschen</button>
                    </form>
                  </details>
                )}
              </div>
            )}
          </article>
        );
      })}
    </section>
  );
}

async function Roles({ selfId }: { selfId: string }) {
  const users = await db.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { entries: true } } },
  });
  return (
    <section className={card}>
      <p className="mb-3 text-sm text-gray-600">
        Admins können Meldungen bearbeiten, Inhalte löschen, praktische Infos pflegen und Destinationen anlegen. Admins aus <code>ADMIN_EMAILS</code> werden in der
        Konfiguration verwaltet.
      </p>
      <ul className="divide-y">
        {users.map((u) => {
          const boot = isBootstrapAdmin(u.email);
          const admin = u.role === "admin" || boot;
          return (
            <li key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
              <div className="min-w-0">
                <div className="font-medium">
                  {u.name ?? u.email} {admin && <span className="badge ml-1">🛡️ Admin</span>}
                </div>
                <div className="truncate text-xs text-gray-500">
                  {u.email} · {u._count.entries} Tipps · seit {u.createdAt.toLocaleDateString("de-CH")}
                </div>
              </div>
              {u.id === selfId ? (
                <span className="text-xs text-gray-400">Du</span>
              ) : boot ? (
                <span className="text-xs text-gray-400">fest (ADMIN_EMAILS)</span>
              ) : (
                <form action={setUserRole.bind(null, u.id, admin ? "user" : "admin")}>
                  <button className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50">{admin ? "Admin entfernen" : "Zum Admin machen"}</button>
                </form>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

async function Destinations() {
  const destinations = await db.destination.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { entries: true } } } });
  const config = mapConfig();
  return (
    <section className="space-y-3">
      <details className={card}>
        <summary className="cursor-pointer font-semibold">➕ Neue Destination anlegen</summary>
        <div className="mt-4">
          <DestinationForm mapConfig={config} center={null} />
        </div>
      </details>
      {destinations.map((d) => (
        <details key={d.code} className={card}>
          <summary className="flex cursor-pointer flex-wrap items-center gap-2">
            <b className="font-mono">{d.code}</b> {d.city}
            <span className="text-sm text-gray-500">
              · {d.country} · {d._count.entries} Tipps
            </span>
            {!d.active && <span className="badge badge-closed">inaktiv</span>}
            {d.hotelLat == null && <span className="badge">kein Hotel auf Karte</span>}
          </summary>
          <div className="mt-4">
            <DestinationForm
              mapConfig={config}
              center={mapCenter(d)}
              d={{
                code: d.code,
                city: d.city,
                country: d.country,
                timezone: d.timezone,
                active: d.active,
                hotelName: d.hotelName,
                hotelAddress: d.hotelAddress,
                hotelLat: d.hotelLat,
                hotelLng: d.hotelLng,
                landmark: d.landmark,
                artSeed: d.artSeed,
              }}
            />
            <p className="mt-3 text-sm text-gray-500">
              Praktische Infos (Transfer, Währung, Notfallnummern …) pflegst du direkt auf der{" "}
              <Link href={`/${d.code}`} className="text-brand underline">
                Seite von {d.city}
              </Link>
              .
            </p>
          </div>
        </details>
      ))}
    </section>
  );
}
