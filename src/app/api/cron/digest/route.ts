import { timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { digestFor, SEVEN_DAYS } from "@/lib/digest";
import { escapeHtml, mailEnabled, sendMail } from "@/lib/mail";

// Weekly digest. Call once a week from a scheduler (cron, Azure Logic App, GitHub Actions):
//   curl -X POST -H "Authorization: Bearer $CRON_SECRET" https://<app>/api/cron/digest
// Sends one email per opted-in user with new tips for their nightstops in the next 14 days.
function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || secret.length < 16) return false;
  const given = Buffer.from(req.headers.get("authorization") ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "Nicht erlaubt" }, { status: 401 });
  if (!mailEnabled()) return NextResponse.json({ error: "SMTP ist nicht konfiguriert (SMTP_HOST, MAIL_FROM)" }, { status: 503 });

  const base = (process.env.AUTH_URL ?? "").replace(/\/$/, "");
  const users = await db.user.findMany({ where: { digestEnabled: true }, select: { id: true, email: true, name: true, lastDigestAt: true } });
  let sent = 0;
  let failed = 0;
  for (const u of users) {
    const since = new Date(Math.max(u.lastDigestAt?.getTime() ?? 0, Date.now() - SEVEN_DAYS));
    const stops = (await digestFor(u.id, since)).filter((s) => s.tips.length > 0);
    if (stops.length === 0) continue; // nothing new, no email

    const day = (d: Date) => d.toLocaleDateString("de-CH", { weekday: "short", day: "numeric", month: "numeric", timeZone: "UTC" });
    const text = [
      `Hallo ${u.name ?? ""}`.trim() + ",",
      "",
      "neue Tipps für deine nächsten Nightstops:",
      ...stops.flatMap((s) => [
        "",
        `${s.code} ${s.city} (${day(s.date)})`,
        ...s.tips.map((t) => `- ${t.title} (${t.categoryLabel}) ${base}/${s.code}/${t.category}#${t.id}`),
      ]),
      "",
      `Abmelden: ${base}/meine-nightstops`,
    ].join("\n");
    const html =
      `<p>Hallo ${escapeHtml(u.name ?? "")},</p><p>neue Tipps für deine nächsten Nightstops:</p>` +
      stops
        .map(
          (s) =>
            `<h3 style="margin:16px 0 4px">${escapeHtml(s.code)} ${escapeHtml(s.city)} <small>(${escapeHtml(day(s.date))})</small></h3><ul>` +
            s.tips
              .map((t) => `<li><a href="${escapeHtml(`${base}/${s.code}/${t.category}#${t.id}`)}">${escapeHtml(t.title)}</a> · ${escapeHtml(t.categoryLabel)}</li>`)
              .join("") +
            "</ul>",
        )
        .join("") +
      `<p style="color:#666;font-size:12px">Du bekommst diese Mail, weil du den Wochen-Digest in Touchdown eingeschaltet hast. <a href="${escapeHtml(base)}/meine-nightstops">Abmelden</a></p>`;
    try {
      await sendMail(u.email, "Touchdown: neue Tipps für deine Nightstops", text, html);
      await db.user.update({ where: { id: u.id }, data: { lastDigestAt: new Date() } });
      sent++;
    } catch {
      failed++;
    }
  }
  return NextResponse.json({ users: users.length, sent, failed });
}
