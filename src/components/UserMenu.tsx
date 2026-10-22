import Link from "next/link";
import { db } from "@/lib/db";
import type { CurrentUser } from "@/lib/session";
import { LogoutButton } from "@/components/LogoutButton";

export async function UserMenu({ user }: { user: CurrentUser }) {
  const openReports = user.isAdmin ? await db.report.count({ where: { status: "open" } }) : 0;
  const linkCls = "rounded-md px-2 py-1 hover:bg-white/10 whitespace-nowrap";
  return (
    <nav className="flex items-center gap-1 text-sm sm:gap-2" aria-label="Benutzermenü">
      <span className="hidden opacity-80 lg:inline">{user.name ?? user.email}</span>
      <Link href="/meine-nightstops" className={linkCls} title="Meine Nightstops">
        📅<span className="hidden md:inline"> Meine Nightstops</span>
      </Link>
      {user.isAdmin && (
        <Link href="/admin" className={`${linkCls} relative`} title="Admin">
          🛡️<span className="hidden md:inline"> Admin</span>
          {openReports > 0 && (
            <span className="ml-1 rounded-full bg-red-500 px-1.5 text-xs font-bold text-white" aria-label={`${openReports} offene Meldungen`}>
              {openReports}
            </span>
          )}
        </Link>
      )}
      <LogoutButton />
    </nav>
  );
}
