import Link from "next/link";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <defs>
        <linearGradient id="ustod-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c74ff" />
          <stop offset="1" stopColor="#4338ca" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#ustod-g)" />
      <path
        d="M10 9.5v7.25a6 6 0 0 0 12 0V9.5"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="22.5" cy="23.5" r="2.25" fill="#ffd166" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)} aria-label="UstodAI — саҳифаи асосӣ">
      <LogoMark />
      <span className="text-[17px] font-bold tracking-tight">
        Ustod<span className="text-brand">AI</span>
      </span>
    </Link>
  );
}
