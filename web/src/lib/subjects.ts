/*
 * Каталоги фанҳо ва ҳадафҳо.
 * status "live" — мундариҷа тайёр аст; "soon" — фан дар таҳия, корбар онро интихоб карда метавонад,
 * то вақте ки тайёр шуд, дар саҳифаи «Имрӯз» пайдо шавад.
 */

export type SubjectId =
  | "english"
  | "russian"
  | "chinese"
  | "tajik"
  | "literature"
  | "math"
  | "physics"
  | "chemistry"
  | "biology"
  | "geography"
  | "history";

export type SubjectGroup = "languages" | "exact" | "natural" | "humanities";

export type Subject = {
  id: SubjectId;
  title: string;
  description: string;
  group: SubjectGroup;
  status: "live" | "soon";
  /** Шакли омӯзиш: кортҳои луғат (FSRS) ё тестҳо */
  mode: "cards" | "tests";
  /** Ҳарфҳо ё рамз барои нишони фан (на эмоҷи) */
  glyph: string;
};

export const SUBJECT_GROUPS: { id: SubjectGroup; title: string }[] = [
  { id: "languages", title: "Забонҳо" },
  { id: "exact", title: "Илмҳои дақиқ" },
  { id: "natural", title: "Илмҳои табиӣ" },
  { id: "humanities", title: "Илмҳои гуманитарӣ" },
];

export const SUBJECTS: Subject[] = [
  { id: "english", title: "Забони англисӣ", description: "Луғат бо такрори фосилавӣ, аз A1", group: "languages", status: "live", mode: "cards", glyph: "En" },
  { id: "russian", title: "Забони русӣ", description: "Луғат, грамматика ва тестҳо", group: "languages", status: "soon", mode: "cards", glyph: "Ру" },
  { id: "chinese", title: "Забони чинӣ", description: "Иероглифҳо, пиньин ва HSK 1", group: "languages", status: "soon", mode: "cards", glyph: "中" },
  { id: "tajik", title: "Забони тоҷикӣ", description: "Имло, грамматика ва тестҳои ММТ", group: "languages", status: "soon", mode: "tests", glyph: "Тҷ" },
  { id: "literature", title: "Адабиёти тоҷик", description: "Шоирон, асарҳо ва тестҳо", group: "humanities", status: "soon", mode: "tests", glyph: "Ад" },
  { id: "history", title: "Таърихи халқи тоҷик", description: "Санаҳо, шахсиятҳо ва тестҳо", group: "humanities", status: "soon", mode: "tests", glyph: "Тр" },
  { id: "math", title: "Математика", description: "Алгебра, геометрия, масъалаҳои ММТ", group: "exact", status: "soon", mode: "tests", glyph: "∑" },
  { id: "physics", title: "Физика", description: "Формулаҳо ва масъалаҳо", group: "exact", status: "soon", mode: "tests", glyph: "Φ" },
  { id: "chemistry", title: "Химия", description: "Унсурҳо, реаксияҳо ва масъалаҳо", group: "natural", status: "soon", mode: "tests", glyph: "H₂" },
  { id: "biology", title: "Биология", description: "Ҳуҷайра, генетика, одам", group: "natural", status: "soon", mode: "tests", glyph: "Bi" },
  { id: "geography", title: "География", description: "Харита, иқлим, Тоҷикистон", group: "natural", status: "soon", mode: "tests", glyph: "Гф" },
];

export const SUBJECT_IDS = SUBJECTS.map((s) => s.id);

export function getSubject(id: string) {
  return SUBJECTS.find((s) => s.id === id);
}

export type GoalId = "exam" | "school" | "self";

export const GOALS: { id: GoalId; title: string; description: string }[] = [
  { id: "exam", title: "Омодагӣ ба имтиҳони ММТ", description: "Имтиҳонҳои дохилшавӣ ба донишгоҳ: тестҳо ва такрор аз рӯи фанҳои кластер" },
  { id: "school", title: "Барои мактаб", description: "Дарсҳои синфҳои 9–11 ва омодагӣ ба санҷишҳо" },
  { id: "self", title: "Худомӯзӣ", description: "Забон ё фанро барои худ, бо суръати худ меомӯзам" },
];
