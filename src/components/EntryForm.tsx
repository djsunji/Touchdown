"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/actions";
import type { MapConfig } from "@/lib/mapConfig";
import type { LatLng } from "@/lib/geo";
import { WEEKDAYS } from "@/lib/time";
import { LocationPicker } from "@/components/LocationPicker";
import { PhotoInput } from "@/components/PhotoInput";

type Values = {
  title?: string;
  description?: string;
  address?: string | null;
  phone?: string | null;
  mapsUrl?: string | null;
  website?: string | null;
  lat?: number | null;
  lng?: number | null;
  priceLevel?: number | null;
  openFrom?: string | null;
  openUntil?: string | null;
  closedDays?: number[];
  veggie?: boolean;
};

export function EntryForm({
  action,
  defaults = {},
  cancelHref,
  submitLabel,
  dest,
  mapConfig,
  center,
  photoSlots,
  initialError,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults?: Values;
  cancelHref: string;
  submitLabel: string;
  dest: string;
  mapConfig: MapConfig;
  center: LatLng | null;
  photoSlots: number;
  initialError?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initialError ? { error: initialError } : {});
  const err = (name: string) =>
    state.fieldErrors?.[name]?.[0] ? <p className="mt-1 text-sm text-red-600">{state.fieldErrors[name]![0]}</p> : null;
  const input = "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none";
  const initialPos = defaults.lat != null && defaults.lng != null ? { lat: defaults.lat, lng: defaults.lng } : null;

  return (
    <form action={formAction} className="space-y-5 rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
      {state.error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Titel *</span>
        <input name="title" required maxLength={150} defaultValue={defaults.title} className={input} placeholder="z. B. Pizzeria da Mario" />
        {err("title")}
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-medium">Beschreibung *</span>
        <textarea
          name="description"
          required
          rows={5}
          maxLength={5000}
          defaultValue={defaults.description}
          className={input}
          placeholder="Was macht es besonders? Was bestellst du? Weg vom Hotel…"
        />
        {err("description")}
      </label>

      <fieldset className="grid gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Preis</span>
          <select name="priceLevel" defaultValue={defaults.priceLevel ?? ""} className={input}>
            <option value="">Keine Angabe</option>
            <option value="1">€ günstig</option>
            <option value="2">€€ mittel</option>
            <option value="3">€€€ gehoben</option>
          </select>
          {err("priceLevel")}
        </label>
        <div className="sm:col-span-2">
          <span className="mb-1 block text-sm font-medium">Öffnungszeiten (Ortszeit)</span>
          <div className="flex items-center gap-2">
            <input name="openFrom" type="time" defaultValue={defaults.openFrom ?? ""} className={input} aria-label="Öffnet um" />
            <span className="text-gray-500">bis</span>
            <input name="openUntil" type="time" defaultValue={defaults.openUntil ?? ""} className={input} aria-label="Schliesst um" />
          </div>
          {err("openFrom")}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-1 text-sm font-medium">Ruhetage</legend>
        <div className="flex flex-wrap gap-2">
          {WEEKDAYS.map((d, i) => (
            <label key={d} className="flex cursor-pointer items-center gap-1 rounded-md border px-2.5 py-1.5 text-sm has-[:checked]:border-brand has-[:checked]:bg-brand/5">
              <input type="checkbox" name="closedDays" value={i} defaultChecked={defaults.closedDays?.includes(i)} className="accent-[var(--brand)]" />
              {d}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="veggie" defaultChecked={defaults.veggie} className="h-4 w-4 accent-[var(--brand)]" />
        🌱 Gute vegetarische Auswahl
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Adresse</span>
          <input name="address" maxLength={300} defaultValue={defaults.address ?? ""} className={input} />
          {err("address")}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Telefon</span>
          <input name="phone" type="tel" maxLength={50} defaultValue={defaults.phone ?? ""} className={input} />
          {err("phone")}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Google-Maps-Link</span>
          <input name="mapsUrl" type="url" defaultValue={defaults.mapsUrl ?? ""} className={input} placeholder="https://maps.app.goo.gl/…" />
          {err("mapsUrl")}
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Website</span>
          <input name="website" type="url" defaultValue={defaults.website ?? ""} className={input} placeholder="https://…" />
          {err("website")}
        </label>
      </div>

      <div>
        <span className="mb-1 block text-sm font-medium">📍 Position auf der Karte</span>
        <LocationPicker config={mapConfig} dest={dest} initial={initialPos} center={center} />
        {err("lat")}
      </div>

      {photoSlots > 0 && (
        <div>
          <span className="mb-1 block text-sm font-medium">📷 Fotos (max. {photoSlots})</span>
          <PhotoInput max={photoSlots} />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <Link href={cancelHref} className="rounded-md px-4 py-2 text-sm hover:bg-gray-100">
          Abbrechen
        </Link>
        <button disabled={pending} className="rounded-md bg-brand px-5 py-2 text-sm font-medium text-brand-contrast disabled:opacity-60">
          {pending ? "Speichern…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
