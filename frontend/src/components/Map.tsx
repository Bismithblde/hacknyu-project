import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const Map = ({ onLocationSelect }: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Initialize map
    const map = L.map(mapContainerRef.current).setView([40.7128, -74.006], 13);
    mapRef.current = map;

    // Dark map tiles
    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 19,
        subdomains: 'abcd',
        attribution:
          '&copy; OpenStreetMap contributors &copy; <a href="https://carto.com/">CARTO</a>',
      }
    ).addTo(map);

    // Handle map clicks
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;

      if (!markerRef.current) {
        const marker = L.marker([lat, lng], {
          draggable: true,
          className: 'issue-marker',
        }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          onLocationSelect(pos.lat, pos.lng);
        });

        markerRef.current = marker;
      } else {
        markerRef.current.setLatLng([lat, lng]);
      }

      onLocationSelect(lat, lng);
    });

    // Animate on scroll
    const mapElement = mapContainerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      },
      { threshold: 0.15 }
    );

    if (mapElement) {
      observer.observe(mapElement);
    }

    return () => {
      observer.disconnect();
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [onLocationSelect]);

  return <div id="map" ref={mapContainerRef} className="animate-zoom-soft js-animate-on-scroll" />;
};

export default Map;

