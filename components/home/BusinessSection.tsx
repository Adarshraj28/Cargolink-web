import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageCheck, Truck, CheckCircle2 } from "lucide-react";

const businessPoints = [
  "Create shipments and book trucks",
  "Find suitable truck capacity",
  "Track shipments from pickup to delivery",
  "View history and manage operations",
];

const fleetPoints = [
  "List vehicles and set availability",
  "Discover loads and return opportunities",
  "Manage trips and update statuses",
  "Track earnings and payouts",
];

export default function BusinessSection() {
  return (
    <section className="bg-offwhite">
      <div className="container-site section-pad">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow">Business solutions</span>
          <h2 className="h2 mt-3">Solutions built around how freight moves.</h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* For Businesses */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative h-48 w-full">
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80"
                alt="Goods being moved through a warehouse"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-8 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700">
              <PackageCheck size={22} className="text-sage-100" />
            </span>
            <h3 className="mt-5 text-[20px] font-bold text-charcoal font-display">
              For Businesses
            </h3>
            <p className="mt-2 text-[15px] text-muted">Move freight with confidence.</p>
            <ul className="mt-6 space-y-3">
              {businessPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14.5px] text-charcoal/80">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-forest-600" />
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/solutions/businesses" className="btn btn-primary mt-8 self-start">
              Business Solutions
              <ArrowRight size={16} />
            </Link>
            </div>
          </div>

          {/* For Fleet Operators */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative h-48 w-full">
              <Image
                src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=1200&q=80"
                alt="Fleet of trucks ready for dispatch"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest-950/50 via-transparent to-transparent" />
            </div>
            <div className="flex flex-1 flex-col p-8 sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sand-200">
              <Truck size={22} className="text-forest-900" />
            </span>
            <h3 className="mt-5 text-[20px] font-bold text-charcoal font-display">
              For Fleet Operators
            </h3>
            <p className="mt-2 text-[15px] text-muted">Keep your trucks moving.</p>
            <ul className="mt-6 space-y-3">
              {fleetPoints.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14.5px] text-charcoal/80">
                  <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-forest-600" />
                  {p}
                </li>
              ))}
            </ul>
            <Link href="/solutions/fleet-operators" className="btn btn-primary mt-8 self-start">
              Fleet Solutions
              <ArrowRight size={16} />
            </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
