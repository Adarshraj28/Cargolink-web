import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-forest-950">
      <header className="container-site flex h-[72px] items-center">
        <Link href="/" aria-label="CARGOLINK home">
          <Logo dark />
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <Compass size={28} className="text-sage-300" />
          </span>
          <p className="mt-6 text-[13px] font-semibold uppercase tracking-[0.2em] text-sage-300">
            404 — Page not found
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white font-display">
            This route doesn&apos;t move freight.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-sage-100/70">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn btn-primary">
              <ArrowLeft size={16} />
              Back to home
            </Link>
            <Link href="/platform" className="btn btn-ghost-light">
              Explore platform
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
