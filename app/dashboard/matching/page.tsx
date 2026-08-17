"use client";

import { useAuth } from "@/lib/auth";
import { getVehiclesByOwner, useAppState } from "@/lib/store";
import MatchingExplorer from "@/components/dashboard/shared/MatchingExplorer";
import { Skeleton } from "@/components/ui/Skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function MatchingPage() {
  const { user } = useAuth();
  useAppState();

  const vehicle = user ? getVehiclesByOwner(user.id)[0] : undefined;

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="mb-8">
        <h1 className="h2">Find your next load</h1>
        <p className="mt-1 text-muted">
          Return-load opportunities scored against your current location and vehicle.
        </p>
      </div>

      {!vehicle ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : (
        <MatchingExplorer />
      )}

      <div className="mt-10 flex items-center justify-between rounded-xl bg-sage-50 p-5">
        <p className="text-[13.5px] text-forest-900/80">
          Not seeing the right match? Browse the full load marketplace.
        </p>
        <Link href="/dashboard/loads" className="inline-flex items-center gap-1 text-[13.5px] font-semibold text-forest-700 hover:text-forest-800">
          All loads <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
