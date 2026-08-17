import type { Load, Vehicle } from "./types";
import { approxDistance, cityFromLocation, normalizeCity } from "./utils";

/**
 * CARGOLINK matching engine.
 *
 * A transparent, weighted score built from logistics data:
 *   route compatibility  30%
 *   distance             20%
 *   truck compatibility  20%
 *   capacity             15%
 *   timing               10%
 *   cargo compatibility   5%
 *
 * Scores are computed from real inputs (vehicle location, truck type,
 * capacity, load route, weight, dates) — not hardcoded.
 */

export interface MatchBreakdown {
  route: number;
  distance: number;
  truck: number;
  capacity: number;
  timing: number;
  cargo: number;
}

export interface ComputedMatch {
  loadId: string;
  score: number;
  breakdown: MatchBreakdown;
  reasons: string[];
  warnings: string[];
}

const WEIGHTS = {
  route: 0.3,
  distance: 0.2,
  truck: 0.2,
  capacity: 0.15,
  timing: 0.1,
  cargo: 0.05,
};

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

/** How well the load's pickup aligns with the vehicle's current location. */
function routeScore(vehicleLocation: string, loadPickup: string): number {
  const vLoc = normalizeCity(cityFromLocation(vehicleLocation));
  const pLoc = normalizeCity(loadPickup);
  if (vLoc === pLoc) return 100;
  const dist = approxDistance(vehicleLocation, loadPickup);
  // Within 50 km: near-ideal. Penalize as pickup gets farther away.
  if (dist <= 50) return 92;
  if (dist <= 150) return 78;
  if (dist <= 300) return 60;
  if (dist <= 600) return 40;
  return 22;
}

function distanceScore(loadDistance: number): number {
  // Shorter hauling distances are easier to fulfill with one vehicle.
  if (loadDistance <= 200) return 100;
  if (loadDistance <= 500) return 88;
  if (loadDistance <= 1000) return 70;
  if (loadDistance <= 1600) return 55;
  return 40;
}

function truckScore(vehicleType: string, requiredType: string): number {
  const v = normalizeCity(vehicleType);
  const r = normalizeCity(requiredType);
  if (v === r) return 100;

  // Family-of-truck approximations: full compatibility within a class.
  const families: Record<string, string[]> = {
    trailer: ["32 ton trailer", "taurus", "container 32ft"],
    container: ["container 14ft", "container 20ft", "container 32ft"],
    light: ["tata ace", "pickup", "lcv", "mazda"],
    medium: ["eicher 19ft", "lcv", "container 14ft", "mazda"],
  };

  const vType = vehicleType.toLowerCase();
  const rType = requiredType.toLowerCase();

  const vFamily = Object.entries(families).find(([, members]) =>
    members.some((m) => vType.includes(m))
  )?.[0];
  const rFamily = Object.entries(families).find(([, members]) =>
    members.some((m) => rType.includes(m))
  )?.[0];

  if (vFamily && rFamily && vFamily === rFamily) return 90;

  // Parse tonnage: if the required capacity fits within vehicle capacity,
  // it's still workable.
  const tonMatch = (s: string) => {
    const m = s.match(/(\d+(?:\.\d+)?)\s*t/i);
    return m ? parseFloat(m[1]) : null;
  };
  const vt = tonMatch(vehicleType);
  const rt = tonMatch(requiredType);
  if (vt && rt && vt >= rt) return 72;
  return 35;
}

function capacityScore(vehicleCapacity: number, loadWeight: number): number {
  if (vehicleCapacity <= 0) return 0;
  const utilization = loadWeight / vehicleCapacity;
  if (utilization <= 0.6) return 95; // well within capacity
  if (utilization <= 0.85) return 100; // ideal band
  if (utilization <= 1.0) return 78;
  return 15; // overweight
}

