import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import SustainabilitySection from "@/components/home/SustainabilitySection";
import {
  Route,
  Gauge,
  TrendingUp,
  RotateCcw,
  LineChart,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Better logistics can mean fewer empty journeys — CARGOLINK focuses on improving vehicle utilization by matching return freight.",
};

const pillars = [
  {
    title: "Reduce empty miles",
    description: "Return-load matching helps trucks avoid driving back without a load.",
    icon: Route,
  },
  {
    title: "Improve fleet utilization",
    description: "Vehicles spend more time moving freight and less time idle or empty.",
    icon: Gauge,
  },
  {
    title: "Make better route decisions",
    description: "Transparent match scores help operators choose productive next trips.",
    icon: LineChart,
  },
  {
    title: "Increase productive journeys",
    description: "Every matched return trip turns a cost into revenue.",
    icon: TrendingUp,
  },
  {
    title: "Use data to improve logistics",
    description: "Operational analytics surface where empty mileage is happening.",
    icon: RotateCcw,
  },
];

export default function SustainabilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sustainability"
        title="Better logistics can mean fewer empty journeys."
        subtitle="CARGOLINK focuses on improving vehicle utilization by helping operators identify suitable freight opportunities."
        image="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Green hills and forest"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="card card-hover p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-700">
                    <Icon size={22} className="text-green-50" />
                  </span>
                  <h3 className="mt-5 text-[16px] font-bold text-charcoal">{pillar.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{pillar.description}</p>
                </div>
              );
            })}
            <div className="card p-7 bg-green-50 border-green-100">
              <h3 className="text-[16px] font-bold text-green-800">The honest framing</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-green-800/80">
                Environmental benefit comes from operational efficiency — fewer
                empty kilometres, better utilization. We don&apos;t claim certified
                carbon reduction; we show estimated impact from platform data.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SustainabilitySection />

      <section className="bg-white">
        <div className="container-site section-pad-sm text-center">
          <h2 className="h2">Efficiency is the point.</h2>
          <p className="lead mx-auto mt-4 max-w-xl">
            See how matching return loads keeps trucks working.
          </p>
          <div className="mt-7 flex justify-center gap-4">
            <Link href="/matching" className="btn btn-primary">
              Explore matching
              <ArrowRight size={16} />
            </Link>
            <Link href="/signup" className="btn btn-ghost">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
