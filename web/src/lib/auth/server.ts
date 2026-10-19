import "server-only";
import { connection } from "next/server";
import { createNeonAuth } from "@neondatabase/auth/next/server";

// Neon Auth (Managed Better Auth): корбарон ва сессияҳо дар схемаи neon_auth нигоҳ дошта мешаванд
export const auth = createNeonAuth({
  baseUrl: process.env.NEON_AUTH_BASE_URL!,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});

/** Сессияи ҷорӣ ё null. */
export async function getCurrentUser() {
  // Сессия ба дархост вобаста аст: ҳангоми prerender ин ҷо таваққуф мекунад, то SDK ба cookie муроҷиат накунад
  await connection();
  const { data: session } = await auth.getSession();
  return session?.user ?? null;
}
