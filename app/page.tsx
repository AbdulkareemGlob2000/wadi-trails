import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { listRegions, listTrails } from "@/lib/catalogue";

export default function HomePage() {
  const regions = listRegions();

  return (
    <>
      <PageHeader eyebrow="Regions" title="Wadi Trails" subtitle="Pick a region to see its walking trails." />
      {regions.length === 0 ? (
        <p className="muted">No regions yet. Add one with the /add-category command, then reload this page.</p>
      ) : (
        <ul className="grid">
          {regions.map((r) => (
            <li key={r.slug} className="card">
              <Link href={`/regions/${r.slug}`}>
                <h2>{r.name}</h2>
                <p className="muted">{r.blurb}</p>
                <p>{listTrails(r.slug).length} trails</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
