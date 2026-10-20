import { Suspense } from "react";
import { BottomNav, BottomNavView } from "@/components/app-nav";
import { Logo } from "@/components/ui/logo";
import { Skeleton } from "@/components/ui/skeleton";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserMenu } from "@/components/auth/user-menu";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Logo href="/app" />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Suspense fallback={<Skeleton className="size-8 rounded-full" />}>
              <UserMenu />
            </Suspense>
          </div>
        </div>
      </header>
      {/* pb-32: ҷой барои менюи поёнӣ */}
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-8 pb-32 sm:px-6 sm:pt-10">{children}</main>
      <Suspense fallback={<BottomNavView pathname="" />}>
        <BottomNav />
      </Suspense>
    </div>
  );
}
