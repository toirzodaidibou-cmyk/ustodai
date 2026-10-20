import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section } from "./section";

const steps = [
  { title: "Ҳисоб бисоз", text: "Бақайдгирӣ як дақиқа вақт мегирад ва ройгон аст." },
  { title: "Ҷаласаи ҳаррӯза", text: "Калимаҳои нав ва такрори калимаҳои кӯҳна — дар як ҷаласаи кӯтоҳ." },
  { title: "Аз хотира ба ёд овар", text: "Аввал калимаро мебинӣ, баъд тарҷумаашро худат ба ёд меоварӣ." },
  { title: "Такрор дар вақти дуруст", text: "FSRS ҳисоб мекунад, ки кай калимаро фаромӯш мекунӣ, ва пеш аз он такрор мекунонад." },
];

export function HowItWorks() {
  return (
    <Section
      id="how"
      title="Чӣ тавр кор мекунад"
      description="Ту танҳо ҷаласаи имрӯзаро мегузарӣ. Банақшагирии такрорҳо кори UstodAI аст."
    >
      <Stagger className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <StaggerItem key={s.title} className="bg-background p-6">
            <span className="flex size-7 items-center justify-center rounded-full border text-sm font-medium tabular-nums">
              {i + 1}
            </span>
            <h3 className="mt-4 font-medium">{s.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
