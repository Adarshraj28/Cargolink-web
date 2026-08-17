import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import IndiaMap from "@/components/ui/IndiaMap";
import { LANDMARKS } from "@/lib/landmarks";
import { Truck, ArrowRight, MapPin, Landmark } from "lucide-react";

const sampleRoutes: { from: string; to: string; note: string }[] = [
  { from: "Delhi", to: "Mumbai", note: "1,420 km" },
  { from: "Mumbai", to: "Pune", note: "148 km" },
  { from: "Delhi", to: "Jaipur", note: "280 km" },
  { from: "Mumbai", to: "Ahmedabad", note: "524 km" },
  { from: "Delhi", to: "Pune", note: "1,460 km" },
  { from: "Mumbai", to: "Surat", note: "262 km" },
];

export default function NetworkSection() {
  return (
    <section className="bg-white">
      <div className="container-site section-pad">
        <SectionHeading
          eyebrow="The CARGOLINK network"
          title="Connecting freight across the routes that matter."
          subtitle="Sample routes — return-load opportunities are matched wherever truck capacity meets freight."
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          {/* Route list */}
          <div>
            <div className="grid gap-3 sm:grid-cols-2">
              {sampleRoutes.map((r) => (
                <div
                  key={`${r.from}-${r.to}`}
                  className="flex items-center justify-between rounded-xl border border-line bg-offwhite px-5 py-4"
                >
                  <div className="flex items-center gap-2 text-[14.5px] font-semibold text-charcoal">
                    {r.from}
                    <ArrowRight size={13} className="text-sage-300" />
                    {r.to}
                  </div>
                  <span className="text-[12px] text-muted">{r.note}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-muted">
              Routes shown are examples for demonstration — not a claim of
              nationwide coverage.
            </p>

            {/* Famous landmarks along these routes */}
            <div className="mt-8">
              <p className="flex items-center gap-2 text-[12.5px] font-bold uppercase tracking-wider text-muted">
                <Landmark size={14} className="text-forest-600" />
                Famous landmarks on these routes
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["Delhi", "Jaipur", "Mumbai", "Pune", "Ahmedabad", "Surat"]
                  .map((c) => LANDMARKS[c])
                  .filter(Boolean)
                  .map((lm) => (
                    <div
                      key={lm.city}
                      className="group overflow-hidden rounded-xl border border-line bg-white shadow-sm"
                    >
                      <div className="relative h-20 w-full overflow-hidden">
                        <Image
                          src={lm.image}
                          alt={`${lm.name} in ${lm.city}`}
                          fill
                          sizes="(max-width: 640px) 50vw, 160px"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="px-3 py-2">
                        <p className="text-[12.5px] font-bold text-charcoal">{lm.name}</p>
                        <p className="text-[11px] text-muted">{lm.city} · {lm.distanceKm} km</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Live network map */}
          <div className="rounded-2xl border border-line bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-muted">
                <MapPin size={13} className="text-forest-600" />
                Live network · Sample positions
              </div>
              <div className="flex items-center gap-4 text-[11.5px] text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Truck size={13} className="text-forest-700" />
                  Fleet on the move
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-forest-700 bg-white" />
                  City
                </span>
              </div>
            </div>

            <div className="mt-6 h-[420px]">
              <IndiaMap />
            </div>

            <p className="mt-4 text-[12px] text-muted">
              Fleet positions shown are sample demo data — real positions come
              from the network once the backend is live.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
