const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-15" or a Date → "15 Sep 2026" (UTC, no ordinals). */
export function formatDate(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** → "14:05" (24-hour, UTC). */
export function formatTime(value: string | Date): string {
  const d = typeof value === "string" ? new Date(value) : value;
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** (3.5, "JOD") → "3.50 JOD". Never a symbol. */
export function formatMoney(amount: number, currency: string): string {
  return `${amount.toFixed(2)} ${currency}`;
}
