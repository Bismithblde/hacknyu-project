import { useState, useEffect, useRef } from 'react';

interface IssueFormProps {
  lat: number | null;
  lng: number | null;
  onSubmit: (issue: {
    description: string;
    category: string;
    lat: number;
    lng: number;
    photoUrl: string | null;
  }) => void;
}

const IssueForm = ({ lat, lng, onSubmit }: IssueFormProps) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!lat || !lng) {
      alert('Please select a location on the map before submitting.');
      return;
    }

    if (!description.trim()) {
      alert('Please describe the issue.');
      return;
    }

    if (!category) {
      alert('Please choose an issue category.');
      return;
    }

    let photoUrl: string | null = null;
    if (photoFile) {
      photoUrl = URL.createObjectURL(photoFile);
    }

    onSubmit({
      description: description.trim(),
      category,
      lat,
      lng,
      photoUrl,
    });

    // Reset form
    setDescription('');
    setCategory('');
    setPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

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

    observer.observe(card);

    return () => {
      observer.disconnect();
    };
  }, []);

  const coordDisplay = lat && lng 
    ? `${lat.toFixed(4)}, ${lng.toFixed(4)}`
    : 'No location selected';

  return (
    <div ref={cardRef} className="sidebar-card animate-slide-soft-right js-animate-on-scroll">
      <h2>Report an Issue</h2>
      <p className="note">
        🗺️ Click anywhere on the map to drop a pin. Drag it if you need to adjust.
      </p>
      <div className="coord-display">
        <span className="coord-label">Selected location</span>
        <span className={`coord-value ${lat && lng ? 'coord-ready' : 'coord-pending'}`}>
          {coordDisplay}
        </span>
      </div>
      <form ref={formRef} id="issue-form" onSubmit={handleSubmit}>
        <div className="field-row">
          <label htmlFor="description">Describe the issue</label>
          <textarea
            id="description"
            name="description"
            placeholder="What's happening, and what should be fixed?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="field-row">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>
              - Select -
            </option>
            <option value="pothole">Pothole</option>
            <option value="streetlight">Broken streetlight</option>
            <option value="trash">Trash / dumping</option>
            <option value="sidewalk">Sidewalk issue</option>
            <option value="illegal-hunting">Illegal Hunting</option>
            <option value="endangered-species">Endangered Species</option>
            <option value="migratory-birds">Migratory Birds</option>
            <option value="marine-mammals">Marine Mammals</option>
            <option value="bald-golden-eagles">Bald and Golden Eagles</option>
            <option value="big-cats">Big Cats</option>
            <option value="archeological-resources">Archeological Resources</option>
            <option value="critical-habitat">Critical Habitat</option>
            <option value="indian-arts-crafts">Indian Arts and Crafts</option>
            <option value="other-wildlife-crimes">Other Wildlife Crimes</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="field-row">
          <label htmlFor="photo">Attach a photo (optional)</label>
          <input
            ref={fileInputRef}
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
          />
        </div>
        <button type="submit" className="primary-btn">
          Submit Issue
        </button>
        <div className="hint">
          <span className="live-pill"></span>
          Reports are visual only in this demo. Status will be updated by city / agency teams.
        </div>
      </form>
    </div>
  );
};

export default IssueForm;

