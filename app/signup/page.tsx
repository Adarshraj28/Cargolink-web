"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth";
import { registerUser } from "@/lib/store";
import Logo from "@/components/ui/Logo";
import { Boxes, Truck, Building2, ArrowRight, Mail, Lock, UserRound, Phone, MapPin } from "lucide-react";
import type { Role } from "@/lib/types";
import { INDIAN_CITIES } from "@/lib/seed";

const roleOptions: { role: Role; label: string; desc: string; icon: typeof Boxes }[] = [
  { role: "SHIPPER", label: "Shipper", desc: "I need to move goods", icon: Boxes },
  { role: "DRIVER", label: "Driver", desc: "I drive a truck", icon: Truck },
  { role: "FLEET_OPERATOR", label: "Fleet Operator", desc: "I manage vehicles", icon: Building2 },
];

function SignupForm() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [role, setRole] = useState<Role>("SHIPPER");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState("Delhi");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("Please enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true);
    setTimeout(() => {
      const res = registerUser({
        name,
        email,
        phone: phone || undefined,
        password,
        role,
        company: company || undefined,
        city: role === "SHIPPER" ? city : undefined,
      });
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      refresh();
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="flex min-h-screen flex-col bg-offwhite">
      <header className="container-site flex h-[72px] items-center">
        <Link href="/" aria-label="CARGOLINK home">
          <Logo />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-line bg-white p-8 shadow-md">
            <h1 className="h2 text-center">Create your account</h1>
            <p className="mt-2 text-center text-[14.5px] text-muted">
              Join the CARGOLINK freight network
            </p>

            {error && (
              <div className="mt-5 rounded-lg bg-danger-bg px-4 py-3 text-[13.5px] font-medium text-danger">
                {error}
              </div>
            )}

            {/* Role selection */}
            <div className="mt-6">
              <p className="form-label">Account type</p>
              <div className="grid grid-cols-3 gap-3">
                {roleOptions.map((opt) => {
                  const Icon = opt.icon;
                  const selected = role === opt.role;
                  return (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => setRole(opt.role)}
                      className={`rounded-xl border-2 p-4 text-center transition-all ${
                        selected
                          ? "border-forest-600 bg-sage-50"
                          : "border-line bg-white hover:border-sage-200"
                      }`}
                      aria-pressed={selected}
                    >
                      <Icon size={20} className={`mx-auto ${selected ? "text-forest-700" : "text-muted"}`} />
                      <p className={`mt-2 text-[13.5px] font-bold ${selected ? "text-forest-800" : "text-charcoal"}`}>
                        {opt.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="form-label">
                  {role === "SHIPPER" ? "Contact name" : role === "DRIVER" ? "Full name" : "Operator name"}{" "}
                  <span className="req">*</span>
                </label>
                <div className="relative">
                  <UserRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="name"
                    className="form-input pl-10"
                    placeholder={role === "FLEET_OPERATOR" ? "e.g. Kiran Transports" : "e.g. Ananya Sharma"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="form-label">
                    Email <span className="req">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      id="email"
                      type="email"
                      className="form-input pl-10"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="phone" className="form-label">Phone</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      id="phone"
                      type="tel"
                      className="form-input pl-10"
                      placeholder="+91 98xxx xxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {role === "FLEET_OPERATOR" && (
                <div>
                  <label htmlFor="company" className="form-label">Company name</label>
                  <input
                    id="company"
                    className="form-input"
                    placeholder="e.g. Kiran Transports"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  />
                </div>
              )}

              {role === "SHIPPER" && (
                <div>
                  <label htmlFor="city" className="form-label">Base city</label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                    <select
                      id="city"
                      className="form-select pl-10"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      {INDIAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="form-label">
                  Password <span className="req">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="password"
                    type="password"
                    className="form-input pl-10"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Creating account…" : "Create account"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="mt-6 text-center text-[14px] text-muted">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-semibold text-forest-700 hover:text-forest-800">
                Login
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthProvider>
      <SignupForm />
    </AuthProvider>
  );
}
