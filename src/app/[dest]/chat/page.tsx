import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { loadChat } from "@/lib/chat";
import { ChatRoom } from "@/components/ChatRoom";

export default async function ChatPage({ params }: { params: Promise<{ dest: string }> }) {
  const { dest } = await params;
  const user = await requireUser();
  const destination = await db.destination.findUniqueOrThrow({ where: { code: dest } });
  const initial = await loadChat(dest, user);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      <div>
        <h1 className="text-2xl font-bold">💬 Crew-Chat {destination.code}</h1>
        <p className="text-sm text-gray-500">
          Für alle Crews, die gerade in {destination.city} sind: verabreden, Tipps teilen, Taxi teilen.
        </p>
      </div>
      <ChatRoom dest={dest} city={destination.city} initial={initial} />
    </div>
  );
}
