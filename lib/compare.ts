// Shared by /api/compare and CompareTable — no server imports here.
import type { Trail } from "@/data/catalogue";

export type Weather = { tempC: number; description: string; windKph: number; observedAt: string };

export type ComparedTrail = {
  id: string;
  name: string;
  regionName: string;
  distanceKm: number;
  elevationGainM: number;
  difficulty: Trail["difficulty"];
  entryFee: Trail["entryFee"];
  lastSurveyed: string;
  weather: Weather | null;
  weatherError: string | null;
};

/** "a, b,,c" → ["a","b","c"]; null unless 2–3 distinct ids. Existence is checked by the server. */
export function parseCompareIds(raw: string | null): string[] | null {
  const ids = (raw ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (ids.length < 2 || ids.length > 3 || new Set(ids).size !== ids.length) return null;
  return ids;
}
