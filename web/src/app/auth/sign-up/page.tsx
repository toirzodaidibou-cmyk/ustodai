import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { signUpAction } from "../actions";

export const metadata: Metadata = { title: "Бақайдгирӣ" };

export default function SignUpPage() {
  return <AuthForm mode="sign-up" action={signUpAction} />;
}
