import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import AnalyticsSection from "@/components/home/AnalyticsSection";
import { PieChart, TrendingUp, ArrowRight, Gauge, Route } from "lucide-react";

export const metadata: Metadata = {
  title: "Analytics",
  description:
    "Turn logistics data into better decisions — operational analytics for fleet utilization, empty miles and return-load opportunities.",
};

const features = [
  { title: "Fleet utilization", description: "See how much of your fleet is working at any time.", icon: Gauge },
  { title: "Empty miles", description: "Understand how much mileage runs without a load.", icon: Route },
  { title: "Completed deliveries", description: "Track delivery volumes and performance over time.", icon: PieChart },
  { title: "Return-load opportunities", description: "Surface areas where return freight could improve revenue.", icon: TrendingUp },
];

export default function AnalyticsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Analytics"
        title="Turn logistics data into better decisions."
        subtitle="Operational analytics that make fleet utilization, empty miles and freight performance visible — so you can act on what the data shows."
        image="https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Freight cargo secured on a truck bed"
      />

      <AnalyticsSection />

      <section className="bg-white">
        <div className="container-site section-pad">
          <h2 className="h2 mx-auto max-w-2xl text-center">Metrics that matter for operations.</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100">
                    <Icon size={22} className="text-forest-700" />
                  </span>
                  <h3 className="mt-5 text-[16px] font-bold text-charcoal">{feature.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 text-center">
            <p className="max-w-xl text-[15px] text-muted">
              Analytics are part of the CARGOLINK platform — alongside shipments,
              fleet visibility and return load matching.
            </p>
            <Link href="/signup" className="btn btn-primary">
              Get Started
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
