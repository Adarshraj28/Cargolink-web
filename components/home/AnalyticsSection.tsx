import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { Package, Gauge, Route, ArrowRight, PackageCheck } from "lucide-react";

const metrics = [
  { label: "Active shipments", value: "128", icon: Package },
  { label: "Completed trips", value: "1,482", icon: PackageCheck },
  { label: "Fleet utilization", value: "87%", icon: Gauge },
  { label: "Empty miles", value: "12.4%", icon: Route },
];

const bars = [42, 58, 47, 66, 54, 72, 61, 78, 69, 84, 76, 90];

export default function AnalyticsSection() {
  return (
    <section id="analytics" className="bg-white">
      <div className="container-site section-pad">
        <SectionHeading
          eyebrow="Analytics"
          title="Turn logistics data into better decisions."
          subtitle="Operational analytics that make fleet and freight performance visible."
        />

        <div className="mx-auto mt-14 max-w-4xl overflow-hidden rounded-2xl border border-line bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-line bg-offwhite px-5 py-3">
            <div>
              <p className="text-[13px] font-bold text-charcoal">Operational analytics</p>
              <p className="text-[11px] text-muted">Fleet performance · Last 30 days</p>
            </div>
            <span className="rounded-full bg-sage-100 px-2.5 py-1 text-[11px] font-semibold text-forest-800">
              Demo data
            </span>
          </div>

          <div className="grid gap-0 sm:grid-cols-2">
            <div className="grid grid-cols-2 gap-px bg-line">
              {metrics.map((m) => {
                const Icon = m.icon;
                return (
                  <div key={m.label} className="bg-white p-5">
                    <div className="flex items-center gap-2">
                      <Icon size={15} className="text-forest-600" />
                      <span className="text-[12px] font-medium text-muted">{m.label}</span>
                    </div>
                    <p className="mt-2 text-[24px] font-bold tracking-tight text-charcoal font-display">
                      {m.value}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-line p-5 sm:border-l sm:border-t-0">
              <div className="flex items-center justify-between">
                <p className="text-[12.5px] font-semibold text-charcoal">Deliveries per week</p>
                <span className="text-[11px] text-muted">Last 12 weeks</span>
              </div>
              <div className="mt-4 flex h-36 items-end gap-1.5">
                {bars.map((height, index) => (
                  <div
                    key={index}
                    className={`flex-1 rounded-t ${index === bars.length - 1 ? "bg-forest-600" : "bg-sage-100"}`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <p className="mt-3 text-[11px] text-muted">
                Sample data shown for demonstration purposes.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/analytics" className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-forest-700 hover:text-forest-800">
            Explore analytics
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
