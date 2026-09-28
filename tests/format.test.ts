import { describe, expect, it } from "vitest";
import { formatDate, formatMoney, formatTime } from "@/lib/format";

describe("formatDate", () => {
  it("renders day, short month, year", () => {
    expect(formatDate("2026-09-15")).toBe("15 Sep 2026");
    expect(formatDate("2026-03-01")).toBe("1 Mar 2026");
  });
});

describe("formatTime", () => {
  it("renders 24-hour time", () => {
    expect(formatTime("2026-09-15T14:05:00Z")).toBe("14:05");
  });
});

describe("formatMoney", () => {
  it("renders two decimals and the ISO code", () => {
    expect(formatMoney(3.5, "JOD")).toBe("3.50 JOD");
    expect(formatMoney(0, "JOD")).toBe("0.00 JOD");
  });
});
