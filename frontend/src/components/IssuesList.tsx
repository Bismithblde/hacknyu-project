import { useEffect, useRef } from 'react';

interface Issue {
  id: string;
  description: string;
  category: string;
  lat: number;
  lng: number;
  photoUrl: string | null;
  timestamp: Date;
}

interface IssuesListProps {
  issues: Issue[];
}

const IssuesList = ({ issues }: IssuesListProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

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

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  const getCategoryText = (value: string) => {
    const categoryMap: Record<string, string> = {
      'pothole': 'Pothole',
      'streetlight': 'Broken streetlight',
      'trash': 'Trash / dumping',
      'sidewalk': 'Sidewalk issue',
      'illegal-hunting': 'Illegal Hunting',
      'endangered-species': 'Endangered Species',
      'migratory-birds': 'Migratory Birds',
      'marine-mammals': 'Marine Mammals',
      'bald-golden-eagles': 'Bald and Golden Eagles',
      'big-cats': 'Big Cats',
      'archeological-resources': 'Archeological Resources',
      'critical-habitat': 'Critical Habitat',
      'indian-arts-crafts': 'Indian Arts and Crafts',
      'other-wildlife-crimes': 'Other Wildlife Crimes',
      'other': 'Other',
    };
    return categoryMap[value] || 'Other';
  };

  return (
    <section id="issues-section" ref={sectionRef} className="js-animate-on-scroll animate-rise-soft">
      <div className="issues-container">
        <header className="issues-header">
          <h2>Reported Issues</h2>
          <p className="issues-subtitle">
            A live feed of what people are seeing and patching.
          </p>
        </header>
        {issues.length === 0 ? (
          <p id="issues-empty" className="issues-empty">
            No issues reported yet. Drop a pin on the map, describe the problem, and attach a photo to get started.
          </p>
        ) : (
          <ul id="issues-list" className="issues-list">
            {issues.map((issue) => (
              <li key={issue.id} className="issue-item">
                <div className="issue-top-row">
                  <span className="issue-category-pill">{getCategoryText(issue.category)}</span>
                  <span className="status-pill status-open">Open</span>
                </div>
                <p className="issue-description">{issue.description}</p>
                {issue.photoUrl && (
                  <img
                    src={issue.photoUrl}
                    alt="Attached photo for this issue"
                    className="issue-photo"
                  />
                )}
                <div className="issue-meta">
                  <span>📍 {issue.lat.toFixed(4)}, {issue.lng.toFixed(4)}</span>
                  <span>⏱ {issue.timestamp.toLocaleString()}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default IssuesList;

