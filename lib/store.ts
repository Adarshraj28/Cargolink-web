"use client";

import { useSyncExternalStore } from "react";
import { createSeedState } from "./seed";
import { computeMatch, matchLoads } from "./matching";
import type {
  AppState,
  Load,
  MatchResult,
  NotificationItem,
  Shipment,
  Transaction,
  Trip,
  User,
  Vehicle,
} from "./types";
import { genRef, uid } from "./utils";

const STORAGE_KEY = "cargolink-state-v2";

/**
 * CARGOLINK application store.
 *
 * A single connected state layer that powers the whole product:
 * shipments → loads → matches → trips → tracking → earnings.
 * Persisted to localStorage so demo data survives reloads without
 * requiring any external credentials.
 */

function loadState(): AppState {
  if (typeof window === "undefined") return createSeedState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && Array.isArray(parsed.users)) return parsed;
    }
  } catch {
    // fall through to fresh seed
  }
  const seeded = createSeedState();
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  } catch {
    // storage unavailable — run in-memory
  }
  return seeded;
}

let state: AppState = loadState();
const listeners = new Set<() => void>();

export function getState(): AppState {
  return state;
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * React hook that re-renders the component whenever the store changes.
 * Use this instead of manual subscribe + setState patterns.
 */
export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getState, getState);
}

function persist() {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // ignore
  }
  listeners.forEach((fn) => fn());
}

function mutate(fn: (draft: AppState) => void) {
  state = structuredClone(state);
  fn(state);
  persist();
}

/* ========================= */
/* Auth                       */
/* ========================= */

export function registerUser(input: {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: User["role"];
  company?: string;
  city?: string;
}): { user: User; error?: string } {
  const email = input.email.trim().toLowerCase();
  const exists = state.users.some((u) => u.email === email);
  if (exists) return { user: null as unknown as User, error: "An account with this email already exists. Try logging in." };
  const user: User = {
    id: uid("u"),
    name: input.name.trim(),
    email,
    phone: input.phone,
    password: input.password,
    role: input.role,
    company: input.company,
    city: input.city,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  mutate((s) => {
    s.users.push(user);
    s.sessionUserId = user.id;
  });
  return { user };
}

export function login(email: string, password: string): { user: User; error?: string } {
  const user = state.users.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password
  );
  if (!user) return { user: null as unknown as User, error: "Invalid email or password." };
  if (user.status === "suspended") return { user: null as unknown as User, error: "This account has been suspended." };
  mutate((s) => {
    s.sessionUserId = user.id;
  });
  return { user };
}

export function logout() {
  mutate((s) => {
    s.sessionUserId = null;
  });
}

export function getSessionUser(): User | null {
  if (!state.sessionUserId) return null;
  return state.users.find((u) => u.id === state.sessionUserId) ?? null;
}

/* ========================= */
/* Users / vehicles           */
/* ========================= */

export function getUser(id: string): User | undefined {
  return state.users.find((u) => u.id === id);
}

export function getVehiclesByOwner(ownerId: string): Vehicle[] {
  return state.vehicles.filter((v) => v.ownerId === ownerId);
}

export function addVehicle(input: Omit<Vehicle, "id" | "createdAt" | "status">): Vehicle {
  const vehicle: Vehicle = {
    ...input,
    id: uid("v"),
    status: "active",
    createdAt: new Date().toISOString(),
  };
  mutate((s) => {
    s.vehicles.push(vehicle);
    const owner = s.users.find((u) => u.id === input.ownerId);
    if (owner) owner.vehicleId = vehicle.id;
  });
  return vehicle;
}

export function updateVehicle(
  vehicleId: string,
  patch: Partial<Pick<Vehicle, "availability" | "currentLocation" | "driverName" | "driverPhone">>
) {
  mutate((s) => {
    const v = s.vehicles.find((x) => x.id === vehicleId);
    if (v) Object.assign(v, patch);
  });
}

export function updateUser(userId: string, patch: Partial<User>) {
  mutate((s) => {
    const u = s.users.find((x) => x.id === userId);
    if (u) Object.assign(u, patch);
  });
}

export function setUserStatus(userId: string, status: User["status"]) {
  mutate((s) => {
    const u = s.users.find((x) => x.id === userId);
    if (u) u.status = status;
  });
}

