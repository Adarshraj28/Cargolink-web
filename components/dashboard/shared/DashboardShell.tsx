"use client";

import { useEffect, useSyncExternalStore, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth";
import { getUnreadCount, subscribe, markAllRead, getNotificationsForUser, resetDemoData } from "@/lib/store";
import Logo from "@/components/ui/Logo";
import StatusBadge from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Boxes,
  Truck,
  GitMerge,
  Radar,
  History,
  Wallet,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  PackageSearch,
  Route,
  BarChart3,
  RotateCcw,
} from "lucide-react";
import type { Role } from "@/lib/types";

interface NavEntry {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  roles: Role[];
}

const NAV: NavEntry[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["SHIPPER", "DRIVER", "FLEET_OPERATOR"] },
  { label: "Shipments", href: "/dashboard/shipments", icon: Boxes, roles: ["SHIPPER"] },
  { label: "Loads", href: "/dashboard/loads", icon: PackageSearch, roles: ["DRIVER", "FLEET_OPERATOR"] },
  { label: "Matching", href: "/dashboard/matching", icon: GitMerge, roles: ["DRIVER", "FLEET_OPERATOR"] },
  { label: "Active Trip", href: "/dashboard/trip", icon: Route, roles: ["DRIVER", "FLEET_OPERATOR"] },
  { label: "Fleet", href: "/dashboard/fleet", icon: Truck, roles: ["FLEET_OPERATOR"] },
  { label: "Tracking", href: "/dashboard/tracking", icon: Radar, roles: ["SHIPPER", "DRIVER", "FLEET_OPERATOR"] },
  { label: "History", href: "/dashboard/history", icon: History, roles: ["SHIPPER", "DRIVER", "FLEET_OPERATOR"] },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["SHIPPER", "DRIVER", "FLEET_OPERATOR"] },
  { label: "Earnings", href: "/dashboard/earnings", icon: Wallet, roles: ["DRIVER", "FLEET_OPERATOR"] },
  { label: "Payments", href: "/dashboard/earnings", icon: Wallet, roles: ["SHIPPER"] },
  { label: "Profile", href: "/dashboard/settings", icon: Settings, roles: ["SHIPPER", "DRIVER", "FLEET_OPERATOR"] },
];

function DashboardNav({
  role,
  onNavigate,
}: {
  role: Role | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const items = NAV.filter((n) => role && n.roles.includes(role));
  return (
    <nav className="space-y-1" aria-label="Dashboard navigation">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-[14.5px] font-medium transition-colors",
              active
                ? "bg-sage-100 text-forest-800"
                : "text-sage-100/70 hover:bg-white/5 hover:text-white"
            )}
          >
            <Icon size={18} className={active ? "text-forest-700" : ""} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function NotificationsBell() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState<ReturnType<typeof getNotificationsForUser>>([]);

  useEffect(() => {
    if (!user) return;
    const refresh = () => {
      setCount(getUnreadCount(user.id));
      setItems(getNotificationsForUser(user.id).slice(0, 8));
    };
    refresh();
    return subscribe(refresh);
  }, [user]);

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (!open) markAllRead(user.id);
        }}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-charcoal transition-colors hover:bg-offwhite"
        aria-label={`Notifications${count ? ` (${count} unread)` : ""}`}
      >
        <Bell size={19} />
        {count > 0 && (
          <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
            {count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[340px] rounded-xl border border-line bg-white p-2 shadow-lg animate-scale-in">
          <p className="px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-muted">
            Notifications
          </p>
          {items.length === 0 ? (
            <p className="px-3 py-6 text-center text-[13.5px] text-muted">No notifications yet.</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {items.map((n) => (
                <Link
                  key={n.id}
                  href={n.href ?? "/dashboard"}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-offwhite"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[13.5px] font-semibold text-charcoal">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 shrink-0 rounded-full bg-forest-600" />}
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-muted">{n.message}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { user, role, logout: doLogout } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
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
    }
  }, [hydrated, user, router]);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-offwhite">
        <div className="skeleton h-8 w-40" />
      </div>
    );
  }

  const handleLogout = () => {
    doLogout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-forest-950 p-4 lg:flex">
        <Link href="/" className="flex items-center px-2 py-2">
          <Logo dark />
        </Link>
        <div className="mt-6 flex-1 overflow-y-auto">
          <DashboardNav role={role} />
        </div>
        <div className="mt-4 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 px-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sage-100 text-[13px] font-bold text-forest-800">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-white">{user.name}</p>
              <StatusBadge status={user.role} />
            </div>
            <button
              onClick={handleLogout}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-sage-100/60 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-forest-950/50" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 flex w-[280px] flex-col bg-forest-950 p-4 shadow-xl animate-fade-in">
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setMobileOpen(false)}>
                <Logo dark />
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-sage-100/70 hover:bg-white/10"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <DashboardNav role={role} onNavigate={() => setMobileOpen(false)} />
            </div>
            <button
              onClick={handleLogout}
              className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2.5 text-[14px] font-medium text-sage-100/80 hover:bg-white/5"
            >
              <LogOut size={16} />
              Log out
            </button>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-[260px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-white/90 px-4 backdrop-blur-md lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-charcoal hover:bg-offwhite lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden items-center gap-1 text-[13.5px] text-muted sm:flex">
              <Link href="/" className="hover:text-charcoal">CARGOLINK</Link>
              <ChevronRight size={13} />
              <span className="font-medium text-charcoal">Dashboard</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="hidden items-center gap-1.5 rounded-full border border-line bg-offwhite px-3 py-1.5 text-[11.5px] font-semibold text-muted md:inline-flex"
              title="Demo platform — data is simulated and stored in your browser"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-forest-600" />
              Demo data
            </span>
            <button
              onClick={() => {
                if (window.confirm("Reset all demo data? You will stay logged in.")) {
                  resetDemoData();
                  router.refresh();
                }
              }}
              className="flex h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-[12.5px] font-semibold text-muted transition-colors hover:border-sage-300 hover:text-charcoal"
              title="Reset demo data"
            >
              <RotateCcw size={13} />
              <span className="hidden md:inline">Reset</span>
            </button>
            <NotificationsBell />
            <span className="hidden h-9 w-9 items-center justify-center rounded-full bg-forest-700 text-[13px] font-bold text-white sm:flex">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <Shell>{children}</Shell>
    </AuthProvider>
  );
}
