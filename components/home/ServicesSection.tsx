import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { Truck, GitMerge, Building2, Radar } from "lucide-react";
import Link from "next/link";

const services = [
  {
    title: "Full Truckload",
    text: "Move freight with suitable truck capacity — book the truck that fits your cargo and route.",
    icon: Truck,
    href: "/solutions/businesses",
    chip: "bg-blue-100 text-blue-800",
    image:
      "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Return Load Network",
    text: "Help available trucks discover suitable freight for the return journey instead of running empty.",
    icon: GitMerge,
    href: "/matching",
    chip: "bg-amber-100 text-amber-800",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Fleet Solutions",
    text: "Manage vehicles, drivers, availability and active trips from one workspace.",
    icon: Building2,
    href: "/solutions/fleet-operators",
    chip: "bg-teal-100 text-teal-800",
    image:
      "https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Tracking & Visibility",
    text: "Monitor shipments and journeys from pickup to delivery, with status at every stage.",
    icon: Radar,
    href: "/tracking",
    chip: "bg-rose-100 text-rose-800",
    image:
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=900&q=80",
  },
];

export default function ServicesSection() {
  return (
    <section className="bg-white">
      <div className="container-site section-pad">
        <SectionHeading
          eyebrow="What CARGOLINK offers"
          title="Four services. One connected platform."
          subtitle="Practical logistics services built around how freight actually moves."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.title}
                href={s.href}
                className="group overflow-hidden rounded-2xl border border-line bg-white transition-all hover:border-sage-300 hover:shadow-md"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
                </div>
                <div className="flex items-start gap-4 p-6">
                  <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.chip}`}>
                    <Icon size={22} />
                  </span>
                  <div>
                    <h3 className="text-[18px] font-bold text-charcoal font-display group-hover:text-forest-700">
                      {s.title}
                    </h3>
                    <p className="mt-1.5 text-[14.5px] leading-relaxed text-muted">
                      {s.text}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
