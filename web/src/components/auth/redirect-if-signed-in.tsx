import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";

/** Агар корбар аллакай ворид шуда бошад, ӯро ба барнома мегузаронад. */
export async function RedirectIfSignedIn() {
  const user = await getCurrentUser();
  if (user) redirect("/app");
  return null;
}
