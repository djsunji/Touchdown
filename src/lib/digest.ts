import { db } from "@/lib/db";
import { getCategory } from "@/lib/categories";

const DAY = 24 * 60 * 60 * 1000;

export function todayUtc() {
  return new Date(new Date().toISOString().slice(0, 10) + "T00:00:00Z");
}

/** New tips (since `since`) for each of the user's nightstops in the next `days` days. */
export async function digestFor(userId: string, since: Date, days = 14) {
  const today = todayUtc();
  const stops = await db.nightstop.findMany({
    where: { userId, date: { gte: today, lte: new Date(today.getTime() + days * DAY) } },
    orderBy: { date: "asc" },
    include: { destination: { select: { code: true, city: true, active: true } } },
  });
  const codes = [...new Set(stops.map((s) => s.destinationCode))];
  const entries = codes.length
    ? await db.entry.findMany({
        where: { destinationCode: { in: codes }, createdAt: { gte: since }, createdById: { not: userId } },
        orderBy: { createdAt: "desc" },
        select: { id: true, title: true, category: true, destinationCode: true, createdAt: true },
      })
    : [];
  return stops
    .filter((s) => s.destination.active)
    .map((s) => ({
      id: s.id,
      date: s.date,
      code: s.destination.code,
      city: s.destination.city,
      tips: entries
        .filter((e) => e.destinationCode === s.destinationCode)
        .slice(0, 8)
        .map((e) => ({ ...e, categoryLabel: getCategory(e.category)?.label ?? e.category })),
    }));
}

export const SEVEN_DAYS = 7 * DAY;
