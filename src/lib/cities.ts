import type { LatLng } from "@/lib/geo";

// City centres, used to centre maps when no crew hotel is set yet.
const CITY_CENTER: Record<string, LatLng> = {
  MUC: { lat: 48.1374, lng: 11.5755 },
  OSL: { lat: 59.9133, lng: 10.7389 },
  MXP: { lat: 45.4642, lng: 9.19 },
  LJU: { lat: 46.0511, lng: 14.5058 },
  BUD: { lat: 47.4979, lng: 19.0402 },
  VCE: { lat: 45.4372, lng: 12.3346 },
  FLR: { lat: 43.7696, lng: 11.2558 },
  TLV: { lat: 32.0853, lng: 34.7818 },
  NCE: { lat: 43.7102, lng: 7.262 },
  GOT: { lat: 57.7089, lng: 11.9746 },
};

export function mapCenter(d: { code: string; hotelLat: number | null; hotelLng: number | null }): LatLng | null {
  if (d.hotelLat != null && d.hotelLng != null) return { lat: d.hotelLat, lng: d.hotelLng };
  return CITY_CENTER[d.code] ?? null;
}

export function hotelOf(d: { hotelName: string | null; hotelLat: number | null; hotelLng: number | null }) {
  return d.hotelLat != null && d.hotelLng != null ? { name: d.hotelName || "Crew-Hotel", lat: d.hotelLat, lng: d.hotelLng } : null;
}
