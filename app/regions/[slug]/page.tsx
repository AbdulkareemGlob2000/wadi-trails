import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import TrailSearch from "@/components/TrailSearch";
import { getRegion, listRegions, listTrails } from "@/lib/catalogue";

export function generateStaticParams() {
  return listRegions().map((r) => ({ slug: r.slug }));
}

export default async function RegionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const region = getRegion(slug);
  if (!region) notFound();
  const trails = listTrails(slug);

  return (
    <>
      <PageHeader eyebrow="Region" title={region.name} subtitle={region.blurb} />
      {trails.length === 0 ? (
        <p className="muted">
          No trails in this region yet. <Link href="/">Browse another region</Link> or add trails to data/catalogue.ts.
        </p>
      ) : (
        <TrailSearch regionName={region.name} trails={trails} />
      )}
    </>
  );
}
