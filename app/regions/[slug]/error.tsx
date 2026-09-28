"use client";

import PageHeader from "@/components/PageHeader";

export default function RegionError({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <PageHeader eyebrow="Region" title="Trails unavailable" subtitle="Something went wrong while loading this region." />
      <div className="state-error">
        <p>The trail list failed to load.</p>
        <button onClick={reset}>Retry</button>
      </div>
    </>
  );
}
