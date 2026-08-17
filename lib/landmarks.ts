/**
 * Famous landmarks for the cities CARGOLINK operates in.
 *
 * Every image URL is a verified Wikimedia Commons thumbnail (checked at build
 * time). When any place name appears in the UI, we show the city's famous
 * landmark next to it so the location is instantly recognizable.
 */

export interface Landmark {
  city: string;
  name: string;
  /** Wikimedia Commons image (verified). */
  image: string;
  /** One-line description shown with the image. */
  blurb: string;
  /** Distance from the city centre, km. */
  distanceKm: number;
}

export const LANDMARKS: Record<string, Landmark> = {
  Delhi: {
    city: "Delhi",
    name: "India Gate",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/India_Gate_delhi.jpg/960px-India_Gate_delhi.jpg",
    blurb: "War memorial at the heart of New Delhi",
    distanceKm: 3,
  },
  Mumbai: {
    city: "Mumbai",
    name: "Gateway of India",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Gateway_of_India.jpg/960px-Gateway_of_India.jpg",
    blurb: "Iconic arch overlooking the Arabian Sea",
    distanceKm: 1,
  },
  Bangalore: {
    city: "Bangalore",
    name: "Vidhana Soudha",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Vidhana_Soudha_Bangalore.jpg/960px-Vidhana_Soudha_Bangalore.jpg",
    blurb: "Granite seat of the Karnataka legislature",
    distanceKm: 3,
  },
  Chennai: {
    city: "Chennai",
    name: "Chennai Central",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Chennai_Central_railway_station.jpg/960px-Chennai_Central_railway_station.jpg",
    blurb: "Historic railway terminus built in 1873",
    distanceKm: 2,
  },
  Kolkata: {
    city: "Kolkata",
    name: "Howrah Bridge",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Howrah_bridge_at_night.jpg/960px-Howrah_bridge_at_night.jpg",
    blurb: "Cantilever bridge over the Hooghly River",
    distanceKm: 2,
  },
  Hyderabad: {
    city: "Hyderabad",
    name: "Charminar",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Charminar_in_Hyderabad.jpg/960px-Charminar_in_Hyderabad.jpg",
    blurb: "Four-towered monument from 1591",
    distanceKm: 1,
  },
  Jaipur: {
    city: "Jaipur",
    name: "Hawa Mahal",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Hawa_Mahal_2011.jpg/960px-Hawa_Mahal_2011.jpg",
    blurb: "Palace of Winds with 953 windows",
    distanceKm: 2,
  },
  Ahmedabad: {
    city: "Ahmedabad",
    name: "Kankaria Lake",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Kankaria_Carnival_2_Ahmedabad.JPG/960px-Kankaria_Carnival_2_Ahmedabad.JPG",
    blurb: "13th-century lake and leisure hub",
    distanceKm: 4,
  },
  Pune: {
    city: "Pune",
    name: "Shaniwar Wada",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Shaniwar_Wada_pune.jpg/960px-Shaniwar_Wada_pune.jpg",
    blurb: "Seat of the Peshwas, built in 1732",
    distanceKm: 2,
  },
  Lucknow: {
    city: "Lucknow",
    name: "Rumi Darwaza",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Rumi_Darwaza_-_DSC2797-01.jpg/960px-Rumi_Darwaza_-_DSC2797-01.jpg",
    blurb: "60-ft gateway of the Awadh era",
    distanceKm: 2,
  },
  Indore: {
    city: "Indore",
    name: "Rajwada",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Rajwada_Indore.jpg/960px-Rajwada_Indore.jpg",
    blurb: "Seven-storey Holkar palace, 1747",
    distanceKm: 1,
  },
  Surat: {
    city: "Surat",
    name: "Dumas Beach",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/8/8e/Dumasbeach1.jpg",
    blurb: "Dark-sand beach on the Arabian Sea",
    distanceKm: 21,
  },
  Nagpur: {
    city: "Nagpur",
    name: "Deekshabhoomi",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Deekshabhoomi.jpg/960px-Deekshabhoomi.jpg",
    blurb: "Largest hollow stupa in Asia",
    distanceKm: 5,
  },
  Kanpur: {
    city: "Kanpur",
    name: "J.K. Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/a/af/J.K._Temple_%28cropped%29.jpg",
    blurb: "White-marble shrine on the Ganga",
    distanceKm: 4,
  },
  Guwahati: {
    city: "Guwahati",
    name: "Kamakhya Temple",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Kamakhya_temple.jpg/960px-Kamakhya_temple.jpg",
    blurb: "Shakti temple atop Nilachal Hill",
    distanceKm: 7,
  },
  Chandigarh: {
    city: "Chandigarh",
    name: "Rock Garden",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/Rock_Garden_of_Chandigarh.jpg/960px-Rock_Garden_of_Chandigarh.jpg",
    blurb: "Sculpture garden of recycled waste",
    distanceKm: 5,
  },
  Kochi: {
    city: "Kochi",
    name: "Chinese Fishing Nets",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Chinese_Fishing_Net_Raising_Birds_Sunrise_Ashtamudi_Kollam_Mar22_A7C_01784.jpg/960px-Chinese_Fishing_Net_Raising_Birds_Sunrise_Ashtamudi_Kollam_Mar22_A7C_01784.jpg",
    blurb: "Centuries-old cantilever nets at Fort Kochi",
    distanceKm: 4,
  },
};

/** Look up a city's landmark, or null if unknown. */
export function landmarkFor(city: string): Landmark | null {
  return LANDMARKS[city] ?? null;
}

/** Short label like "Delhi · India Gate". */
export function landmarkLabel(city: string): string | null {
  const lm = LANDMARKS[city];
  if (!lm) return null;
  return `${city} · ${lm.name}`;
}
