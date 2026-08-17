import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import {
  Truck,
  MapPin,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  Route,
  CircleHelp,
} from "lucide-react";

const opportunities = [
  { route: "Mumbai → Pune", match: 94, distance: "148 km", load: "FMCG · 12 T", earnings: "₹18,500" },
  { route: "Mumbai → Surat", match: 88, distance: "262 km", load: "Chemicals · 14 T", earnings: "₹19,800" },
  { route: "Mumbai → Ahmedabad", match: 81, distance: "524 km", load: "General Goods · 11 T", earnings: "₹38,500" },
];

function MatchBar({ value }: { value: number }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-sage-100">
      <div className="h-full rounded-full bg-forest-600" style={{ width: `${value}%` }} />
    </div>
  );
}

export default function MatchingSection() {
  return (
    <section id="matching" className="bg-white">
      <div className="container-site section-pad">
        <div className="grid grid-12 items-center gap-12">
          <div className="col-span-12 lg:col-span-5">
            <SectionHeading
              align="left"
              eyebrow="Return Load Matching"
              title="Turn empty returns into opportunities."
              subtitle="When a truck finishes a delivery, CARGOLINK looks for suitable freight near its location that moves toward the next destination."
            />

            <ul className="mt-8 space-y-3">
              {[
                "Return-load suggestions before the trip ends",
                "Route, truck and capacity compatibility checks",
                "A transparent match score with reasons",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-[15px] font-medium text-charcoal/80">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-forest-600" />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-sage-50 p-4">
              <CircleHelp size={17} className="mt-0.5 shrink-0 text-forest-700" />
              <p className="text-[13.5px] leading-relaxed text-forest-900/80">
                Intelligent matching powered by logistics data and scoring —
                not magic. Every score is explained.
              </p>
            </div>

            <Link href="/matching" className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-semibold text-forest-700 hover:text-forest-800">
              Explore matching
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Interface */}
          <div className="col-span-12 lg:col-span-7">
            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lg">
              <div className="flex items-center justify-between border-b border-line bg-offwhite px-5 py-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-forest-700 text-sage-100">
                    <Truck size={16} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold text-charcoal">Return load matching</p>
                    <p className="text-[11px] text-muted">Truck #CL-2841 · 32 T · Mumbai</p>
                  </div>
                </div>
                <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-semibold text-forest-800">
                  Demo data
                </span>
              </div>

              <div className="border-b border-line px-5 py-4">
                <div className="flex items-center gap-2 text-[13px] font-semibold text-charcoal">
                  <span>Delhi</span>
                  <ArrowRight size={14} className="text-muted" />
                  <span>Mumbai</span>
                  <span className="ml-auto rounded-md bg-sage-50 px-2 py-0.5 text-[11px] font-medium text-forest-800">
                    Completed · looking for return
                  </span>
                </div>
              </div>

              <div className="divide-y divide-line">
                {opportunities.map((op) => (
                  <div key={op.route} className="group flex items-center gap-5 px-5 py-4 transition-colors hover:bg-offwhite">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Route size={14} className="shrink-0 text-forest-600" />
                        <p className="text-[14.5px] font-bold text-charcoal">{op.route}</p>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} />
                          {op.distance}
                        </span>
                        <span>{op.load}</span>
                      </div>
                    </div>
                    <div className="w-24 shrink-0">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-muted">Match</span>
                        <span className="font-bold text-charcoal">{op.match}%</span>
                      </div>
                      <div className="mt-1.5">
                        <MatchBar value={op.match} />
                      </div>
                    </div>
                    <div className="w-24 shrink-0 text-right">
                      <p className="flex items-center justify-end gap-1 text-[14px] font-bold text-charcoal">
                        <IndianRupee size={13} className="text-muted" />
                        {op.earnings}
                      </p>
                      <p className="text-[11px] text-muted">Est. earnings</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
