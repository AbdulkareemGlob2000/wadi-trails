"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { FAVOURITES_EVENT, readFavourites } from "@/lib/favourites";

export type FavouriteCard = {
  id: string;
  name: string;
  summary: string;
  regionName: string;
  image: { src: string; alt: string; width: number; height: number };
};

type State =
  | { kind: "loading" }
  | { kind: "empty" }
  | { kind: "error" }
  | { kind: "success"; cards: FavouriteCard[] };

const MAX_COMPARE = 3;

export default function FavouritesList({ cards }: { cards: FavouriteCard[] }) {
  const [state, setState] = useState<State>({ kind: "loading" });
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const load = useCallback(() => {
    const r = readFavourites();
    if (!r.ok) return setState({ kind: "error" });
    const byId = new Map(cards.map((c) => [c.id, c]));
    const saved = r.ids.map((id) => byId.get(id)).filter((c): c is FavouriteCard => Boolean(c));
    setState(saved.length === 0 ? { kind: "empty" } : { kind: "success", cards: saved });
    setPicked((p) => p.filter((id) => saved.some((c) => c.id === id)));
  }, [cards]);

  useEffect(() => {
    load();
    window.addEventListener(FAVOURITES_EVENT, load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener(FAVOURITES_EVENT, load);
      window.removeEventListener("storage", load);
    };
  }, [load]);

  function togglePick(id: string) {
    if (picked.includes(id)) {
      setPicked(picked.filter((x) => x !== id));
      setNote("");
    } else if (picked.length >= MAX_COMPARE) {
      setNote("You can compare up to three trails.");
    } else {
      setPicked([...picked, id]);
      setNote("");
    }
  }

  if (state.kind === "loading") return <p className="muted">Loading your saved trails…</p>;
  if (state.kind === "error")
    return (
      <div className="state-error">
        <p>Your saved trails could not be read in this browser.</p>
        <button onClick={load}>Retry</button>
      </div>
    );
  if (state.kind === "empty")
    return (
      <p className="muted">
        You haven&apos;t saved any trails yet. Open a trail and press Save to favourites. <Link href="/">Browse the regions</Link>
      </p>
    );

  return (
    <>
      <div className="compare-bar">
        {picked.length >= 2 ? (
          <Link className="button" href={`/compare?ids=${picked.join(",")}`}>
            Compare selected ({picked.length})
          </Link>
        ) : (
          <button disabled>Compare selected ({picked.length})</button>
        )}
        <p className="muted" aria-live="polite">
          {note}
        </p>
      </div>
      <ul className="grid">
        {state.cards.map((c) => (
          <li key={c.id} className="card">
            <img src={c.image.src} alt={c.image.alt} width={c.image.width} height={c.image.height} />
            <Link href={`/trails/${c.id}`}>
              <p className="eyebrow">{c.regionName}</p>
              <h2>{c.name}</h2>
              <p className="muted">{c.summary}</p>
            </Link>
            <label className="pick">
              <input type="checkbox" checked={picked.includes(c.id)} onChange={() => togglePick(c.id)} /> Compare
            </label>
          </li>
        ))}
      </ul>
    </>
  );
}
