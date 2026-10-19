import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary:
    "bg-brand text-brand-fg shadow-[0_1px_0_rgb(255_255_255/0.2)_inset,0_4px_14px_-4px_var(--brand)] hover:bg-brand-hover",
  secondary: "bg-bg-elevated text-fg border border-border shadow-sm hover:border-border-strong hover:bg-bg-muted",
  ghost: "text-fg-muted hover:text-fg hover:bg-bg-muted",
} as const;

const sizes = {
  sm: "h-9 px-3.5 text-sm rounded-full gap-1.5",
  md: "h-11 px-5 text-[15px] rounded-full gap-2",
  lg: "h-13 px-7 text-base rounded-full gap-2",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

const base =
  "inline-flex items-center justify-center font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-50";

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: ButtonLinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}
