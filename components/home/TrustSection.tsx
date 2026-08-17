import { ShieldCheck, Users, LifeBuoy } from "lucide-react";

export default function TrustSection() {
  return (
    <section className="bg-white">
      <div className="container-site section-pad-sm">
        <div className="mx-auto max-w-4xl rounded-2xl border border-line bg-offwhite px-8 py-10 text-center">
          <h2 className="h3">Built like a logistics business, not a demo.</h2>
          <p className="lead mx-auto mt-3 max-w-2xl text-center">
            CARGOLINK is built around real freight workflows: booking, matching,
            tracking, verification and settlement. As the network grows, we will
            publish live operational metrics here.
          </p>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700">
                <ShieldCheck size={22} className="text-sage-100" />
              </span>
              <p className="text-[14.5px] font-semibold text-charcoal">Verified operations</p>
              <p className="max-w-[220px] text-[13px] text-muted">
                Pickup and delivery verification on every trip.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700">
                <Users size={22} className="text-sage-100" />
              </span>
              <p className="text-[14.5px] font-semibold text-charcoal">Business and fleet focused</p>
              <p className="max-w-[220px] text-[13px] text-muted">
                Built for shippers, fleet operators and drivers.
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest-700">
                <LifeBuoy size={22} className="text-sage-100" />
              </span>
              <p className="text-[14.5px] font-semibold text-charcoal">Practical support</p>
              <p className="max-w-[220px] text-[13px] text-muted">
                Business enquiries and fleet partnerships handled directly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