/* ========================= */
/* Shipments                 */
/* ========================= */

export function createShipment(
  shipperId: string,
  input: Omit<Shipment, "id" | "ref" | "shipperId" | "status" | "createdAt"> & {
    preferredVehicleId?: string;
  }
): Shipment {
  const shipment: Shipment = {
    ...input,
    id: uid("s"),
    ref: genRef("CL"),
    shipperId,
    status: "SEARCHING_FOR_TRUCK",
    createdAt: new Date().toISOString(),
  };
  mutate((s) => {
    s.shipments.push(shipment);
    // If the shipper picked a specific truck, notify its owner so the
    // marketplace feels two-sided — the driver still confirms via the load.
    if (shipment.preferredVehicleId) {
      const vehicle = s.vehicles.find((v) => v.id === shipment.preferredVehicleId);
      if (vehicle) {
        s.notifications.unshift({
          id: uid("n"),
          userId: vehicle.ownerId,
          type: "new_shipment",
          title: "Your truck was selected",
          message: `${vehicle.number} was selected for shipment ${shipment.ref} (${shipment.pickup} → ${shipment.drop}). Confirm pickup from the load marketplace.`,
          read: false,
          createdAt: new Date().toISOString(),
          href: "/dashboard/loads",
        });
      }
    }
    // Shipment enters the load marketplace automatically.
    const load: Load = {
      id: uid("l"),
      ref: genRef("LD"),
      shipmentId: shipment.id,
      pickup: shipment.pickup,
      drop: shipment.drop,
      distance: 600, // refined by the UI after creation if needed
      cargoType: shipment.cargoType,
      weight: shipment.weight,
      truckType: shipment.truckType,
      price: shipment.budget,
      pickupDate: shipment.pickupDate,
      pickupTime: shipment.pickupTime,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    s.loads.push(load);
    s.notifications.unshift({
      id: uid("n"),
      userId: shipperId,
      type: "new_shipment",
      title: "Shipment created",
      message: `Shipment ${shipment.ref} (${shipment.pickup} → ${shipment.drop}) is now searching for a truck.`,
      read: false,
      createdAt: new Date().toISOString(),
      href: "/dashboard/shipments",
    });
  });
  return shipment;
}

export function getShipmentsByShipper(shipperId: string): Shipment[] {
  return state.shipments
    .filter((s) => s.shipperId === shipperId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function findShipment(refOrId: string): Shipment | undefined {
  const q = refOrId.trim().toUpperCase();
  return state.shipments.find((s) => s.ref === q || s.id === q);
}

export function updateShipmentStatus(shipmentId: string, status: Shipment["status"]) {
  mutate((s) => {
    const shipment = s.shipments.find((x) => x.id === shipmentId);
    if (shipment) shipment.status = status;
  });
}

/* ========================= */
/* Loads                     */
/* ========================= */

export function getOpenLoads(): Load[] {
  return state.loads
    .filter((l) => l.status === "open")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function findLoad(refOrId: string): Load | undefined {
  const q = refOrId.trim().toUpperCase();
  return state.loads.find((l) => l.ref === q || l.id === q);
}

export function updateLoadStatus(loadId: string, status: Load["status"]) {
  mutate((s) => {
    const load = s.loads.find((x) => x.id === loadId);
    if (load) load.status = status;
  });
}

export function rejectLoad(loadId: string) {
  updateLoadStatus(loadId, "cancelled");
}

/* ========================= */
/* Matching                  */
/* ========================= */

export function getMatchesForVehicle(vehicle: Vehicle): MatchResult[] {
  const computed = matchLoads(getOpenLoads(), vehicle);
  return computed.map((m) => {
    const load = state.loads.find((l) => l.id === m.loadId)!;
    return {
      id: uid("m"),
      loadId: m.loadId,
      load,
      score: m.score,
      breakdown: m.breakdown,
      reasons: m.reasons,
      warnings: m.warnings,
      createdAt: new Date().toISOString(),
    };
  });
}

export function persistMatches(vehicle: Vehicle): MatchResult[] {
  const matches = getMatchesForVehicle(vehicle);
  mutate((s) => {
    s.matches = matches;
  });
  return matches;
}

/* ========================= */
/* Trips                     */
/* ========================= */

export function createTripFromLoad(load: Load, vehicle: Vehicle, driverId: string): Trip {
  const trip: Trip = {
    id: uid("t"),
    ref: genRef("TRP"),
    shipmentId: load.shipmentId ?? "",
    loadId: load.id,
    vehicleId: vehicle.id,
    driverId,
    shipperId: "",
    pickup: load.pickup,
    drop: load.drop,
    status: "LOAD_ACCEPTED",
    currentLocation: vehicle.currentLocation,
    eta: `${load.pickupDate} ${load.pickupTime}`,
    progress: 0,
    earnings: load.price,
    createdAt: new Date().toISOString(),
  };
  mutate((s) => {
    s.trips.push(trip);
    updateLoadStatusIn(s, load.id, "accepted");
    const v = s.vehicles.find((x) => x.id === vehicle.id);
    if (v) v.availability = "on-trip";
    if (load.shipmentId) {
      const shipment = s.shipments.find((x) => x.id === load.shipmentId);
      if (shipment) {
        shipment.status = "LOAD_ACCEPTED";
        shipment.assignedTripId = trip.id;
        shipment.pickupCode = String(Math.floor(1000 + Math.random() * 9000));
        shipment.deliveryCode = String(Math.floor(1000 + Math.random() * 9000));
        trip.pickupCode = shipment.pickupCode;
        trip.deliveryCode = shipment.deliveryCode;
        trip.shipperId = shipment.shipperId;
        s.notifications.unshift({
          id: uid("n"),
          userId: shipment.shipperId,
          type: "load_accepted",
          title: "Driver assigned",
          message: `A driver accepted shipment ${shipment.ref}. Your pickup verification code is ${shipment.pickupCode}.`,
          read: false,
          createdAt: new Date().toISOString(),
          href: "/dashboard/tracking",
        });
      }
    }
    s.notifications.unshift({
      id: uid("n"),
      userId: driverId,
      type: "load_accepted",
      title: "Load accepted",
      message: `Load ${load.ref} (${load.pickup} → ${load.drop}) accepted. Proceed to pickup.`,
      read: false,
      createdAt: new Date().toISOString(),
      href: "/dashboard/trip",
    });
  });
  return trip;
}

function updateLoadStatusIn(s: AppState, loadId: string, status: Load["status"]) {
  const load = s.loads.find((x) => x.id === loadId);
  if (load) load.status = status;
}

export function getTripsForDriver(driverId: string): Trip[] {
  return state.trips
    .filter((t) => t.driverId === driverId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getActiveTripForDriver(driverId: string): Trip | undefined {
  return state.trips.find(
    (t) =>
      t.driverId === driverId &&
      !["COMPLETED", "CANCELLED", "DELIVERED"].includes(t.status)
  );
}

export function getTripsForShipper(shipperId: string): Trip[] {
  return state.trips
    .filter((t) => t.shipperId === shipperId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function findTrip(refOrId: string): Trip | undefined {
  const q = refOrId.trim().toUpperCase();
  return state.trips.find((t) => t.ref === q || t.id === q);
}

export function updateTripStatus(tripId: string, status: Trip["status"]) {
  mutate((s) => {
    const trip = s.trips.find((x) => x.id === tripId);
    if (!trip) return;
    trip.status = status;
    // Progress mapping along the trip lifecycle.
    const progressMap: Record<Trip["status"], number> = {
      LOAD_ACCEPTED: 0,
      DRIVER_ASSIGNED: 5,
      ARRIVING_AT_PICKUP: 15,
      AT_PICKUP: 20,
      LOADING: 25,
      IN_TRANSIT: 45,
      NEAR_DESTINATION: 80,
      DELIVERED: 100,
      COMPLETED: 100,
      CANCELLED: 0,
    };
    trip.progress = progressMap[status];
    if (status === "COMPLETED") {
      trip.completedAt = new Date().toISOString();
      const v = s.vehicles.find((x) => x.id === trip.vehicleId);
      if (v) {
        v.availability = "available";
        v.currentLocation = trip.drop;
      }
      // Release the driver's vehicle back into the marketplace —
      // return-load matching picks up from here.
      const shipment = s.shipments.find((x) => x.id === trip.shipmentId);
      if (shipment) {
        shipment.status = "COMPLETED";
        s.transactions.unshift({
          id: uid("tx"),
          userId: trip.driverId,
          type: "earnings",
          amount: trip.earnings,
          label: `Trip ${trip.ref} · ${trip.pickup} → ${trip.drop}`,
          status: "completed",
          createdAt: new Date().toISOString(),
        });
        s.transactions.unshift({
          id: uid("tx"),
          userId: trip.shipperId,
          type: "payment",
          amount: trip.earnings,
          label: `Shipment ${shipment.ref} · ${trip.pickup} → ${trip.drop}`,
          status: "completed",
          createdAt: new Date().toISOString(),
        });
        s.notifications.unshift({
          id: uid("n"),
          userId: trip.shipperId,
          type: "delivery_completed",
          title: "Shipment delivered",
          message: `Shipment ${shipment.ref} (${trip.pickup} → ${trip.drop}) has been completed.`,
          read: false,
          createdAt: new Date().toISOString(),
          href: "/dashboard/tracking",
        });
      }
    }
  });
}

export function verifyPickupCode(tripId: string, code: string): boolean {
  const trip = state.trips.find((t) => t.id === tripId);
  if (!trip || !trip.pickupCode) return false;
  if (trip.pickupCode !== code.trim()) return false;
  mutate((s) => {
    const t = s.trips.find((x) => x.id === tripId);
    if (t) t.status = "IN_TRANSIT";
  });
  return true;
}

export function verifyDeliveryCode(tripId: string, code: string): boolean {
  const trip = state.trips.find((t) => t.id === tripId);
  if (!trip || !trip.deliveryCode) return false;
  if (trip.deliveryCode !== code.trim()) return false;
  mutate((s) => {
    const t = s.trips.find((x) => x.id === tripId);
    if (!t) return;
    t.status = "COMPLETED";
    t.progress = 100;
    t.completedAt = new Date().toISOString();
    const v = s.vehicles.find((x) => x.id === t.vehicleId);
    if (v) {
      v.availability = "available";
      v.currentLocation = t.drop;
    }
    const shipment = s.shipments.find((x) => x.id === t.shipmentId);
    if (shipment) {
      shipment.status = "COMPLETED";
      s.transactions.unshift({
        id: uid("tx"),
        userId: t.driverId,
        type: "earnings",
        amount: t.earnings,
        label: `Trip ${t.ref} · ${t.pickup} → ${t.drop}`,
        status: "completed",
        createdAt: new Date().toISOString(),
      });
      s.transactions.unshift({
        id: uid("tx"),
        userId: t.shipperId,
        type: "payment",
        amount: t.earnings,
        label: `Shipment ${shipment.ref} · ${t.pickup} → ${t.drop}`,
        status: "completed",
        createdAt: new Date().toISOString(),
      });
      s.notifications.unshift({
        id: uid("n"),
        userId: t.shipperId,
        type: "delivery_completed",
        title: "Shipment delivered",
        message: `Shipment ${shipment.ref} (${t.pickup} → ${t.drop}) has been completed.`,
        read: false,
        createdAt: new Date().toISOString(),
        href: "/dashboard/tracking",
      });
    }
  });
  return true;
}

/* ========================= */
/* Notifications             */
/* ========================= */

export function getNotificationsForUser(userId: string): NotificationItem[] {
  return state.notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getUnreadCount(userId: string): number {
  return state.notifications.filter(
    (n) => n.userId === userId && !n.read
  ).length;
}

export function markAllRead(userId: string) {
  mutate((s) => {
    s.notifications.forEach((n) => {
      if (n.userId === userId) n.read = true;
    });
  });
}

/* ========================= */
/* Transactions              */
/* ========================= */

export function getTransactionsForUser(userId: string): Transaction[] {
  return state.transactions
    .filter((t) => t.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getEarningsTotal(userId: string): number {
  return state.transactions
    .filter((t) => t.userId === userId && t.type === "earnings" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);
}

/* ========================= */
/* Demo / reset              */
/* ========================= */

export function resetDemoData() {
  // Re-seed the demo while keeping the current user signed in, so visitors
  // can replay the demo freely without losing their session.
  const currentUserId = state.sessionUserId;
  state = createSeedState();
  if (currentUserId && state.users.some((u) => u.id === currentUserId)) {
    state.sessionUserId = currentUserId;
  }
  persist();
}

export { computeMatch };
