import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/weather/route";

const call = (qs: string) => GET(new Request(`http://localhost/api/weather${qs}`));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("GET /api/weather", () => {
  it("rejects missing coordinates with the error envelope", async () => {
    const res = await call("");
    expect(res.status).toBe(400);
    expect((await res.json()).error.code).toBe("BAD_COORDINATES");
  });

  it("returns 503 when the key is missing", async () => {
    vi.stubEnv("OPENWEATHER_API_KEY", "");
    const res = await call("?lat=32.3&lon=35.7");
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({
      error: { code: "WEATHER_NOT_CONFIGURED", message: "The weather service is not configured." },
    });
  });

  it("maps a successful upstream answer", async () => {
    vi.stubEnv("OPENWEATHER_API_KEY", "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        new Response(JSON.stringify({ main: { temp: 21.6 }, weather: [{ description: "clear sky" }], wind: { speed: 5 }, dt: 1789000000 })),
      ),
    );
    const res = await call("?lat=32.3&lon=35.7");
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ tempC: 22, description: "clear sky", windKph: 18 });
  });
});
