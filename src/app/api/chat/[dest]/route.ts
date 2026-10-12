import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { CHAT_HISTORY_LIMIT, loadChat } from "@/lib/chat";
import { db } from "@/lib/db";

// Polled by the chat UI: GET /api/chat/LJU?after=<ISO date> returns newer messages.
// `ids` lists the ids of the latest messages (as of `asOf`), so clients can drop deleted ones.
export async function GET(req: Request, { params }: { params: Promise<{ dest: string }> }) {
  const asOf = new Date().toISOString(); // before querying, so messages sent meanwhile are never pruned
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Nicht angemeldet" }, { status: 401 });
  const { dest } = await params;
  const afterParam = new URL(req.url).searchParams.get("after");
  const after = afterParam ? new Date(afterParam) : undefined;
  if (after && isNaN(after.getTime())) return NextResponse.json({ error: "Ungültiges Datum" }, { status: 400 });

  const messages = await loadChat(dest, user, after);
  const recent = await db.chatMessage.findMany({
    where: { destinationCode: dest },
    orderBy: { createdAt: "desc" },
    take: CHAT_HISTORY_LIMIT,
    select: { id: true },
  });
  return NextResponse.json({ messages, ids: recent.map((r) => r.id), asOf }, { headers: { "Cache-Control": "no-store" } });
}
