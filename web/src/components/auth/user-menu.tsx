import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/auth/actions";
import { getCurrentUser } from "@/lib/auth/server";

export async function UserMenu() {
  const user = await getCurrentUser();
  if (!user) return null;
  const initial = (user.name || user.email).trim().charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="hidden text-right leading-tight sm:block">
        <div className="text-sm font-semibold">{user.name}</div>
        <div className="text-xs text-fg-subtle">{user.email}</div>
      </div>
      <span
        aria-hidden
        className="flex size-9 items-center justify-center rounded-full bg-brand text-sm font-bold text-brand-fg"
      >
        {initial}
      </span>
      <form action={signOutAction}>
        <button
          type="submit"
          className="flex size-9 items-center justify-center rounded-full text-fg-muted transition hover:bg-bg-muted hover:text-fg"
          aria-label="Баромадан"
          title="Баромадан"
        >
          <LogOut className="size-4.5" />
        </button>
      </form>
    </div>
  );
}
