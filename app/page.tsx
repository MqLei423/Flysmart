"use client";

import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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

const airports = [
  { code: "JFK", name: "New York JFK", position: [40.6413, -73.7781] },
  { code: "EWR", name: "Newark Liberty", position: [40.6895, -74.1745] },
  { code: "BOS", name: "Boston Logan", position: [42.3656, -71.0096] },
  { code: "MIA", name: "Miami Intl", position: [25.7959, -80.2870] },
  { code: "MCO", name: "Orlando Intl", position: [28.4312, -81.3081] },
  { code: "CLT", name: "Charlotte Douglas", position: [35.2144, -80.9473] },
  { code: "ATL", name: "Atlanta Hartsfield-Jackson", position: [33.6407, -84.4277] },
  { code: "ORD", name: "Chicago O'Hare", position: [41.9742, -87.9073] },
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


const usBounds = [
  [15, -170], // Southwest corner (includes Hawaii)
  [55, -60],  // Northeast corner
];

// Define custom icon (this is the key part)
const planeIcon = L.icon({
  iconUrl: "/map_pin.png",     // relative to /public
  iconSize: [32, 32],          // adjust size to fit your image
  iconAnchor: [16, 32],        // point that will be at marker’s location
  popupAnchor: [0, -32],       // popup position relative to the icon
});

export default function Home() {
  const position: [number, number] = [20, 0];

  return (
    <main className="w-screen h-screen">
      <MapContainer
        center={[39.5, -98.35]}   // roughly the center of the continental U.S.
        zoom={4}                  // zoomed in enough to show the whole U.S.
        minZoom={4}
        maxZoom={8}
        maxBounds={[
          [15, -180],  // southwest corner (includes Hawaii)
          [55, -60],   // northeast corner (Maine)
        ]}

        maxBoundsViscosity={1.0}  // prevents dragging off the map
        className="w-full h-full"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
        />

        {airports.map((a) => (
          <Marker
            key={a.code}
            position={a.position as [number, number]}
            icon={planeIcon}
          >
            <Popup>
              <div>
                <h2 className="font-semibold">{a.name}</h2>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                  onClick={() => alert(`Show routes from ${a.code}`)}
                >
                  View Routes
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </main>
  );
}
