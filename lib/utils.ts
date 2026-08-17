export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function genRef(prefix: string): string {
  return `${prefix}-${Math.floor(10000 + Math.random() * 89999)}`;
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

/** Great-circle distance between two lat/lng points (km). */
export function distanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s)));
}

/** Approximate road distance between two Indian cities (km). */
export function approxDistance(cityA: string, cityB: string): number {
  const city = normalizeCity(cityA);
  const other = normalizeCity(cityB);
  const key = [city, other].sort().join("-");
  const table: Record<string, number> = {
    "delhi-mumbai": 1420,
    "delhi-pune": 1460,
    "delhi-bangalore": 2120,
    "delhi-chennai": 2180,
    "delhi-kolkata": 1530,
    "delhi-hyderabad": 1580,
    "delhi-ahmedabad": 945,
    "delhi-jaipur": 280,
    "delhi-lucknow": 570,
    "delhi-surat": 1120,
    "delhi-nagpur": 1080,
    "mumbai-pune": 148,
    "mumbai-ahmedabad": 524,
    "mumbai-surat": 262,
    "mumbai-bangalore": 985,
    "mumbai-hyderabad": 712,
    "mumbai-nagpur": 830,
    "mumbai-jaipur": 1150,
    "pune-bangalore": 845,
    "pune-ahmedabad": 670,
    "pune-surat": 400,
    "bangalore-chennai": 350,
    "bangalore-hyderabad": 570,
    "chennai-hyderabad": 630,
    "ahmedabad-surat": 260,
    "ahmedabad-jaipur": 660,
    "jaipur-lucknow": 620,
    "surat-nagpur": 630,
  };
  return table[key] ?? 600;
}

export function normalizeCity(city: string): string {
  return city.trim().toLowerCase().replace(/\s+/g, "-");
}

export function cityFromLocation(location: string): string {
  // Locations look like "Mumbai" or "Mumbai, MH" — take the city part
  return location.split(",")[0].trim();
}
