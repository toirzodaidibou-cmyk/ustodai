import { SectionHeading } from "./section-heading";

/*
 * Графики схематикии қаҷхаттаи фаромӯшӣ (Эббингауз).
 * Рақамҳо тасвирӣ мебошанд: R(t) = e^(-t/S). Пас аз ҳар такрор S калон мешавад.
 */
const DAYS = 20;
const W = 560;
const H = 240;
const PAD = { l: 36, r: 12, t: 12, b: 28 };

const x = (d: number) => PAD.l + (d / DAYS) * (W - PAD.l - PAD.r);
const y = (r: number) => PAD.t + (1 - r) * (H - PAD.t - PAD.b);

function curve(segments: { from: number; to: number; s: number }[]) {
  const pts: string[] = [];
  for (const seg of segments) {
    for (let d = seg.from; d <= seg.to + 1e-9; d += 0.25) {
      const r = Math.exp(-(d - seg.from) / seg.s);
      pts.push(`${pts.length === 0 ? "M" : "L"}${x(d).toFixed(1)},${y(r).toFixed(1)}`);
    }
  }
  return pts.join(" ");
}

const noReview = curve([{ from: 0, to: DAYS, s: 1.6 }]);
const reviews = [1, 4, 11];
const withReview = curve([
  { from: 0, to: 1, s: 1.6 },
  { from: 1, to: 4, s: 4.5 },
  { from: 4, to: 11, s: 12 },
  { from: 11, to: DAYS, s: 40 },
]);

const facts = [
  {
    title: "Эффекти фосилагузорӣ",
    text: "Агар такрорҳоро дар фосилаҳо тақсим кунӣ, натиҷааш назар ба якбора хондан беҳтар аст.",
    source: "Cepeda et al., 2006 — Psychological Bulletin",
  },
  {
    title: "Эффекти санҷиш",
    text: "Аз хотира ба ёд овардани ҷавоб донишро нисбат ба аз нав хондан мустаҳкамтар мекунад.",
    source: "Roediger & Karpicke, 2006 — Psychological Science",
  },
  {
    title: "Усули калимаи калидӣ",
    text: "Калимаи хориҷӣ бо калимаи ҳамсадои забони модарӣ ва тасвир пайваст карда мешавад.",
    source: "Atkinson, 1975 — American Psychologist",
  },
];

export function Science() {
  return (
    <section id="science" className="scroll-mt-20 border-y border-border bg-bg-elevated">
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Асоси илмӣ"
            title="Мо ҷодугарӣ ваъда намедиҳем. Мо усулҳои исботшударо истифода мебарем."
            description="UstodAI бар се усули омӯзиш асос ёфтааст, ки самаранокии онҳо дар тадқиқотҳои илмӣ борҳо санҷида шудааст."
          />
          <ul className="mt-10 space-y-5">
            {facts.map((f) => (
              <li key={f.title} className="border-l-2 border-brand pl-5">
                <h3 className="font-bold tracking-tight">{f.title}</h3>
                <p className="mt-1 leading-relaxed text-fg-muted">{f.text}</p>
                <p className="mt-1.5 text-xs font-medium text-fg-subtle">{f.source}</p>
              </li>
            ))}
          </ul>
        </div>

        <figure className="rounded-3xl border border-border bg-bg p-5 shadow-md sm:p-7">
          <figcaption className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-bold tracking-tight">Қаҷхаттаи фаромӯшӣ</span>
            <span className="flex gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-fg-muted">
                <span className="h-0.5 w-4 rounded bg-fg-subtle" /> Бе такрор
              </span>
              <span className="flex items-center gap-1.5 text-brand">
                <span className="h-0.5 w-4 rounded bg-brand" /> Бо UstodAI
              </span>
            </span>
          </figcaption>

          <svg viewBox={`0 0 ${W} ${H}`} className="mt-5 w-full" role="img" aria-label="Графики схематикӣ: бе такрор хотира зуд кам мешавад, бо такрорҳои фосилавӣ дар сатҳи баланд мемонад">
            {[0, 0.5, 1].map((r) => (
              <g key={r}>
                <line x1={PAD.l} x2={W - PAD.r} y1={y(r)} y2={y(r)} stroke="var(--border)" strokeDasharray="3 4" />
                <text x={PAD.l - 8} y={y(r) + 4} textAnchor="end" fontSize="11" fill="var(--fg-subtle)">
                  {r * 100}%
                </text>
              </g>
            ))}
            {[0, 5, 10, 15, 20].map((d) => (
              <text key={d} x={x(d)} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--fg-subtle)">
                {d === 0 ? "Рӯзи 0" : d}
              </text>
            ))}
            <path d={noReview} fill="none" stroke="var(--fg-subtle)" strokeWidth="2" strokeDasharray="5 5" />
            <path d={withReview} fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinejoin="round" />
            {reviews.map((d) => (
              <g key={d}>
                <circle cx={x(d)} cy={y(1)} r="5" fill="var(--brand)" stroke="var(--bg)" strokeWidth="2.5" />
              </g>
            ))}
          </svg>
          <p className="mt-3 text-xs leading-relaxed text-fg-subtle">
            Графики схематикӣ. Нуқтаҳо лаҳзаҳои такрорро нишон медиҳанд. Пас аз ҳар такрор калима дертар фаромӯш
            мешавад.
          </p>
        </figure>
      </div>
    </section>
  );
}
