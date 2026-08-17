import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowDown, CheckCircle2, XCircle } from "lucide-react";

function JourneyColumn({
  title,
  steps,
  tone,
  icon,
}: {
  title: string;
  steps: string[];
  tone: "danger" | "success";
  icon: typeof CheckCircle2;
}) {
  const Icon = icon;
  return (
    <div
      className={`rounded-2xl border p-6 sm:p-8 ${
        tone === "danger"
          ? "border-danger/20 bg-danger-bg"
          : "border-success/25 bg-success-bg"
      }`}
    >
      <div className="flex items-center justify-between">
        <p
          className={`text-[13px] font-bold uppercase tracking-wider ${
            tone === "danger" ? "text-danger" : "text-success"
          }`}
        >
          {title}
        </p>
        <Icon size={18} className={tone === "danger" ? "text-danger/70" : "text-success/70"} />
      </div>
      <div className="mt-6 space-y-1">
        {steps.map((step, i) => (
          <div key={i}>
            <div className="flex items-center gap-3">
              <span
                className={`h-2 w-2 rounded-full ${
                  tone === "danger" ? "bg-danger/60" : "bg-success/60"
                }`}
              />
              <p className="text-[15px] font-medium text-charcoal/85">{step}</p>
            </div>
            {i < steps.length - 1 && (
              <ArrowDown
                size={14}
                className={`ml-[3px] my-1.5 ${
                  tone === "danger" ? "text-danger/50" : "text-success/50"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProblemSection() {
  return (
    <section className="bg-white">
      <div className="container-site section-pad">
        <SectionHeading
          eyebrow="The problem"
          title="The journey doesn't have to end at delivery."
          subtitle="CARGOLINK helps connect suitable freight opportunities with available truck capacity, helping operators make better use of the return journey."
        />

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-line">
          <div className="relative h-44 sm:h-56">
            <Image
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1800&q=80"
              alt="Empty truck heading back on a highway"
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-950/60 via-forest-950/30 to-transparent" />
            <div className="absolute inset-0 flex items-center px-6 sm:px-10">
              <p className="max-w-md text-[15px] font-semibold leading-snug text-white drop-shadow sm:text-[17px]">
                Almost a third of India&apos;s truck journeys run empty on the
                way back.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
          <JourneyColumn
            title="Traditional"
            tone="danger"
            icon={XCircle}
            steps={["Delhi → Mumbai", "Delivery", "Empty return"]}
          />
          <JourneyColumn
            title="With CARGOLINK"
            tone="success"
            icon={CheckCircle2}
            steps={["Delhi → Mumbai", "Delivery", "Return load found", "Next destination"]}
          />
        </div>
      </div>
    </section>
  );
}
