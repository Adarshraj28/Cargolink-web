"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

// Leaflet touches the DOM, so it must never load during SSR. next/dynamic with
// ssr:false keeps it client-only; the placeholder shows until the map mounts.
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-sage-50 text-[13px] text-muted">
      Loading live map…
    </div>
  ),
});

interface IndiaMapProps {
  className?: string;
  /** Draw a dashed route between two cities. */
  route?: { from: string; to: string };
  showTrucks?: boolean;
  showLabels?: boolean;
  /** Mark one city with a highlighted "You" marker (e.g. exact location). */
  highlight?: string;
}

export default function IndiaMap({
  className,
  route,
  showTrucks = true,
  showLabels = true,
  highlight,
}: IndiaMapProps) {
  return (
    <div className={cn("h-full w-full", className)}>
      <LeafletMap
        route={route}
        showTrucks={showTrucks}
        showLabels={showLabels}
        highlight={highlight}
      />
    </div>
  );
}
