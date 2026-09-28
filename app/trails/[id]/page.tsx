import Link from "next/link";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import WeatherPanel from "@/components/WeatherPanel";
import FavouriteButton from "@/components/FavouriteButton";
import { getRegion, getTrail } from "@/lib/catalogue";
import { trails } from "@/data/catalogue";
import { formatDate, formatMoney } from "@/lib/format";

export function generateStaticParams() {
  return trails.map((t) => ({ id: t.id }));
}

export default async function TrailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const trail = getTrail(id);
  if (!trail) notFound();
  const region = getRegion(trail.regionSlug);

  return (
    <>
      <PageHeader eyebrow={region?.name ?? "Trail"} title={trail.name} subtitle={trail.summary} />
      <FavouriteButton trailId={trail.id} />
      <img className="hero" src={trail.image.src} alt={trail.image.alt} width={trail.image.width} height={trail.image.height} />
      <section className="panel">
        <dl className="facts">
          <dt>Distance</dt>
          <dd>{trail.distanceKm} km</dd>
          <dt>Elevation gain</dt>
          <dd>{trail.elevationGainM} m</dd>
          <dt>Difficulty</dt>
          <dd>{trail.difficulty}</dd>
          <dt>Entry fee</dt>
          <dd>{formatMoney(trail.entryFee.amount, trail.entryFee.currency)}</dd>
          <dt>Last surveyed</dt>
          <dd>{formatDate(trail.lastSurveyed)}</dd>
        </dl>
      </section>
      <WeatherPanel lat={trail.lat} lon={trail.lon} />
      {region && (
        <p>
          <Link href={`/regions/${region.slug}`}>← Back to {region.name}</Link>
        </p>
      )}
    </>
  );
}
