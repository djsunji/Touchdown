import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";

// Photos are only visible to logged-in crew, so they are served through the app, not as public files.
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await getCurrentUser())) return new Response("Nicht angemeldet", { status: 401 });
  const { id } = await params;
  const thumb = new URL(req.url).searchParams.get("size") === "thumb";
  const photo = await db.photo.findUnique({
    where: { id },
    select: { mime: true, data: !thumb, thumb },
  });
  if (!photo) return new Response("Nicht gefunden", { status: 404 });
  const body = (thumb ? photo.thumb : photo.data) as Uint8Array;
  return new Response(Buffer.from(body), {
    headers: {
      "Content-Type": photo.mime,
      // Photos never change (a new upload gets a new id); private = not stored by shared proxies
      "Cache-Control": "private, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
