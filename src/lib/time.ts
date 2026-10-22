// Time zone helpers (Intl only, no extra library). Opening hours and meetup times
// are entered in the local time of the destination.

const HHMM = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function isHHMM(v: string) {
  return HHMM.test(v);
}

function minutesOf(v: string) {
  const [h, m] = v.split(":").map(Number);
  return h * 60 + m;
}

/** Wall clock parts of `date` in time zone `tz`. weekday: 0 = Sunday. */
export function tzParts(date: Date, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { year: +get("year"), month: +get("month"), day: +get("day"), hour: +get("hour"), minute: +get("minute"), weekday };
}

function offsetMs(date: Date, tz: string) {
  const p = tzParts(date, tz);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - Math.floor(date.getTime() / 60000) * 60000;
}

/** "2026-10-22T19:00" in `tz` → UTC Date. */
export function zonedToUtc(local: string, tz: string): Date | null {
  const m = local.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!m) return null;
  const guess = Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]);
  let result = guess - offsetMs(new Date(guess), tz);
  result = guess - offsetMs(new Date(result), tz); // second pass handles DST changes
  return new Date(result);
}

/** UTC Date → "YYYY-MM-DDTHH:MM" wall time in `tz` (for datetime-local inputs). */
export function utcToZonedInput(date: Date, tz: string) {
  const p = tzParts(date, tz);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${p.year}-${pad(p.month)}-${pad(p.day)}T${pad(p.hour)}:${pad(p.minute)}`;
}

export function formatInTz(date: Date, tz: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("de-CH", { timeZone: tz, ...opts }).format(date);
}

export function validTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export type OpenState = { open: boolean; label: string } | null;

/** Whether a place with daily hours is open at `now` in `tz`. Null when no hours are known. */
export function openState(
  openFrom: string | null,
  openUntil: string | null,
  closedDays: number[],
  tz: string,
  now = new Date(),
): OpenState {
  if (!openFrom || !openUntil || !isHHMM(openFrom) || !isHHMM(openUntil)) return null;
  const p = tzParts(now, tz);
  const m = p.hour * 60 + p.minute;
  const from = minutesOf(openFrom);
  const until = minutesOf(openUntil);
  const today = p.weekday;
  const yesterday = (today + 6) % 7;
  let open: boolean;
  if (until > from) open = !closedDays.includes(today) && m >= from && m < until;
  else open = (!closedDays.includes(today) && m >= from) || (!closedDays.includes(yesterday) && m < until); // past midnight
  if (open) return { open, label: `Jetzt offen bis ${openUntil}` };
  return { open, label: closedDays.includes(today) ? "Heute geschlossen" : `Geschlossen, öffnet ${openFrom}` };
}

export const WEEKDAYS = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
