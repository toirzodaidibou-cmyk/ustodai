import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { NavLinks } from "./nav-links";

const links = [
  { href: "#features", label: "Имконот" },
  { href: "#how", label: "Чӣ тавр кор мекунад" },
  { href: "#science", label: "Асоси илмӣ" },
  { href: "#languages", label: "Забонҳо" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <NavLinks links={links} />
        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <Button asChild variant="ghost" size="lg" className="hidden sm:inline-flex">
            <Link href="/auth/sign-in">Воридшавӣ</Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/auth/sign-up">Оғоз кардан</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
