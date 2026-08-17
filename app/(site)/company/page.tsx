import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import { ArrowRight, Building2, Users, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Company",
  description: "About CARGOLINK, how to reach the team and how the platform connects freight and fleets.",
};

export default function CompanyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Company"
        title="Building smarter logistics infrastructure."
        subtitle="CARGOLINK helps businesses and fleet operators manage freight, trucks, routes and return loads through a connected digital platform."
        image="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Shipping containers in a yard"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="grid gap-6 lg:grid-cols-3">
            <Link href="/company/about" className="card card-hover group flex flex-col p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-700">
                <Building2 size={26} className="text-sage-100" />
              </span>
              <h2 className="h3 mt-6">About</h2>
              <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted">
                Who we are and what we&apos;re building — a platform for modern
                freight movement.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-forest-700 group-hover:text-forest-800">
                Read more
                <ArrowRight size={15} />
              </span>
            </Link>

            <div className="card flex flex-col p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100">
                <Users size={26} className="text-forest-700" />
              </span>
              <h2 className="h3 mt-6">Careers</h2>
              <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted">
                We&apos;re always interested in people who care about building good
                logistics software. Reach out to discuss open roles.
              </p>
              <Link href="/company/contact" className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-forest-700 hover:text-forest-800">
                Get in touch
                <ArrowRight size={15} />
              </Link>
            </div>

            <Link href="/company/contact" className="card card-hover group flex flex-col p-8">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sage-100">
                <Mail size={26} className="text-forest-700" />
              </span>
              <h2 className="h3 mt-6">Contact</h2>
              <p className="mt-3 flex-1 text-[14.5px] leading-relaxed text-muted">
                Questions about the platform, partnerships or your operation —
                talk to the team.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-[14px] font-semibold text-forest-700 group-hover:text-forest-800">
                Contact us
                <ArrowRight size={15} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
