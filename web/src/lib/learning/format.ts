const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Фосилаи вақтро ба шакли кӯтоҳи тоҷикӣ табдил медиҳад: «10 дақ», «4 рӯз», «2 моҳ». */
export function formatInterval(from: Date, to: Date) {
  const ms = Math.max(0, to.getTime() - from.getTime());
  if (ms < MINUTE) return "<1 дақ";
  if (ms < HOUR) return `${Math.round(ms / MINUTE)} дақ`;
  if (ms < DAY) return `${Math.round(ms / HOUR)} соат`;
  const days = Math.round(ms / DAY);
  if (days < 30) return `${days} рӯз`;
  if (days < 365) return `${Math.round(days / 30)} моҳ`;
  return `${Math.round((days / 365) * 10) / 10} сол`;
}
