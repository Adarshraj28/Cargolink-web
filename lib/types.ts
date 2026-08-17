export type Role = "SHIPPER" | "DRIVER" | "FLEET_OPERATOR" | "ADMIN";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  company?: string;
  city?: string;
  status: "active" | "suspended";
  createdAt: string;
  vehicleId?: string;
}

export interface Vehicle {
  id: string;
  ownerId: string;
  number: string;
  truckType: string;
  capacity: number; // tonnes
  bodyType: string;
  currentLocation: string;
  driverName: string;
  driverPhone: string;
  availability: "available" | "on-trip" | "unavailable" | "maintenance";
  status: "active" | "inactive";
  createdAt: string;
}

export type ShipmentStatus =
  | "SEARCHING_FOR_TRUCK"
  | "LOAD_ACCEPTED"
  | "DRIVER_ASSIGNED"
  | "ARRIVING_AT_PICKUP"
  | "AT_PICKUP"
  | "LOADING"
  | "IN_TRANSIT"
  | "NEAR_DESTINATION"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export interface Shipment {
  id: string;
  ref: string; // CL-XXXXX
  shipperId: string;
  pickup: string;
  drop: string;
  cargoType: string;
  weight: number; // tonnes
  truckType: string;
  pickupDate: string;
  pickupTime: string;
  budget: number; // INR
  instructions?: string;
  dimensions?: string;
  contactName?: string;
  contactPhone?: string;
  status: ShipmentStatus;
  createdAt: string;
  assignedTripId?: string;
  preferredVehicleId?: string;
  pickupCode?: string;
  deliveryCode?: string;
}

export interface Load {
  id: string;
  ref: string; // LD-XXXXX
  shipmentId?: string;
  pickup: string;
  drop: string;
  distance: number; // km
  cargoType: string;
  weight: number;
  truckType: string;
  price: number;
  pickupDate: string;
  pickupTime: string;
  status: "open" | "accepted" | "completed" | "cancelled";
  createdAt: string;
}

export type TripStatus =
  | "LOAD_ACCEPTED"
  | "DRIVER_ASSIGNED"
  | "ARRIVING_AT_PICKUP"
  | "AT_PICKUP"
  | "LOADING"
  | "IN_TRANSIT"
  | "NEAR_DESTINATION"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export interface Trip {
  id: string;
  ref: string; // TRP-XXXXX
  shipmentId: string;
  loadId?: string;
  vehicleId: string;
  driverId: string;
  shipperId: string;
  pickup: string;
  drop: string;
  status: TripStatus;
  currentLocation: string;
  eta: string;
  progress: number; // 0-100
  startedAt?: string;
  completedAt?: string;
  pickupCode?: string;
  deliveryCode?: string;
  earnings: number;
  createdAt: string;
  isReturnTrip?: boolean;
}

export interface MatchResult {
  id: string;
  loadId: string;
  load: Load;
  score: number;
  breakdown: {
    route: number;
    distance: number;
    truck: number;
    capacity: number;
    timing: number;
    cargo: number;
  };
  reasons: string[];
  warnings: string[];
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type:
    | "new_shipment"
    | "load_accepted"
    | "driver_assigned"
    | "pickup_reminder"
    | "trip_started"
    | "delivery_completed"
    | "return_match"
    | "payment";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  href?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "payment" | "earnings" | "payout";
  amount: number;
  label: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
}

export interface AppState {
  users: User[];
  vehicles: Vehicle[];
  shipments: Shipment[];
  loads: Load[];
  trips: Trip[];
  matches: MatchResult[];
  notifications: NotificationItem[];
  transactions: Transaction[];
  sessionUserId: string | null;
}
