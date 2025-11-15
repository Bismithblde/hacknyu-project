import { useState, useEffect, useRef } from 'react';
import Map from './Map';
import IssueForm from './IssueForm';
import IssuesList from './IssuesList';

interface Issue {
  id: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  photoUrl: string | null;
  timestamp: Date;
}

const ReportSection = () => {
  const [selectedLat, setSelectedLat] = useState<number | null>(null);
  const [selectedLng, setSelectedLng] = useState<number | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLocationSelect = (lat: number, lng: number) => {
    setSelectedLat(lat);
    setSelectedLng(lng);
  };

  const handleIssueSubmit = (issueData: {
    description: string;
    category: string;
    lat: number;
    lng: number;
    photoUrl: string | null;
  }) => {
    const newIssue: Issue = {
      id: Date.now().toString(),
      ...issueData,
      timestamp: new Date(),
    };

    setIssues([...issues, newIssue]);
    setSelectedLat(null);
    setSelectedLng(null);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="report">
      <div ref={containerRef} className="app-container js-animate-on-scroll animate-rise-blur">
        <Map onLocationSelect={handleLocationSelect} />
        <aside id="sidebar">
          <IssueForm
            lat={selectedLat}
            lng={selectedLng}
            onSubmit={handleIssueSubmit}
          />
        </aside>
      </div>
      <IssuesList issues={issues} />
    </section>
  );
};

export default ReportSection;

