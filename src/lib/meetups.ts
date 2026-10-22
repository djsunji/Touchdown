import { db } from "@/lib/db";
import type { CurrentUser } from "@/lib/session";
import { formatInTz, tzParts, utcToZonedInput, zonedToUtc } from "@/lib/time";

const HOUR = 60 * 60 * 1000;
// A meetup stays visible until 3 hours after its start, and is deleted after a day.
const VISIBLE_AFTER_START = 3 * HOUR;

export type MeetupView = {
  id: string;
  title: string;
  place: string | null;
  when: string;
  past: boolean;
  attendees: string[];
  joined: boolean;
  canDelete: boolean;
};

export async function loadMeetups(dest: string, tz: string, user: CurrentUser): Promise<MeetupView[]> {
  const now = Date.now();
  await db.meetup.deleteMany({ where: { startsAt: { lt: new Date(now - 24 * HOUR) } } });
  const rows = await db.meetup.findMany({
    where: { destinationCode: dest, startsAt: { gte: new Date(now - VISIBLE_AFTER_START) } },
    orderBy: { startsAt: "asc" },
    include: { attendees: { orderBy: { joinedAt: "asc" }, include: { user: { select: { name: true, email: true } } } } },
  });
  const today = utcToZonedInput(new Date(now), tz).slice(0, 10);
  const tomorrow = utcToZonedInput(new Date(now + 24 * HOUR), tz).slice(0, 10);
  return rows.map((m) => {
    const day = utcToZonedInput(m.startsAt, tz).slice(0, 10);
    const time = formatInTz(m.startsAt, tz, { hour: "2-digit", minute: "2-digit" });
    const dayLabel = day === today ? "Heute" : day === tomorrow ? "Morgen" : formatInTz(m.startsAt, tz, { weekday: "short", day: "numeric", month: "numeric" });
    return {
      id: m.id,
      title: m.title,
      place: m.place,
      when: `${dayLabel}, ${time} Uhr`,
      past: m.startsAt.getTime() < now,
      attendees: m.attendees.map((a) => a.user.name ?? a.user.email.split("@")[0]),
      joined: m.attendees.some((a) => a.userId === user.id),
      canDelete: m.createdById === user.id || user.isAdmin,
    };
  });
}

/** Default for a new meetup: today 19:00 local time, or tomorrow if that has passed. */
export function defaultMeetupTime(tz: string) {
  const now = new Date();
  const p = tzParts(now, tz);
  const pad = (n: number) => String(n).padStart(2, "0");
  let local = `${p.year}-${pad(p.month)}-${pad(p.day)}T19:00`;
  const at = zonedToUtc(local, tz);
  if (at && at.getTime() < now.getTime()) local = utcToZonedInput(new Date(at.getTime() + 24 * HOUR), tz);
  return { value: local, min: utcToZonedInput(now, tz) };
}
