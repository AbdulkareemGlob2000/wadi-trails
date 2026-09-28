"use client";

import PageHeader from "@/components/PageHeader";

export default function CompareError({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <PageHeader eyebrow="Compare" title="Page unavailable" subtitle="Something went wrong while loading the comparison." />
      <div className="state-error">
        <p>This page failed to render.</p>
        <button onClick={reset}>Retry</button>
      </div>
    </>
  );
}
