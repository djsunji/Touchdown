"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { FormState } from "@/app/actions";

type Values = {
  title?: string;
  description?: string;
  address?: string | null;
  phone?: string | null;
  mapsUrl?: string | null;
  website?: string | null;
};

export function EntryForm({
  action,
  defaults = {},
  cancelHref,
  submitLabel,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaults?: Values;
  cancelHref: string;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const err = (name: string) =>
    state.fieldErrors?.[name]?.[0] ? <p className="mt-1 text-sm text-red-600">{state.fieldErrors[name]![0]}</p> : null;
  const input = "w-full rounded-md border border-gray-300 px-3 py-2 focus:border-brand focus:outline-none";

  return (
    <form action={formAction} className="space-y-4 rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
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
          rows={6}
          maxLength={5000}
          defaultValue={defaults.description}
          className={input}
          placeholder="Was macht es besonders? Preise, Öffnungszeiten, Weg vom Hotel…"
        />
        {err("description")}
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
