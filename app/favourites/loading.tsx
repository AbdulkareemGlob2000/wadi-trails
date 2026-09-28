import PageHeader from "@/components/PageHeader";

export default function Loading() {
  return (
    <>
      <PageHeader eyebrow="Favourites" title="Loading" subtitle="Fetching your saved trails…" />
      <p className="muted">Loading your saved trails…</p>
    </>
  );
}
