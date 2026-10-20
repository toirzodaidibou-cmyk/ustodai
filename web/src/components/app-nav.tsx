"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Car, GraduationCap, Home, School, Video, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV_ITEMS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/app", label: "Асосӣ", icon: Home },
  { href: "/app/school", label: "Хонандагон", icon: School },
  { href: "/app/students", label: "Донишҷӯён", icon: GraduationCap },
  { href: "/app/bloggers", label: "Блогерон", icon: Video },
  { href: "/app/drivers", label: "Ронандагон", icon: Car },
];

function isActive(pathname: string, href: string) {
  if (href === "/app") return pathname === "/app";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** Менюи поёнӣ (дар ҳамаи экранҳо): тугмаи фаъол бо заминаи сабзи нарм, ки байни бахшҳо «мелағжад». */
export function BottomNav() {
  return <BottomNavView pathname={usePathname()} />;
}

/** Ҳамон меню бе тугмаи фаъол — барои fallback-и Suspense, то саҳифа «наҷаҳад». */
export function BottomNavView({ pathname }: { pathname: string }) {
  return (
    <nav
      aria-label="Бахшҳо"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl sm:bottom-5"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="flex items-stretch justify-between rounded-2xl border bg-background/90 p-1.5 shadow-lg shadow-foreground/5 backdrop-blur supports-backdrop-filter:bg-background/75">
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[11px] font-medium transition-colors sm:text-xs",
                  active ? "text-nav-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {active && (
                  <motion.span
                    layoutId="bottom-nav-pill"
                    className="absolute inset-x-1 top-0.5 h-8 rounded-xl bg-nav-accent-soft sm:inset-x-3"
                    transition={{ type: "spring", stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative flex h-8 items-center">
                  <item.icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
                </span>
                <span className="relative">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
