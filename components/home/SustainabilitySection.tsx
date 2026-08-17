import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { Route, Gauge, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";

const points = [
  {
    title: "Fewer empty miles",
    text: "Available trucks find suitable freight for the return journey.",
    icon: Route,
  },
  {
    title: "Better fleet utilization",
    text: "More productive time on the road means a more efficient fleet.",
    icon: Gauge,
  },
  {
    title: "More productive journeys",
    text: "Every trip has a purpose — from delivery to the next pickup.",
    icon: TrendingUp,
  },
];

function CityNode({
  code,
  label,
  sub,
  highlight = false,
}: {
  code: string;
  label: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className="text-center">
      <span
        className={`flex h-12 w-12 items-center justify-center rounded-full text-[12px] font-bold ${
          highlight ? "bg-green-100 text-green-800" : "bg-forest-700 text-white"
        }`}
      >
        {code}
      </span>
      <p className="mt-2 text-[14px] font-semibold text-charcoal">{label}</p>
      <p className="text-[11.5px] text-muted">{sub}</p>
    </div>
  );
}

export default function SustainabilitySection() {
  return (
    <section id="sustainability" className="bg-sand-100">
      <div className="container-site section-pad">
        <SectionHeading
          eyebrow="Sustainability"
          title="Better utilization. Less wasted movement."
          subtitle="Return-load discovery, fleet utilization and digital coordination help operators make more productive use of every journey."
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          {/* Route illustration */}
          <div className="rounded-2xl border border-line bg-white p-8 shadow-sm sm:p-10">
            <div className="flex items-center">
              <CityNode code="DEL" label="Delhi" sub="Origin · Loaded" />
              <div className="mx-3 flex-1 sm:mx-5">
                <div className="h-px bg-green-300" />
                <p className="mt-2 text-center text-[11.5px] font-medium text-muted">
                  Delhi → Mumbai
                </p>
              </div>
              <CityNode code="BOM" label="Mumbai" sub="Delivery" />
            </div>

            <div className="my-8 border-t border-dashed border-green-300" />

            <div className="flex items-center">
              <CityNode code="BOM" label="Mumbai" sub="Return pickup" highlight />
              <div className="mx-3 flex-1 sm:mx-5">
                <div className="border-t border-dashed border-green-600/50" />
                <p className="mt-2 text-center text-[11.5px] font-medium text-green-700">
                  Return load · 94% match
                </p>
              </div>
              <CityNode code="PNQ" label="Pune" sub="Next journey" />
            </div>
          </div>

          {/* Three points */}
          <div className="space-y-8">
            <div className="relative h-44 overflow-hidden rounded-2xl sm:h-52">
              <Image
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80"
                alt="Green forest canopy"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/60 via-transparent to-transparent" />
              <p className="absolute bottom-3 left-4 right-4 text-[14px] font-semibold text-white drop-shadow">
                Every empty kilometre avoided is a step toward cleaner logistics.
              </p>
            </div>
            {points.map((point) => {
              const Icon = point.icon;
              return (
                <div key={point.title} className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-700">
                    <Icon size={20} className="text-green-50" />
                  </span>
                  <div>
                    <h3 className="text-[17px] font-bold text-charcoal font-display">
                      {point.title}
                    </h3>
                    <p className="mt-1.5 max-w-md text-[14.5px] leading-relaxed text-muted">
                      {point.text}
                    </p>
                  </div>
                </div>
              );
            })}
            <Link
              href="/sustainability"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-green-700 hover:text-green-800"
            >
              Learn more about sustainability
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
