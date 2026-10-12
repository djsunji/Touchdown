// Shared between server and client code (no database imports here)
export type ChatMsg = {
  id: string;
  text: string;
  createdAt: string; // ISO
  authorName: string;
  mine: boolean;
  canDelete: boolean;
};

export const CHAT_HISTORY_LIMIT = 200;
