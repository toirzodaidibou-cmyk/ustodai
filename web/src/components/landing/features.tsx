import type { ReactNode } from "react";
import { BrainCircuit, Languages, LineChart, MessageSquareText, Puzzle, Volume2, type LucideIcon } from "lucide-react";
import { BentoCard } from "@/components/motion/bento-card";
import { Badge } from "@/components/ui/badge";
import { ChatDemo, FsrsTimeline, LogicDemo, ProgressDemo, SpeakDemo, TypingTranslate } from "./feature-demos";
import { Section } from "./section";

function Head({ icon: Icon, title, text, soon }: { icon: LucideIcon; title: string; text: string; soon?: boolean }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-muted-foreground" />
        <h3 className="font-medium">{title}</h3>
        {soon && (
          <Badge variant="secondary" className="ml-auto">
            ба зудӣ
          </Badge>
        )}
      </div>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

function Demo({ children }: { children: ReactNode }) {
  return <div className="mt-auto">{children}</div>;
}

export function Features() {
  return (
    <Section id="features" title="Ҳама чиз барои омӯзиш дар як ҷо" description="Камтар вақт сарф кун, дертар фаромӯш кун. Курсорро ба кортҳо барор ва онҳоро санҷ.">
      <div className="grid gap-4 md:grid-cols-6">
        <BentoCard className="md:col-span-4">
          <Head
            icon={BrainCircuit}
            title="Такрори фосилавӣ (FSRS)"
            text="Ҳар калима ҷадвали худро дорад. Агар осон бошад, фосила дароз мешавад; агар душвор бошад, калима зудтар бармегардад."
          />
          <Demo>
            <FsrsTimeline />
          </Demo>
        </BentoCard>

        <BentoCard className="md:col-span-2" delay={0.06}>
          <Head icon={Languages} title="Бо забони тоҷикӣ" text="Тарҷума ва шарҳ бо забони модарӣ, бе забони миёнарав." />
          <Demo>
            <TypingTranslate />
          </Demo>
        </BentoCard>

        <BentoCard className="md:col-span-2" delay={0.04}>
          <Head icon={Volume2} title="Талаффуз" text="Ҳар калима ва ҷумларо гӯш кун. Тугмаро пахш кун." />
          <Demo>
            <SpeakDemo />
          </Demo>
        </BentoCard>

        <BentoCard className="md:col-span-2" delay={0.08}>
          <Head icon={LineChart} title="Пешрафти воқеӣ" text="Курс, рӯзҳои пай дар пай ва ҷавобҳо — аз маълумоти худи ту." />
          <Demo>
            <ProgressDemo />
          </Demo>
        </BentoCard>

        <BentoCard className="md:col-span-2" delay={0.12}>
          <Head icon={Puzzle} title="Масъалаҳои мантиқӣ" text="Як масъалаи кӯтоҳ дар ҳар ҷаласа." soon />
          <Demo>
            <LogicDemo />
          </Demo>
        </BentoCard>

        <BentoCard className="md:col-span-6">
          <div className="grid items-center gap-6 md:grid-cols-2">
            <Head
              icon={MessageSquareText}
              title="Омӯзгори AI"
              text="Ҳар саволро бо забони тоҷикӣ пурс. AI хатогиатро бо мисол мефаҳмонад ва барои калимаҳои душвор ассотсиатсия месозад."
              soon
            />
            <ChatDemo />
          </div>
        </BentoCard>
      </div>
    </Section>
  );
}
