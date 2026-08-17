import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import { Route, TrendingUp, Users, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "CARGOLINK is a connected logistics platform — turning empty trucks into earning assets by connecting freight, fleets and return loads.",
};

const values = [
  {
    title: "Smarter logistics",
    description: "We build tools that help freight move more efficiently — less empty, more productive.",
    icon: Route,
  },
  {
    title: "Reliable by design",
    description: "A platform that operators can depend on for the everyday movement of goods.",
    icon: TrendingUp,
  },
  {
    title: "Built with operators",
    description: "Shippers, drivers and fleet teams shape what we build and how it works.",
    icon: Users,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About CARGOLINK"
        title="Helping freight move more efficiently."
        subtitle="CARGOLINK connects businesses, freight and fleet operators through connected technology built to reduce empty miles and improve fleet utilization."
        image="https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Truck on an Indian highway at golden hour"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="grid grid-12 items-center gap-12">
            <div className="col-span-12 lg:col-span-6">
              <span className="eyebrow">Our Mission</span>
              <h2 className="h2 mt-4">Trucks should spend more time moving freight and less time returning empty.</h2>
              <p className="lead mt-4">
                Every empty return journey is a wasted trip — lower utilization,
                higher costs, and unnecessary fuel. CARGOLINK connects available
                trucks with suitable freight opportunities — including return
                loads — so every journey has a purpose.
              </p>
            </div>
            <div className="col-span-12 lg:col-span-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {values.map((value) => {
                  const Icon = value.icon;
                  return (
                    <div key={value.title} className="card card-hover p-6">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest-700">
                        <Icon size={20} className="text-sage-100" />
                      </span>
                      <h3 className="mt-4 text-[15.5px] font-bold text-charcoal">{value.title}</h3>
                      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{value.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center gap-4 rounded-2xl bg-sage-50 p-10 text-center">
            <h3 className="h3">Turning empty trucks into earning assets.</h3>
            <p className="max-w-lg text-[15px] text-muted">
              That&apos;s the standard we build toward — for businesses, drivers and
              fleet operators.
            </p>
            <Link href="/signup" className="btn btn-primary mt-2">
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
