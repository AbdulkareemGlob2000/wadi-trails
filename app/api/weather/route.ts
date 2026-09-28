import { NextResponse } from "next/server";
import { fetchWeather } from "@/lib/weather";

export type { Weather } from "@/lib/weather";

function fail(status: number, code: string, message: string) {
  return NextResponse.json({ error: { code, message } }, { status });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const lat = Number(url.searchParams.get("lat"));
  const lon = Number(url.searchParams.get("lon"));
  const valid =
    url.searchParams.get("lat") && url.searchParams.get("lon") &&
    Number.isFinite(lat) && Math.abs(lat) <= 90 && Number.isFinite(lon) && Math.abs(lon) <= 180;
  if (!valid) {
    return fail(400, "BAD_COORDINATES", "lat and lon must be valid coordinates.");
  }

  const result = await fetchWeather(lat, lon);
  if (!result.ok) return fail(result.status, result.code, result.message);
  return NextResponse.json(result.weather);
}
