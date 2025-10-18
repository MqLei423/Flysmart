"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
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
  { code: 'SJU', name: 'San Juan Luis Muñoz Marín Intl', position: [18.4394, -66.0018]},
  { code: 'BZN', name: 'Bozeman Yellowstone Intl', position: [45.7778, -111.1530]},
  { code: 'PBI', name: 'West Palm Beach Intl', position: [26.6832, -80.0956]},
  { code: 'FLL', name: 'Fort Lauderdale-Hollywood Intl', position: [26.0726, -80.1527]},
  { code: 'PHX', name: 'Phoenix Sky Harbor Intl', position: [33.4373, -112.0078]},
  { code: 'ANC', name: 'Anchorage Ted Stevens Intl', position: [61.1743, -149.9983]},
];

type RouteGroup = {
  destination: any;
  flights: any[];
};

export default function Home() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [selectedAirport, setSelectedAirport] = useState<string | null>(null);
  const [L, setLeaflet] = useState<any>(null);
  const [hintVisible, setHintVisible] = useState(true); // display hint

  useEffect(() => {
    import("leaflet").then((leaflet) => setLeaflet(leaflet));
    fetch("/api/routes")
      .then((res) => res.json())
      .then((data) => setRoutes(data))
      .catch(console.error);
  }, []);

  if (!L) return null;

  const planeIcon = L.icon({
    iconUrl: "/map_pin.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <main className="relative w-screen h-screen">
      {hintVisible && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 text-black px-4 py-2 rounded-xl shadow-md text-sm font-medium z-[9999]">
          ✈️ Click an airport to start!
        </div>
      )}

      <MapContainer
        center={[45, -135]}   // Center of continental US
        zoom={3.5}
        minZoom={3.5}
        maxZoom={8}
        maxBounds={[
          [10, -200],  // southwest corner (includes Hawaii)
          [70, -50],   // northeast corner
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
              click: () => {
                setSelectedAirport(a.code); // Show routes on click
                setHintVisible(false);
              }
            }}
          >
            {/* Tooltip appears on hover */}
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
              {a.name}
            </Tooltip>
          </Marker>
        ))}

        {/* Sidebar list of routes */}
        {selectedAirport && (
          <div className="absolute top-20 left-2 bg-white p-4 rounded-xl shadow-lg w-85 max-h-[80vh] overflow-y-auto z-[9999]">
            <h2 className="text-lg font-semibold mb-2 text-black">
              Routes from {selectedAirport}
            </h2>
            
            {Object.entries(
              routes
                .filter((r) => r.origin.code === selectedAirport)
                .reduce((groups: Record<string, RouteGroup>, r) => {
                  const dest = r.destination.code;
                  if (!groups[dest]) groups[dest] = { destination: r.destination, flights: [] };
                  groups[dest].flights.push(r);
                  return groups;
                }, {} as Record<string, { destination: any; flights: any[] }>)
            ).map(([destCode, { destination, flights }]) => (
              <div key={destCode} className="border-b py-2">
                <div className="text-blue-700 font-medium">
                  ✈️ {destination.name} ({destination.code})
                </div>
                {flights.map((r: {
                  frequency: any; id: Key | null | undefined; airline: { name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; aircrafts: any[]; 
}) => (
                  <div key={r.id} className="text-sm text-gray-500 ml-4">
                    {r.airline.name}
                    {r.frequency && (
                      <> • {r.frequency}</>
                    )}
                    {r.aircrafts.length > 0 && (
                      <> • {r.aircrafts.map((a: { code: any; }) => a.code).join(", ")}</>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}


        {/* Great-circle arcs for routes */}
        {routes.filter((r) => r.origin.code === selectedAirport).map((r) => {
          const from = turf.point([r.origin.lon, r.origin.lat]);
          const to = turf.point([r.destination.lon, r.destination.lat]);
          const line = turf.greatCircle(from, to, { npoints: 50 });
          const positions = (line.geometry.coordinates as [number, number][]).map(
            (c) => [c[1], c[0]] as [number, number]
          );



          return (
            <Polyline key={r.id} positions={positions} color="blue" weight={2} />
          );
        })}

      </MapContainer>
    </main>
  );
}


