import PageHeader from "@/components/PageHeader";

export default function Loading() {
  return (
    <>
      <PageHeader eyebrow="Region" title="Loading trails" subtitle="Fetching the trails for this region…" />
      <p className="muted">Loading the trail list…</p>
    </>
  );
}
