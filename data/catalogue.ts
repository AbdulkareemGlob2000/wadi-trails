export type Region = { slug: string; name: string; blurb: string };

export type Trail = {
  id: string;
  regionSlug: string;
  name: string;
  summary: string;
  distanceKm: number;
  difficulty: "easy" | "moderate" | "hard";
  entryFee: { amount: number; currency: "JOD" };
  lastSurveyed: string;
  lat: number;
  lon: number;
  image: { src: string; alt: string; width: number; height: number };
};

export const regions: Region[] = [
  {
    slug: "northern-highlands",
    name: "Northern Highlands",
    blurb: "Oak and pine forest around Ajloun, cool enough to walk in summer.",
  },
];

export const trails: Trail[] = [
  {
    id: "ajloun-soap-house",
    regionSlug: "northern-highlands",
    name: "Soap House Trail",
    summary: "A forest loop from the Ajloun reserve down to the village soap workshop.",
    distanceKm: 7,
    difficulty: "moderate",
    entryFee: { amount: 7, currency: "JOD" },
    lastSurveyed: "2026-04-11",
    lat: 32.3726,
    lon: 35.7486,
    image: { src: "/images/forest.svg", alt: "Oak trees along a forest path", width: 640, height: 360 },
  },
  {
    id: "ajloun-roe-deer",
    regionSlug: "northern-highlands",
    name: "Roe Deer Trail",
    summary: "A short, shaded circuit inside the reserve, good for a first walk.",
    distanceKm: 2,
    difficulty: "easy",
    entryFee: { amount: 3.5, currency: "JOD" },
    lastSurveyed: "2026-05-02",
    lat: 32.3719,
    lon: 35.7471,
    image: { src: "/images/forest.svg", alt: "Dappled light on a short woodland loop", width: 640, height: 360 },
  },
  {
    id: "ajloun-castle-ridge",
    regionSlug: "northern-highlands",
    name: "Castle Ridge Walk",
    summary: "Olive terraces and ridge views ending at Ajloun Castle.",
    distanceKm: 11.5,
    difficulty: "hard",
    entryFee: { amount: 0, currency: "JOD" },
    lastSurveyed: "2026-03-14",
    lat: 32.3254,
    lon: 35.7272,
    image: { src: "/images/ridge.svg", alt: "A hilltop castle above olive terraces", width: 640, height: 360 },
  },
];
