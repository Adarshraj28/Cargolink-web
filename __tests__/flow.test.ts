import { beforeAll, describe, expect, it } from "vitest";
import {
  addVehicle,
  createShipment,
  createTripFromLoad,
  getActiveTripForDriver,
  getMatchesForVehicle,
  getNotificationsForUser,
  getOpenLoads,
  getState,
  getTransactionsForUser,
  getTripsForDriver,
  registerUser,
  updateTripStatus,
  verifyDeliveryCode,
  verifyPickupCode,
} from "@/lib/store";
import type { Vehicle } from "@/lib/types";

/**
 * The critical spec test: a shipper creates a shipment, a driver accepts it,
 * the trip runs with pickup/delivery verification, and the system then
 * surfaces a high-scoring return load which becomes a second trip.
 */

describe("Complete connected flow", () => {
  let shipperId: string;
  let driverId: string;
  let vehicle: Vehicle;

  beforeAll(() => {
    // Fresh state for this suite
    const shipper = registerUser({
      name: "Flow Shipper",
      email: "flow-shipper@test.com",
      password: "pass123",
      role: "SHIPPER",
      city: "Delhi",
    });
    const driver = registerUser({
      name: "Flow Driver",
      email: "flow-driver@test.com",
      password: "pass123",
      role: "DRIVER",
      city: "Mumbai",
    });
    shipperId = shipper.user.id;
    driverId = driver.user.id;
    vehicle = addVehicle({
      ownerId: driverId,
      number: "MH-12-FL-9999",
      truckType: "32 Ton Trailer",
      capacity: 32,
      bodyType: "Open Trailer",
      currentLocation: "Mumbai",
      driverName: "Flow Driver",
      driverPhone: "+91 99999 99999",
      availability: "available",
    });
  });

  it("shipper creates a shipment which enters the marketplace", () => {
    const shipment = createShipment(shipperId, {
      pickup: "Delhi",
      drop: "Mumbai",
      cargoType: "General Goods",
      weight: 20,
      truckType: "32 Ton Trailer",
      pickupDate: "2026-08-20",
      pickupTime: "09:00",
      budget: 90000,
    });
    expect(shipment.ref).toMatch(/^CL-\d{5}$/);
    expect(shipment.status).toBe("SEARCHING_FOR_TRUCK");
    expect(getOpenLoads().some((l) => l.shipmentId === shipment.id)).toBe(true);
  });

  it("matching engine returns scores for the driver's truck", () => {
    const matches = getMatchesForVehicle(vehicle);
    expect(matches.length).toBeGreaterThan(0);
    // Scores must differ across loads — not all hardcoded 90%+
    const scores = new Set(matches.map((m) => m.score));
    expect(scores.size).toBeGreaterThan(1);
  });

  it("driver accepts the shipment — trip created with private codes", () => {
    const load = getOpenLoads().find((l) => l.drop === "Mumbai")!;
    createTripFromLoad(load, vehicle, driverId);
    const trip = getActiveTripForDriver(driverId);
    expect(trip).toBeTruthy();
    expect(trip!.pickupCode).toMatch(/^\d{4}$/);
    expect(trip!.deliveryCode).toMatch(/^\d{4}$/);
    expect(trip!.status).toBe("LOAD_ACCEPTED");

    // Shipper sees the update
    const shipment = getState().shipments.find((s) => s.id === load.shipmentId);
    expect(shipment?.status).toBe("LOAD_ACCEPTED");
    expect(shipment?.assignedTripId).toBe(trip!.id);
  });

  it("pickup verification gates the trip start", () => {
    const trip = getActiveTripForDriver(driverId)!;
    updateTripStatus(trip.id, "ARRIVING_AT_PICKUP");
    updateTripStatus(trip.id, "AT_PICKUP");

    expect(verifyPickupCode(trip.id, "0000")).toBe(false);
    expect(verifyPickupCode(trip.id, trip.pickupCode!)).toBe(true);
    expect(getActiveTripForDriver(driverId)!.status).toBe("IN_TRANSIT");
  });

  it("delivery verification completes the trip and releases the vehicle", () => {
    const trip = getActiveTripForDriver(driverId)!;
    updateTripStatus(trip.id, "NEAR_DESTINATION");
    updateTripStatus(trip.id, "DELIVERED");

    expect(verifyDeliveryCode(trip.id, "0000")).toBe(false);
    expect(verifyDeliveryCode(trip.id, trip.deliveryCode!)).toBe(true);

    const done = getState().trips.find((t) => t.id === trip.id);
    expect(done?.status).toBe("COMPLETED");
    expect(done?.completedAt).toBeTruthy();

    const released = getState().vehicles.find((v) => v.id === vehicle.id);
    expect(released?.availability).toBe("available");
    expect(released?.currentLocation).toBe("Mumbai");

    // Notifications + earnings
    expect(
      getNotificationsForUser(shipperId).some((n) => n.type === "delivery_completed")
    ).toBe(true);
    expect(
      getTransactionsForUser(driverId).some((t) => t.type === "earnings" && t.amount === 90000)
    ).toBe(true);
  });

  it("return-load matching surfaces a high-scoring Mumbai→Pune load after completion", () => {
    const released = getState().vehicles.find((v) => v.id === vehicle.id)!;
    const matches = getMatchesForVehicle(released);
    const pune = matches.find((m) => m.load.drop === "Pune");
    expect(pune).toBeTruthy();
    expect(pune!.score).toBeGreaterThanOrEqual(85);
    expect(pune!.reasons.length).toBeGreaterThan(0);

    // Accepting it creates a second trip
    createTripFromLoad(pune!.load, released, driverId);
    expect(getTripsForDriver(driverId).length).toBe(2);
  });
});
