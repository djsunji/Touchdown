"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import type { MapConfig } from "@/lib/mapConfig";
import { coordsFromMapsUrl, type LatLng } from "@/lib/geo";

type Result = { label: string; lat: number; lng: number };

/**
 * Sets a position for a tip or hotel: tap on the map, search the address, or paste a
 * maps link that contains coordinates. Writes hidden inputs `${name}Lat` / `${name}Lng`
 * (or "lat"/"lng" when no name is given).
 */
export function LocationPicker({
  config,
  dest,
  initial,
  center,
  addressField = "address",
  mapsField = "mapsUrl",
  latName = "lat",
  lngName = "lng",
}: {
  config: MapConfig;
  dest: string;
  initial: LatLng | null;
  center: LatLng | null;
  addressField?: string;
  mapsField?: string;
  latName?: string;
  lngName?: string;
}) {
  const [pos, setPos] = useState<LatLng | null>(initial);
  const [results, setResults] = useState<Result[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const setPosRef = useRef(setPos);

  // Map with a draggable marker
  useEffect(() => {
    if (!config) return;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !mapEl.current) return;
      const start = initial ?? center;
      const map = L.map(mapEl.current, { scrollWheelZoom: false });
      L.tileLayer(config.tileUrl, { attribution: config.attribution, maxZoom: 19 }).addTo(map);
      map.setView(start ? [start.lat, start.lng] : [46.8, 8.2], start ? (initial ? 16 : 14) : 4);
      map.on("click", (e) => setPosRef.current({ lat: +e.latlng.lat.toFixed(6), lng: +e.latlng.lng.toFixed(6) }));
      mapRef.current = map;
      (window as unknown as { __L?: typeof L }).__L = L;
      if (initial) placeMarker(initial);
    }).catch(() => setMsg("Karte konnte nicht geladen werden (offline?)."));
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function placeMarker(p: LatLng) {
    const L = (window as unknown as { __L?: typeof import("leaflet") }).__L;
    const map = mapRef.current;
    if (!L || !map) return;
    if (!markerRef.current) {
      const span = document.createElement("span");
      span.className = "map-pin";
      span.appendChild(document.createElement("span")).textContent = "📍";
      markerRef.current = L.marker([p.lat, p.lng], {
        draggable: true,
        icon: L.divIcon({ html: span, className: "", iconSize: [32, 32], iconAnchor: [16, 32] }),
      }).addTo(map);
      markerRef.current.on("dragend", () => {
        const ll = markerRef.current!.getLatLng();
        setPosRef.current({ lat: +ll.lat.toFixed(6), lng: +ll.lng.toFixed(6) });
      });
    } else markerRef.current.setLatLng([p.lat, p.lng]);
  }

  useEffect(() => {
    if (pos) placeMarker(pos);
    else if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }
  }, [pos]);

  // A pasted maps link with coordinates sets the position
  useEffect(() => {
    const form = wrap.current?.closest("form");
    const input = form?.querySelector<HTMLInputElement>(`[name="${mapsField}"]`);
    if (!input) return;
    const onInput = () => {
      const c = coordsFromMapsUrl(input.value);
      if (c) {
        setPos(c);
        mapRef.current?.setView([c.lat, c.lng], 16);
        setMsg("Position aus dem Link übernommen.");
      }
    };
    input.addEventListener("input", onInput);
    return () => input.removeEventListener("input", onInput);
  }, [mapsField]);

  async function search() {
    const form = wrap.current?.closest("form");
    const q = form?.querySelector<HTMLInputElement>(`[name="${addressField}"]`)?.value.trim() ?? "";
    if (q.length < 3) {
      setMsg("Bitte zuerst eine Adresse oder einen Namen eingeben.");
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/geocode?dest=${encodeURIComponent(dest)}&q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (!res.ok) setMsg(data.error ?? "Suche fehlgeschlagen");
      else if (!data.results.length) setMsg("Nichts gefunden. Setze den Punkt direkt auf der Karte.");
      setResults(data.results ?? []);
    } catch {
      setMsg("Suche fehlgeschlagen. Setze den Punkt direkt auf der Karte.");
    } finally {
      setBusy(false);
    }
  }

  function choose(r: Result) {
    setPos({ lat: r.lat, lng: r.lng });
    mapRef.current?.setView([r.lat, r.lng], 17);
    setResults([]);
    setMsg(null);
  }

  return (
    <div ref={wrap} className="space-y-2">
      <input type="hidden" name={latName} value={pos?.lat ?? ""} />
      <input type="hidden" name={lngName} value={pos?.lng ?? ""} />
      {config ? (
        <>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <button type="button" onClick={search} disabled={busy} className="rounded-md border px-3 py-1.5 hover:bg-gray-50 disabled:opacity-60">
              {busy ? "Suche…" : "🔎 Adresse auf Karte suchen"}
            </button>
            {pos && (
              <button type="button" onClick={() => setPos(null)} className="rounded-md px-2 py-1.5 text-gray-500 hover:bg-gray-50">
                Position entfernen
              </button>
            )}
            <span className="text-gray-500">{pos ? "✓ Position gesetzt" : "Tippe auf die Karte, um den Ort zu markieren."}</span>
          </div>
          {results.length > 0 && (
            <ul className="divide-y rounded-md border bg-white text-sm">
              {results.map((r, i) => (
                <li key={i}>
                  <button type="button" onClick={() => choose(r)} className="w-full px-3 py-2 text-left hover:bg-gray-50">
                    {r.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {msg && <p className="text-sm text-gray-600">{msg}</p>}
          <div ref={mapEl} className="map-box small" />
        </>
      ) : (
        <p className="text-sm text-gray-500">Karten sind deaktiviert. Ein Google-Maps-Link mit Koordinaten setzt die Position automatisch.</p>
      )}
    </div>
  );
}
