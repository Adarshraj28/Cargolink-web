import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import { AuthProvider } from "@/lib/auth";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen flex-col bg-offwhite">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
