import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  SEARCHING_FOR_TRUCK: "Searching for truck",
  LOAD_ACCEPTED: "Load accepted",
  DRIVER_ASSIGNED: "Driver assigned",
  ARRIVING_AT_PICKUP: "Arriving at pickup",
  AT_PICKUP: "At pickup",
  LOADING: "Loading",
  IN_TRANSIT: "In transit",
  NEAR_DESTINATION: "Near destination",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  available: "Available",
  "on-trip": "On trip",
  unavailable: "Unavailable",
  maintenance: "Maintenance",
  open: "Open",
  accepted: "Accepted",
  active: "Active",
  suspended: "Suspended",
  pending: "Pending",
  failed: "Failed",
};

const TONES: Record<string, string> = {
  // success family
  COMPLETED: "badge-success",
  DELIVERED: "badge-success",
  available: "badge-success",
  active: "badge-success",
  open: "badge-success",
  completed: "badge-success",
  // warning family
  SEARCHING_FOR_TRUCK: "badge-warning",
  LOAD_ACCEPTED: "badge-warning",
  DRIVER_ASSIGNED: "badge-warning",
  ARRIVING_AT_PICKUP: "badge-warning",
  AT_PICKUP: "badge-warning",
  LOADING: "badge-warning",
  accepted: "badge-warning",
  pending: "badge-warning",
  maintenance: "badge-warning",
  // info family
  IN_TRANSIT: "badge-info",
  NEAR_DESTINATION: "badge-info",
  "on-trip": "badge-info",
  // danger family
  CANCELLED: "badge-danger",
  suspended: "badge-danger",
  failed: "badge-danger",
  unavailable: "badge-danger",
  // neutral
  inactive: "badge-neutral",
};

const DOTS: Record<string, boolean> = {
  IN_TRANSIT: true,
  NEAR_DESTINATION: true,
  available: true,
  "on-trip": true,
  SEARCHING_FOR_TRUCK: true,
  open: true,
  pending: true,
};

export default function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const label = LABELS[status] ?? status.replace(/_/g, " ").toLowerCase();
  return (
    <span className={cn("badge", TONES[status] ?? "badge-neutral", className)}>
      {DOTS[status] && <span className="badge-dot animate-pulse-soft" aria-hidden="true" />}
      {label}
    </span>
  );
}
