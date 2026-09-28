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
  {
    slug: "dead-sea-and-rift",
    name: "Dead Sea and Rift",
    blurb: "Water-cut sandstone canyons dropping to the lowest point on earth.",
  },
  {
    slug: "southern-desert",
    name: "Southern Desert",
    blurb: "Red sand, granite domes and Nabataean stone between Petra and Wadi Rum.",
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
  {
    id: "mujib-siq",
    regionSlug: "dead-sea-and-rift",
    name: "Siq Trail",
    summary: "Wade and scramble upstream through the narrow Wadi Mujib gorge to a waterfall.",
    distanceKm: 2,
    difficulty: "moderate",
    entryFee: { amount: 21, currency: "JOD" },
    lastSurveyed: "2026-06-20",
    lat: 31.4667,
    lon: 35.5668,
    image: { src: "/images/ridge.svg", alt: "Sandstone walls closing in over a shallow river", width: 640, height: 360 },
  },
  {
    id: "mujib-ibex",
    regionSlug: "dead-sea-and-rift",
    name: "Ibex Trail",
    summary: "A guided ridge walk above the Mujib reserve with views over the Dead Sea.",
    distanceKm: 6,
    difficulty: "moderate",
    entryFee: { amount: 25, currency: "JOD" },
    lastSurveyed: "2026-02-08",
    lat: 31.4508,
    lon: 35.5812,
    image: { src: "/images/ridge.svg", alt: "A rocky ridge path above a pale blue sea", width: 640, height: 360 },
  },
  {
    id: "main-hot-springs",
    regionSlug: "dead-sea-and-rift",
    name: "Hammamat Ma'in Canyon",
    summary: "A descent along Wadi Zarqa Ma'in past hot springs and palm-lined pools.",
    distanceKm: 9,
    difficulty: "hard",
    entryFee: { amount: 20, currency: "JOD" },
    lastSurveyed: "2025-11-15",
    lat: 31.6101,
    lon: 35.6048,
    image: { src: "/images/ridge.svg", alt: "Steam rising from a waterfall in a desert canyon", width: 640, height: 360 },
  },
  {
    id: "numeira-canyon",
    regionSlug: "dead-sea-and-rift",
    name: "Wadi Numeira",
    summary: "A short out-and-back into a slot canyon just off the Dead Sea highway.",
    distanceKm: 4,
    difficulty: "easy",
    entryFee: { amount: 15, currency: "JOD" },
    lastSurveyed: "2026-04-03",
    lat: 31.1335,
    lon: 35.5337,
    image: { src: "/images/ridge.svg", alt: "A narrow slot canyon lit from above", width: 640, height: 360 },
  },
  {
    id: "rum-umm-ad-dami",
    regionSlug: "southern-desert",
    name: "Jebel Umm ad Dami",
    summary: "A steep scramble to Jordan's highest summit, looking across into Saudi Arabia.",
    distanceKm: 3.5,
    difficulty: "hard",
    entryFee: { amount: 5, currency: "JOD" },
    lastSurveyed: "2026-01-24",
    lat: 29.3131,
    lon: 35.4297,
    image: { src: "/images/ridge.svg", alt: "A granite summit above red desert sand", width: 640, height: 360 },
  },
  {
    id: "rum-burdah-bridge",
    regionSlug: "southern-desert",
    name: "Burdah Rock Bridge",
    summary: "A climb up a sandstone dome to a natural arch high above the Wadi Rum floor.",
    distanceKm: 3,
    difficulty: "hard",
    entryFee: { amount: 5, currency: "JOD" },
    lastSurveyed: "2026-03-02",
    lat: 29.4556,
    lon: 35.4729,
    image: { src: "/images/ridge.svg", alt: "A thin rock arch against a clear sky", width: 640, height: 360 },
  },
  {
    id: "rum-khazali-canyon",
    regionSlug: "southern-desert",
    name: "Khazali Canyon",
    summary: "A short walk into a cleft lined with Thamudic rock inscriptions.",
    distanceKm: 1,
    difficulty: "easy",
    entryFee: { amount: 5, currency: "JOD" },
    lastSurveyed: "2026-05-18",
    lat: 29.5329,
    lon: 35.4277,
    image: { src: "/images/ridge.svg", alt: "Carved figures on a shaded canyon wall", width: 640, height: 360 },
  },
  {
    id: "petra-monastery-back",
    regionSlug: "southern-desert",
    name: "Monastery Back Trail",
    summary: "The quiet route from Little Petra over the hills to the Monastery.",
    distanceKm: 8,
    difficulty: "moderate",
    entryFee: { amount: 50, currency: "JOD" },
    lastSurveyed: "2026-04-27",
    lat: 30.3702,
    lon: 35.4513,
    image: { src: "/images/ridge.svg", alt: "A rock-cut facade at the end of a hill path", width: 640, height: 360 },
  },
];
