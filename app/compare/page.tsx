import PageHeader from "@/components/PageHeader";
import CompareTable from "@/components/CompareTable";

export default function ComparePage() {
  return (
    <>
      <PageHeader eyebrow="Compare" title="Trails side by side" subtitle="Key facts and the weather right now at each trailhead." />
      <CompareTable />
    </>
  );
}
