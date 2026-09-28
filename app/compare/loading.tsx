import PageHeader from "@/components/PageHeader";

export default function Loading() {
  return (
    <>
      <PageHeader eyebrow="Compare" title="Loading" subtitle="Fetching the comparison…" />
      <p className="muted">Loading the comparison…</p>
    </>
  );
}
