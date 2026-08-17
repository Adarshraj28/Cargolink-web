import Image from "next/image";

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  /** Background photo shown under the navy overlay. */
  image?: string;
  imageAlt?: string;
}

export default function PageHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
  image,
  imageAlt,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-forest-950 pt-[72px]">
      {image && (
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={image}
            alt={imageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-950/90 via-forest-950/70 to-forest-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950/60 to-transparent" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute right-[-10%] top-[-30%] h-[400px] w-[500px] rounded-full bg-forest-600/15 blur-[120px]" />
      </div>

      <div className="container-site relative section-pad">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-sage-200">
            <span className="h-px w-5 bg-sage-300" aria-hidden="true" />
            {eyebrow}
          </span>
          <h1 className="mt-3 text-[40px] font-bold leading-[1.1] tracking-tight text-white font-display sm:text-5xl lg:text-[56px]">
            {title}
            {highlight && <span className="text-sage-300"> {highlight}</span>}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-[680px] text-lg leading-relaxed text-sage-100/70">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
