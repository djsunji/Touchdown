import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { CategoryNav } from "@/components/CategoryNav";
import { UserMenu } from "@/components/UserMenu";
import { Brand } from "@/components/Brand";

export default async function DestinationLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ dest: string }>;
}) {
  const user = await requireUser();
  const { dest } = await params;
  const destination = await db.destination.findUnique({ where: { code: dest.toUpperCase() } });
  if (!destination) notFound();
  if (destination.code !== dest) notFound(); // keep URLs canonical (upper case)
  if (!destination.active && !user.isAdmin) notFound(); // hidden by an admin

  const grouped = await db.entry.groupBy({
    by: ["category"],
    where: { destinationCode: destination.code },
    _count: true,
  });
  const counts = Object.fromEntries(grouped.map((g) => [g.category, g._count]));

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 bg-brand text-brand-contrast shadow">
        <div className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 rounded-md px-1 py-1 text-sm hover:bg-white/10" aria-label="Alle Destinationen">
              <Brand size={28} wordmark={false} />
              <span className="hidden sm:inline">← Alle</span>
            </Link>
            <Link href={`/${destination.code}`} className="text-lg font-bold">
              {destination.code} <span className="font-normal opacity-80">· {destination.city}</span>
            </Link>
          </div>
          <UserMenu user={user} />
        </div>
      </header>
      <div className="flex flex-1 flex-col lg:flex-row">
        <CategoryNav dest={destination.code} counts={counts} />
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
