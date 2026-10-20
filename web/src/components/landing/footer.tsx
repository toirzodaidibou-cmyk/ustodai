import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo className="text-foreground" />
        <p>© 2026 UstodAI. Дар Тоҷикистон сохта шудааст.</p>
      </div>
    </footer>
  );
}
