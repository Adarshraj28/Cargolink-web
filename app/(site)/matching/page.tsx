import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import { AuthProvider } from "@/lib/auth";
import MatchingExplorer from "@/components/dashboard/shared/MatchingExplorer";
import {
  Route,
  Package,
  Truck,
  IndianRupee,
  CircleHelp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Return Load Matching",
  description:
    "Find your next load — CARGOLINK scores return-load opportunities with transparent, data-driven match scores.",
};

const factors = [
  { title: "Route compatibility", description: "How well the pickup aligns with your current location.", icon: Route },
  { title: "Distance", description: "Shorter hauls score higher on suitability.", icon: Package },
  { title: "Truck compatibility", description: "Does the requirement fit your vehicle type?", icon: Truck },
  { title: "Capacity & earnings", description: "Weight fit and estimated trip value.", icon: IndianRupee },
];

export default function MatchingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Return Load Matching"
        title="Find your next load."
        subtitle="When a truck finishes a trip, CARGOLINK scores suitable return freight — transparently, from logistics data."
        image="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Trucks lined up at a port"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <AuthProvider>
            <MatchingExplorer />
          </AuthProvider>

          <div className="mt-14">
            <h2 className="h2 mx-auto max-w-2xl text-center">What goes into a match score.</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {factors.map((factor) => {
                const Icon = factor.icon;
                return (
                  <div key={factor.title} className="card p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-700">
                      <Icon size={20} className="text-sage-100" />
                    </span>
                    <h3 className="mt-4 text-[15.5px] font-bold text-charcoal">{factor.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{factor.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto mt-10 flex max-w-2xl items-start gap-3 rounded-2xl bg-sage-50 p-6">
              <CircleHelp size={20} className="mt-0.5 shrink-0 text-forest-700" />
              <p className="text-[14.5px] leading-relaxed text-forest-900/80">
                Scores are computed from real inputs — route, distance, truck
                type, capacity, timing and cargo — and every match shows why it
                received its score. Matching is powered by logistics data and
                scoring, not magic, and depends on the freight available on the
                network at any given time.
              </p>
            </div>

            <div className="mt-10 text-center">
              <Link href="/signup" className="btn btn-primary">
                Start matching
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
