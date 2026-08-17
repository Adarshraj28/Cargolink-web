"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-offwhite px-4">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-bg">
        <AlertTriangle size={28} className="text-danger" />
      </span>
      <h1 className="mt-6 text-3xl font-bold text-charcoal font-display">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-center text-[15px] text-muted">
        An unexpected error occurred. You can try again, or head back to the
        homepage.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button onClick={reset} className="btn btn-primary">
          <RotateCcw size={16} />
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Back to home
        </Link>
      </div>
    </div>
  );
}