function timingScore(
  loadPickupDate: string,
  loadPickupTime: string,
  vehicleAvailable: boolean
): number {
  if (!vehicleAvailable) return 25;
  const today = new Date().toISOString().slice(0, 10);
  const diffDays =
    (new Date(loadPickupDate).getTime() - new Date(today).getTime()) /
    86400000;
  if (diffDays < -1) return 20; // pickup already overdue
  if (diffDays <= 0) return 90; // today — urgent but doable
  if (diffDays <= 2) return 100; // ideal window
  if (diffDays <= 7) return 80;
  return 60;
}

function cargoScore(vehicleBodyType: string, cargoType: string): number {
  const cargo = cargoType.toLowerCase();
  const body = (vehicleBodyType || "").toLowerCase();
  // Chemicals and liquids need closed/container bodies.
  if (cargo.includes("chem")) {
    return body.includes("container") || body.includes("closed") ? 95 : 45;
  }
  if (cargo.includes("electronics") || cargo.includes("pharma")) {
    return body.includes("container") || body.includes("closed") ? 90 : 55;
  }
  return 90;
}

export function computeMatch(
  load: Load,
  vehicle: Vehicle
): ComputedMatch | null {
  if (load.status !== "open") return null;

  const vehicleAvailable = vehicle.availability === "available";

  const route = routeScore(vehicle.currentLocation, load.pickup);
  const distance = distanceScore(load.distance);
  const truck = truckScore(vehicle.truckType, load.truckType);
  const capacity = capacityScore(vehicle.capacity, load.weight);
  const timing = timingScore(load.pickupDate, load.pickupTime, vehicleAvailable);
  const cargo = cargoScore(vehicle.bodyType, load.cargoType);

  const raw =
    route * WEIGHTS.route +
    distance * WEIGHTS.distance +
    truck * WEIGHTS.truck +
    capacity * WEIGHTS.capacity +
    timing * WEIGHTS.timing +
    cargo * WEIGHTS.cargo;

  const score = Math.round(clamp(raw));

  const breakdown: MatchBreakdown = {
    route: Math.round(route),
    distance: Math.round(distance),
    truck: Math.round(truck),
    capacity: Math.round(capacity),
    timing: Math.round(timing),
    cargo: Math.round(cargo),
  };

  const reasons: string[] = [];
  const warnings: string[] = [];

  const pickupDist = approxDistance(vehicle.currentLocation, load.pickup);
  if (route >= 90) {
    reasons.push(`Pickup is at or near your current location (${pickupDist} km)`);
  } else if (route >= 60) {
    reasons.push(`Pickup is ${pickupDist} km from your location`);
  } else {
    warnings.push(`Pickup is ${pickupDist} km away — consider repositioning`);
  }

  if (capacity >= 90) {
    reasons.push(`Load weight (${load.weight} T) fits your ${vehicle.capacity} T capacity`);
  } else if (capacity >= 78) {
    reasons.push(`Load weight (${load.weight} T) is within your ${vehicle.capacity} T capacity`);
  } else {
    warnings.push(`Load weight (${load.weight} T) may exceed your ${vehicle.capacity} T capacity`);
  }

  if (truck >= 90) reasons.push(`Truck type matches requirement (${load.truckType})`);
  else if (truck >= 60) reasons.push(`Truck type is workable for ${load.truckType}`);
  else warnings.push(`Truck type ${load.truckType} may not suit your vehicle`);

  if (timing >= 90) reasons.push(`Pickup timing works with your schedule`);
  else if (timing >= 60) warnings.push(`Pickup timing needs planning`);
  else warnings.push(`Pickup date is soon — confirm availability`);

  if (cargo >= 85) reasons.push(`Cargo type is suitable for your vehicle`);
  else warnings.push(`Cargo type may need a different body type`);

  if (!vehicleAvailable) {
    warnings.push("Your vehicle is not currently marked available");
  }

  return { loadId: load.id, score, breakdown, reasons, warnings };
}

export function matchLoads(
  loads: Load[],
  vehicle: Vehicle
): ComputedMatch[] {
  return loads
    .map((load) => computeMatch(load, vehicle))
    .filter((m): m is ComputedMatch => m !== null)
    .sort((a, b) => b.score - a.score);
}
