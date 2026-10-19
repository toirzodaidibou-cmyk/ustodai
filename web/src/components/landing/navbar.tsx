import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";

const links = [
  { href: "#features", label: "Имконот" },
  { href: "#how", label: "Чӣ тавр кор мекунад" },
  { href: "#science", label: "Асоси илмӣ" },
  { href: "#languages", label: "Забонҳо" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-bg/75 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav aria-label="Менюи асосӣ" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-fg-muted transition-colors hover:bg-bg-muted hover:text-fg"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1">
          <ButtonLink href="/auth/sign-in" variant="ghost" size="sm">
            Воридшавӣ
          </ButtonLink>
          <ButtonLink href="/auth/sign-up" size="sm">
            Оғоз кардан
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
