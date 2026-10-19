import { Suspense } from "react";
import { Logo } from "@/components/ui/logo";
import { Emoji, type EmojiName } from "@/components/ui/emoji";
import { RedirectIfSignedIn } from "@/components/auth/redirect-if-signed-in";

const points: { emoji: EmojiName; text: string }[] = [
  { emoji: "brain", text: "Такрори калимаҳо маҳз дар вақти лозимӣ" },
  { emoji: "light_bulb", text: "Мнемоникаи AI бо забони тоҷикӣ" },
  { emoji: "stopwatch", text: "Дар як рӯз танҳо 15 дақиқа" },
];

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <Suspense fallback={null}>
        <RedirectIfSignedIn />
      </Suspense>

      <div className="flex flex-col px-4 py-6 sm:px-8">
        <Logo />
        <main className="flex flex-1 items-start justify-center pt-10 pb-12 sm:items-center sm:py-12">{children}</main>
      </div>

      <aside className="relative hidden overflow-hidden bg-[#15132b] p-12 text-white lg:flex lg:flex-col lg:justify-center">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 -right-40 size-140 rounded-full bg-[radial-gradient(closest-side,rgb(124_116_255/0.45),transparent)]"
        />
        <div className="relative max-w-md">
          <Emoji name="graduation_cap" size={64} className="animate-float" />
          <h2 className="mt-8 text-4xl leading-tight font-extrabold tracking-[-0.03em] text-balance">
            Забонҳоро бо забони модарии худ омӯз
          </h2>
          <ul className="mt-10 space-y-4">
            {points.map((p) => (
              <li key={p.text} className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <Emoji name={p.emoji} size={32} />
                <span className="font-medium text-white/85">{p.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
