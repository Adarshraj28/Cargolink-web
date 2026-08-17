"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Boxes,
  Truck,
  Route,
  PackageSearch,
  BarChart3,
  LogOut,
  ShieldCheck,
} from "lucide-react";

const NAV = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Shipments", href: "/admin/shipments", icon: Boxes },
  { label: "Vehicles", href: "/admin/vehicles", icon: Truck },
  { label: "Trips", href: "/admin/trips", icon: Route },
  { label: "Loads", href: "/admin/loads", icon: PackageSearch },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Only enforce auth after hydration: during the first client render the
  // auth hook still returns the SSR snapshot (null), so redirecting there
  // would bounce logged-in users out on a full page load / refresh.
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace("/sign-in");
    } else if (user.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [hydrated, user, router]);

  if (!user || user.role !== "ADMIN") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-forest-950">
        <div className="skeleton h-8 w-48" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-offwhite">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[250px] flex-col bg-forest-950 p-4 lg:flex">
        <Link href="/" className="flex items-center px-2 py-2">
          <Logo dark />
        </Link>
        <div className="mt-2 rounded-lg bg-white/5 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-sage-200">
          <ShieldCheck size={12} className="mr-1 inline" />
          Admin Panel
        </div>
        <nav className="mt-5 flex-1 space-y-1" aria-label="Admin navigation">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[14.5px] font-medium transition-colors",
                  active ? "bg-sage-100 text-forest-800" : "text-sage-100/70 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="px-2 text-[13px] font-semibold text-white">{user.name}</p>
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] text-sage-100/70 hover:bg-white/5 hover:text-white"
          >
            <LogOut size={15} />
            Log out
          </button>
        </div>
      </aside>

      <div className="lg:pl-[250px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line bg-white/90 px-6 backdrop-blur-md lg:px-8">
          <p className="text-[14px] font-semibold text-charcoal">CARGOLINK operations</p>
          <Link href="/" className="text-[13px] text-muted hover:text-charcoal">
            ← Back to website
          </Link>
        </header>
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
