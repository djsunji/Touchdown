import { db } from "@/lib/db";
import type { CurrentUser } from "@/lib/session";
import { CHAT_HISTORY_LIMIT, type ChatMsg } from "@/lib/chatTypes";

export { CHAT_HISTORY_LIMIT, type ChatMsg } from "@/lib/chatTypes";

type Row = { id: string; text: string; createdAt: Date; userId: string; user: { name: string | null; email: string } };

export function toChatMsg(m: Row, user: CurrentUser): ChatMsg {
  return {
    id: m.id,
    text: m.text,
    createdAt: m.createdAt.toISOString(),
    authorName: m.user.name ?? m.user.email.split("@")[0],
    mine: m.userId === user.id,
    canDelete: m.userId === user.id || user.isAdmin,
  };
}

/** Latest messages of a destination in chronological order, optionally only those after a timestamp. */
export async function loadChat(dest: string, user: CurrentUser, after?: Date, take = CHAT_HISTORY_LIMIT) {
  const rows = await db.chatMessage.findMany({
    where: { destinationCode: dest, ...(after ? { createdAt: { gt: after } } : {}) },
    orderBy: { createdAt: "desc" },
    take,
    include: { user: { select: { name: true, email: true } } },
  });
  return rows.reverse().map((m) => toChatMsg(m, user));
}
