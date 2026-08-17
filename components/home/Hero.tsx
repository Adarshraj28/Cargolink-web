import Link from "next/link";
import Image from "next/image";
import { Truck, GitMerge } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sage-100/70 via-offwhite to-offwhite pt-[72px]">
      {/* subtle ambient light */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -top-40 right-[-10%] h-[500px] w-[500px] rounded-full bg-forest-500/10 blur-[120px]" />
        <div className="absolute bottom-[-30%] left-[-5%] h-[400px] w-[400px] rounded-full bg-sage-300/20 blur-[100px]" />
      </div>

      <div className="container-site relative">
        <div className="grid grid-12 items-center gap-12 section-pad">
          {/* Copy */}
          <div className="col-span-12 lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-forest-700">
              <span className="h-1.5 w-1.5 rounded-full bg-forest-600 animate-pulse-soft" />
              Book trucks · Find return loads · Track journeys
            </span>

            <h1 className="mt-4 text-[40px] font-bold leading-[1.08] tracking-tight text-charcoal font-display sm:text-[50px] lg:text-[60px]">
              Turning empty trucks into{" "}
              <span className="text-forest-600">earning assets.</span>
            </h1>

            <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-muted lg:text-lg">
              CARGOLINK connects businesses with transportation capacity and
              helps fleet operators discover suitable return loads — making
              every journey more productive.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/signup" className="btn btn-primary btn-lg">
                <Truck size={18} />
                Book a Truck
              </Link>
              <Link href="/matching" className="btn btn-secondary btn-lg">
                <GitMerge size={18} />
                Find a Return Load
              </Link>
            </div>

            <p className="mt-8 text-[13px] text-muted">
              Built for businesses, fleet operators and drivers across India.
            </p>
          </div>

          {/* Visual — one strong logistics image */}
          <div className="col-span-12 lg:col-span-6">
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lg">
                <div className="flex items-center justify-between border-b border-line px-5 py-3">
                  <div className="flex items-center gap-2 text-[12.5px] font-medium text-muted">
                    <span className="h-2 w-2 rounded-full bg-forest-600 animate-pulse-soft" />
                    Live network · Sample route
                  </div>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted">
                    Delhi → Mumbai → Return Load
                  </span>
                </div>
                <div className="relative h-[300px] sm:h-[360px]">
                  <Image
                    src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1400&q=80"
                    alt="Truck carrying cargo on the highway"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent" />
                </div>
              </div>

              {/* Journey overlay — delivery → return load */}
              <div className="absolute -bottom-6 left-5 right-5 sm:left-8 sm:right-auto sm:w-[320px]">
                <div className="rounded-xl border border-line bg-white/95 p-4 shadow-xl backdrop-blur-md animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sage-100">
                      <Truck size={15} className="text-forest-700" />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-charcoal">Delhi → Mumbai</p>
                      <p className="text-[12px] text-muted">Loaded · En route</p>
                    </div>
                  </div>
                  <div className="my-2.5 border-t border-dashed border-line-strong" />
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand-200">
                      <GitMerge size={15} className="text-forest-900" />
                    </span>
                    <div>
                      <p className="text-[14px] font-bold text-charcoal">Return Load Found · Mumbai → Pune</p>
                      <p className="text-[12px] text-muted">BOM → PUN · 94% match</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
