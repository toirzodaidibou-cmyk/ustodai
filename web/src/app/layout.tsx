import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Geist ҳамаи ҳарфҳои тоҷикӣ (ғ ӣ қ ӯ ҳ ҷ)-ро дорад; санҷида шуд
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UstodAI — забонҳоро бо забони тоҷикӣ омӯз",
    template: "%s · UstodAI",
  },
  description:
    "UstodAI забони англисиро бо забони тоҷикӣ меомӯзонад. Такрори фосилавӣ (FSRS), шарҳ бо забони модарӣ ва 15 дақиқа дар як рӯз.",
  applicationName: "UstodAI",
  keywords: ["UstodAI", "омӯзиши забон", "забони англисӣ", "тоҷикӣ", "такрори фосилавӣ"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tg" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
