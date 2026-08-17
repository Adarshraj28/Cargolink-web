import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import { ArrowRight, Boxes, Truck, Building2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Solutions for businesses and fleet operators — book trucks, find return loads and manage freight on one connected platform.",
};

const solutions = [
  {
    title: "For Businesses",
    description:
      "Create shipments faster, find suitable capacity and monitor delivery progress from pickup to drop-off.",
    icon: Boxes,
    href: "/solutions/businesses",
    points: ["Create shipments faster", "Find suitable capacity", "Monitor delivery progress"],
  },
  {
    title: "For Fleet Operators",
    description:
      "Discover available freight, reduce empty return journeys and keep your fleet moving productively.",
    icon: Truck,
    href: "/solutions/fleet-operators",
    points: ["Discover available freight", "Reduce empty return journeys", "Improve vehicle utilization"],
  },
  {
    title: "Industries",
    description:
      "Freight solutions built for manufacturing, retail, e-commerce and industrial operations.",
    icon: Building2,
    href: "/industries",
    points: ["Manufacturing", "Retail & distribution", "E-commerce & industrial"],
  },
];

export default function SolutionsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Built for every part of the freight journey."
        subtitle="CARGOLINK serves businesses, fleet operators and drivers — with one connected platform."
        image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Warehouse logistics operations"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="grid gap-6 lg:grid-cols-3">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              return (
                <Link
                  key={solution.title}
                  href={solution.href}
                  className="card card-hover group flex flex-col p-8"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-700">
                    <Icon size={26} className="text-sage-100" />
                  </span>
                  <h2 className="h3 mt-6">{solution.title}</h2>
                  <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted">
                    {solution.description}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {solution.points.map((point) => (
                      <li key={point} className="flex items-center gap-2 text-[13.5px] font-medium text-charcoal/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest-600" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-forest-700 group-hover:text-forest-800">
                    Learn more
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
