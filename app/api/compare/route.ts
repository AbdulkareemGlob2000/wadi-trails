import { NextResponse } from "next/server";
import { getRegion, getTrail } from "@/lib/catalogue";
import { fetchWeather } from "@/lib/weather";
import { parseCompareIds, type ComparedTrail } from "@/lib/compare";
import type { Trail } from "@/data/catalogue";

function badIds() {
  return NextResponse.json(
    { error: { code: "COMPARE_BAD_IDS", message: "Pick two or three trails to compare." } },
    { status: 400 },
  );
}

export async function GET(request: Request) {
  const ids = parseCompareIds(new URL(request.url).searchParams.get("ids"));
  if (!ids) return badIds();

  const chosen = ids.map((id) => getTrail(id));
  if (chosen.some((t) => !t)) return badIds();
  const trails = chosen as Trail[];

  const results = await Promise.all(trails.map((t) => fetchWeather(t.lat, t.lon)));
  const compared: ComparedTrail[] = trails.map((t, i) => {
    const r = results[i];
    return {
      id: t.id,
      name: t.name,
      regionName: getRegion(t.regionSlug)?.name ?? "",
      distanceKm: t.distanceKm,
      elevationGainM: t.elevationGainM,
      difficulty: t.difficulty,
      entryFee: t.entryFee,
      lastSurveyed: t.lastSurveyed,
      weather: r.ok ? r.weather : null,
      weatherError: r.ok ? null : r.code,
    };
  });

  return NextResponse.json({ trails: compared });
}
