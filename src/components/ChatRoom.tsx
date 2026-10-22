"use client";

import { ReportButton } from "@/components/ReportButton";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { deleteChatMessage, sendChatMessage } from "@/app/actions";
import { CHAT_HISTORY_LIMIT, type ChatMsg } from "@/lib/chatTypes";

const POLL_MS = 4000;

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Heute";
  if (d.toDateString() === yesterday.toDateString()) return "Gestern";
  return d.toLocaleDateString("de-CH", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
}

const timeLabel = (iso: string) => new Date(iso).toLocaleTimeString("de-CH", { hour: "2-digit", minute: "2-digit" });

/** Keeps a destination's chat up to date by polling the chat API while the tab is visible. */
export function useChat(dest: string, initial: ChatMsg[]) {
  const [messages, setMessages] = useState(initial);
  const latest = useRef(initial.at(-1)?.createdAt);

  const merge = useCallback((incoming: ChatMsg[], present?: { ids: string[]; asOf: string }) => {
    setMessages((prev) => {
      const byId = new Map(prev.map((m) => [m.id, m]));
      for (const m of incoming) byId.set(m.id, m);
      let list = [...byId.values()].sort((a, b) => a.createdAt.localeCompare(b.createdAt)).slice(-CHAT_HISTORY_LIMIT);
      if (present) {
        // Drop messages deleted elsewhere; anything newer than the server snapshot stays
        const ids = new Set(present.ids);
        list = list.filter((m) => ids.has(m.id) || m.createdAt > present.asOf);
      }
      latest.current = list.at(-1)?.createdAt;
      return list;
    });
  }, []);

  useEffect(() => {
    let stopped = false;
    async function poll() {
      if (document.visibilityState !== "visible") return;
      try {
        const q = latest.current ? `?after=${encodeURIComponent(latest.current)}` : "";
        const res = await fetch(`/api/chat/${dest}${q}`, { cache: "no-store" });
        if (!res.ok || stopped) return;
        const data: { messages: ChatMsg[]; ids: string[]; asOf: string } = await res.json();
        merge(data.messages, { ids: data.ids, asOf: data.asOf });
      } catch {
        // offline or server restarting: try again on the next tick
      }
    }
    const t = setInterval(poll, POLL_MS);
    document.addEventListener("visibilitychange", poll);
    return () => {
      stopped = true;
      clearInterval(t);
      document.removeEventListener("visibilitychange", poll);
    };
  }, [dest, merge]);

  return { messages, merge, setMessages };
}

export function ChatRoom({ dest, city, initial }: { dest: string; city: string; initial: ChatMsg[] }) {
  const { messages, merge, setMessages } = useChat(dest, initial);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const stickToBottom = useRef(true);

  // Follow new messages unless the user scrolled up to read older ones
  useEffect(() => {
    const el = listRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function onScroll() {
    const el = listRef.current;
    if (el) stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  function send() {
    const value = text.trim();
    if (!value || pending) return;
    setError(null);
    startTransition(async () => {
      const res = await sendChatMessage(dest, value);
      if (res.error) setError(res.error);
      if (res.message) {
        setText("");
        stickToBottom.current = true;
        merge([res.message]);
      }
    });
  }

  function remove(id: string) {
    setConfirmId(null);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    startTransition(() => deleteChatMessage(id));
  }

  return (
    <div className="flex h-[calc(100dvh-17rem)] min-h-[360px] flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 md:h-[calc(100dvh-10rem)]">
      <div ref={listRef} onScroll={onScroll} className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="py-16 text-center text-sm text-gray-500">
            Noch keine Nachrichten. Bist du gerade in {city}? Schreib die erste Nachricht!
          </p>
        )}
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const newDay = !prev || new Date(prev.createdAt).toDateString() !== new Date(m.createdAt).toDateString();
          const sameAuthor = prev && !newDay && prev.authorName === m.authorName && prev.mine === m.mine;
          return (
            <div key={m.id}>
              {newDay && (
                <div className="my-3 text-center text-xs text-gray-400" suppressHydrationWarning>
                  {dayLabel(m.createdAt)}
                </div>
              )}
              <div className={`group flex ${m.mine ? "justify-end" : "justify-start"} ${sameAuthor ? "" : "mt-2"}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 ${m.mine ? "rounded-br-sm bg-brand text-brand-contrast" : "rounded-bl-sm bg-gray-100"}`}>
                  {!m.mine && !sameAuthor && <div className="text-xs font-semibold text-brand-light">{m.authorName}</div>}
                  <p className="text-sm break-words whitespace-pre-line">{m.text}</p>
                  <div className={`mt-0.5 flex items-center justify-end gap-2 text-[11px] ${m.mine ? "text-white/70" : "text-gray-400"}`}>
                    {m.canDelete &&
                      (confirmId === m.id ? (
                        <>
                          <button type="button" onClick={() => remove(m.id)} className="font-semibold underline">
                            Löschen?
                          </button>
                          <button type="button" onClick={() => setConfirmId(null)} className="underline">
                            Nein
                          </button>
                        </>
                      ) : (
                        <button type="button" onClick={() => setConfirmId(m.id)} className="md:opacity-0 md:group-hover:opacity-100 md:focus:opacity-100">
                          Löschen
                        </button>
                      ))}
                    {!m.mine && !m.canDelete && <ReportButton type="chat" id={m.id} align="left" />}
                    <span suppressHydrationWarning>{timeLabel(m.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="border-t bg-gray-50 p-3"
      >
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            maxLength={1000}
            placeholder={`Nachricht an alle in ${city}…`}
            aria-label="Nachricht"
            className="max-h-32 min-h-[42px] flex-1 resize-none rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none"
          />
          <button
            disabled={pending || !text.trim()}
            className="h-[42px] rounded-xl bg-brand px-4 text-sm font-medium text-brand-contrast disabled:opacity-50"
          >
            Senden
          </button>
        </div>
        <p className="mt-1 text-[11px] text-gray-400">Enter zum Senden, Shift+Enter für eine neue Zeile. Nachrichten bleiben gespeichert.</p>
      </form>
    </div>
  );
}

/** Small live preview of the newest message, for the destination page. */
export function ChatTeaser({ dest, city, initial }: { dest: string; city: string; initial: ChatMsg[] }) {
  const { messages } = useChat(dest, initial);
  const last = messages.at(-1);
  return (
    <a href={`/${dest}/chat`} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:shadow-md">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-xl">
        💬
        {last && <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">Crew-Chat {city}</span>
        {last ? (
          <span className="block truncate text-sm text-gray-600">
            <span className="font-medium">{last.mine ? "Du" : last.authorName}:</span> {last.text}
          </span>
        ) : (
          <span className="block text-sm text-gray-500">Noch keine Nachrichten. Schreib die erste!</span>
        )}
      </span>
      {last && (
        <span className="shrink-0 text-xs text-gray-400" suppressHydrationWarning>
          {dayLabel(last.createdAt) === "Heute" ? timeLabel(last.createdAt) : dayLabel(last.createdAt)}
        </span>
      )}
      <span className="shrink-0 text-gray-400">→</span>
    </a>
  );
}
