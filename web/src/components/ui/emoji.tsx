import Image from "next/image";
import { cn } from "@/lib/cn";

// Microsoft Fluent Emoji 3D (MIT) — файлҳо дар public/emoji
const EMOJI = {
  brain: "Майна",
  fire: "Оташ",
  books: "Китобҳо",
  puzzle_piece: "Муаммо",
  bullseye: "Ҳадаф",
  trophy: "Ҷом",
  speaking_head: "Талаффуз",
  light_bulb: "Ғоя",
  rocket: "Ракета",
  sparkles: "Ситораҳо",
  chart_increasing: "Пешрафт",
  alarm_clock: "Соат",
  high_voltage: "Барқ",
  graduation_cap: "Кулоҳи хатм",
  gem_stone: "Гавҳар",
  speech_balloon: "Гуфтугӯ",
  "globe_showing_asia-australia": "Кураи замин",
  crown: "Тоҷ",
  stopwatch: "Секундомер",
  check_mark_button: "Дуруст",
  speaker_high_volume: "Овоз",
  seedling: "Ниҳол",
  party_popper: "Ҷашн",
} as const;

export type EmojiName = keyof typeof EMOJI;

type EmojiProps = {
  name: EmojiName;
  size?: number;
  className?: string;
  priority?: boolean;
  /** Агар эмоҷи танҳо барои зебоӣ бошад, alt холӣ мемонад */
  decorative?: boolean;
};

export function Emoji({ name, size = 32, className, priority, decorative = true }: EmojiProps) {
  return (
    <Image
      src={`/emoji/${name}.png`}
      alt={decorative ? "" : EMOJI[name]}
      width={size}
      height={size}
      priority={priority}
      draggable={false}
      className={cn("inline-block shrink-0 select-none", className)}
    />
  );
}
