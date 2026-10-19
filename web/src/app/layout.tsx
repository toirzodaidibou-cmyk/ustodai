import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// cyrillic-ext ҳарфҳои тоҷикиро дар бар мегирад: ғ ӣ қ ӯ ҳ ҷ
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "UstodAI — забонҳоро бо забони тоҷикӣ омӯз",
    template: "%s · UstodAI",
  },
  description:
    "UstodAI — омӯзгори AI, ки англисӣ, русӣ ва забонҳои дигарро бо забони тоҷикӣ меомӯзонад. Такрори фосилавӣ, мнемоникаи AI ва машқҳои мантиқ дар 15 дақиқа дар як рӯз.",
  applicationName: "UstodAI",
  keywords: ["UstodAI", "омӯзиши забон", "забони англисӣ", "тоҷикӣ", "такрори фосилавӣ", "AI"],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f7f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tg" className={`${inter.variable} h-full`}>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
