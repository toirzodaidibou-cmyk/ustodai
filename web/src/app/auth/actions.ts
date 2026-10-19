"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/server";
import { authErrorMessage } from "@/lib/auth/errors";

export type AuthFormState = {
  error?: string;
  values?: { name?: string; email?: string };
} | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(formData: FormData, key: string) {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function signUpAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const name = field(formData, "name");
  const email = field(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const values = { name, email };

  if (name.length < 2 || name.length > 50) return { error: "Номи худро нависед (2–50 аломат).", values };
  if (!EMAIL_RE.test(email)) return { error: "Email нодуруст навишта шудааст.", values };
  if (password.length < 8) return { error: "Парол бояд ақаллан 8 аломат бошад.", values };
  if (password.length > 128) return { error: "Парол хеле дароз аст.", values };

  const { error } = await auth.signUp.email({ name, email, password });
  if (error) {
    return { error: authErrorMessage(error, "Сохтани ҳисоб муяссар нашуд. Боз кӯшиш кунед."), values };
  }
  redirect("/app");
}

export async function signInAction(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = field(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const values = { email };

  if (!EMAIL_RE.test(email) || !password) return { error: "Email ва паролро нависед.", values };

  const { error } = await auth.signIn.email({ email, password });
  if (error) {
    return { error: authErrorMessage(error, "Воридшавӣ муяссар нашуд. Боз кӯшиш кунед."), values };
  }
  redirect("/app");
}

export async function signOutAction() {
  await auth.signOut();
  redirect("/");
}
