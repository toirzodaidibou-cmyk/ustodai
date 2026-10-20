/*
 * Каталоги озмунҳо.
 * Қоида: ҳар маълумот манбаъ дорад. Санаҳо се ҳолат доранд:
 *  - confirmed — дар манбаи расмӣ навишта шудааст;
 *  - estimated — аз рӯи ҷадвали соли гузашта ҳисоб шудааст (дар UI ҳамчун «тахминӣ» нишон дода мешавад);
 *  - unknown — сана ҳанӯз эълон нашудааст (сана нишон дода намешавад).
 * Маълумот 20.10.2026 санҷида шуд. Ҳангоми эълони расмӣ санаҳоро навсозӣ кунед.
 */
import type { SubjectId } from "@/lib/subjects";

export type Role = "school" | "student" | "self";

export type Stage = {
  label: string;
  /** ISO сана (YYYY-MM-DD) ё null, агар маълум набошад */
  date: string | null;
  status: "confirmed" | "estimated" | "unknown";
  note?: string;
};

export type Nomination = { title: string; subject?: SubjectId; format?: string; topics?: string };

export type Competition = {
  id: string;
  title: string;
  summary: string;
  organizer: string;
  roles: Role[];
  /** Синфҳо барои хонандагон (агар маҳдудият бошад) */
  grades?: [number, number];
  audience: string[];
  stages: Stage[];
  nominations?: Nomination[];
  format: string[];
  prizes?: string[];
  sources: { title: string; url: string }[];
  /** Оё дар UstodAI тести машқӣ дар формати ин озмун пешбинӣ шудааст (кадами B–D) */
  practice: boolean;
};

