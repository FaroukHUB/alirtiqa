"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/cn";

type Item = {
  href: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
};

const items: Item[] = [
  {
    href: "/admin",
    label: "Tableau de bord",
    enabled: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    href: "/admin/avis",
    label: "Avis",
    enabled: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M21 12a9 9 0 11-3.5-7.1L21 3" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
    ),
  },
  {
    href: "/admin/bibliotheque",
    label: "Bibliothèque",
    enabled: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M4 4v16h4V4z" />
        <path d="M10 4v16h4V4z" />
        <path d="M16 4l4 16-4 1z" />
      </svg>
    ),
  },
  {
    href: "/admin/questions",
    label: "Questions du test",
    enabled: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 015 0c0 1.5-1.5 2-2.5 2.5V14" />
        <circle cx="12" cy="17" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "/admin/tests",
    label: "Résultats des tests",
    enabled: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M9 11l3 3 8-8" />
        <path d="M20 12v6a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h9" />
      </svg>
    ),
  },
  {
    href: "/admin/inscriptions",
    label: "Inscriptions",
    enabled: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M19 8v6M22 11h-6" />
      </svg>
    ),
  },
  {
    href: "/admin/stats",
    label: "Statistiques",
    enabled: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M3 3v18h18" />
        <path d="M7 14l4-4 4 4 5-7" />
      </svg>
    ),
  },
];

export function Sidebar({ adminEmail }: { adminEmail?: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-none flex-col border-r border-nuit/10 bg-creme">
      <div className="border-b border-nuit/10 px-6 py-6">
        <p className="font-display text-xs uppercase tracking-[0.3em] text-dore-700">
          Al-Irtiqā&apos;
        </p>
        <p className="mt-1 font-display text-lg text-nuit">Administration</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-0.5">
          {items.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            const baseCls =
              "group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors";

            if (!item.enabled) {
              return (
                <li key={item.href}>
                  <span
                    className={cn(
                      baseCls,
                      "cursor-not-allowed text-nuit/40",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-nuit/35">{item.icon}</span>
                      {item.label}
                    </span>
                    <span className="rounded-full bg-nuit/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-nuit/45">
                      Bientôt
                    </span>
                  </span>
                </li>
              );
            }

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    baseCls,
                    active
                      ? "bg-nuit text-creme"
                      : "text-nuit/75 hover:bg-nuit/5 hover:text-nuit",
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        active ? "text-dore" : "text-nuit/55 group-hover:text-dore-700",
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-nuit/10 p-4">
        {adminEmail && (
          <p
            className="mb-3 truncate text-xs text-nuit/55"
            title={adminEmail}
          >
            {adminEmail}
          </p>
        )}
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-nuit/15 px-3 py-2 text-sm text-nuit/75 transition-colors hover:border-dore/40 hover:bg-dore/5 hover:text-dore-700"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </aside>
  );
}
