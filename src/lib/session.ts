import { redirect } from "next/navigation";
import { auth, emailAllowed } from "@/auth";
import { db } from "@/lib/db";

export type CurrentUser = { id: string; email: string; name: string | null; isAdmin: boolean };

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

/** Admins: role "admin" in the database, or listed in ADMIN_EMAILS (bootstrap, cannot be removed in the app). */
export function isAdminUser(user: { email: string; role: string }) {
  return user.role === "admin" || adminEmails.includes(user.email);
}

export function isBootstrapAdmin(email: string) {
  return adminEmails.includes(email);
}

export async function requireAdmin(): Promise<CurrentUser> {
  const user = await requireUser();
  if (!user.isAdmin) redirect("/");
  return user;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await auth();
  const id = session?.user?.id;
  if (!id) return null;
  const user = await db.user.findUnique({ where: { id } });
  // Re-checked on every request, so removing a domain from ALLOWED_EMAIL_DOMAINS takes effect at once.
  if (!user || !emailAllowed(user.email)) return null;
  return { id: user.id, email: user.email, name: user.name, isAdmin: isAdminUser(user) };
}

export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}
