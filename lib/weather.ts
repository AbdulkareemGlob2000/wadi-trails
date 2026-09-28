// Server-only: reads OPENWEATHER_API_KEY. Import from route handlers, never from a client component.
import type { Weather } from "@/lib/compare";

export type { Weather };

export type WeatherResult =
  | { ok: true; weather: Weather }
  | { ok: false; status: number; code: string; message: string };

export async function fetchWeather(lat: number, lon: number): Promise<WeatherResult> {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key) {
    return { ok: false, status: 503, code: "WEATHER_NOT_CONFIGURED", message: "The weather service is not configured." };
  }

  const upstream = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${key}`;
  try {
    const res = await fetch(upstream, { signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!res.ok) {
      return { ok: false, status: 502, code: "WEATHER_UPSTREAM", message: `The weather service answered ${res.status}.` };
    }
    const body = await res.json().catch(() => null);
    if (typeof body?.main?.temp !== "number" || typeof body?.dt !== "number") {
      return { ok: false, status: 502, code: "WEATHER_BAD_RESPONSE", message: "The weather service sent an unreadable answer." };
    }
    return {
      ok: true,
      weather: {
        tempC: Math.round(body.main.temp),
        description: body.weather?.[0]?.description ?? "unknown",
        windKph: Math.round((body.wind?.speed ?? 0) * 3.6),
        observedAt: new Date(body.dt * 1000).toISOString(),
      },
    };
  } catch (err) {
    if (err instanceof Error && (err.name === "TimeoutError" || err.name === "AbortError")) {
      return { ok: false, status: 504, code: "WEATHER_TIMEOUT", message: "The weather service did not answer within 5 seconds." };
    }
    return { ok: false, status: 502, code: "WEATHER_UPSTREAM", message: "The weather service could not be reached." };
  }
}
