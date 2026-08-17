import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import { Factory, ShoppingCart, Globe, Wrench, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries",
  description:
    "Freight solutions built for manufacturing, retail & distribution, e-commerce and industrial operations.",
};

const industries = [
  {
    title: "Manufacturing",
    icon: Factory,
    text: "Move raw materials and finished goods between plants, suppliers and markets with suitable truck capacity.",
    points: ["Plant-to-warehouse movements", "Raw material procurement", "Finished goods dispatch"],
  },
  {
    title: "Retail & Distribution",
    icon: ShoppingCart,
    text: "Connect warehouses, distributors and destinations with reliable, trackable freight.",
    points: ["Warehouse to distributor", "Stock replenishment", "Multi-city distribution"],
  },
  {
    title: "E-commerce",
    icon: Globe,
    text: "Support recurring transportation requirements with dependable capacity and visibility.",
    points: ["Recurring dispatch schedules", "Cross-city fulfilment", "Consistent capacity"],
  },
  {
    title: "Industrial & Commercial",
    icon: Wrench,
    text: "Support specialized freight movement for construction, machinery and commercial cargo.",
    points: ["Project cargo", "Equipment movement", "Specialized truck types"],
  },
];

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Industries we serve."
        subtitle="Practical freight solutions for the businesses that move goods every day."
        image="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Container port with stacked cargo"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="grid gap-6 md:grid-cols-2">
            {industries.map((ind) => {
              const Icon = ind.icon;
              return (
                <div key={ind.title} className="card card-hover p-8">
                  <div className="flex items-center gap-4">
                    <span className="flex h-13 w-13 h-[52px] w-[52px] items-center justify-center rounded-xl bg-forest-700">
                      <Icon size={24} className="text-sage-100" />
                    </span>
                    <h2 className="h3">{ind.title}</h2>
                  </div>
                  <p className="mt-4 text-[14.5px] leading-relaxed text-muted">{ind.text}</p>
                  <ul className="mt-5 space-y-2">
                    {ind.points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-[13.5px] font-medium text-charcoal/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-forest-600" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-offwhite">
        <div className="container-site section-pad-sm text-center">
          <h2 className="h2">Moving freight for your industry.</h2>
          <p className="lead mx-auto mt-4 max-w-xl">
            Book trucks and manage shipments on the CARGOLINK platform.
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
