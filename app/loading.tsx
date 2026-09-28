import PageHeader from "@/components/PageHeader";

export default function Loading() {
  return (
    <>
      <PageHeader eyebrow="Regions" title="Loading regions" subtitle="Fetching the list of regions…" />
      <p className="muted">Loading the region list…</p>
    </>
  );
}
