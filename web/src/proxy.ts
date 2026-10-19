import { auth } from "@/lib/auth/server";

export default auth.middleware({ loginUrl: "/auth/sign-in" });

// Танҳо саҳифаҳои барнома ҳифз мешаванд. Саҳифаи асосӣ, /auth ва файлҳои статикӣ кушода мемонанд.
export const config = {
  matcher: ["/app/:path*"],
};
