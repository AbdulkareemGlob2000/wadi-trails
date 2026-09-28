import { afterEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/compare/route";

const call = (ids: string) => GET(new Request(`http://localhost/api/compare?ids=${ids}`));
const okWeather = () =>
  new Response(JSON.stringify({ main: { temp: 18.2 }, weather: [{ description: "few clouds" }], wind: { speed: 2 }, dt: 1789000000 }));

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("GET /api/compare", () => {
  it.each([
    ["one id", "mujib-siq"],
    ["four ids", "mujib-siq,mujib-ibex,numeira-canyon,rum-umm-ad-dami"],
    ["a duplicate", "mujib-siq,mujib-siq"],
    ["an unknown id", "mujib-siq,nope"],
    ["nothing", ""],
  ])("rejects %s with COMPARE_BAD_IDS", async (_name, ids) => {
    vi.stubEnv("OPENWEATHER_API_KEY", "test-key");
    const res = await call(ids);
    const text = await res.text();
    expect(res.status).toBe(400);
    expect(JSON.parse(text).error.code).toBe("COMPARE_BAD_IDS");
    expect(text).not.toContain("test-key");
  });

  it.each([
    ["upstream 500", async () => new Response("", { status: 500 }), "WEATHER_UPSTREAM"],
    ["malformed body", async () => new Response("not json"), "WEATHER_BAD_RESPONSE"],
    ["network error", () => Promise.reject(new TypeError("fetch failed")), "WEATHER_UPSTREAM"],
  ])("reports %s per trail without leaking the key", async (_name, impl, code) => {
    vi.stubEnv("OPENWEATHER_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(impl));
    const res = await call("mujib-siq,mujib-ibex");
    const text = await res.text();
    expect(res.status).toBe(200);
    for (const t of JSON.parse(text).trails) expect(t).toMatchObject({ weather: null, weatherError: code });
    expect(text).not.toContain("test-key");
  });

  it("returns the trails in the order asked, with weather", async () => {
    vi.stubEnv("OPENWEATHER_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => okWeather()));
    const res = await call("rum-khazali-canyon,ajloun-soap-house");
    const text = await res.text();
    const body = JSON.parse(text);
    expect(res.status).toBe(200);
    expect(body.trails.map((t: { id: string }) => t.id)).toEqual(["rum-khazali-canyon", "ajloun-soap-house"]);
    expect(body.trails[0]).toMatchObject({ regionName: "Southern Desert", elevationGainM: 10, weather: { tempC: 18 } });
    expect(text).not.toContain("test-key");
  });

  it("still returns facts when the key is missing", async () => {
    vi.stubEnv("OPENWEATHER_API_KEY", "");
    const text = await (await call("mujib-siq,mujib-ibex")).text();
    const body = JSON.parse(text);
    expect(text).not.toMatch(/appid=/);
    expect(body.trails).toHaveLength(2);
    for (const t of body.trails) expect(t).toMatchObject({ weather: null, weatherError: "WEATHER_NOT_CONFIGURED" });
  });

  it("keeps the other trails' weather when one call fails", async () => {
    vi.stubEnv("OPENWEATHER_API_KEY", "test-key");
    let n = 0;
    vi.stubGlobal("fetch", vi.fn(async () => (n++ === 0 ? Promise.reject(new DOMException("", "TimeoutError")) : okWeather())));
    const text = await (await call("mujib-siq,mujib-ibex,numeira-canyon")).text();
    const body = JSON.parse(text);
    expect(body.trails[0]).toMatchObject({ weather: null, weatherError: "WEATHER_TIMEOUT" });
    expect(body.trails[1].weather.tempC).toBe(18);
    expect(body.trails[2].weather.tempC).toBe(18);
    expect(text).not.toContain("test-key");
  });
});
