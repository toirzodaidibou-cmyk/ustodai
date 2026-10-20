import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Нишони UstodAI: қаҷхаттаи хотира, ки бо ҳар такрор (нуқтаҳо) баландтар мешавад —
 * ғояи асосии такрори фосилавӣ. Замина: лоҷвард → фирӯза.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "group/logo relative inline-flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-[9px] shadow-sm ring-1 ring-black/10",
        className,
      )}
      style={{ background: "linear-gradient(135deg, #2a44d4 0%, #3b5bdb 45%, #0e9f8e 100%)" }}
    >
      <span
        className="absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(120% 80% at 20% 0%, rgb(255 255 255 / 0.35), transparent 60%)" }}
      />
      <svg viewBox="0 0 28 28" className="relative size-full" fill="none">
        <path
          d="M5 20.5 C 8 20.5, 8.5 15, 11.5 15 S 15 17.5, 17 12.5 S 20.5 7, 23 6.5"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          className="[stroke-dasharray:40] [stroke-dashoffset:0] transition-[stroke-dashoffset] duration-700 ease-out group-hover/logo:[animation:logo-draw_0.9s_ease-out]"
        />
        <circle cx="11.5" cy="15" r="1.9" fill="white" />
        <circle cx="17" cy="12.5" r="1.9" fill="white" />
        <circle cx="23" cy="6.5" r="2.3" fill="#f2a30f" stroke="white" strokeWidth="1.2" />
      </svg>
    </span>
  );
}

export function Logo({ className, href = "/" }: { className?: string; href?: string }) {
  return (
    <Link href={href} className={cn("group flex items-center gap-2 font-semibold tracking-tight", className)}>
      <LogoMark />
      <span>
        Ustod<span className="text-muted-foreground transition-colors group-hover:text-foreground">AI</span>
      </span>
    </Link>
  );
}
