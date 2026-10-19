import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Emoji, type EmojiName } from "@/components/ui/emoji";
import { getCurrentUser } from "@/lib/auth/server";

export const metadata: Metadata = { title: "Имрӯз" };

export default function TodayPage() {
  return (
    <Suspense fallback={<TodaySkeleton />}>
      <Today />
    </Suspense>
  );
}

const stats: { emoji: EmojiName; label: string; value: string }[] = [
  { emoji: "books", label: "Калимаҳои омӯхта", value: "0" },
  { emoji: "fire", label: "Рӯзҳои пай дар пай", value: "0" },
  { emoji: "brain", label: "Барои такрор", value: "0" },
];

async function Today() {
  const user = await getCurrentUser();
  // Ҳифзи дуюм: proxy.ts аллакай redirect мекунад, вале саҳифа худаш ҳам месанҷад
  if (!user) redirect("/auth/sign-in");

  const firstName = user.name.split(" ")[0];

  return (
    <div className="animate-fade-up">
      <p className="text-sm font-semibold text-brand">Имрӯз</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.03em] sm:text-4xl">Салом, {firstName}!</h1>

      <section className="mt-8 overflow-hidden rounded-3xl border border-border bg-bg-elevated p-6 shadow-md sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <Emoji name="rocket" size={72} className="animate-float" />
          <div className="flex-1">
            <h2 className="text-xl font-bold tracking-tight">Ҳисоби шумо тайёр аст</h2>
            <p className="mt-1.5 leading-relaxed text-fg-muted">
              Ҷаласаи ҳаррӯза бо калимаҳои англисӣ ва такрори фосилавӣ дар навсозии оянда илова мешавад.
            </p>
          </div>
          <span className="w-fit rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand">
            Ба зудӣ
          </span>
        </div>
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-3xl border border-border bg-bg-elevated p-5 shadow-sm">
            <Emoji name={s.emoji} size={40} />
            <div>
              <div className="text-2xl font-extrabold tracking-tight">{s.value}</div>
              <div className="text-sm text-fg-muted">{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TodaySkeleton() {
  return (
    <div aria-hidden className="animate-pulse">
      <div className="h-4 w-16 rounded bg-bg-muted" />
      <div className="mt-3 h-9 w-56 rounded-lg bg-bg-muted" />
      <div className="mt-8 h-36 rounded-3xl bg-bg-muted" />
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-20 rounded-3xl bg-bg-muted" />
        ))}
      </div>
    </div>
  );
}
