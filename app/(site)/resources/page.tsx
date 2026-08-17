import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import { BookOpen, LifeBuoy, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources",
  description: "Documentation, help center and guides for the CARGOLINK platform.",
};

const resources = [
  {
    title: "Documentation",
    description:
      "Guides for creating shipments, registering vehicles, accepting loads and running trips.",
    icon: BookOpen,
    href: "/resources#documentation",
  },
  {
    title: "Help Center",
    description:
      "Answers to common questions about matching, tracking, payments and account settings.",
    icon: LifeBuoy,
    href: "/resources#help",
  },
  {
    title: "Guides",
    description:
      "Practical walkthroughs — from setting up your fleet to planning a return journey.",
    icon: FileText,
    href: "/resources#guides",
  },
];

const docs = [
  "Create a shipment",
  "Register a vehicle",
  "Browse and accept loads",
  "Understand match scores",
  "Run a trip with pickup verification",
  "Complete delivery and find a return load",
  "Track a shipment by ID",
  "Manage your account and notifications",
];

export default function ResourcesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title="Everything you need to get moving."
        subtitle="Documentation, help and guides for using the CARGOLINK platform."
        image="https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Logistics yard with freight"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="grid gap-6 lg:grid-cols-3">
            {resources.map((resource) => {
              const Icon = resource.icon;
              return (
                <Link key={resource.title} href={resource.href} className="card card-hover group flex flex-col p-8">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-700">
                    <Icon size={26} className="text-sage-100" />
                  </span>
                  <h2 className="h3 mt-6">{resource.title}</h2>
                  <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted">{resource.description}</p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-forest-700 group-hover:text-forest-800">
                    Explore
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div id="documentation" className="mt-16 scroll-mt-24">
            <h2 className="h2">Documentation</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {docs.map((doc) => (
                <Link key={doc} href="/signup" className="card card-hover flex items-center gap-3 p-5">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-forest-600" />
                  <span className="text-[14px] font-medium text-charcoal/85">{doc}</span>
                </Link>
              ))}
            </div>
          </div>

          <div id="help" className="mt-16 scroll-mt-24 rounded-2xl bg-sage-50 p-10 text-center">
            <h3 className="h3">Still need help?</h3>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-muted">
              Reach out to the team and we&apos;ll point you in the right direction.
            </p>
            <Link href="/company/contact" className="btn btn-primary mt-6">
              Contact us
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
