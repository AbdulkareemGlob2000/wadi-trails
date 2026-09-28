"use client";

import { useEffect, useState } from "react";
import { FAVOURITES_EVENT, isFavourite, toggleFavourite } from "@/lib/favourites";

export default function FavouriteButton({ trailId }: { trailId: string }) {
  const [saved, setSaved] = useState(false);

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
      <button aria-pressed={saved} onClick={() => setSaved(toggleFavourite(trailId))}>
        {saved ? "Saved — remove" : "Save to favourites"}
      </button>
    </p>
  );
}
