import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import TrackingSection from "@/components/home/TrackingSection";
import {
  FilePlus2,
  Search,
  PackageCheck,
  ListChecks,
  History,
  Eye,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "For Businesses",
  description:
    "Move freight with confidence — create shipments, book trucks, find suitable capacity and track every delivery.",
};

const benefits = [
  {
    title: "Create shipments faster",
    description: "Add pickup, destination, cargo and truck requirements in a few steps.",
    icon: FilePlus2,
  },
  {
    title: "Find suitable capacity",
    description: "Connect your shipments with available trucks that fit the route and cargo.",
    icon: Search,
  },
  {
    title: "Monitor delivery progress",
    description: "Follow every shipment with live location, ETA and delivery status.",
    icon: PackageCheck,
  },
  {
    title: "Manage active freight",
    description: "Keep all in-transit shipments organized in one operational view.",
    icon: ListChecks,
  },
  {
    title: "Access shipment history",
    description: "A complete record of past shipments whenever you need to review.",
    icon: History,
  },
  {
    title: "Improve operational visibility",
    description: "Know where your freight is — and what comes next — across your network.",
    icon: Eye,
  },
];

export default function ShippersPage() {
  return (
    <>
      <PageHeader
        eyebrow="For Businesses"
        title="Move freight with confidence."
        subtitle="Create shipments, book trucks, find the right capacity and follow every delivery — from a platform built for modern freight."
        image="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Delivery trucks ready for dispatch"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="card card-hover p-7">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-100">
                    <Icon size={22} className="text-forest-700" />
                  </span>
                  <h3 className="mt-5 text-[16.5px] font-bold text-charcoal">{benefit.title}</h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <TrackingSection />

      <section className="bg-offwhite">
        <div className="container-site section-pad-sm text-center">
          <h2 className="h2">Start moving freight smarter.</h2>
          <p className="lead mx-auto mt-4 max-w-xl">
            Bring your shipments onto one connected platform.
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
