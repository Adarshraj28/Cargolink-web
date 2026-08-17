import Link from "next/link";
import { ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How does CARGOLINK work?",
    a: "Businesses create transportation requirements, trucks are matched to those requirements, and return-load opportunities are identified for the journey back.",
  },
  {
    q: "How can I book a truck?",
    a: "Enter your pickup, destination, cargo and weight on the homepage or in the platform — suitable trucks appear and you can confirm one.",
  },
  {
    q: "How do fleet operators find return loads?",
    a: "After a delivery, CARGOLINK shows suitable return-load opportunities near the vehicle, scored by route, distance, capacity and timing.",
  },
  {
    q: "Can I use CARGOLINK from the web?",
    a: "Yes. The website is a full working platform — book trucks, create shipments, manage trips and track journeys from any desktop.",
  },
  {
    q: "Can I track my shipment?",
    a: "Yes — enter your shipment ID (e.g. CL-28491) on the tracking page and follow the journey from pickup to delivery.",
  },
];

export default function FaqSection() {
  return (
    <section className="bg-offwhite">
      <div className="container-site section-pad">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <span className="eyebrow">Questions</span>
            <h2 className="h2 mt-3">Frequently asked questions</h2>
          </div>
          <div className="mt-10 space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-line bg-white p-6">
                <h3 className="text-[15.5px] font-bold text-charcoal">{f.q}</h3>
                <p className="mt-1.5 text-[14px] leading-relaxed text-muted">{f.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-forest-700 hover:text-forest-800"
            >
              View all questions
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
