import { NextResponse } from "next/server";

export type Weather = { tempC: number; description: string; windKph: number; observedAt: string };

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

  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return fail(503, "WEATHER_NOT_CONFIGURED", "The weather service is not configured.");
  }

  const upstream = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
  try {
    const res = await fetch(upstream, { signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!res.ok) {
      return fail(502, "WEATHER_UPSTREAM", `The weather service answered ${res.status}.`);
    }
    const body = await res.json().catch(() => null);
    if (typeof body?.main?.temp !== "number" || typeof body?.dt !== "number") {
      return fail(502, "WEATHER_BAD_RESPONSE", "The weather service sent an unreadable answer.");
    }
    const weather: Weather = {
      tempC: Math.round(body.main.temp),
      description: body.weather?.[0]?.description ?? "unknown",
      windKph: Math.round((body.wind?.speed ?? 0) * 3.6),
      observedAt: new Date(body.dt * 1000).toISOString(),
    };
    return NextResponse.json(weather);
  } catch (err) {
    if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
      return fail(504, "WEATHER_TIMEOUT", "The weather service did not answer within 5 seconds.");
    }
    return fail(502, "WEATHER_UPSTREAM", "The weather service could not be reached.");
  }
}
