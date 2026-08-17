import type { MetadataRoute } from "next";

const base = "https://cargolink.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/platform",
    "/solutions",
    "/solutions/businesses",
    "/solutions/fleet-operators",
    "/industries",
    "/matching",
    "/tracking",
    "/analytics",
    "/sustainability",
    "/company",
    "/company/about",
    "/company/contact",
    "/resources",
    "/faq",
    "/sign-in",
    "/signup",
  ];
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
