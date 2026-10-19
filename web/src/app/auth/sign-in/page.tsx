import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { signInAction } from "../actions";

export const metadata: Metadata = { title: "Воридшавӣ" };

export default function SignInPage() {
  return <AuthForm mode="sign-in" action={signInAction} />;
}
