"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import TrackingSearch from "@/components/dashboard/shared/TrackingSearch";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TrackingPage() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const [prefill, setPrefill] = useState<string | null>(null);
  const [seenRef, setSeenRef] = useState<string | null>(null);

  // Keep the search field in sync with the URL (?ref=CL-…) after hydration.
  if (ref !== seenRef) {
    setSeenRef(ref);
    setPrefill(ref);
  }

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <h1 className="h2">Tracking</h1>
        <p className="mt-1 text-muted">
          Search a shipment or trip ID to see live demo tracking.
        </p>
      </div>
      {prefill === null ? (
        <div className="space-y-4">
          <Skeleton className="h-16 w-full max-w-2xl" />
          <Skeleton className="h-72 w-full" />
        </div>
      ) : (
        <TrackingSearch initialQuery={prefill} />
      )}
    </div>
  );
}
