import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { Truck, MapPin, Clock3, ArrowRight, PackageCheck, UserRound } from "lucide-react";

function MiniRoute() {
  return (
    <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl bg-forest-950">
      <div className="absolute left-6 top-1/2 -translate-y-1/2">
        <span className="block h-3 w-3 rounded-full border-2 border-sage-300 bg-forest-950" />
      </div>
      <div className="absolute right-6 top-1/2 -translate-y-1/2">
        <span className="block h-3 w-3 rounded-full border-2 border-sand-200 bg-forest-950" />
      </div>
      <svg viewBox="0 0 300 180" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <path d="M20 90 C 80 30, 140 150, 200 90 S 270 40, 285 92" stroke="rgba(42,111,214,0.5)" strokeWidth="2" strokeDasharray="5 5" fill="none" />
        <path d="M20 90 C 80 30, 140 150, 200 90 S 270 40, 285 92" stroke="#2a6fd6" strokeWidth="2.5" fill="none" />
        <circle cx="150" cy="96" r="14" fill="rgba(42,111,214,0.25)">
          <animate attributeName="r" values="12;18;12" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <rect x="141" y="88" width="18" height="10" rx="2" fill="#dfe7f8" />
      </svg>
      <div className="absolute left-8 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wider text-sage-200/70">
        Delhi
      </div>
      <div className="absolute right-8 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-wider text-sage-200/70">
        Mumbai
      </div>
    </div>
  );
}

export default function TrackingSection() {
  return (
    <section id="tracking" className="bg-white">
      <div className="container-site section-pad">
        <div className="grid grid-12 items-center gap-12">
          {/* Dashboard mock */}
          <div className="col-span-12 lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-line bg-offwhite px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-700 text-sage-100">
                    <Truck size={16} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-charcoal">Shipment #CL-28491</p>
                    <p className="text-[11px] text-muted">Delhi → Mumbai · FMCG · 12 T</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sage-100 px-3 py-1 text-[11.5px] font-bold text-forest-800">
                  <span className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-forest-600" />
                  In Transit
                </span>
              </div>

              <div className="grid gap-0 sm:grid-cols-2">
                <div className="border-b border-line p-4 sm:border-b-0 sm:border-r">
                  <MiniRoute />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between rounded-lg bg-offwhite px-4 py-3">
                    <span className="text-[13px] font-medium text-muted">ETA</span>
                    <span className="text-[15px] font-bold text-charcoal">Today, 18:40</span>
                  </div>
                  <dl className="mt-4 space-y-3.5">
                    <div className="flex items-center gap-3">
                      <UserRound size={16} className="shrink-0 text-muted" />
                      <dt className="w-20 text-[12.5px] text-muted">Driver</dt>
                      <dd className="text-[13.5px] font-semibold text-charcoal">R. Kumar · Active</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin size={16} className="shrink-0 text-muted" />
                      <dt className="w-20 text-[12.5px] text-muted">Pickup</dt>
                      <dd className="text-[13.5px] font-semibold text-charcoal">Delhi · 11:30 AM</dd>
                    </div>
                    <div className="flex items-center gap-3">
                      <PackageCheck size={16} className="shrink-0 text-muted" />
                      <dt className="w-20 text-[12.5px] text-muted">Status</dt>
                      <dd className="text-[13.5px] font-semibold text-charcoal">On NH-48 · 62%</dd>
                    </div>
                  </dl>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-muted">Delivery progress</span>
                      <span className="font-bold text-charcoal">62%</span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-sage-100">
                      <div className="h-full w-[62%] rounded-full bg-forest-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading
              align="left"
              eyebrow="Live Tracking"
              title="Know where your freight is."
              subtitle="Live vehicle location, route progress, ETA and driver status — in one clear view."
            />
            <ul className="mt-8 space-y-3.5">
              {[
                "Real-time shipment location and route",
                "Driver and vehicle status at a glance",
                "Accurate ETA and delivery progress",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] font-medium text-charcoal/80">
                  <Clock3 size={18} className="mt-0.5 shrink-0 text-forest-600" />
                  {point}
                </li>
              ))}
            </ul>
            <Link href="/tracking" className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-forest-700 hover:text-forest-800">
              See live tracking
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
