"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import type { AuthFormState } from "@/app/auth/actions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Mode = "sign-in" | "sign-up";

type Props = {
  mode: Mode;
  action: (prev: AuthFormState, formData: FormData) => Promise<AuthFormState>;
};

const COPY = {
  "sign-up": {
    title: "Сохтани ҳисоб",
    description: "Ном, email ва паролро нависед.",
    submit: "Сохтани ҳисоб",
    pending: "Сохта мешавад…",
    switchText: "Аллакай ҳисоб доред?",
    switchLink: "Ворид шавед",
    switchHref: "/auth/sign-in",
  },
  "sign-in": {
    title: "Воридшавӣ",
    description: "Барои идомаи омӯзиш email ва паролро нависед.",
    submit: "Ворид шудан",
    pending: "Ворид мешавем…",
    switchText: "Ҳисоб надоред?",
    switchLink: "Бақайдгирӣ",
    switchHref: "/auth/sign-up",
  },
} as const;

export function AuthForm({ mode, action }: Props) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [showPassword, setShowPassword] = useState(false);
  const copy = COPY[mode];

  return (
    <div className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{copy.title}</CardTitle>
          <CardDescription>{copy.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* key: пас аз хато форма бо қиматҳои пешина аз нав сохта мешавад */}
          <form action={formAction} key={JSON.stringify(state?.values ?? {})} className="grid gap-4" noValidate>
            {mode === "sign-up" && (
              <div className="grid gap-2">
                <Label htmlFor="name">Ном</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={50}
                  placeholder="Фарзона"
                  defaultValue={state?.values?.name}
                  className="h-9"
                />
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                placeholder="nom@gmail.com"
                defaultValue={state?.values?.email}
                className="h-9"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Парол</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                  required
                  minLength={8}
                  placeholder={mode === "sign-up" ? "Ақаллан 8 аломат" : undefined}
                  className="h-9 pr-9"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Паролро пинҳон кардан" : "Паролро нишон додан"}
                  className="absolute top-1/2 right-1 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </Button>
              </div>
            </div>

            {state?.error && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription role="alert">{state.error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isPending} className="h-9 w-full">
              {isPending && <Loader2 className="animate-spin" />}
              {isPending ? copy.pending : copy.submit}
            </Button>
          </form>
        </CardContent>
      </Card>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {copy.switchText}{" "}
        <Link href={copy.switchHref} className="font-medium text-foreground underline-offset-4 hover:underline">
          {copy.switchLink}
        </Link>
      </p>
    </div>
  );
}
