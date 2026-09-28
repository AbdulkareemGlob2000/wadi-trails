import { describe, expect, it } from "vitest";
import {
  FAVOURITES_KEY,
  MAX_FAVOURITES,
  isFavourite,
  readFavourites,
  removeFavourite,
  saveFavourite,
  toggleFavourite,
} from "@/lib/favourites";

function memoryStorage(initial: Record<string, string> = {}): Storage {
  const data = new Map(Object.entries(initial));
  return {
    get length() {
      return data.size;
    },
    clear: () => data.clear(),
    getItem: (k) => data.get(k) ?? null,
    key: (i) => [...data.keys()][i] ?? null,
    removeItem: (k) => void data.delete(k),
    setItem: (k, v) => void data.set(k, String(v)),
  };
}

describe("favourites store", () => {
  it("starts empty", () => {
    expect(readFavourites(memoryStorage())).toEqual({ ok: true, ids: [] });
  });

  it("saves newest first without duplicates", () => {
    const s = memoryStorage();
    saveFavourite("a", s);
    saveFavourite("b", s);
    saveFavourite("a", s);
    expect(readFavourites(s)).toEqual({ ok: true, ids: ["a", "b"] });
  });

  it("removes and toggles", () => {
    const s = memoryStorage();
    expect(toggleFavourite("a", s)).toBe(true);
    expect(isFavourite("a", s)).toBe(true);
    expect(toggleFavourite("a", s)).toBe(false);
    saveFavourite("b", s);
    removeFavourite("b", s);
    expect(readFavourites(s)).toEqual({ ok: true, ids: [] });
  });

  it("caps the list and drops the oldest", () => {
    const s = memoryStorage();
    for (let i = 0; i <= MAX_FAVOURITES; i++) saveFavourite(`t${i}`, s);
    const r = readFavourites(s);
    expect(r.ok && r.ids.length).toBe(MAX_FAVOURITES);
    expect(r.ok && r.ids.includes("t0")).toBe(false);
  });

  it("reports unreadable storage as an error instead of throwing", () => {
    expect(readFavourites(memoryStorage({ [FAVOURITES_KEY]: "{not json" }))).toEqual({ ok: false });
    const throwing = { ...memoryStorage(), getItem: () => { throw new Error("denied"); } } as Storage;
    expect(readFavourites(throwing)).toEqual({ ok: false });
    expect(readFavourites(undefined)).toEqual({ ok: false });
  });

  it("drops non-string entries", () => {
    expect(readFavourites(memoryStorage({ [FAVOURITES_KEY]: '["a", 3, null]' }))).toEqual({ ok: true, ids: ["a"] });
  });
});
