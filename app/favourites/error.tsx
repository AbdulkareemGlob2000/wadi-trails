"use client";

import PageHeader from "@/components/PageHeader";

export default function FavouritesError({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <PageHeader eyebrow="Favourites" title="Page unavailable" subtitle="Something went wrong while loading your saved trails." />
      <div className="state-error">
        <p>This page failed to render.</p>
        <button onClick={reset}>Retry</button>
      </div>
    </>
  );
}
