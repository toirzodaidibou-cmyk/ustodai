"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, LoaderCircle } from "lucide-react";
import type { AuthFormState } from "@/app/auth/actions";
import { buttonClass } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type Mode = "sign-in" | "sign-up";

type Props = {
  mode: Mode;
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
};

const COPY = {
  "sign-up": {
    title: "Ҳисоби нав бисоз",
    subtitle: "Ройгон аст ва як дақиқа вақт мегирад.",
    submit: "Сохтани ҳисоб",
    pending: "Ҳисоб сохта мешавад…",
    switchText: "Аллакай ҳисоб доред?",
    switchLink: "Ворид шавед",
    switchHref: "/auth/sign-in",
  },
  "sign-in": {
    title: "Хуш омадед!",
    subtitle: "Барои идомаи омӯзиш ворид шавед.",
    submit: "Ворид шудан",
    pending: "Ворид мешавем…",
    switchText: "Ҳисоб надоред?",
    switchLink: "Бақайдгирӣ",
    switchHref: "/auth/sign-up",
  },
} as const;

const inputClass =
  "h-12 w-full rounded-2xl border border-border bg-bg-elevated px-4 text-[15px] text-fg shadow-sm outline-none transition placeholder:text-fg-subtle focus:border-brand focus:ring-4 focus:ring-brand-soft";

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [showPassword, setShowPassword] = useState(false);
  const copy = COPY[mode];

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-3xl font-extrabold tracking-[-0.03em]">{copy.title}</h1>
      <p className="mt-2 text-fg-muted">{copy.subtitle}</p>

      {/* key: пас аз хато форма бо қиматҳои пешина аз нав сохта мешавад */}
      <form action={formAction} key={JSON.stringify(state?.values ?? {})} className="mt-8 space-y-4" noValidate>
        {mode === "sign-up" && (
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-semibold">
              Ном
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              minLength={2}
              maxLength={50}
              placeholder="Масалан, Фарзона"
              defaultValue={state?.values?.name}
              className={inputClass}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-semibold">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="nom@gmail.com"
            defaultValue={state?.values?.email}
            className={inputClass}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-semibold">
            Парол
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              required
              minLength={8}
              placeholder={mode === "sign-up" ? "Ақаллан 8 аломат" : "••••••••"}
              className={cn(inputClass, "pr-12")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Паролро пинҳон кардан" : "Паролро нишон додан"}
              className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-xl text-fg-subtle transition hover:bg-bg-muted hover:text-fg"
            >
              {showPassword ? <EyeOff className="size-4.5" /> : <Eye className="size-4.5" />}
            </button>
          </div>
        </div>

        {state?.error && (
          <p role="alert" className="rounded-2xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            {state.error}
          </p>
        )}

        <button type="submit" disabled={isPending} className={buttonClass("primary", "lg", "mt-2 w-full")}>
          {isPending ? (
            <>
              <LoaderCircle className="size-4.5 animate-spin" />
              {copy.pending}
            </>
          ) : (
            <>
              {copy.submit}
              <ArrowRight className="size-4.5" strokeWidth={2.5} />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-fg-muted">
        {copy.switchText}{" "}
        <Link href={copy.switchHref} className="font-semibold text-brand hover:underline">
          {copy.switchLink}
        </Link>
      </p>
    </div>
  );
}
