import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import L, { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type IssueStatus = "Open";

interface Issue {
  id: string;
  description: string;
  category: string;
  coordinates: { lat: number; lng: number };
  createdAt: string;
  status: IssueStatus;
  photoUrl?: string;
}

const categories = [
  { value: "", label: "- Select -" },
  { value: "pothole", label: "Pothole" },
  { value: "streetlight", label: "Broken streetlight" },
  { value: "trash", label: "Trash / dumping" },
  { value: "sidewalk", label: "Sidewalk issue" },
  { value: "illegal-hunting", label: "Illegal Hunting" },
  { value: "endangered-species", label: "Endangered Species" },
  { value: "migratory-birds", label: "Migratory Birds" },
  { value: "marine-mammals", label: "Marine Mammals" },
  { value: "bald-golden-eagles", label: "Bald and Golden Eagles" },
  { value: "big-cats", label: "Big Cats" },
  { value: "archeological-resources", label: "Archeological Resources" },
  { value: "critical-habitat", label: "Critical Habitat" },
  { value: "indian-arts-crafts", label: "Indian Arts and Crafts" },
  { value: "other-wildlife-crimes", label: "Other Wildlife Crimes" },
  { value: "other", label: "Other" },
];

const defaultView: [number, number] = [40.7128, -74.006];

export default function ReportPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const objectUrlsRef = useRef<string[]>([]);
  const isInitializingRef = useRef<boolean>(false);

  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Check if container exists or if already initializing
    if (!mapRef.current || isInitializingRef.current) return;
    
    // Prevent double initialization (React StrictMode protection)
    if (leafletRef.current) return;
    
    // Check if Leaflet has already initialized this container
    if (mapRef.current && (mapRef.current as any)._leaflet_id) {
      return;
    }
    
    isInitializingRef.current = true;
    let cleanup: (() => void) | undefined;
    let timeoutId: NodeJS.Timeout | undefined;
    let isMounted = true;
    
    // Cleanup function to remove any existing map
    const cleanupExistingMap = () => {
      if (leafletRef.current) {
        try {
          leafletRef.current.remove();
        } catch (error) {
          // Ignore errors during cleanup
        }
        leafletRef.current = null;
      }
    };
    
    // Ensure the container has a size before initializing
    const initMap = () => {
      if (!isMounted || !mapRef.current) {
        isInitializingRef.current = false;
        return;
      }
      
      // Final check before initialization - ensure no existing map
      if (leafletRef.current || (mapRef.current as any)._leaflet_id) {
        cleanupExistingMap();
        isInitializingRef.current = false;
        return;
      }
      
      // Double-check container is ready
      if (mapRef.current.offsetHeight === 0 || mapRef.current.offsetWidth === 0) {
        timeoutId = setTimeout(initMap, 50);
        return;
      }
      
      cleanup = initializeMap();
      isInitializingRef.current = false;
    };

    function initializeMap(): () => void {
      if (!mapRef.current) {
        isInitializingRef.current = false;
        return () => {};
      }
      
      // Final safety check
      if (leafletRef.current || (mapRef.current as any)._leaflet_id) {
        isInitializingRef.current = false;
        return () => {};
      }
      
      try {
        const map = L.map(mapRef.current!, { 
          zoomControl: true,
          preferCanvas: false
        }).setView(defaultView, 13);
        
        leafletRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map);

        // Invalidate size after map is fully rendered
        const invalidateTimeout = setTimeout(() => {
          if (isMounted && map && mapRef.current && mapRef.current.offsetParent !== null) {
            try {
              map.invalidateSize();
            } catch (error) {
              console.warn("Failed to invalidate map size:", error);
            }
          }
        }, 200);

        const handleMapClick = (event: LeafletMouseEvent) => {
          const { lat, lng } = event.latlng;
          placeOrMoveMarker(lat, lng);
          setSelectedCoords({ lat, lng });
        };

        map.on("click", handleMapClick);

        // Handle window resize
        const handleResize = () => {
          if (isMounted && map && mapRef.current && mapRef.current.offsetParent !== null) {
            try {
              map.invalidateSize();
            } catch (error) {
              console.warn("Failed to invalidate map size on resize:", error);
            }
          }
        };
        window.addEventListener("resize", handleResize);

        return () => {
          clearTimeout(invalidateTimeout);
          map.off("click", handleMapClick);
          window.removeEventListener("resize", handleResize);
          if (map) {
            try {
              map.remove();
            } catch (error) {
              // Ignore errors during cleanup
            }
          }
          // Clear the ref after removal
          if (leafletRef.current === map) {
            leafletRef.current = null;
          }
          isInitializingRef.current = false;
          objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        };
      } catch (error) {
        console.error("Error initializing map:", error);
        isInitializingRef.current = false;
        return () => {};
      }
    }

    // Start initialization
    if (mapRef.current.offsetHeight === 0 || mapRef.current.offsetWidth === 0) {
      timeoutId = setTimeout(initMap, 100);
    } else {
      cleanup = initializeMap();
    }

    return () => {
      isMounted = false;
      isInitializingRef.current = false;
      if (timeoutId) clearTimeout(timeoutId);
      cleanupExistingMap();
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  // Invalidate map size when sidebar toggles
  useEffect(() => {
    if (leafletRef.current && mapRef.current && mapRef.current.offsetParent !== null) {
      const timeoutId = setTimeout(() => {
        if (leafletRef.current && mapRef.current && mapRef.current.offsetParent !== null) {
          try {
            leafletRef.current.invalidateSize();
          } catch (error) {
            console.warn("Failed to invalidate map size on sidebar toggle:", error);
          }
        }
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [sidebarOpen]);

  const placeOrMoveMarker = (lat: number, lng: number) => {
    if (!leafletRef.current) return;
    if (!markerRef.current) {
      const marker = L.marker([lat, lng], { draggable: true }).addTo(leafletRef.current);
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setSelectedCoords({ lat: pos.lat, lng: pos.lng });
      });
      markerRef.current = marker;
    }
    markerRef.current.setLatLng([lat, lng]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const description = (formData.get("description") as string)?.trim();
    const category = formData.get("category") as string;
    const photo = formData.get("photo") as File | null;

    if (!selectedCoords) {
      alert("Please select a location on the map before submitting.");
      return;
    }

    if (!description) {
      alert("Please describe the issue.");
      return;
    }

    if (!category) {
      alert("Please choose an issue category.");
      return;
    }

    let photoUrl: string | undefined;
    if (photo && photo.size > 0) {
      photoUrl = URL.createObjectURL(photo);
      objectUrlsRef.current.push(photoUrl);
    }

    setIssues((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        description,
        category,
        status: "Open",
        coordinates: { ...selectedCoords },
        createdAt: new Date().toISOString(),
        photoUrl,
      },
    ]);

    event.currentTarget.reset();
    setSelectedCoords(null);
    markerRef.current?.remove();
    markerRef.current = null;
  };

  return (
    <div className="relative h-[calc(100vh-73px)] w-full overflow-hidden">
      {/* Full-screen map */}
      <div ref={mapRef} className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }} />

      {/* Sidebar */}
      <aside
        className={`absolute right-0 top-0 z-[1000] h-full w-full max-w-md transform overflow-y-auto rounded-l-3xl border-l border-white/10 bg-slate-900/95 p-6 text-slate-50 shadow-2xl backdrop-blur-2xl transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 rounded-l-lg border border-white/10 bg-slate-900/95 px-3 py-4 text-white shadow-lg transition hover:bg-slate-800"
          aria-label="Toggle sidebar"
        >
          <svg
            className={`h-5 w-5 transition-transform ${sidebarOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Report an Issue</h2>
          <p className="text-sm text-slate-300">
            Click anywhere on the map to drop a pin. Drag it if you need to adjust.
          </p>
        </div>
        <dl className="mt-6 space-y-1 text-sm">
          <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">Selected location</dt>
          <dd
            className={
              selectedCoords
                ? "font-semibold text-emerald-300"
                : "text-slate-400 italic"
            }
          >
            {selectedCoords
              ? `${selectedCoords.lat.toFixed(4)}, ${selectedCoords.lng.toFixed(4)}`
              : "No location selected"}
          </dd>
        </dl>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="space-y-2 text-sm font-medium text-slate-200">
            Describe the issue
            <textarea
              name="description"
              placeholder="What's happening, and what should be fixed?"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
              rows={4}
            />
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-200">
            Category
            <select
              name="category"
              defaultValue=""
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-emerald-400"
            >
              {categories.map((option) => (
                <option key={option.value} value={option.value} disabled={option.value === ""}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="space-y-2 text-sm font-medium text-slate-200">
            Attach a photo (optional)
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="w-full rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-2 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-slate-50 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.2em] file:text-slate-900"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-full border border-white/80 bg-white py-3 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900 shadow-xl transition hover:-translate-y-0.5 hover:border-emerald-300 hover:bg-slate-50"
          >
            Submit Issue
          </button>
          <p className="flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_0_0_rgba(56,189,248,0.7)] animate-pulse" />
            Reports are visual only in this demo. Status will be updated by city / agency teams.
          </p>
        </form>

        {/* Reported issues section */}
        <section className="mt-8 rounded-3xl border border-white/10 bg-slate-950/40 p-6 text-slate-100">
          <header className="mb-4 border-b border-white/5 pb-3">
            <p className="text-xs uppercase tracking-[0.35em] text-emerald-300">Reported issues</p>
            <h3 className="text-lg font-semibold text-white">Live feed</h3>
          </header>
          {issues.length === 0 ? (
            <p className="text-sm text-slate-300">
              No issues reported yet. Drop a pin on the map, describe the problem, and attach a photo to get started.
            </p>
          ) : (
            <ul className="flex max-h-80 flex-col gap-4 overflow-y-auto pr-2">
              {issues.map((issue) => (
                <li key={issue.id} className="rounded-2xl border border-white/5 bg-slate-900/40 p-4 shadow-inner">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-300">
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[0.65rem]">
                      {issue.category}
                    </span>
                    <span className="rounded-full border border-emerald-400/40 px-3 py-1 text-emerald-200">
                      {issue.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-slate-100">{issue.description}</p>
                  {issue.photoUrl && (
                    <img
                      src={issue.photoUrl}
                      alt="Attachment"
                      className="mt-3 max-h-48 w-full rounded-2xl border border-white/10 object-cover"
                    />
                  )}
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
                    <span>
                      📍 {issue.coordinates.lat.toFixed(4)}, {issue.coordinates.lng.toFixed(4)}
                    </span>
                    <span>⏱ {new Date(issue.createdAt).toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </aside>
    </div>
  );
}

