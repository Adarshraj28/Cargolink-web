import Image from "next/image";
import Link from "next/link";
import SectionHeading from "@/components/ui/SectionHeading";
import { ArrowRight, Boxes, Truck, GitMerge, Radar, ClipboardList } from "lucide-react";

const features = [
  {
    title: "Book trucks",
    text: "Create a shipment and pick the truck that fits your route and cargo.",
    icon: Truck,
    chip: "bg-blue-100 text-blue-800",
  },
  {
    title: "Find return loads",
    text: "Turn an empty return journey into the next paying trip.",
    icon: GitMerge,
    chip: "bg-amber-100 text-amber-800",
  },
  {
    title: "Manage trips",
    text: "Keep vehicles, drivers and statuses in one operational view.",
    icon: ClipboardList,
    chip: "bg-teal-100 text-teal-800",
  },
  {
    title: "Track every journey",
    text: "Follow shipments from pickup to delivery with live status.",
    icon: Radar,
    chip: "bg-rose-100 text-rose-800",
  },
];

export default function PlatformPreviewSection() {
  return (
    <section className="bg-offwhite">
      <div className="container-site section-pad">
        <SectionHeading
          eyebrow="The platform"
          title="Your logistics operations, connected."
          subtitle="The CARGOLINK web platform — book trucks, find loads, manage trips and track journeys from any desktop."
        />

        <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
          {/* Photo */}
          <div className="relative overflow-hidden rounded-2xl border border-line shadow-lg">
            <div className="relative h-[380px] sm:h-[440px]">
              <Image
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1400&q=80"
                alt="Truck being loaded with cargo"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/70 via-forest-950/10 to-transparent" />
            </div>

            {/* Live stat chips over the photo */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2.5">
              <span className="rounded-lg bg-white/95 px-3.5 py-2 text-[12.5px] font-bold text-charcoal shadow">
                <span className="mr-1.5 inline-block h-2 w-2 rounded-full bg-success animate-pulse-soft" />
                Live network
              </span>
              <span className="rounded-lg bg-white/95 px-3.5 py-2 text-[12.5px] font-bold text-charcoal shadow">
                {new Intl.NumberFormat("en-IN").format(8200)}+ trucks
              </span>
              <span className="rounded-lg bg-white/95 px-3.5 py-2 text-[12.5px] font-bold text-charcoal shadow">
                15 cities
              </span>
            </div>
          </div>

          {/* Feature tiles */}
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-line bg-white p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${f.chip}`}>
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 text-[16px] font-bold text-charcoal font-display">
                    {f.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
                    {f.text}
                  </p>
                </div>
              );
            })}
            <Link
              href="/signup"
              className="flex items-center justify-between rounded-2xl border-2 border-dashed border-sage-300 bg-sage-50 p-6 transition-colors hover:border-forest-500 hover:bg-sage-100"
            >
              <span className="flex items-center gap-2 text-[15px] font-bold text-forest-800">
                <Boxes size={18} className="text-forest-600" />
                Open the platform
              </span>
              <ArrowRight size={17} className="text-forest-700" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
