"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import * as turf from "@turf/turf";

// Dynamic imports for SSR
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import("react-leaflet").then((mod) => mod.Tooltip),
  { ssr: false }
);


// Airport list
const airports = [
  { code: "JFK", name: "New York JFK", position: [40.6413, -73.7781] },
  { code: "EWR", name: "Newark Liberty", position: [40.6895, -74.1745] },
  { code: "BOS", name: "Boston Logan", position: [42.3656, -71.0096] },
  { code: "MIA", name: "Miami Intl", position: [25.7959, -80.2870] },
  { code: "MCO", name: "Orlando Intl", position: [28.4312, -81.3081] },
  { code: "CLT", name: "Charlotte Douglas", position: [35.2144, -80.9473] },
  { code: "ATL", name: "Atlanta Hartsfield-Jackson", position: [33.6407, -84.4277] },
  { code: "ORD", name: "Chicago OHare", position: [41.9742, -87.9073] },
  { code: "DFW", name: "Dallas/Fort Worth", position: [32.8998, -97.0403] },
  { code: "DEN", name: "Denver Intl", position: [39.8561, -104.6737] },
  { code: "SFO", name: "San Francisco Intl", position: [37.6213, -122.3790] },
  { code: "LAX", name: "Los Angeles Intl", position: [33.9416, -118.4085] },
  { code: "SAN", name: "San Diego Intl", position: [32.7338, -117.1933] },
  { code: "SEA", name: "Seattle-Tacoma Intl", position: [47.4502, -122.3088] },
  { code: "LAS", name: "Las Vegas Harry Reid", position: [36.0840, -115.1537] },
  { code: "SNA", name: "Orange County John Wayne", position: [33.6757, -117.8682] },
  { code: "MSP", name: "Minneapolis–St. Paul Intl", position: [44.8848, -93.2223] },
  { code: "DTW", name: "Detroit Metro Wayne County", position: [42.2162, -83.3554] },
  { code: "HNL", name: "Honolulu Intl", position: [21.3187, -157.9225] },
  { code: "OGG", name: "Maui Kahului", position: [20.8987, -156.4305] },
];

// Custom marker icon
const planeIcon = L.icon({
  iconUrl: "/map_pin.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

export default function Home() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => setRoutes(data))
      .catch(console.error);
  }, []);

  return (
    <main className="w-screen h-screen">
      <MapContainer
        center={[39.5, -98.35]}   // Center of continental US
        zoom={4}
        minZoom={4}
        maxZoom={8}
        maxBounds={[
          [15, -180],  // southwest corner (includes Hawaii)
          [55, -60],   // northeast corner
        ]}
        maxBoundsViscosity={1.0}
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {/* Airport markers */}
        {airports.map((a) => (
          <Marker
            key={a.code}
            position={a.position as [number, number]}
            icon={planeIcon}
            eventHandlers={{
              click: () => setSelectedAirport(a.code), // Show routes on click
            }}
          >
            {/* Tooltip appears on hover */}
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
              {a.name}
            </Tooltip>
          </Marker>
        ))}


        {/* Great-circle arcs for routes */}
        {routes.filter((r) => r.origin.code === selectedAirport).map((r) => {
          const from = turf.point([r.origin.lon, r.origin.lat]);
          const to = turf.point([r.destination.lon, r.destination.lat]);
          const line = turf.greatCircle(from, to, { npoints: 50 });
          const positions = line.geometry.coordinates.map((c: number[]) => [c[1], c[0]]);

          return (
            <Polyline key={r.id} positions={positions} color="blue" weight={2} />
          );
        })}

      </MapContainer>
    </main>
  );
}
