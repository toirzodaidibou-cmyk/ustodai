"use client";

import { useState } from "react";
import { motion } from "motion/react";

type Link = { href: string; label: string };

/** Менюи болоӣ: ҳангоми hover заминаи нарм аз як пункт ба дигар «мелағжад». */
export function NavLinks({ links }: { links: Link[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav aria-label="Менюи асосӣ" className="hidden items-center md:flex" onMouseLeave={() => setHovered(null)}>
      {links.map((l) => (
        <a
          key={l.href}
          href={l.href}
          onMouseEnter={() => setHovered(l.href)}
          className="relative rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          {hovered === l.href && (
            <motion.span
              layoutId="nav-hover"
              className="absolute inset-0 -z-10 rounded-md bg-muted"
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
            />
          )}
          {l.label}
        </a>
      ))}
    </nav>
  );
}
