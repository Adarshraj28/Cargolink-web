import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-forest-900">
      <div className="absolute inset-0" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-950/95 via-forest-900/80 to-forest-950/95" />
      </div>

      <div className="container-site relative section-pad">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="h2 text-white">Turning empty trucks into earning assets.</h2>
          <p className="lead mx-auto mt-5 max-w-xl text-sage-100/70">
            Move freight. Find capacity. Keep journeys productive.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Book a Truck
              <ArrowRight size={18} />
            </Link>
            <Link href="/matching" className="btn btn-ghost-light btn-lg">
              Find a Return Load
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
