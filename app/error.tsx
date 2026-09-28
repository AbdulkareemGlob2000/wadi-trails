"use client";

import PageHeader from "@/components/PageHeader";

export default function RootError({ reset }: { error: Error; reset: () => void }) {
  return (
    <>
      <PageHeader eyebrow="Error" title="Something went wrong" subtitle="This page failed to load." />
      <div className="state-error">
        <p>The page could not be rendered.</p>
        <button onClick={reset}>Retry</button>
      </div>
    </>
  );
}
