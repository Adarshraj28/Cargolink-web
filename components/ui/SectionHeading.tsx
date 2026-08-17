import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "center" | "left";
  dark?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "center",
  dark = false,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow && (
        <span
          className={cn(
            "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em]",
            dark ? "text-sage-200" : "text-forest-700"
          )}
        >
          {!dark && <span className="h-px w-5 bg-sage-300" aria-hidden="true" />}
          {eyebrow}
          {dark && <span className="h-px w-5 bg-sage-300" aria-hidden="true" />}
        </span>
      )}
      <h2
        className={cn(
          "h2 mt-3",
          dark && "text-white"
        )}
      >
        {title}
        {highlight && (
          <span className={dark ? "text-sage-200" : "text-forest-600"}>
            {" "}
            {highlight}
          </span>
        )}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "lead mt-5 max-w-[680px]",
            align === "center" && "mx-auto",
            dark && "text-sage-100/70"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
