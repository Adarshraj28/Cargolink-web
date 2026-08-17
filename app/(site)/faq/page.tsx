import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/sections/PageHeader";
import CTASection from "@/components/home/CTASection";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about booking trucks, finding return loads, tracking shipments and using CARGOLINK from the web and mobile app.",
};

const faqs = [
  {
    q: "How does CARGOLINK work?",
    a: "Businesses create transportation requirements, trucks are matched to those requirements, and return-load opportunities are identified for the journey back. Everything — booking, matching, tracking and verification — happens on one connected platform.",
  },
  {
    q: "How can I book a truck?",
    a: "Enter your pickup, destination, cargo type and weight on the homepage service panel or in the platform. Suitable trucks appear, you select one, and your shipment is created with a CARGOLINK ID (e.g. CL-28491).",
  },
  {
    q: "How can fleet operators find return loads?",
    a: "Register your vehicles, set their availability and current location, and the matching engine shows suitable loads — including return-load opportunities scored by route, distance, capacity and timing.",
  },
  {
    q: "How does return-load matching work?",
    a: "The match score is calculated from route compatibility, pickup distance, truck compatibility, capacity, timing and cargo compatibility. Each match shows the reasons behind its score.",
  },
  {
    q: "What truck types are supported?",
    a: "From small pickups to full trailers — including container trucks, open trucks, taurus and 32-ton trailers — matched to the weight and dimensions of your cargo.",
  },
  {
    q: "Can I track my shipment?",
    a: "Yes. Enter your shipment ID (e.g. CL-28491) on the tracking page to see origin, destination, current status, progress, ETA and the trip timeline.",
  },
  {
    q: "Can I use CARGOLINK from the web?",
    a: "Yes. The website is a full working platform — book trucks, create shipments, manage trips, track journeys, view history and manage earnings from any desktop browser.",
  },
  {
    q: "Can I use the mobile app and website with the same account?",
    a: "Yes. CARGOLINK uses one account and one data source, so shipments, trips and statuses are the same whether you use the web or the mobile app.",
  },
  {
    q: "How do I become a fleet partner?",
    a: "Create a fleet operator account, register your vehicles, and start discovering loads and return opportunities immediately. For larger partnerships, contact us directly.",
  },
  {
    q: "How does payment work?",
    a: "Payments, earnings and transaction history are managed in the platform. Trip earnings for drivers and payments for shipments appear in your dashboard as trips complete.",
  },
  {
    q: "How do I contact support?",
    a: "Use the contact page to send a business enquiry, fleet partnership request or general question — we respond directly.",
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions, answered."
        subtitle="Everything you need to know about booking trucks, finding return loads and using CARGOLINK."
        image="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1920&q=80"
        imageAlt="Open highway ahead"
      />

      <section className="bg-white">
        <div className="container-site section-pad">
          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-xl border border-line bg-white p-6 open:shadow-md"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-bold text-charcoal">
                  {f.q}
                  <span className="shrink-0 text-sage-300 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-[14px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-[14.5px] text-muted">Still have a question?</p>
            <Link href="/company/contact" className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-forest-700 hover:text-forest-800">
              Contact the CARGOLINK team
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}
