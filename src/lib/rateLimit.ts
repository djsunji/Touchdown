// Simple in-memory rate limit per user and action (enough for a single app instance).
const hits = new Map<string, number[]>();

/** Returns true if the call is allowed: at most `limit` calls per `windowMs` for this key. */
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return false;
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) {
    for (const [k, ts] of hits) if (ts.every((t) => now - t >= windowMs)) hits.delete(k);
  }
  return true;
}

export const TOO_FAST = "Zu viele Aktionen in kurzer Zeit. Bitte warte einen Moment.";
