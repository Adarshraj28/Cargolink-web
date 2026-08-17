import { describe, expect, it } from "vitest";
import { computeMatch, matchLoads } from "@/lib/matching";
import type { Load, Vehicle } from "@/lib/types";

const vehicle: Vehicle = {
  id: "v-test",
  ownerId: "u-1",
  number: "MH-12-AB-3456",
  truckType: "32 Ton Trailer",
  capacity: 32,
  bodyType: "Open Trailer",
  currentLocation: "Mumbai",
  driverName: "Rahul",
  driverPhone: "+91 98000 00000",
  availability: "available",
  status: "active",
  createdAt: new Date().toISOString(),
};

function makeLoad(overrides: Partial<Load>): Load {
  return {
    id: "l-" + Math.random(),
    ref: "LD-10000",
    pickup: "Mumbai",
    drop: "Pune",
    distance: 148,
    cargoType: "FMCG",
    weight: 12,
    truckType: "32 Ton Trailer",
    price: 18500,
    pickupDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    pickupTime: "14:00",
    status: "open",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("computeMatch", () => {
  it("returns null for non-open loads", () => {
    expect(computeMatch(makeLoad({ status: "accepted" }), vehicle)).toBeNull();
  });

  it("scores a well-matched load highly", () => {
    const match = computeMatch(makeLoad({}), vehicle)!;
    expect(match.score).toBeGreaterThanOrEqual(80);
    expect(match.breakdown.route).toBeGreaterThanOrEqual(90);
    expect(match.breakdown.capacity).toBeGreaterThanOrEqual(90);
    expect(match.reasons.length).toBeGreaterThanOrEqual(3);
  });

  it("scores a poor match lower and surfaces warnings", () => {
    const match = computeMatch(
      makeLoad({
        pickup: "Chennai",
        drop: "Bangalore",
        distance: 350,
        truckType: "Tata ACE (1T)",
        weight: 40,
        pickupDate: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10),
      }),
      vehicle
    )!;
    expect(match.score).toBeLessThan(60);
    expect(match.warnings.length).toBeGreaterThanOrEqual(1);
  });

  it("penalizes an unavailable vehicle", () => {
    const unavailable = { ...vehicle, availability: "unavailable" as const };
    const availableScore = computeMatch(makeLoad({}), vehicle)!.score;
    const unavailableScore = computeMatch(makeLoad({}), unavailable)!.score;
    expect(unavailableScore).toBeLessThan(availableScore);
  });

  it("produces different scores for different loads", () => {
    const scores = new Set(
      [
        makeLoad({ pickup: "Mumbai", drop: "Pune", distance: 148, weight: 12 }),
        makeLoad({ pickup: "Mumbai", drop: "Ahmedabad", distance: 524, weight: 11 }),
        makeLoad({ pickup: "Surat", drop: "Delhi", distance: 1120, weight: 30 }),
      ].map((l) => computeMatch(l, vehicle)!.score)
    );
    expect(scores.size).toBeGreaterThan(1);
  });
});

describe("matchLoads", () => {
  it("filters to open loads and sorts by score descending", () => {
    const loads = [
      makeLoad({ id: "l-good", pickup: "Mumbai", drop: "Pune" }),
      makeLoad({ id: "l-bad", pickup: "Chennai", drop: "Bangalore", truckType: "Tata ACE (1T)", weight: 40 }),
      makeLoad({ id: "l-closed", status: "accepted" }),
    ];
    const matches = matchLoads(loads, vehicle);
    expect(matches.map((m) => m.loadId)).not.toContain("l-closed");
    expect(matches.length).toBe(2);
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].score).toBeGreaterThanOrEqual(matches[i].score);
    }
  });
});