export const COMPETITIONS: Competition[] = [
  {
    id: "ilm-furugi-marifat",
    title: "«Илм — фурӯғи маърифат»",
    summary:
      "Озмуни бузургтарини ҷумҳуриявӣ дар илмҳои дақиқ, табиӣ ва технология. Ҳар сол бо Амри Президенти Ҷумҳурии Тоҷикистон баргузор мешавад.",
    organizer: "Амри Президенти Ҷумҳурии Тоҷикистон, Вазорати маориф ва илм, Маркази миллии тестӣ",
    roles: ["school", "student"],
    audience: [
      "Хонандагони муассисаҳои таҳсилоти миёнаи умумӣ ва ибтидоии касбӣ",
      "Хонандагони литсейҳо, гимназияҳо, муассисаҳои президентӣ ва хусусӣ",
      "Донишҷӯёни муассисаҳои таҳсилоти миёна ва олии касбӣ (магистрантон ва шӯъбаи ғоибона истисно)",
      "Магистрантон, аспирантон, омӯзгорон ва муҳандисон — танҳо дар номинатсияҳои «Зеҳни сунъӣ ва барномасозӣ» ва «Ихтироъкорӣ ва навоварӣ»",
    ],
    stages: [
      {
        label: "Даври ҷумҳуриявии озмуни 2026",
        date: null,
        status: "confirmed",
        note: "Тибқи Низомнома — «дар нимаи дуюми моҳи октябр» 2026. Ғолибони соли 2025 рӯзи 1 ноябр эълон шуда буданд.",
      },
      {
        label: "Фармон дар бораи озмуни соли 2027",
        date: "2027-01-01",
        status: "estimated",
        note: "Фармони соли 2026 рӯзи 1 январи 2026 (№АП-950) имзо шуда буд.",
      },
      {
        label: "Даврҳои аввал: мактабӣ ва донишгоҳӣ",
        date: "2027-04-01",
        status: "estimated",
        note: "Соли 2026 даври донишгоҳӣ то 20 апрел анҷом ёфт. Санаи дақиқро дар муассисаи худ пурсед.",
      },
      {
        label: "Даври ҷумҳуриявӣ (финал)",
        date: "2027-10-15",
        status: "estimated",
        note: "Тибқи Низомнома — «дар нимаи дуюми моҳи октябр».",
      },
    ],
    nominations: [
      { title: "Математика", subject: "math", topics: "Арифметика, алгебра, геометрия" },
      { title: "Физика ва астрономия", subject: "physics", format: "40% назариявӣ, 60% амалӣ-озмоишӣ (физика 80%, астрономия 20%)" },
      { title: "Химия", subject: "chemistry", format: "30% назариявӣ, 50% хаттӣ-амалӣ, 20% озмоишӣ" },
      { title: "Биология", subject: "biology", format: "40% назариявӣ, 40% амалӣ, 20% озмоишӣ", topics: "Ботаника, зоология, анатомия" },
      { title: "География", subject: "geography", format: "50% назариявӣ, 50% амалӣ" },
      { title: "Технологияи иттилоотӣ", format: "30% назариявӣ, 70% амалӣ" },
      { title: "Зеҳни сунъӣ ва барномасозӣ", format: "Ҳимояи лоиҳа назди ҳакамон" },
      { title: "Ихтироъкорӣ ва навоварӣ", format: "Ҳимояи лоиҳа назди ҳакамон" },
    ],
    format: [
      "Даврҳо: якум, дуюм ва сеюм (муассиса, шаҳр/ноҳия, вилоят) ва даври чоруми ҷумҳуриявӣ.",
      "Даври ҷумҳуриявӣ ду қисм дорад: тест аз ҷониби Маркази миллии тестӣ ва баъд санҷиш аз ҷониби ҳакамон.",
      "Агар дар тести Маркази миллии тестӣ аз 50% кам хол гиред, ба қисми дуюм роҳ дода намешавад.",
      "Ҷойҳо аз рӯи хол: 75–100 — ҷойи якум, 60–75 — ҷойи дуюм, 50–60 — ҷойи сеюм.",
    ],
    prizes: [
      "Соли 2025: ҷойи якум — 70 000, ҷойи дуюм — 50 000, ҷойи сеюм — 30 000 сомонӣ.",
      "Шоҳҷоиза барои ҷойи якум дар номинатсияҳои «Зеҳни сунъӣ ва барномасозӣ» ва «Ихтироъкорӣ ва навоварӣ».",
      "Иштирокчиён ва ғолибони даври ҷумҳуриявӣ ба ихтисосҳои риёзӣ, табиатшиносӣ ва техникӣ бе имтиҳон қабул мешаванд (тибқи Низомнома).",
    ],
    sources: [
      { title: "Амри Президент дар бораи озмуни 2026 — АМИТ «Ховар»", url: "https://khovar.tj/2026/01/amri-prezidenti-um-urii-to-ikiston-dar-borai-barguzor-kardani-ozmuni-um-uriyavii-ilm-fur-i-marifat-dar-soli-2026/" },
      { title: "Амри №АП-950 — Президенти Тоҷикистон", url: "https://www.president.tj/event/documents/commands/54525" },
      { title: "Низомномаи соли 2026 ва Маркази миллии тестӣ — tvb.tj", url: "https://tvb.tj/ba-nizomnomai-ozmuni-jumhuriyavii-ilm-furugi-marifat-baroi-soli-2026-markazi-millii-testi-niz-hamroh-gardid/" },
      { title: "Даври донишгоҳии 2026 ҷамъбаст гардид — «Анвори дониш»", url: "https://anvor.tj/2026/04/20/%D0%B4%D0%B0%D0%B2%D1%80%D0%B8-%D0%B4%D0%BE%D0%BD%D0%B8%D1%88%D0%B3%D0%BE%D2%B3%D0%B8%D0%B8-%D0%BE%D0%B7%D0%BC%D1%83%D0%BD%D0%B8-%D2%B7%D1%83%D0%BC%D2%B3%D1%83%D1%80%D0%B8%D1%8F%D0%B2%D0%B8%D0%B8-2/" },
      { title: "Ғолибони озмуни 2025 — АМИТ «Ховар»", url: "https://khovar.tj/2025/11/oliboni-ozmuni-um-uriyavii-ilm-fur-i-marifat-muajyan/" },
    ],
    practice: true,
  },
  {
    id: "subject-olympiad",
    title: "Олимпиадаи ҷумҳуриявии фанҳо",
    summary: "Олимпиадаи ҳарсолаи хонандагон аз рӯи фанҳои таълимӣ. Маркази миллии тестӣ саволҳои намунавиро нашр мекунад.",
    organizer: "Вазорати маориф ва илм, Маркази миллии тестӣ",
    roles: ["school"],
    audience: ["Хонандагони муассисаҳои таҳсилоти миёнаи умумӣ"],
    stages: [
      {
        label: "Санаҳои соли таҳсили 2026–2027",
        date: null,
        status: "unknown",
        note: "Ҷадвали марҳилаҳо ҳанӯз дар манбаъҳои расмӣ ёфт нашуд. Дар мактаб ё шӯъбаи маориф пурсед.",
      },
    ],
    format: ["Марҳилаҳо одатан аз мактаб то ҷумҳурӣ мегузаранд.", "Саволҳои намунавӣ дар сайти Маркази миллии тестӣ нашр мешаванд."],
    sources: [{ title: "Саволу масъалаҳои тест барои олимпиадаи ҷумҳуриявӣ — ntc.tj", url: "https://ntc.tj/tj/ba-dovtalab/olymp-republic.html" }],
    practice: true,
  },
  {
    id: "ntc-entrance",
    title: "Имтиҳонҳои марказонидаи дохилшавӣ",
    summary: "Имтиҳони тестӣ барои дохилшавӣ ба муассисаҳои таҳсилоти миёна ва олии касбӣ, ки Маркази миллии тестӣ мегузаронад.",
    organizer: "Маркази миллии тестии назди Президенти Ҷумҳурии Тоҷикистон",
    roles: ["school"],
    grades: [10, 11],
    audience: ["Хатмкунандагони мактаб ва довталабон"],
    stages: [
      {
        label: "Имтиҳонҳои соли 2027",
        date: null,
        status: "unknown",
        note: "Ҷадвали расмӣ ҳанӯз эълон нашудааст. Онро дар сайти ntc.tj пайгирӣ кунед.",
      },
    ],
    format: ["Тестҳо аз рӯи кластерҳо (гурӯҳҳои ихтисосҳо) мегузаранд. Рӯйхати фанҳои ҳар кластерро дар ntc.tj бинед."],
    sources: [{ title: "Маркази миллии тестӣ — ntc.tj", url: "https://ntc.tj/tj/ba-dovtalab/olymp-republic.html" }],
    practice: true,
  },
  {
    id: "sohibkori-sol",
    title: "«Соҳибкори сол»",
    summary: "Озмуни ҷумҳуриявии соҳибкорон. Номинатсияи «Беҳтарин соҳибкори ҷавон (стартап)» барои ҷавонон муносиб аст.",
    organizer: "Кумитаи давлатии сармоягузорӣ ва идораи амволи давлатӣ",
    roles: ["student"],
    audience: ["Соҳибкорон ва ҷавонон бо стартап"],
    stages: [
      {
        label: "Озмуни соли 2026",
        date: null,
        status: "unknown",
        note: "Мӯҳлати қабули аризаҳоро дар эълони расмӣ санҷед.",
      },
    ],
    nominations: [{ title: "Беҳтарин соҳибкори ҷавон (стартап)" }, { title: "Соҳибкори пешрави сол" }],
    format: ["Ариза ва муаррифии лоиҳа ё тиҷорат."],
    sources: [{ title: "Эълони «Соҳибкори сол-2026» — investcom.tj", url: "https://investcom.tj/presscenter/announcement/756-jelon-baroi-ishtirok-dar-ozmuni-umurijavii-soibkori-sol-2026.html" }],
    practice: false,
  },
  {
    id: "ict-week-dushanbe",
    title: "ICT Week Dushanbe",
    summary: "Ҳафтаи технологияҳои иттилоотӣ дар Душанбе: намоиши лоиҳаҳо, навоварӣ ва вохӯрӣ бо мутахассисон.",
    organizer: "Ташкилотҳои давлатии соҳаи рақамӣ",
    roles: ["student", "self"],
    audience: ["Донишҷӯён, ҷавонони навовар ва ширкатҳои IT"],
    stages: [
      { label: "ICT Week Dushanbe 2026", date: "2026-05-18", status: "confirmed", note: "18–22 майи 2026 баргузор шуд." },
      { label: "ICT Week Dushanbe 2027", date: "2027-05-17", status: "estimated", note: "Аз рӯи санаҳои соли 2026 ҳисоб шудааст." },
    ],
    format: ["Намоиши лоиҳаҳо ва стартапҳо, сӯҳбатҳо ва семинарҳо."],
    sources: [{ title: "ICT WEEK DUSHANBE 2026 — «Азия-Плюс»", url: "https://asiaplus.news/tg/2026/05/30/ict-week-dushanbe-2026-majdoni-muosiri-ilm-fannovary-va-navovary-dar-pojtaht/" }],
    practice: false,
  },
];

