"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";
import { CITY_COORDS } from "@/lib/geo";
import { landmarkFor } from "@/lib/landmarks";

const MAP_CENTER: [number, number] = [22.8, 79.4];
const ROUTE_ICON_COLOR = "#2a6fd6";
const CITY_ICON_COLOR = "#1e56a8";

function cityIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:12px;height:12px;border-radius:9999px;background:#fff;border:3px solid ${CITY_ICON_COLOR};box-shadow:0 1px 3px rgba(0,0,0,.35)"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function truckIcon() {
  return L.divIcon({
    className: "cl-truck-pulse",
    html: `<svg width="26" height="16" viewBox="0 0 26 16" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="2" width="11" height="7" rx="1.2" fill="#1e56a8"/><path d="M14.5 3 L19 3 C20.2 3 21 3.8 21 4.6 L21 9 L14.5 9 Z" fill="#2a6fd6"/><circle cx="7.5" cy="11.5" r="2.4" fill="#0a1e3c" stroke="#fff" stroke-width="0.8"/><circle cx="17.5" cy="11.5" r="2.4" fill="#0a1e3c" stroke="#fff" stroke-width="0.8"/></svg>`,
    iconSize: [26, 16],
    iconAnchor: [13, 8],
  });
}

function youIcon() {
  return L.divIcon({
    className: "",
    html: `<div style="width:18px;height:18px;border-radius:9999px;background:#ff7a45;border:3px solid #fff;box-shadow:0 0 0 4px rgba(255,122,69,.35), 0 2px 6px rgba(0,0,0,.3)"></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

// Cities that show live fleet truck markers (sample positions, honestly labeled).
const TRUCK_CITIES = [
  "Delhi",
  "Jaipur",
  "Mumbai",
  "Pune",
  "Surat",
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Kolkata",
  "Nagpur",
];

interface LeafletMapProps {
  className?: string;
  route?: { from: string; to: string };
  showTrucks?: boolean;
  showLabels?: boolean;
  highlight?: string;
}

export default function LeafletMap({
  className,
  route,
  showTrucks = true,
  showLabels = true,
  highlight,
}: LeafletMapProps) {
  const routeFrom = route ? CITY_COORDS[route.from] : null;
  const routeTo = route ? CITY_COORDS[route.to] : null;
  const highlightCity = highlight ? CITY_COORDS[highlight] : null;

  return (
    <MapContainer
      center={MAP_CENTER}
      zoom={4.7}
      minZoom={4}
      maxZoom={11}
      scrollWheelZoom={false}
      className={cn("z-0 h-full w-full rounded-xl", className)}
      style={{ background: "#dcebf7" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Route line */}
      {routeFrom && routeTo && (
        <Polyline
          positions={[
            [routeFrom.lat, routeFrom.lng],
            [routeTo.lat, routeTo.lng],
          ]}
          pathOptions={{ color: ROUTE_ICON_COLOR, weight: 3, dashArray: "8 8", opacity: 0.85 }}
        />
      )}

      {/* Live fleet trucks */}
      {showTrucks &&
        TRUCK_CITIES.map((city) => {
          const c = CITY_COORDS[city];
          if (!c) return null;
          return (
            <Marker
              key={`truck-${city}`}
              position={[c.lat + 0.28, c.lng + 0.2]}
              icon={truckIcon()}
              interactive={false}
            />
          );
        })}

      {/* City dots */}
      {Object.entries(CITY_COORDS).map(([city, c]) => {
        const lm = landmarkFor(city);
        const isHighlight = highlight === city;
        return (
          <Marker
            key={city}
            position={[c.lat, c.lng]}
            icon={isHighlight ? youIcon() : cityIcon()}
          >
            {showLabels && (
              <Popup>
                <div className="cl-map-popup">
                  <p className="text-[13px] font-bold">{city}</p>
                  {lm && (
                    <p className="text-[12px] text-gray-600">Known for {lm.name}</p>
                  )}
                  {isHighlight && (
                    <p className="mt-1 inline-block rounded bg-orange-100 px-1.5 py-0.5 text-[11px] font-semibold text-orange-700">
                      Your location
                    </p>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}

      {/* Highlight pulse ring */}
      {highlightCity && (
        <Circle
          center={[highlightCity.lat, highlightCity.lng]}
          radius={14000}
          pathOptions={{ color: "#ff7a45", weight: 2, fillColor: "#ff7a45", fillOpacity: 0.15 }}
        />
      )}
    </MapContainer>
  );
}
