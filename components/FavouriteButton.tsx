"use client";

import { useEffect, useState } from "react";
import { FAVOURITES_EVENT, isFavourite, toggleFavourite } from "@/lib/favourites";

// The label carries the state ("Save…" / "Saved — remove"), so no aria-pressed: both at once read as a contradiction.
export default function FavouriteButton({ trailId }: { trailId: string }) {
  const [saved, setSaved] = useState<boolean | null>(null);

  useEffect(() => {
    const sync = () => setSaved(isFavourite(trailId));
    sync();
    window.addEventListener(FAVOURITES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(FAVOURITES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [trailId]);

  return (
    <p>
      <button disabled={saved === null} onClick={() => setSaved(toggleFavourite(trailId))}>
        {saved ? "Saved — remove" : "Save to favourites"}
      </button>
    </p>
  );
}
