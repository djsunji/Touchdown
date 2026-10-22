"use client";

import { useActionState, useRef } from "react";
import { addNightstop, type FormState } from "@/app/actions";

const INITIAL: FormState = {};

export function NightstopForm({ destinations, today }: { destinations: { code: string; city: string }[]; today: string }) {
  const form = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<FormState, FormData>(async (prev, fd) => {
    const res = await addNightstop(prev, fd);
    if (!res.error) form.current?.reset();
    return res;
  }, INITIAL);
  return (
    <form ref={form} action={action} className="flex flex-wrap items-end gap-2">
      <label className="text-sm">
        <span className="mb-1 block font-medium">Destination</span>
        <select name="dest" required className="rounded-md border bg-white px-3 py-2">
          {destinations.map((d) => (
            <option key={d.code} value={d.code}>
              {d.code} · {d.city}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="mb-1 block font-medium">Datum</span>
        <input type="date" name="date" required min={today} className="rounded-md border px-3 py-2" />
      </label>
      <button disabled={pending} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-brand-contrast disabled:opacity-60">
        {pending ? "…" : "Hinzufügen"}
      </button>
      {state.error && (
        <p className="w-full text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
    </form>
  );
}
