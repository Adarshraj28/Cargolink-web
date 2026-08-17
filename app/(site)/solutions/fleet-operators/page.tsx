import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import MatchingSection from "@/components/home/MatchingSection";
import {
  Search,
  RotateCcw,
  Truck,
  Gauge,
  LineChart,
  ClipboardList,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "For Fleet Operators",
  description:
    "Keep your fleet moving — discover available freight, reduce empty return journeys and improve vehicle utilization.",
};

const benefits = [
  { title: "Discover available freight", description: "Browse loads that fit your trucks, routes and capacity.", icon: Search },
  { title: "Reduce empty return journeys", description: "Get return-load suggestions matched to your trips.", icon: RotateCcw },
  { title: "Manage active trips", description: "Run the full trip lifecycle from acceptance to delivery.", icon: Truck },
  { title: "Improve vehicle utilization", description: "Keep trucks working instead of waiting between loads.", icon: Gauge },
  { title: "Track operational performance", description: "See utilization, earnings and trip history per vehicle.", icon: LineChart },
  { title: "Manage fleet activity", description: "One view across vehicles, drivers, availability and trips.", icon: ClipboardList },
];

export default function FleetOperatorsPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Fleet Operators"
        title="Keep your fleet moving."
        subtitle="Reduce empty returns, manage active trips, and keep every vehicle working productively."
        image="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Truck on an open road"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="card card-hover p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700">
                    <Icon size={22} className="text-sage-100" />
                  </span>
                  <h3 className="mt-5 text-[16.5px] font-bold text-charcoal">{benefit.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <MatchingSection />

      <section className="bg-offwhite">
        <div className="container-site section-pad-sm text-center">
          <h2 className="h2">Start matching your fleet.</h2>
          <p className="lead mx-auto mt-4 max-w-xl">
            Register your vehicles and start finding return loads today.
          </p>
          <div className="mt-7 flex justify-center gap-4">
            <Link href="/signup" className="btn btn-primary">
              Get Started
              <ArrowRight size={16} />
            </Link>
            <Link href="/company/contact" className="btn btn-ghost">
              Talk to Us
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
