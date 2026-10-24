"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/categories";

const EXTRA = [{ slug: "chat", label: "Crew-Chat", icon: "💬" }];

export function CategoryNav({ dest, counts }: { dest: string; counts: Record<string, number> }) {
  const pathname = usePathname();
  const active = pathname.split("/")[2];

  return (
    <>
      {/* Phone and iPad portrait: horizontal chips */}
      <nav className="cat-chips flex gap-2 overflow-x-auto px-4 py-3 lg:hidden" aria-label="Kategorien">
        {EXTRA.map((x) => (
          <Link
            key={x.slug}
            href={`/${dest}/${x.slug}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap ring-1 ${
              active === x.slug ? "bg-brand text-brand-contrast ring-brand" : "bg-white ring-black/10"
            }`}
          >
            {x.icon} {x.label}
          </Link>
        ))}
        {CATEGORIES.map((c) => (
          <Link
            key={c.slug}
            href={`/${dest}/${c.slug}`}
            className={`shrink-0 rounded-full px-3 py-1.5 text-sm whitespace-nowrap ring-1 ${
              active === c.slug ? "bg-brand text-brand-contrast ring-brand" : "bg-white ring-black/10"
            }`}
          >
            {c.icon} {c.label}
            {counts[c.slug] ? <span className="ml-1 opacity-60">{counts[c.slug]}</span> : null}
          </Link>
        ))}
      </nav>

      {/* Desktop and iPad landscape: sidebar, stays in place while the content scrolls */}
      <nav className="dest-sidebar sticky hidden w-64 shrink-0 overflow-y-auto overscroll-contain border-r border-black/5 bg-white lg:block xl:w-72" aria-label="Kategorien">
        <div className="mx-3 mt-4 space-y-2">
          {EXTRA.map((x) => (
            <Link
              key={x.slug}
              href={`/${dest}/${x.slug}`}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ring-1 ring-black/5 hover:bg-gray-50 ${
                active === x.slug ? "bg-gray-100 font-semibold" : ""
              }`}
            >
              <span className="w-6 text-center">{x.icon}</span>
              <span className="flex-1">{x.label}</span>
            </Link>
          ))}
        </div>
        <p className="px-5 pt-5 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
          Empfehlungen von Kolleg:innen
        </p>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/${dest}/${c.slug}`}
                className={`flex items-center gap-3 px-5 py-3 hover:bg-gray-50 ${
                  active === c.slug ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                <span className="w-6 text-center">{c.icon}</span>
                <span className="flex-1">{c.label}</span>
                {counts[c.slug] ? (
                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-600">{counts[c.slug]}</span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
