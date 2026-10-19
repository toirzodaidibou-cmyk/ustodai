import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-sm text-fg-muted sm:flex-row sm:px-6">
        <Logo />
        <p>© 2026 UstodAI. Бо муҳаббат дар Тоҷикистон сохта шудааст.</p>
      </div>
    </footer>
  );
}
