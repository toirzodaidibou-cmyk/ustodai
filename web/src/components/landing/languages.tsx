import { Badge } from "@/components/ui/badge";
import { Stagger, StaggerItem } from "@/components/motion/reveal";
import { Section } from "./section";

const langs = [
  { name: "Англисӣ", native: "English", status: "Дастрас", live: true },
  { name: "Русӣ", native: "Русский", status: "Навбатӣ" },
  { name: "Чинӣ", native: "中文", status: "Дар нақша" },
  { name: "Олмонӣ", native: "Deutsch", status: "Дар нақша" },
];

export function Languages() {
  return (
    <Section
      id="languages"
      title="Забонҳо"
      description="Аввал забони англисиро пурра месозем. Баъд забонҳои дигар илова мешаванд."
    >
      <Stagger className="divide-y rounded-xl border">
        {langs.map((l) => (
          <StaggerItem key={l.name} className="flex items-center gap-4 px-5 py-4">
            <span className="font-medium">{l.name}</span>
            <span className="text-sm text-muted-foreground">{l.native}</span>
            <Badge variant={l.live ? "default" : "secondary"} className="ml-auto">
              {l.status}
            </Badge>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
