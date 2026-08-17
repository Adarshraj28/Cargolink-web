import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  hint?: string;
  tone?: "brand" | "sage" | "sand" | "neutral";
  className?: string;
}

const tones = {
  brand: "bg-forest-700 text-white",
  sage: "bg-sage-100 text-forest-800",
  sand: "bg-sand-100 text-forest-900",
  neutral: "bg-neutral-bg text-neutral",
};

export default function MetricCard({
  label,
  value,
  icon: Icon,
  hint,
  tone = "brand",
  className,
}: MetricCardProps) {
  return (
    <div className={cn("card-elevated p-5", className)}>
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] font-semibold uppercase tracking-wide text-muted">
          {label}
        </p>
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            tones[tone]
          )}
        >
          <Icon size={17} />
        </span>
      </div>
      <p className="mt-2 text-[28px] font-bold tracking-tight text-charcoal font-display">
        {value}
      </p>
      {hint && <p className="mt-1 text-[12.5px] text-muted">{hint}</p>}
    </div>
  );
}
