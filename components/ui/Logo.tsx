import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Render for dark surfaces (white chip behind the mark). */
  dark?: boolean;
  showWordmark?: boolean;
}

export default function Logo({
  className,
  dark = false,
  showWordmark = true,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/5">
        <Image
          src="/brand/cargolink-mark-256.png"
          alt=""
          width={256}
          height={256}
          className="h-full w-full object-contain"
          aria-hidden="true"
        />
      </span>
      {showWordmark && (
        <span
          className={cn(
            "text-[21px] font-extrabold tracking-tight font-display",
            dark ? "text-white" : "text-forest-900"
          )}
        >
          CARGO<span className="text-forest-600">LINK</span>
        </span>
      )}
    </span>
  );
}
