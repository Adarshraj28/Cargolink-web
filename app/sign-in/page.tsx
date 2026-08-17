"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth";
import Logo from "@/components/ui/Logo";
import { Lock, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    // small delay so the loading state is visible
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (res.error) {
        setError(res.error);
        return;
      }
      // Honor ?next= (e.g. continue a booking started on the homepage) but
      // never leave the app — only allow internal paths.
      const next = searchParams.get("next");
      const safeNext = next && next.startsWith("/") && !next.startsWith("//") ? next : null;
      if (res.user?.role === "ADMIN" && !safeNext) {
        router.push("/admin");
      } else if (safeNext) {
        router.push(safeNext);
      } else {
        router.push("/dashboard");
      }
    }, 400);
  };

  const fillDemo = (demoEmail: string) => {
    // Per-account demo passwords — the seeded admin uses admin1234.
    const passwords: Record<string, string> = {
      "shipper@cargolink.demo": "demo1234",
      "driver@cargolink.demo": "demo1234",
      "admin@cargolink.demo": "admin1234",
    };
    setEmail(demoEmail);
    setPassword(passwords[demoEmail] ?? "demo1234");
    setError("");
  };

  return (
    <div className="flex min-h-screen flex-col bg-offwhite">
      <header className="container-site flex h-[72px] items-center">
        <Link href="/" aria-label="CARGOLINK home">
          <Logo />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-line bg-white p-8 shadow-md">
            <h1 className="h2 text-center">Welcome back</h1>
            <p className="mt-2 text-center text-[14.5px] text-muted">
              Log in to your CARGOLINK account
            </p>

            {error && (
              <div className="mt-5 rounded-lg bg-danger-bg px-4 py-3 text-[13.5px] font-medium text-danger">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="form-label">
                  Email <span className="req">*</span>
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className="form-input pl-10"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="form-label">
                  Password <span className="req">*</span>
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="form-input pl-10 pr-10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-[13.5px] text-charcoal/80">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-line-strong accent-forest-700"
                  />
                  Remember me
                </label>
                <Link href="/sign-in" className="text-[13.5px] font-medium text-forest-700 hover:text-forest-800">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full">
                {loading ? "Logging in…" : "Login"}
                {!loading && <ArrowRight size={16} />}
              </button>
            </form>

            <p className="mt-6 text-center text-[14px] text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-semibold text-forest-700 hover:text-forest-800">
                Sign up
              </Link>
            </p>

            <div className="mt-6 rounded-xl bg-offwhite px-4 py-3 text-[12px] text-muted">
              Demo platform — all data is simulated and stored locally in your
              browser.
            </div>
          </div>

          {/* Demo accounts */}
          <div className="mt-5 rounded-2xl border border-dashed border-sage-200 bg-sage-50 p-5">
            <p className="text-[12px] font-semibold uppercase tracking-wide text-forest-800">
              Demo accounts
            </p>
            <div className="mt-3 grid gap-2">
              <button
                onClick={() => fillDemo("shipper@cargolink.demo")}
                className="flex items-center justify-between rounded-lg border border-line bg-white px-3.5 py-2.5 text-left text-[13.5px] font-medium text-charcoal transition-colors hover:border-sage-300"
              >
                Shipper
                <span className="text-muted">shipper@cargolink.demo</span>
              </button>
              <button
                onClick={() => fillDemo("driver@cargolink.demo")}
                className="flex items-center justify-between rounded-lg border border-line bg-white px-3.5 py-2.5 text-left text-[13.5px] font-medium text-charcoal transition-colors hover:border-sage-300"
              >
                Driver / Fleet
                <span className="text-muted">driver@cargolink.demo</span>
              </button>
              <button
                onClick={() => fillDemo("admin@cargolink.demo")}
                className="flex items-center justify-between rounded-lg border border-line bg-white px-3.5 py-2.5 text-left text-[13.5px] font-medium text-charcoal transition-colors hover:border-sage-300"
              >
                Admin
                <span className="text-muted">admin@cargolink.demo</span>
              </button>
            </div>
            <p className="mt-3 text-[12px] text-muted">
              Password: <code className="rounded bg-white px-1.5 py-0.5 text-[11.5px]">demo1234</code>{" "}
              (admin: <code className="rounded bg-white px-1.5 py-0.5 text-[11.5px]">admin1234</code>)
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SignInPage() {
  return (
    <AuthProvider>
      <SignInForm />
    </AuthProvider>
  );
}
