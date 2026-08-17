import { cn } from "@/lib/utils";

const STATUSES = [
  "LOAD_ACCEPTED",
  "DRIVER_ASSIGNED",
  "ARRIVING_AT_PICKUP",
  "AT_PICKUP",
  "LOADING",
  "IN_TRANSIT",
  "NEAR_DESTINATION",
  "DELIVERED",
  "COMPLETED",
] as const;

const LABELS: Record<string, string> = {
  LOAD_ACCEPTED: "Load accepted",
  DRIVER_ASSIGNED: "Driver assigned",
  ARRIVING_AT_PICKUP: "Arriving at pickup",
  AT_PICKUP: "At pickup",
  LOADING: "Loading",
  IN_TRANSIT: "In transit",
  NEAR_DESTINATION: "Near destination",
  DELIVERED: "Delivered",
  COMPLETED: "Completed",
};

export default function TripTimeline({ status }: { status: string }) {
  const currentIndex = STATUSES.indexOf(status as (typeof STATUSES)[number]);
  const isCancelled = status === "CANCELLED";

  return (
    <ol className="grid gap-2 sm:grid-cols-3 lg:grid-cols-9 lg:gap-0">
      {STATUSES.map((step, index) => {
        const done = !isCancelled && currentIndex >= index;
        const active = !isCancelled && currentIndex === index;
        return (
          <li key={step} className="relative flex items-start gap-2 lg:flex-col lg:items-center lg:gap-1.5 lg:px-1 lg:text-center">
            {index < STATUSES.length - 1 && (
              <div
                className={cn(
                  "absolute left-5 top-[9px] hidden h-px w-[calc(100%-16px)] lg:block",
                  done ? "bg-forest-600" : "bg-line"
                )}
                aria-hidden="true"
              />
            )}
            <span
              className={cn(
                "relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2",
                done
                  ? "border-forest-600 bg-forest-600"
                  : active
                    ? "border-forest-600 bg-white"
                    : "border-line-strong bg-white",
                active && "animate-pulse-soft"
              )}
              aria-hidden="true"
            >
              {done && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
            </span>
            <span
              className={cn(
                "text-[11px] leading-tight",
                done ? "font-semibold text-forest-700" : active ? "font-semibold text-charcoal" : "text-muted"
              )}
            >
              {LABELS[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
