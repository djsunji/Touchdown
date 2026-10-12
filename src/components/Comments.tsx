"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { addComment, deleteComment, type FormState } from "@/app/actions";

export type CommentView = {
  id: string;
  authorName: string;
  text: string;
  createdAt: Date;
  stars: number; // the author's rating of this entry, 0 = none
  canDelete: boolean;
};

export function Comments({ entryId, comments }: { entryId: string; comments: CommentView[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<FormState, FormData>(addComment.bind(null, entryId), {});
  const formRef = useRef<HTMLFormElement>(null);
  const count = comments.length;

  // Clear the textarea after a successful post
  useEffect(() => {
    if (!pending && !state.error) formRef.current?.reset();
  }, [pending, state]);

  return (
    <div className="mt-3">
      <button type="button" onClick={() => setOpen(!open)} className="text-sm text-gray-600 hover:text-brand" aria-expanded={open}>
        💬 {count === 0 ? "Kommentieren" : `${count} ${count === 1 ? "Kommentar" : "Kommentare"}`}
        <span className="ml-1 text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {comments.map((c) => (
            <CommentItem key={c.id} c={c} />
          ))}
          <form ref={formRef} action={formAction} className="space-y-2">
            <textarea
              name="text"
              required
              maxLength={2000}
              rows={2}
              placeholder="Deine Erfahrung, ein Update oder eine Frage…"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none"
            />
            {state.error && <p className="text-sm text-red-600">{state.error}</p>}
            <div className="flex justify-end">
              <button disabled={pending} className="rounded-md bg-brand px-4 py-1.5 text-sm font-medium text-brand-contrast disabled:opacity-60">
                {pending ? "Senden…" : "Kommentar senden"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function CommentItem({ c }: { c: CommentView }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  return (
    <div className={`rounded-md bg-gray-50 px-3 py-2 ${pending ? "opacity-50" : ""}`}>
      <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
        <span className="font-semibold text-gray-700">{c.authorName}</span>
        {c.stars > 0 && <span className="text-accent" aria-label={`${c.stars} Sterne`}>{"★".repeat(c.stars)}</span>}
        <span>{c.createdAt.toLocaleDateString("de-CH")}</span>
        {c.canDelete && (
          <span className="ml-auto">
            {confirming ? (
              <>
                <button type="button" onClick={() => startTransition(() => deleteComment(c.id))} className="text-red-600 hover:underline">
                  Wirklich löschen
                </button>
                <button type="button" onClick={() => setConfirming(false)} className="ml-3 hover:underline">
                  Abbrechen
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setConfirming(true)} className="text-red-600 hover:underline">
                Löschen
              </button>
            )}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm whitespace-pre-line text-gray-800">{c.text}</p>
    </div>
  );
}
