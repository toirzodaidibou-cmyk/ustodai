import { cn } from "@/lib/cn";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, align = "center", className }: Props) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      <p className="text-sm font-semibold tracking-wide text-brand">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.03em] text-balance sm:text-[2.6rem] sm:leading-[1.1]">
        {title}
      </h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-pretty text-fg-muted">{description}</p>}
    </div>
  );
}
