"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  description?: string;
}

const dropdowns: { label: string; items: NavItem[] }[] = [
  {
    label: "Solutions",
    items: [
      { title: "For Businesses", description: "Move freight with confidence", href: "/solutions/businesses" },
      { title: "For Fleet Operators", description: "Keep your trucks moving", href: "/solutions/fleet-operators" },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "Book a Truck", description: "Create a shipment in minutes", href: "/dashboard/shipments/create" },
      { title: "Find Trucks", description: "Search available truck capacity", href: "/dashboard/loads" },
      { title: "Return Load Matching", description: "Find suitable return-load opportunities", href: "/matching" },
      { title: "Tracking", description: "Monitor shipments and trips", href: "/tracking" },
    ],
  },
  {
    label: "Industries",
    items: [
      { title: "Manufacturing", description: "Raw materials and finished goods", href: "/industries#manufacturing" },
      { title: "Retail & Distribution", description: "Warehouses, distributors and destinations", href: "/industries#retail" },
      { title: "E-commerce", description: "Recurring transportation requirements", href: "/industries#ecommerce" },
      { title: "Industrial & Commercial", description: "Specialized freight movement", href: "/industries#industrial" },
    ],
  },
  {
    label: "Company",
    items: [
      { title: "About", description: "Who we are and what we build", href: "/company/about" },
      { title: "Contact", description: "Talk to the team", href: "/company/contact" },
      { title: "FAQ", description: "Common questions answered", href: "/faq" },
      { title: "Resources", description: "Guides and documentation", href: "/resources" },
    ],
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const pathname = usePathname();
  const [seenPath, setSeenPath] = useState(pathname);
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Close the mobile menu and dropdowns when the route changes.
  if (pathname !== seenPath) {
    setSeenPath(pathname);
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // The whole site now uses light surfaces, so the navbar is always solid.
  const solid = true;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        solid
          ? "border-b border-line bg-white/95 shadow-sm backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="container-site flex h-[72px] items-center justify-between" aria-label="Main navigation">
        <Link href="/" className="flex items-center" aria-label="CARGOLINK home">
          <Logo dark={!solid} />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 xl:flex" ref={dropdownRef}>
          {dropdowns.map((dd) => (
            <div key={dd.label} className="relative">
              <button
                onClick={() => setOpenDropdown(openDropdown === dd.label ? null : dd.label)}
                aria-haspopup="true"
                aria-expanded={openDropdown === dd.label}
                className={cn(
                  "flex items-center gap-1 rounded-lg px-3.5 py-2 text-[14.5px] font-medium transition-colors",
                  solid ? "text-charcoal/80 hover:bg-offwhite hover:text-charcoal" : "text-sage-100/90 hover:bg-white/10 hover:text-white",
                  openDropdown === dd.label && (solid ? "bg-offwhite text-charcoal" : "bg-white/10 text-white")
                )}
              >
                {dd.label}
                <ChevronDown size={14} className={cn("transition-transform duration-200", openDropdown === dd.label && "rotate-180")} />
              </button>
              {openDropdown === dd.label && (
                <div className="absolute left-0 top-full pt-2">
                  <div className="w-[300px] rounded-xl border border-line bg-white p-2 shadow-lg animate-fade-in">
                    {dd.items.map((item) => (
                      <Link
                        key={item.title}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="group flex items-start gap-3 rounded-lg px-3.5 py-3 transition-colors hover:bg-offwhite"
                      >
                        <div className="flex-1">
                          <span className="block text-[15px] font-semibold text-charcoal group-hover:text-forest-700">
                            {item.title}
                          </span>
                          {item.description && (
                            <span className="mt-0.5 block text-[13px] text-muted">{item.description}</span>
                          )}
                        </div>
                        <ArrowRight size={15} className="mt-1 shrink-0 text-line-strong transition-all group-hover:translate-x-0.5 group-hover:text-forest-600" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Link
            href="/sustainability"
            className={cn(
              "rounded-lg px-3.5 py-2 text-[14.5px] font-medium transition-colors",
              solid ? "text-charcoal/80 hover:bg-offwhite" : "text-sage-100/90 hover:bg-white/10"
            )}
          >
            Sustainability
          </Link>
        </div>

        {/* Right side — Dashboard when logged in, Get Started otherwise */}
        <div className="hidden items-center gap-2 xl:flex">
          {isAuthenticated ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              <LayoutDashboard size={15} />
              Dashboard
            </Link>
          ) : (
            <Link href="/signup" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg xl:hidden",
            solid ? "text-charcoal hover:bg-offwhite" : "text-white hover:bg-white/10"
          )}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-line bg-white xl:hidden">
          <div className="container-site max-h-[calc(100vh-72px)] overflow-y-auto py-4">
            <div className="mb-3">
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    router.push("/dashboard");
                  }}
                  className="btn btn-primary w-full"
                >
                  <LayoutDashboard size={16} />
                  Open Dashboard
                </button>
              ) : (
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-primary w-full"
                >
                  Get Started
                </Link>
              )}
            </div>
            {dropdowns.map((dd) => (
              <div key={dd.label} className="border-b border-line">
                <button
                  onClick={() => setExpandedMobile(expandedMobile === dd.label ? null : dd.label)}
                  aria-expanded={expandedMobile === dd.label}
                  className="flex w-full items-center justify-between py-3.5 text-left text-[15px] font-semibold text-charcoal"
                >
                  {dd.label}
                  <ChevronDown size={16} className={cn("text-muted transition-transform", expandedMobile === dd.label && "rotate-180")} />
                </button>
                {expandedMobile === dd.label && (
                  <div className="pb-3">
                    {dd.items.map((item) => (
                      <Link key={item.title} href={item.href} className="block rounded-lg px-3 py-2.5 text-[14.5px] font-medium text-charcoal/75 hover:bg-offwhite">
                        {item.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/sustainability" className="block py-3.5 text-[15px] font-semibold text-charcoal">
              Sustainability
            </Link>
            <div className="mt-3 flex flex-col gap-3 border-t border-line pt-5 pb-2">
              <Link
                href={isAuthenticated ? "/dashboard" : "/signup"}
                onClick={() => setMobileOpen(false)}
                className="btn btn-secondary w-full"
              >
                {isAuthenticated ? "Dashboard" : "Create account"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
