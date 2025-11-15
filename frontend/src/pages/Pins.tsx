import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Pin {
  id: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  category: string;
  status: string;
  location: {
    lat: number;
    lng: number;
  };
  createdAt: string;
  photoUrl?: string;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const defaultView: [number, number] = [40.7128, -74.006];

const severityColors: Record<string, string> = {
  low: "#3b82f6", // blue
  medium: "#f59e0b", // amber
  high: "#ef4444", // red
  critical: "#dc2626", // darker red
};

export default function PinsPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) return;

    let cleanup: (() => void) | undefined;
    let mounted = true;
    let retryTimeout: number | undefined;

    const initializeMap = (): (() => void) => {
      if (!mapRef.current || leafletRef.current || !mounted) return () => {};

      // Ensure container has dimensions and is visible
      const container = mapRef.current;
      if (container.offsetHeight === 0 || container.offsetWidth === 0) {
        // Wait for next frame if container isn't ready, with retry limit
        retryTimeout = window.setTimeout(() => {
          if (!mapRef.current || leafletRef.current || !mounted) return;
          initializeMap();
        }, 50);
        return () => {
          if (retryTimeout) clearTimeout(retryTimeout);
        };
      }

      try {
        const map = L.map(container, {
          zoomControl: true,
          preferCanvas: false,
        }).setView(defaultView, 13);

        leafletRef.current = map;

        // Wait for map to be fully ready before allowing marker additions
        map.whenReady(() => {
          if (mounted && map && !map._destroyed) {
            setMapReady(true);
            // Invalidate size after map is ready to ensure proper rendering
            setTimeout(() => {
              if (map && !map._destroyed) {
                map.invalidateSize();
              }
            }, 100);
          }
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        const handleResize = () => {
          if (map && !map._destroyed) {
            map.invalidateSize();
          }
        };
        window.addEventListener("resize", handleResize);

        return () => {
          mounted = false;
          if (retryTimeout) clearTimeout(retryTimeout);
          window.removeEventListener("resize", handleResize);
          setMapReady(false);
          if (map && !map._destroyed) {
            map.remove();
          }
        };
      } catch (error) {
        console.error("Error initializing map:", error);
        return () => {};
      }
    };

    cleanup = initializeMap();

    return () => {
      mounted = false;
      if (retryTimeout) clearTimeout(retryTimeout);
      if (cleanup) cleanup();
    };
  }, []);

  // Fetch pins from API
  useEffect(() => {
    const fetchPins = async () => {
      try {
        const response = await fetch(`${API_URL}/api/v1/pins`);
        if (!response.ok) throw new Error("Failed to fetch pins");
        const result = await response.json();
        if (result.success && result.data) {
          setPins(result.data);
        }
      } catch (error) {
        console.error("Error fetching pins:", error);
        // Fallback to sample data if API fails
        setPins([
          {
            id: "pin-241",
            description: "Flooded basement on Henry St",
            status: "open",
            severity: "high",
            category: "Flooding",
            location: { lat: 40.7128, lng: -74.006 },
            createdAt: new Date().toISOString(),
          },
          {
            id: "pin-242",
            description: "Collapsed tree limb",
            status: "resolved",
            severity: "medium",
            category: "Tree",
            location: { lat: 40.7589, lng: -73.9851 },
            createdAt: new Date().toISOString(),
          },
          {
            id: "pin-243",
            description: "Streetlight outage",
            status: "escalated",
            severity: "low",
            category: "Streetlight",
            location: { lat: 40.7282, lng: -73.9942 },
            createdAt: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPins();
  }, []);

  // Update markers when pins change
  useEffect(() => {
    // Only add markers when map is ready and not loading
    if (!leafletRef.current || !mapReady || loading) return;

    // Verify map is still valid and has panes
    const map = leafletRef.current;
    if (!map || map._destroyed || !map.getPane) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      try {
        marker.remove();
      } catch (e) {
        // Marker might already be removed
        console.warn("Error removing marker:", e);
      }
    });
    markersRef.current.clear();

    // Add new markers
    pins.forEach((pin) => {
      if (!map || map._destroyed) return;

      try {
        const color = severityColors[pin.severity] || "#3b82f6";
        const marker = L.circleMarker([pin.location.lat, pin.location.lng], {
          radius: 8,
          fillColor: color,
          color: "#fff",
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8,
        }).addTo(map);

        marker.bindPopup(
          `<div style="min-width: 200px;">
            <strong>${pin.category}</strong><br/>
            <p style="margin: 4px 0;">${pin.description}</p>
            <small>Status: ${pin.status} | Severity: ${pin.severity}</small>
          </div>`
        );

        marker.on("click", () => {
          setSelectedPin(pin);
        });

        markersRef.current.set(pin.id, marker);
      } catch (e) {
        console.error("Error adding marker:", e);
      }
    });

    // Fit map to show all markers
    if (pins.length > 0 && map && !map._destroyed) {
      try {
        const bounds = L.latLngBounds(pins.map((p) => [p.location.lat, p.location.lng]));
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (e) {
        console.error("Error fitting bounds:", e);
      }
    }
  }, [pins, loading, mapReady]);

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-6 py-10">
      <header>
        <p className="text-sm uppercase tracking-widest text-emerald-500">Response queue</p>
        <h2 className="text-3xl font-bold text-slate-900">Hazard pins</h2>
        <p className="mt-2 text-slate-600">
          View all reported hazards on the map. Click on markers to see details.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div
            ref={mapRef}
            className="min-h-[60vh] w-full rounded-2xl border border-slate-200 bg-white shadow-sm"
            style={{ zIndex: 0, height: '60vh', minHeight: '400px' }}
          />
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Legend</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(severityColors).map(([severity, color]) => (
                <div key={severity} className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="capitalize text-slate-700">{severity}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedPin && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-3 text-lg font-semibold text-slate-900">Selected Pin</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{selectedPin.category}</p>
                  <p className="text-slate-600">{selectedPin.description}</p>
                </div>
                <dl className="flex gap-4 text-xs">
                  <div>
                    <dt className="text-slate-400">Status</dt>
                    <dd className="capitalize text-slate-900">{selectedPin.status}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400">Severity</dt>
                    <dd className="capitalize text-slate-900">{selectedPin.severity}</dd>
                  </div>
                </dl>
                <button
                  onClick={() => setSelectedPin(null)}
                  className="mt-2 w-full rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg font-semibold text-slate-900">All Pins ({pins.length})</h3>
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {loading ? (
                <p className="text-sm text-slate-500">Loading...</p>
              ) : pins.length === 0 ? (
                <p className="text-sm text-slate-500">No pins found</p>
              ) : (
                pins.map((pin) => (
                  <button
                    key={pin.id}
                    onClick={() => {
                      setSelectedPin(pin);
                      const marker = markersRef.current.get(pin.id);
                      if (marker && leafletRef.current) {
                        leafletRef.current.setView([pin.location.lat, pin.location.lng], 15);
                        marker.openPopup();
                      }
                    }}
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-left text-sm transition hover:bg-slate-100"
                  >
                    <p className="font-semibold text-slate-900">{pin.category}</p>
                    <p className="truncate text-xs text-slate-600">{pin.description}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: severityColors[pin.severity] }}
                      />
                      <span className="text-xs capitalize text-slate-500">
                        {pin.severity} • {pin.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

