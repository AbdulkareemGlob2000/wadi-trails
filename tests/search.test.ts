import { describe, expect, it } from "vitest";
import { filterTrails } from "@/lib/search";
import { trails } from "@/data/catalogue";

const rift = trails.filter((t) => t.regionSlug === "dead-sea-and-rift");

describe("filterTrails", () => {
  it("matches on name", () => {
    expect(filterTrails(rift, "ibex").map((t) => t.id)).toEqual(["mujib-ibex"]);
  });

  it("matches on summary", () => {
    expect(filterTrails(rift, "waterfall").map((t) => t.id)).toEqual(["mujib-siq"]);
  });

  it("ignores case and surrounding spaces", () => {
    expect(filterTrails(rift, "  CANYON ").map((t) => t.id)).toEqual(["main-hot-springs", "numeira-canyon"]);
  });

  it("returns every trail, in order, for an empty query", () => {
    expect(filterTrails(rift, "   ")).toEqual(rift);
  });

  it("returns nothing when nothing matches", () => {
    expect(filterTrails(rift, "glacier")).toEqual([]);
  });

  it("keeps the original order", () => {
    const ids = filterTrails(rift, "a").map((t) => t.id);
    expect(ids).toEqual(rift.map((t) => t.id).filter((id) => ids.includes(id)));
  });
});
