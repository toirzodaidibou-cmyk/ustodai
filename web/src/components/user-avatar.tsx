import BoringAvatar from "boring-avatars";
import { cn } from "@/lib/utils";

/*
 * Аватари генеративӣ: аз ID-и корбар «мармари» градиентии беназир сохта мешавад.
 * Палитра аз ранги лоҷвард, фирӯза, заъфарон ва анор гирифта шудааст.
 */
const PALETTE = ["#2a44d4", "#0e9f8e", "#f2a30f", "#d2334c", "#7dd3c8"];

export function UserAvatar({ seed, size = 28, className }: { seed: string; size?: number; className?: string }) {
  return (
    <span
      className={cn("inline-flex shrink-0 overflow-hidden rounded-full ring-1 ring-foreground/10", className)}
      style={{ width: size, height: size }}
    >
      {/* size-full: тугмаҳои shadcn SVG-ҳоро бе синфи size-* ба 16px маҷбур мекунанд */}
      <BoringAvatar name={seed} variant="marble" size={size} colors={PALETTE} title={false} className="size-full" />
    </span>
  );
}
