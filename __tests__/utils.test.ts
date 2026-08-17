import { describe, expect, it } from "vitest";
import { approxDistance, formatINR, genRef, normalizeCity, uid } from "@/lib/utils";

describe("utils", () => {
  it("generates unique ids", () => {
    const a = uid("u");
    const b = uid("u");
    expect(a).not.toBe(b);
    expect(a.startsWith("u-")).toBe(true);
  });

  it("generates shipment-style refs", () => {
    const ref = genRef("CL");
    expect(ref).toMatch(/^CL-\d{5}$/);
  });

  it("formats INR", () => {
    expect(formatINR(82000)).toContain("82,000");
  });

  it("computes approximate distances for known pairs", () => {
    expect(approxDistance("Delhi", "Mumbai")).toBe(1420);
    expect(approxDistance("Mumbai", "Pune")).toBe(148);
    // order-independent
    expect(approxDistance("Mumbai", "Delhi")).toBe(1420);
  });

  it("normalizes city names", () => {
    expect(normalizeCity("New Delhi ")).toBe("new-delhi");
  });
});
