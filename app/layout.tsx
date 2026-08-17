import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CARGOLINK — Turning Empty Trucks into Earning Assets",
    template: "%s | CARGOLINK",
  },
  description:
    "CARGOLINK connects businesses, trucks and return-load opportunities through one connected logistics platform.",
  keywords: [
    "freight matching",
    "book a truck",
    "return load",
    "empty miles",
    "fleet management",
    "logistics platform",
    "truck booking",
    "shipment tracking",
    "CARGOLINK",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "CARGOLINK",
    title: "CARGOLINK — Turning Empty Trucks into Earning Assets",
    description:
      "Move freight. Find capacity. Keep journeys productive.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakartaSans.variable} antialiased`}
    >
      <body>{children}</body>
    </html>
  );
}
