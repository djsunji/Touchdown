import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { rateLimit } from "@/lib/rateLimit";

// Address search for the map picker. Uses a Nominatim-compatible geocoder
// (default: the free OpenStreetMap service, which allows light use with an identifying
// User-Agent). Set GEOCODER_URL to your own instance, or to "off" to disable the search.
const GEOCODER = process.env.GEOCODER_URL || "https://nominatim.openstreetmap.org";

export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  if (GEOCODER === "off") return NextResponse.json({ error: "Adresssuche ist deaktiviert" }, { status: 503 });
  if (!rateLimit(`geocode:${user.id}`, 20, 60_000)) return NextResponse.json({ error: "Zu viele Suchen, bitte kurz warten" }, { status: 429 });

  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 200);
  if (q.length < 3) return NextResponse.json({ results: [] });
  const dest = await db.destination.findUnique({ where: { code: url.searchParams.get("dest") ?? "" } });

  const search = new URL(`${GEOCODER.replace(/\/+$/, "")}/search`);
  // Add the city unless the user already typed it, so "Prešernov trg" finds the one in Ljubljana
  search.searchParams.set("q", dest && !q.toLowerCase().includes(dest.city.toLowerCase()) ? `${q}, ${dest.city}` : q);
  search.searchParams.set("format", "jsonv2");
  search.searchParams.set("limit", "5");
  search.searchParams.set("accept-language", "de");
  try {
    const res = await fetch(search, {
      headers: { "User-Agent": `Touchdown crew app (${process.env.AUTH_URL ?? "self-hosted"})` },
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(String(res.status));
    const rows = (await res.json()) as { display_name: string; lat: string; lon: string }[];
    const results = rows.slice(0, 5).map((r) => ({ label: r.display_name, lat: Number(r.lat), lng: Number(r.lon) }));
    return NextResponse.json({ results }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Adresssuche gerade nicht erreichbar. Setze den Punkt direkt auf der Karte." }, { status: 502 });
  }
}
