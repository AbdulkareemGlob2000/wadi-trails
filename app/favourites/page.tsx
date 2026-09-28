import PageHeader from "@/components/PageHeader";
import FavouritesList, { type FavouriteCard } from "@/components/FavouritesList";
import { getRegion, listAllTrails } from "@/lib/catalogue";

export default function FavouritesPage() {
  const cards: FavouriteCard[] = listAllTrails().map((t) => ({
    id: t.id,
    name: t.name,
    summary: t.summary,
    regionName: getRegion(t.regionSlug)?.name ?? "",
    image: t.image,
  }));

  return (
    <>
      <PageHeader eyebrow="Favourites" title="Your saved trails" subtitle="Tick two or three to compare them side by side." />
      <FavouritesList cards={cards} />
    </>
  );
}
