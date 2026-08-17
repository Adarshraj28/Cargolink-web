import Link from "next/link";
import Logo from "@/components/ui/Logo";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Solutions",
    links: [
      { label: "For Businesses", href: "/solutions/businesses" },
      { label: "For Fleet Operators", href: "/solutions/fleet-operators" },
      { label: "Full Truckload", href: "/platform#services" },
      { label: "Return Loads", href: "/matching" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Book a Truck", href: "/dashboard/shipments/create" },
      { label: "Find Trucks", href: "/dashboard/loads" },
      { label: "Tracking", href: "/tracking" },
      { label: "Analytics", href: "/analytics" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company/about" },
      { label: "Industries", href: "/industries" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/company/contact" },
      { label: "Login", href: "/sign-in" },
      { label: "Create account", href: "/signup" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-sage-100">
      <div className="container-site section-pad-sm">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo dark />
            <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-sage-100/60">
              Turning empty trucks into earning assets. Move freight, find
              capacity and keep journeys productive.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {columns.map((col) => (
              <div key={col.title}>
                <h3 className="text-[13px] font-semibold uppercase tracking-wider text-sage-200">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-[14.5px] text-sage-100/60 transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-[13px] text-sage-100/50">
            © {new Date().getFullYear()} CARGOLINK. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/company/contact" className="text-[13px] text-sage-100/50 transition-colors hover:text-white">
              Contact
            </Link>
            <Link href="/resources" className="text-[13px] text-sage-100/50 transition-colors hover:text-white">
              Privacy
            </Link>
            <Link href="/resources" className="text-[13px] text-sage-100/50 transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/resources" className="text-[13px] text-sage-100/50 transition-colors hover:text-white">
              Security
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
