"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { createMeetup, deleteMeetup, toggleMeetup, type FormState } from "@/app/actions";
import type { MeetupView } from "@/lib/meetups";

export function Meetups({
  dest,
  meetups,
  defaultTime,
  city,
}: {
  dest: string;
  meetups: MeetupView[];
  defaultTime: { value: string; min: string };
  city: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5" aria-labelledby="meetups-h">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="meetups-h" className="font-semibold">
          📅 Crew-Treffpunkte
        </h2>
        {!open && (
          <button type="button" onClick={() => setOpen(true)} className="rounded-md bg-brand px-3 py-1.5 text-sm text-brand-contrast hover:opacity-90">
            + Treffpunkt vorschlagen
          </button>
        )}
      </div>
      {open && <MeetupForm dest={dest} defaultTime={defaultTime} onDone={() => setOpen(false)} />}
      {meetups.length === 0 ? (
        !open && <p className="mt-2 text-sm text-gray-500">Noch nichts geplant. Schlag doch was vor, z. B. „Heute 19 Uhr Pizza, wer kommt mit?“</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {meetups.map((m) => (
            <MeetupItem key={m.id} m={m} />
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs text-gray-400">Zeiten in Ortszeit {city}. Treffpunkte verschwinden ein paar Stunden nach dem Start.</p>
    </section>
  );
}

function MeetupItem({ m }: { m: MeetupView }) {
  const [pending, startTransition] = useTransition();
  const n = m.attendees.length;
  return (
    <li className={`flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border px-3 py-2.5 ${pending ? "opacity-60" : ""}`}>
      <div className="min-w-0 flex-1">
        <div className="font-medium">{m.title}</div>
        <div className="text-sm text-gray-600">
          🕖 {m.when}
          {m.past && <span className="ml-1 text-xs text-amber-700">(läuft)</span>}
          {m.place && <> · 📍 {m.place}</>}
        </div>
        <div className="text-xs text-gray-500" title={m.attendees.join(", ")}>
          {n} {n === 1 ? "Person" : "Personen"}: {m.attendees.slice(0, 4).join(", ")}
          {n > 4 ? ` +${n - 4}` : ""}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => startTransition(() => toggleMeetup(m.id))}
          className={`rounded-md px-3 py-1.5 text-sm ${m.joined ? "bg-green-600 text-white hover:bg-green-700" : "border border-brand text-brand hover:bg-brand/5"}`}
          aria-pressed={m.joined}
        >
          {m.joined ? "✓ Bin dabei" : "Bin dabei"}
        </button>
        {m.canDelete && (
          <button
            type="button"
            onClick={() => {
              if (confirm(`„${m.title}“ absagen und löschen?`)) startTransition(() => deleteMeetup(m.id));
            }}
            className="text-sm text-red-600 hover:underline"
          >
            Absagen
          </button>
        )}
      </div>
    </li>
  );
}

function MeetupForm({ dest, defaultTime, onDone }: { dest: string; defaultTime: { value: string; min: string }; onDone: () => void }) {
  const [state, action, pending] = useActionState(async (prev: FormState, fd: FormData) => {
    const res = await createMeetup(dest, prev, fd);
    return { ...res, ok: !res.error } as FormState & { ok?: boolean };
  }, {} as FormState & { ok?: boolean });
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state.ok) onDone();
  }, [state, onDone]);
  const input = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none";
  return (
    <form ref={formRef} action={action} className="mt-3 grid gap-3 rounded-md bg-gray-50 p-3 sm:grid-cols-2">
      <label className="sm:col-span-2">
        <span className="mb-1 block text-sm font-medium">Was ist geplant? *</span>
        <input name="title" required maxLength={120} placeholder="z. B. Pizza bei Da Mario" className={input} />
      </label>
      <label>
        <span className="mb-1 block text-sm font-medium">Wo?</span>
        <input name="place" maxLength={200} placeholder="z. B. Hotellobby" className={input} />
      </label>
      <label>
        <span className="mb-1 block text-sm font-medium">Wann? (Ortszeit) *</span>
        <input name="startsAt" type="datetime-local" required defaultValue={defaultTime.value} min={defaultTime.min} className={input} />
      </label>
      {state.error && <p className="text-sm text-red-600 sm:col-span-2">{state.error}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <button disabled={pending} className="rounded-md bg-brand px-4 py-2 text-sm text-brand-contrast disabled:opacity-60">
          {pending ? "Speichern…" : "Treffpunkt erstellen"}
        </button>
        <button type="button" onClick={onDone} className="rounded-md px-3 py-2 text-sm hover:bg-gray-100">
          Abbrechen
        </button>
      </div>
      <p className="text-xs text-gray-500 sm:col-span-2">Der Treffpunkt wird auch im Crew-Chat angekündigt.</p>
    </form>
  );
}
