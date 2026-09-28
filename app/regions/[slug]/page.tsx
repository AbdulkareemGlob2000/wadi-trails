import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { getRegion, listRegions, listTrails } from "@/lib/catalogue";
import { formatMoney } from "@/lib/format";

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
        <ul className="grid">
          {trails.map((t) => (
            <li key={t.id} className="card">
              <img src={t.image.src} alt={t.image.alt} width={t.image.width} height={t.image.height} />
              <Link href={`/trails/${t.id}`}>
                <h2>{t.name}</h2>
                <p className="muted">{t.summary}</p>
                <p>
                  {t.distanceKm} km · {t.difficulty} · {formatMoney(t.entryFee.amount, t.entryFee.currency)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
