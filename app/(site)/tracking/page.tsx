import type { Metadata } from "next";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import { AuthProvider } from "@/lib/auth";
import TrackingSearch from "@/components/dashboard/shared/TrackingSearch";
import { MapPin, Clock3, UserRound, PackageCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Tracking",
  description:
    "Know where your freight is — live vehicle location, route, ETA, shipment status and delivery progress in one view.",
};

const features = [
  { title: "Live vehicle location", description: "See exactly where each truck is, in real time.", icon: MapPin },
  { title: "Accurate ETA", description: "Estimated arrival times updated as the trip progresses.", icon: Clock3 },
  { title: "Driver status", description: "Know when drivers are active, resting or at a stop.", icon: UserRound },
  { title: "Delivery progress", description: "Track shipment status from pickup through to delivery.", icon: PackageCheck },
];

export default function TrackingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tracking"
        title="Know where your freight is."
        subtitle="Live vehicle location, route progress, ETA and driver status — searchable by shipment or trip ID."
        image="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Highway with a truck ahead"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <AuthProvider>
            <TrackingSearch />
          </AuthProvider>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card card-hover p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100">
                    <Icon size={22} className="text-forest-700" />
                  </span>
                  <h3 className="mt-5 text-[16px] font-bold text-charcoal">{feature.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
