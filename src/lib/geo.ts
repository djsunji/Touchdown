// Distance helpers for the map and "near the hotel" sorting. No routing service:
// walking time is estimated from the straight-line distance with a detour factor.

const DETOUR = 1.3; // streets are rarely a straight line
const WALK_KMH = 5;

export type LatLng = { lat: number; lng: number };

export function distanceMeters(a: LatLng, b: LatLng) {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Estimated walking route length (m) and minutes between two points. */
export function walking(a: LatLng, b: LatLng) {
  const meters = distanceMeters(a, b) * DETOUR;
  return { meters, minutes: Math.max(1, Math.round(meters / ((WALK_KMH * 1000) / 60))) };
}

export function walkingLabel(a: LatLng, b: LatLng) {
  const { meters, minutes } = walking(a, b);
  const dist = meters < 1000 ? `${Math.round(meters / 10) * 10} m` : `${(meters / 1000).toFixed(1).replace(".", ",")} km`;
  return minutes > 90 ? `ca. ${dist} vom Hotel` : `ca. ${minutes} Min. zu Fuss (${dist})`;
}

export function hasCoords<T extends { lat: number | null; lng: number | null }>(x: T): x is T & LatLng {
  return x.lat != null && x.lng != null;
}

export function validLatLng(lat: number, lng: number) {
  return Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
}

/** Reads coordinates from common Google Maps / OpenStreetMap URLs, e.g. ".../@46.05,14.50,17z" or "?q=46.05,14.50". */
export function coordsFromMapsUrl(url: string): LatLng | null {
  const patterns = [
    /!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/, // place pin (more exact than the viewport)
    /@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/,
    /[?&](?:q|query|ll|center|destination)=(-?\d+(?:\.\d+)?)(?:,|%2C)\s*(-?\d+(?:\.\d+)?)/i,
    /[?&]mlat=(-?\d+(?:\.\d+)?)&mlon=(-?\d+(?:\.\d+)?)/,
    /#map=\d+\/(-?\d+(?:\.\d+)?)\/(-?\d+(?:\.\d+)?)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) {
      const lat = Number(m[1]);
      const lng = Number(m[2]);
      if (validLatLng(lat, lng)) return { lat, lng };
    }
  }
  return null;
}
