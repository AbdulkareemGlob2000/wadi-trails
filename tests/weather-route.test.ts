import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/weather/route";

const call = (qs: string) => GET(new Request(`http://localhost/api/weather${qs}`));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("GET /api/weather", () => {
  it.each([
    ["missing coordinates", ""],
    ["out-of-range coordinates", "?lat=999&lon=35.7"],
  ])("rejects %s with the error envelope, without the key", async (_name, qs) => {
    vi.stubEnv("OPENWEATHER_API_KEY", "test-key");
    const res = await call(qs);
    const text = await res.text();
    expect(res.status).toBe(400);
    expect(JSON.parse(text).error.code).toBe("BAD_COORDINATES");
    expect(text).not.toContain("test-key");
  });

  it("returns 503 when the key is missing", async () => {
    vi.stubEnv("OPENWEATHER_API_KEY", "");
    const res = await call("?lat=32.3&lon=35.7");
    const text = await res.text();
    expect(res.status).toBe(503);
    expect(JSON.parse(text)).toEqual({
      error: { code: "WEATHER_NOT_CONFIGURED", message: "The weather service is not configured." },
    });
    expect(text).not.toMatch(/appid=/);
  });

  it.each([
    ["timeout", () => Promise.reject(new DOMException("", "TimeoutError")), 504, "WEATHER_TIMEOUT"],
    ["upstream 500", async () => new Response("", { status: 500 }), 502, "WEATHER_UPSTREAM"],
    ["malformed body", async () => new Response("not json"), 502, "WEATHER_BAD_RESPONSE"],
    ["network error", () => Promise.reject(new TypeError("fetch failed")), 502, "WEATHER_UPSTREAM"],
  ])("returns the envelope on %s without leaking the key", async (_name, impl, status, code) => {
    vi.stubEnv("OPENWEATHER_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(impl));
    const res = await call("?lat=32.3&lon=35.7");
    const text = await res.text();
    expect(res.status).toBe(status);
    expect(JSON.parse(text).error.code).toBe(code);
    expect(text).not.toContain("test-key");
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