export function getCompetition(id: string) {
  return COMPETITIONS.find((c) => c.id === id);
}

export type LearnerInfo = { role: Role; grade?: number | null };

/** Озмунҳое, ки барои корбар бо нақш ва синфи ӯ муносибанд. */
export function recommendCompetitions({ role, grade }: LearnerInfo) {
  return COMPETITIONS.filter((c) => {
    if (!c.roles.includes(role)) return false;
    if (role === "school" && c.grades && grade) return grade >= c.grades[0] && grade <= c.grades[1];
    return true;
  });
}

const DAY = 86_400_000;

/** Марҳилаи навбатии дорои сана (имрӯз ё баъд) ва чанд рӯз то он монд. */
export function nextStage(c: Competition, now: Date) {
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  for (const s of c.stages) {
    if (!s.date) continue;
    const t = Date.parse(`${s.date}T00:00:00Z`);
    if (t >= today) return { stage: s, days: Math.round((t - today) / DAY) };
  }
  return null;
}

export function formatDate(iso: string) {
  const months = ["январ", "феврал", "март", "апрел", "май", "июн", "июл", "август", "сентябр", "октябр", "ноябр", "декабр"];
  const d = new Date(`${iso}T00:00:00Z`);
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]}и ${d.getUTCFullYear()}`;
}
