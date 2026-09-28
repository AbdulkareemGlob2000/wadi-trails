export const FAVOURITES_KEY = "wadi-trails:favourites";
export const MAX_FAVOURITES = 50;
export const FAVOURITES_EVENT = "favourites-changed";

export type FavouritesResult = { ok: true; ids: string[] } | { ok: false };

function defaultStorage(): Storage | undefined {
  return typeof window === "undefined" ? undefined : window.localStorage;
}

/** Newest first. Never throws: unreadable storage is { ok: false }. */
export function readFavourites(storage: Storage | undefined = defaultStorage()): FavouritesResult {
  try {
    if (!storage) return { ok: false };
    const raw = storage.getItem(FAVOURITES_KEY);
    if (!raw) return { ok: true, ids: [] };
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return { ok: false };
    return { ok: true, ids: parsed.filter((x): x is string => typeof x === "string") };
  } catch {
    return { ok: false };
  }
}

function write(ids: string[], storage: Storage | undefined): boolean {
  try {
    if (!storage) return false;
    storage.setItem(FAVOURITES_KEY, JSON.stringify(ids.slice(0, MAX_FAVOURITES)));
    if (typeof window !== "undefined") window.dispatchEvent(new Event(FAVOURITES_EVENT));
    return true;
  } catch {
    return false;
  }
}

export function isFavourite(id: string, storage = defaultStorage()): boolean {
  const r = readFavourites(storage);
  return r.ok && r.ids.includes(id);
}

export function saveFavourite(id: string, storage = defaultStorage()): boolean {
  const r = readFavourites(storage);
  const ids = r.ok ? r.ids.filter((x) => x !== id) : [];
  return write([id, ...ids], storage);
}

export function removeFavourite(id: string, storage = defaultStorage()): boolean {
  const r = readFavourites(storage);
  return write(r.ok ? r.ids.filter((x) => x !== id) : [], storage);
}

/** Returns the new state: true when the trail is now saved. */
export function toggleFavourite(id: string, storage = defaultStorage()): boolean {
  if (isFavourite(id, storage)) {
    removeFavourite(id, storage);
    return false;
  }
  saveFavourite(id, storage);
  return isFavourite(id, storage);
}
