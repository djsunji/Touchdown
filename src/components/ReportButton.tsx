"use client";

import { useState, useTransition } from "react";
import { reportContent } from "@/app/actions";
import { REPORT_REASONS, type ReportType } from "@/lib/reports";

/** Small "Melden" link with an inline form: reason + optional note, goes to the admins. */
export function ReportButton({ type, id, light = false, align = "right" }: { type: ReportType; id: string; light?: boolean; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const linkCls = light ? "text-white/80 hover:text-white" : "text-gray-400 hover:text-red-600";

  if (done) return <span className={`text-xs ${light ? "text-white/80" : "text-gray-500"}`}>Danke, gemeldet ✓</span>;
  return (
    <span className="relative inline-block">
      <button type="button" onClick={() => setOpen(!open)} className={`text-xs ${linkCls}`} aria-expanded={open}>
        ⚑ Melden
      </button>
      {open && (
        <form
          className={`report-pop ${align === "left" ? "report-pop-left" : ""}`}
          onClick={(e) => e.stopPropagation()}
          action={(fd) =>
            startTransition(async () => {
              const res = await reportContent(type, id, String(fd.get("reason")), String(fd.get("note") ?? ""));
              if (res.error) setError(res.error);
              else {
                setDone(true);
                setOpen(false);
              }
            })
          }
        >
          <p className="mb-2 text-sm font-medium text-gray-800">Was stimmt nicht?</p>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {REPORT_REASONS.map((r, i) => (
              <label key={r} className="cursor-pointer rounded-full border px-2.5 py-1 text-xs text-gray-700 has-[:checked]:border-red-500 has-[:checked]:bg-red-50">
                <input type="radio" name="reason" value={r} defaultChecked={i === 0} className="sr-only" />
                {r}
              </label>
            ))}
          </div>
          <input name="note" maxLength={500} placeholder="Optional: kurze Erklärung" className="mb-2 w-full rounded-md border px-2 py-1.5 text-sm text-gray-800" />
          {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded-md px-2 py-1 text-xs text-gray-600 hover:bg-gray-100">
              Abbrechen
            </button>
            <button disabled={pending} className="rounded-md bg-red-600 px-3 py-1 text-xs text-white disabled:opacity-60">
              {pending ? "Senden…" : "Melden"}
            </button>
          </div>
        </form>
      )}
    </span>
  );
}
