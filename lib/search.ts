import type { Trail } from "@/data/catalogue";

/** Case-insensitive substring match on name and summary. Empty query returns every trail, order kept. */
export function filterTrails(trails: Trail[], query: string): Trail[] {
  const q = query.trim().toLowerCase();
  if (!q) return trails;
  return trails.filter((t) => t.name.toLowerCase().includes(q) || t.summary.toLowerCase().includes(q));
}
