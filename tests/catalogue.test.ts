import { describe, expect, it } from "vitest";
import { regions, trails } from "@/data/catalogue";

describe("catalogue data", () => {
  it("has unique region slugs and trail ids", () => {
    expect(new Set(regions.map((r) => r.slug)).size).toBe(regions.length);
    expect(new Set(trails.map((t) => t.id)).size).toBe(trails.length);
  });

  it("links every trail to an existing region", () => {
    const slugs = new Set(regions.map((r) => r.slug));
    for (const t of trails) expect(slugs.has(t.regionSlug), t.id).toBe(true);
  });

  it("gives every trail every required field", () => {
    for (const t of trails) {
      expect(t.name && t.summary, t.id).toBeTruthy();
      expect(t.distanceKm, t.id).toBeGreaterThan(0);
      expect(Number.isInteger(t.elevationGainM) && t.elevationGainM >= 0, t.id).toBe(true);
      expect(["easy", "moderate", "hard"]).toContain(t.difficulty);
      expect(t.entryFee.currency).toBe("JOD");
      expect(Number.isNaN(Date.parse(t.lastSurveyed)), t.id).toBe(false);
      expect(t.image.alt, t.id).not.toBe("");
      expect(t.image.width > 0 && t.image.height > 0, t.id).toBe(true);
    }
  });
});
