"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import type { MapConfig } from "@/lib/mapConfig";

export type MapPoint = { id: string; lat: number; lng: number; title: string; sub?: string; href?: string; icon?: string };
export type MapHotel = { name: string; lat: number; lng: number } | null;

// Leaflet popups take HTML, so popup content is built as DOM nodes (textContent only).
function popupNode(p: { title: string; sub?: string; href?: string }) {
  const box = document.createElement("div");
  const title = document.createElement(p.href ? "a" : "strong");
  title.textContent = p.title;
  if (p.href) {
    (title as HTMLAnchorElement).href = p.href;
    title.className = "map-pop-title";
  }
  box.appendChild(title);
  if (p.sub) {
    const sub = document.createElement("div");
    sub.className = "map-pop-sub";
    sub.textContent = p.sub;
    box.appendChild(sub);
  }
  return box;
}

function pinHtml(icon: string, hotel = false) {
  const span = document.createElement("span");
  span.className = hotel ? "map-pin map-pin-hotel" : "map-pin";
  const inner = document.createElement("span");
  inner.textContent = icon;
  span.appendChild(inner);
  return span;
}

export function MapView({
  config,
  hotel,
  points,
  className = "h-80",
  focusId,
}: {
  config: NonNullable<MapConfig>;
  hotel: MapHotel;
  points: MapPoint[];
  className?: string;
  focusId?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const key = JSON.stringify({ hotel, points, focusId });

  useEffect(() => {
    let map: LeafletMap | null = null;
    let cancelled = false;
    import("leaflet").then((L) => {
      if (cancelled || !ref.current) return;
      map = L.map(ref.current, { scrollWheelZoom: false, attributionControl: true });
      L.tileLayer(config.tileUrl, { attribution: config.attribution, maxZoom: 19 }).addTo(map);
      const bounds: [number, number][] = [];
      if (hotel) {
        L.marker([hotel.lat, hotel.lng], {
          icon: L.divIcon({ html: pinHtml("🏨", true), className: "", iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -32] }),
          zIndexOffset: 1000,
          title: hotel.name,
        })
          .addTo(map)
          .bindPopup(popupNode({ title: hotel.name, sub: "Crew-Hotel" }));
        bounds.push([hotel.lat, hotel.lng]);
      }
      for (const p of points) {
        const m = L.marker([p.lat, p.lng], {
          icon: L.divIcon({ html: pinHtml(p.icon ?? "📍"), className: "", iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -28] }),
          title: p.title,
        })
          .addTo(map)
          .bindPopup(popupNode(p));
        if (p.id === focusId) setTimeout(() => m.openPopup(), 300);
        bounds.push([p.lat, p.lng]);
      }
      const focus = points.find((p) => p.id === focusId);
      if (focus) map.setView([focus.lat, focus.lng], 16);
      else if (bounds.length > 1) map.fitBounds(bounds, { padding: [36, 36], maxZoom: 16 });
      else if (bounds.length === 1) map.setView(bounds[0], 15);
      else map.setView([46.8, 8.2], 4);
    })
      // Offline without the map code stored: show a note, the list below still works
      .catch(() => {
        if (!cancelled && ref.current) ref.current.textContent = "Karte ist offline nicht verfügbar.";
      });
    return () => {
      cancelled = true;
      map?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, config.tileUrl]);

  return <div ref={ref} className={`map-box ${className}`} role="region" aria-label="Karte" />;
}
