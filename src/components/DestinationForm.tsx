"use client";

import { useActionState } from "react";
import { saveDestination } from "@/app/admin/actions";
import type { FormState } from "@/app/actions";
import type { MapConfig } from "@/lib/mapConfig";
import type { LatLng } from "@/lib/geo";
import { LocationPicker } from "@/components/LocationPicker";

type Dest = {
  code: string;
  city: string;
  country: string;
  timezone: string;
  active: boolean;
  hotelName: string | null;
  hotelAddress: string | null;
  hotelLat: number | null;
  hotelLng: number | null;
};

const input = "w-full rounded-md border px-3 py-2";
const INITIAL: FormState = {};

/** Create a destination (no `d`) or edit one. Saving needs no deploy. */
export function DestinationForm({ d, mapConfig, center }: { d?: Dest; mapConfig: MapConfig; center: LatLng | null }) {
  const mode = d ? "update" : "create";
  const [state, action, pending] = useActionState<FormState, FormData>(saveDestination.bind(null, mode), INITIAL);
  const saved = !pending && state !== INITIAL && !state.error;
  return (
    <form action={action} className="grid gap-3 sm:grid-cols-2">
      <label className="block text-sm">
        <span className="mb-1 block font-medium">IATA-Code</span>
        {d ? (
          <>
            <input type="hidden" name="code" value={d.code} />
            <input value={d.code} disabled className={`${input} bg-gray-50`} />
          </>
        ) : (
          <input name="code" required maxLength={3} placeholder="z. B. LIS" className={`${input} uppercase`} autoCapitalize="characters" />
        )}
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Zeitzone</span>
        <input name="timezone" required defaultValue={d?.timezone ?? "Europe/Zurich"} placeholder="z. B. Europe/Lisbon" className={input} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Stadt</span>
        <input name="city" required maxLength={80} defaultValue={d?.city} className={input} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Land</span>
        <input name="country" required maxLength={80} defaultValue={d?.country} className={input} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Crew-Hotel</span>
        <input name="hotelName" maxLength={150} defaultValue={d?.hotelName ?? ""} placeholder="Name des Hotels" className={input} />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-medium">Hotel-Adresse</span>
        <input name="hotelAddress" maxLength={300} defaultValue={d?.hotelAddress ?? ""} className={input} />
      </label>
      <div className="sm:col-span-2">
        <span className="mb-1 block text-sm font-medium">Hotel auf der Karte</span>
        <LocationPicker
          config={mapConfig}
          dest={d?.code ?? ""}
          initial={d?.hotelLat != null && d?.hotelLng != null ? { lat: d.hotelLat, lng: d.hotelLng } : null}
          center={center}
          addressField="hotelAddress"
          latName="hotelLat"
          lngName="hotelLng"
        />
      </div>
      <label className="flex items-center gap-2 text-sm sm:col-span-2">
        <input type="checkbox" name="active" defaultChecked={d?.active ?? true} />
        Aktiv (auf der Startseite sichtbar)
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button disabled={pending} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-contrast disabled:opacity-60">
          {pending ? "Speichere…" : d ? "Speichern" : "Destination anlegen"}
        </button>
        {state.error && <p className="text-sm text-red-600" role="alert">{state.error}</p>}
        {saved && <p className="text-sm text-green-700">Gespeichert ✓</p>}
      </div>
    </form>
  );
}
