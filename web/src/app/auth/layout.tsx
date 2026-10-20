import { Suspense } from "react";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { RedirectIfSignedIn } from "@/components/auth/redirect-if-signed-in";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="flex min-h-dvh flex-col bg-muted/40">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>
      <header className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-start justify-center px-4 pt-8 pb-16 sm:items-center sm:pt-0">{children}</main>
    </div>
  );
}
