"use client";

import { useState } from "react";

/** Asks the service worker to store this city's pages (and photo thumbnails) for use without network. */
export function OfflineSave({ urls, city }: { urls: string[]; city: string }) {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error" | "unsupported">("idle");
  const [count, setCount] = useState(0);

  async function save() {
    const reg = "serviceWorker" in navigator ? await navigator.serviceWorker.ready.catch(() => null) : null;
    if (!reg?.active) {
      setState("unsupported");
      return;
    }
    setState("busy");
    const channel = new MessageChannel();
    const result = new Promise<{ ok: number; failed: number }>((resolve) => {
      channel.port1.onmessage = (e) => resolve(e.data);
      setTimeout(() => resolve({ ok: 0, failed: urls.length }), 60_000);
    });
    reg.active.postMessage({ type: "cache-urls", urls }, [channel.port2]);
    const { ok, failed } = await result;
    setCount(ok);
    setState(failed && !ok ? "error" : "done");
  }

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg bg-white p-4 text-sm shadow-sm ring-1 ring-black/5">
      <button
        type="button"
        onClick={save}
        disabled={state === "busy"}
        className="rounded-md border border-brand px-3 py-1.5 font-medium text-brand hover:bg-brand/5 disabled:opacity-60"
      >
        {state === "busy" ? "Speichere…" : "⬇️ Für offline speichern"}
      </button>
      <span className="text-gray-600">
        {state === "done"
          ? `✓ ${count} Seiten gespeichert. Die Tipps für ${city} gehen jetzt auch ohne Roaming.`
          : state === "error"
            ? "Speichern hat nicht geklappt. Bist du online?"
            : state === "unsupported"
              ? "Dein Browser unterstützt das nicht (oder die Seite läuft im Entwicklungsmodus)."
              : `Lade die Tipps für ${city} vor dem Abflug, dann gehen sie auch ohne Netz.`}
      </span>
    </div>
  );
}
