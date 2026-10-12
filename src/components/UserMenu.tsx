import { signOut } from "@/auth";
import type { CurrentUser } from "@/lib/session";

export function UserMenu({ user }: { user: CurrentUser }) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
      className="flex items-center gap-3 text-sm"
    >
      <span className="hidden opacity-80 sm:inline">{user.name ?? user.email}</span>
      <button className="rounded-md border border-white/40 px-3 py-1 hover:bg-white/10">Abmelden</button>
    </form>
  );
}
