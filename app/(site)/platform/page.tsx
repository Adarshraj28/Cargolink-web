import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import { Boxes, Truck, GitMerge, Radar, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Platform",
  description:
    "One platform for every journey — shipments, fleet, matching and tracking in a single connected system.",
};

const capabilities = [
  {
    id: "shipments",
    title: "Shipments",
    description:
      "Create shipments with pickup, drop, cargo and truck requirements. Shipments automatically enter the network and start searching for suitable capacity.",
    icon: Boxes,
    points: [
      "Create shipments in minutes",
      "Cargo and truck requirement fields",
      "Shipment history and status",
    ],
  },
  {
    id: "fleet",
    title: "Fleet",
    description:
      "Register vehicles, set availability and track active trips. See which trucks are moving, idle, or under maintenance — and where your fleet stands.",
    icon: Truck,
    points: [
      "Vehicle and driver overview",
      "Availability and utilization view",
      "Active trip monitoring",
    ],
  },
  {
    id: "matching",
    title: "Matching",
    description:
      "The matching engine evaluates route, truck, capacity, timing and cargo to surface suitable return-load opportunities with transparent scores.",
    icon: GitMerge,
    points: [
      "Return load suggestions",
      "Explained match scores",
      "Estimated earnings per opportunity",
    ],
  },
  {
    id: "tracking",
    title: "Tracking",
    description:
      "Live location, ETA, driver status and delivery progress — without switching tools. Search by shipment or trip ID from anywhere.",
    icon: Radar,
    points: [
      "Real-time shipment location",
      "ETA and progress tracking",
      "Driver and vehicle status",
    ],
  },
];

export default function PlatformPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Platform"
        title="One platform. Every journey."
        subtitle="Shipments, fleet, matching and tracking — connected in a single operational system built for modern freight movement."
        image="https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Truck on a highway at dusk"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="space-y-16">
            {capabilities.map((cap, index) => {
              const Icon = cap.icon;
              const reversed = index % 2 === 1;
              return (
                <div
                  key={cap.id}
                  id={cap.id}
                  className="grid grid-12 items-center gap-10 scroll-mt-24"
                >
                  <div className={`col-span-12 lg:col-span-6 ${reversed ? "lg:order-2" : ""}`}>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100">
                      <Icon size={26} className="text-forest-700" />
                    </span>
                    <h2 className="h2 mt-6">{cap.title}</h2>
                    <p className="lead mt-4">{cap.description}</p>
                    <ul className="mt-6 space-y-2.5">
                      {cap.points.map((point) => (
                        <li key={point} className="flex items-center gap-2.5 text-[15px] font-medium text-charcoal/80">
                          <span className="h-1.5 w-1.5 rounded-full bg-forest-600" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`col-span-12 lg:col-span-6 ${reversed ? "lg:order-1" : ""}`}>
                    <div className="rounded-2xl border border-line bg-offwhite p-8 lg:p-10">
                      <div className="flex items-center gap-2 text-[13px] font-bold text-charcoal">
                        <Icon size={17} className="text-forest-700" />
                        {cap.title} — interface preview
                      </div>
                      <div className="mt-6 space-y-3">
                        {[0, 1, 2].map((row) => (
                          <div
                            key={row}
                            className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3"
                          >
                            <div className="h-2.5 w-28 rounded-full bg-sage-100" />
                            <div className="h-2.5 w-16 rounded-full bg-sand-100" />
                          </div>
                        ))}
                      </div>
                      <p className="mt-5 text-[12px] text-muted">
                        Representative layout — see the live product after
                        signing in.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 flex flex-col items-center gap-4 rounded-2xl bg-sage-50 p-10 text-center">
            <h3 className="h3">See the platform in action</h3>
            <p className="max-w-lg text-[15px] text-muted">
              Explore matching, tracking and analytics as standalone
              capabilities — or bring your operation onto the platform.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <Link href="/signup" className="btn btn-primary">
                Get Started
              </Link>
              <Link href="/matching" className="btn btn-ghost">
                See matching
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
