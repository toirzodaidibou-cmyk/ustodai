import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ForgettingChart } from "./forgetting-chart";
import { Section } from "./section";

const facts = [
  {
    title: "Эффекти фосилагузорӣ",
    text: "Такрорҳое, ки дар фосилаҳо тақсим шудаанд, назар ба якбора хондан натиҷаи беҳтар медиҳанд.",
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
    <Section
      id="science"
      title="Асоси илмӣ"
      description="Мо ваъдаи ҷодугарӣ намедиҳем. UstodAI бар се усули омӯзиш сохта шудааст, ки дар тадқиқотҳо борҳо санҷида шудаанд."
    >
      <div className="grid items-start gap-10 lg:grid-cols-2">
        <Stagger className="divide-y rounded-xl border">
          {facts.map((f) => (
            <StaggerItem key={f.title} className="p-5">
              <h3 className="font-medium">{f.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              <p className="mt-2 text-xs text-muted-foreground">{f.source}</p>
            </StaggerItem>
          ))}
        </Stagger>

        <Reveal delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle>Қаҷхаттаи фаромӯшӣ</CardTitle>
              <CardDescription>Графики схематикӣ. Нуқтаҳо лаҳзаҳои такрорро нишон медиҳанд.</CardDescription>
            </CardHeader>
            <CardContent>
              <ForgettingChart />
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </Section>
  );
}
