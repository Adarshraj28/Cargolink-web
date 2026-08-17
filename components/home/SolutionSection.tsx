import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { Boxes, Truck, Route, GitMerge, ArrowRight } from "lucide-react";

const steps = [
  {
    num: "01",
    title: "Freight",
    icon: Boxes,
    text: "A business creates a transportation requirement.",
  },
  {
    num: "02",
    title: "Truck",
    icon: Truck,
    text: "Suitable transportation capacity is identified.",
  },
  {
    num: "03",
    title: "Journey",
    icon: Route,
    text: "The shipment moves with operational visibility.",
  },
  {
    num: "04",
    title: "Return",
    icon: GitMerge,
    text: "The system identifies suitable return-load opportunities.",
  },
];

export default function SolutionSection() {
  return (
    <section className="bg-offwhite">
      <div className="container-site section-pad">
        <SectionHeading
          eyebrow="The CARGOLINK solution"
          title="One connected journey."
          subtitle="Freight → Truck → Delivery → Return Load — every stage connected, so capacity keeps working."
        />

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-line">
          <div className="relative h-52 sm:h-64">
            <Image
              src="https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1800&q=80"
              alt="Truck on an Indian highway at golden hour"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/20 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5 sm:left-8">
              <p className="text-[15px] font-semibold text-white drop-shadow">
                One truck. One journey. No empty kilometres.
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-10">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="rounded-2xl border border-line bg-white p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-bold uppercase tracking-[0.14em] text-forest-700">
                      {step.num}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-sage-100">
                      <Icon size={20} className="text-forest-700" />
                    </span>
                  </div>
                  <h3 className="mt-6 text-[19px] font-bold text-charcoal font-display">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-muted">
                    {step.text}
                  </p>
                </div>
              );
            })}
          </div>
          {/* connector arrows (desktop) */}
          <div className="pointer-events-none absolute -bottom-4 left-1/2 hidden -translate-x-1/2 lg:block" aria-hidden="true">
            <ArrowRight size={18} className="text-sage-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
