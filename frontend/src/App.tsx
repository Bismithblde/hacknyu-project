import React, { useEffect, useMemo, useState } from "react";
import type {
  AiResult,
  DatasetRecord,
  LeaderboardEntry,
  Pin,
  PinStatus,
  Severity,
  UserProfile,
} from "./types";
import {
  fallbackAiResult,
  fallbackLeaderboard,
  fallbackPins,
  fallbackProfile,
} from "./utils/fallbackData";
import "./index.css";

const API_BASE = import.meta.env.VITE_API_BASE ?? "/api/v1";

const severityColors: Record<Severity, string> = {
  low: "#38bdf8",
  medium: "#facc15",
  high: "#fb923c",
  critical: "#f87171",
};

const statusColors: Record<PinStatus, string> = {
  open: "#1d4ed8",
  escalated: "#9333ea",
  resolved: "#059669",
};

interface PinFormState {
  description: string;
  severity: Severity;
  lat: number;
  lng: number;
  address: string;
  photo?: string;
  fileName?: string;
}

interface ConfirmationState {
  pinId: string;
  reportType: "official-report" | "confirmation";
  reportText: string;
  fileUrl?: string;
}

const defaultForm: PinFormState = {
  description: "",
  severity: "medium",
  lat: 40.7128,
  lng: -74.006,
  address: "New York City",
};

const defaultConfirmation: ConfirmationState = {
  pinId: "",
  reportType: "official-report",
  reportText: "",
};

async function apiFetch<T>(
  path: string,
  options: RequestInit,
  fallback: T,
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!response.ok) throw new Error("Request failed");
    const payload = await response.json();
    return (payload.data ?? payload) as T;
  } catch (error) {
    console.warn(`Falling back for ${path}`, error);
    return fallback;
  }
}

const MapView: React.FC<{
  pins: Pin[];
  selectedPinId?: string;
  onSelectPin: (id: string) => void;
  onChooseLocation: (lat: number, lng: number, address: string) => void;
}> = ({ pins, selectedPinId, onSelectPin, onChooseLocation }) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const percentX = (event.clientX - rect.left) / rect.width;
    const percentY = (event.clientY - rect.top) / rect.height;
    const lng = percentX * 360 - 180;
    const lat = 90 - percentY * 180;
    const address = `Dropped pin (${lat.toFixed(3)}, ${lng.toFixed(3)})`;
    onChooseLocation(parseFloat(lat.toFixed(3)), parseFloat(lng.toFixed(3)), address);
  };

  return (
    <div className="map" onClick={handleClick}>
      <div className="map-grid" />
      {pins.map((pin) => {
        const x = ((pin.location.lng + 180) / 360) * 100;
        const y = ((90 - pin.location.lat) / 180) * 100;
        const active = pin.id === selectedPinId;
        return (
          <button
            key={pin.id}
            className={`pin ${active ? "pin-active" : ""}`}
            style={{ left: `${x}%`, top: `${y}%`, backgroundColor: severityColors[pin.severity] }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPin(pin.id);
            }}
            aria-label={`Pin ${pin.description}`}
          />
        );
      })}
    </div>
  );
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function App() {
  const [pins, setPins] = useState<Pin[]>(fallbackPins);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(fallbackLeaderboard);
  const [profile, setProfile] = useState<UserProfile>(fallbackProfile);
  const [selectedPinId, setSelectedPinId] = useState<string>(fallbackPins[0]?.id ?? "");
  const [formState, setFormState] = useState<PinFormState>(defaultForm);
  const [aiResult, setAiResult] = useState<AiResult | null>(null);
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>(defaultConfirmation);
  const [isSubmittingPin, setIsSubmittingPin] = useState(false);
  const [verifyingPinId, setVerifyingPinId] = useState<string | null>(null);

  useEffect(() => {
    const loadPins = async () => {
      const data = await apiFetch<Pin[]>("/pins", { method: "GET" }, fallbackPins);
      setPins(data);
      if (!selectedPinId && data[0]) {
        setSelectedPinId(data[0].id);
      }
      setConfirmationState((prev) => ({ ...prev, pinId: data[0]?.id ?? prev.pinId }));
    };

    const loadLeaderboard = async () => {
      const data = await apiFetch<LeaderboardEntry[]>("/leaderboard", { method: "GET" }, fallbackLeaderboard);
      setLeaderboard(data);
    };

    const loadProfile = async () => {
      const data = await apiFetch<UserProfile>(`/users/${fallbackProfile.id}`, { method: "GET" }, fallbackProfile);
      setProfile(data);
    };

    loadPins();
    loadLeaderboard();
    loadProfile();
  }, []);

  const selectedPin = useMemo(() => pins.find((pin) => pin.id === selectedPinId), [pins, selectedPinId]);

  const verificationCandidates = useMemo(() => {
    return [...pins]
      .sort((a, b) => a.verificationStats.score - b.verificationStats.score)
      .slice(0, 3);
  }, [pins]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormState((prev) => ({ ...prev, photo: reader.result as string, fileName: file.name }));
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!formState.description) return;
    const analysis = await apiFetch<AiResult>(
      "/ai/analyze",
      { method: "POST", body: JSON.stringify({ description: formState.description, photoUrl: formState.photo }) },
      fallbackAiResult,
    );
    setAiResult(analysis);
  };

  const handleCreatePin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.description) return;
    setIsSubmittingPin(true);
    const payload = {
      userId: profile.id,
      description: formState.description,
      severity: formState.severity,
      location: { lat: formState.lat, lng: formState.lng, address: formState.address },
      photoUrl: formState.photo,
    };
    const newPin = await apiFetch<Pin>("/pins", { method: "POST", body: JSON.stringify(payload) }, {
      ...fallbackPins[0],
      id: `temp-${Date.now()}`,
      description: payload.description,
      severity: payload.severity,
      location: payload.location,
    } as Pin);
    setPins((prev) => [newPin, ...prev]);
    setSelectedPinId(newPin.id);
    setFormState(defaultForm);
    setAiResult(null);
    setIsSubmittingPin(false);
  };

  const handleVerification = async (pinId: string, vote: "valid" | "invalid") => {
    setVerifyingPinId(pinId);
    const updated = await apiFetch<Pin>(
      "/verifications",
      { method: "POST", body: JSON.stringify({ pinId, userId: profile.id, vote }) },
      pins.find((pin) => pin.id === pinId) ?? fallbackPins[0],
    );
    setPins((prev) => prev.map((pin) => (pin.id === updated.id ? updated : pin)));
    setVerifyingPinId(null);
  };

  const handleConfirmationSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!confirmationState.pinId) return;
    await apiFetch<Record<string, unknown>>(
      "/confirmations",
      { method: "POST", body: JSON.stringify({ ...confirmationState, userId: profile.id }) },
      {},
    );
    setConfirmationState((prev) => ({ ...defaultConfirmation, pinId: prev.pinId }));
  };

  const handleDatasetDownload = async () => {
    const dataset = await apiFetch<DatasetRecord[]>("/dataset", { method: "GET" }, []);
    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "belli-open-dataset.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const levelCopy = [
    { name: "Scout", points: 0 },
    { name: "Ranger", points: 100 },
    { name: "Inspector", points: 200 },
    { name: "Guardian", points: 400 },
  ];

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Belli civic hazard routing</p>
          <h1>Map hazards. Reward neighbors. Route smarter.</h1>
          <p>
            Belli lets communities drop pins for potholes, flooding, lights, sanitation, and more. Every
            report is routed with Groq-powered AI to the best agency and logged into a public dataset.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={handleDatasetDownload}>
              Export public dataset
            </button>
            <button className="ghost" onClick={handleAnalyze}>
              Run AI routing demo
            </button>
          </div>
        </div>
        <div className="profile-card">
          <div className="profile-header">
            <img src={profile.avatar} alt="avatar" />
            <div>
              <p className="label">{profile.level}</p>
              <h3>{profile.name}</h3>
              <p>{profile.points} pts • Trust {profile.trustScore}%</p>
            </div>
          </div>
          <dl>
            <div>
              <dt>Pins filed</dt>
              <dd>{profile.createdPins}</dd>
            </div>
            <div>
              <dt>Verifications</dt>
              <dd>{profile.verifiedPins}</dd>
            </div>
            <div>
              <dt>Reports</dt>
              <dd>{profile.submittedReports}</dd>
            </div>
            <div>
              <dt>Resolved</dt>
              <dd>{profile.resolvedPins}</dd>
            </div>
          </dl>
          <div className="badge-row">
            {profile.badges.map((badge) => (
              <span key={badge}>{badge}</span>
            ))}
          </div>
        </div>
      </header>

      <section className="map-section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Live hazard map</p>
            <h2>Open issues routed by Belli</h2>
          </div>
          <div className="legend">
            {Object.entries(severityColors).map(([key, value]) => (
              <span key={key}>
                <i style={{ backgroundColor: value }} /> {key}
              </span>
            ))}
          </div>
        </div>
        <div className="map-grid-layout">
          <MapView
            pins={pins}
            selectedPinId={selectedPinId}
            onSelectPin={setSelectedPinId}
            onChooseLocation={(lat, lng, address) => {
              setFormState((prev) => ({ ...prev, lat, lng, address }));
            }}
          />
          {selectedPin && (
            <div className="pin-detail">
              <p className="label">{selectedPin.category}</p>
              <h3>{selectedPin.description}</h3>
              <p className="detail-location">{selectedPin.location.address}</p>
              <div className="pill-row">
                <span style={{ backgroundColor: severityColors[selectedPin.severity] }}>
                  {selectedPin.severity} • {(selectedPin.aiConfidence * 100).toFixed(0)}%
                </span>
                <span style={{ backgroundColor: statusColors[selectedPin.status] }}>{selectedPin.status}</span>
              </div>
              <dl>
                <div>
                  <dt>Agency</dt>
                  <dd>{selectedPin.recommendedAgency}</dd>
                </div>
                <div>
                  <dt>Verifications</dt>
                  <dd>
                    {selectedPin.verificationStats.upvotes} ✓ / {selectedPin.verificationStats.downvotes} ✕
                  </dd>
                </div>
                <div>
                  <dt>Filed</dt>
                  <dd>{formatDate(selectedPin.createdAt)}</dd>
                </div>
              </dl>
              {selectedPin.photoUrl && <img src={selectedPin.photoUrl} alt="hazard" className="detail-photo" />}
            </div>
          )}
        </div>
      </section>

      <section className="form-section">
        <div>
          <p className="eyebrow">Create a pin</p>
          <h2>Upload photo, describe hazard, drop the pin</h2>
          <form className="pin-form" onSubmit={handleCreatePin}>
            <label>
              Description
              <textarea
                value={formState.description}
                onChange={(e) => setFormState((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Ex: Sinkhole forming along the bus lane"
              />
            </label>
            <div className="two-col">
              <label>
                Severity
                <select
                  value={formState.severity}
                  onChange={(e) => setFormState((prev) => ({ ...prev, severity: e.target.value as Severity }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </label>
              <label>
                Address
                <input
                  value={formState.address}
                  onChange={(e) => setFormState((prev) => ({ ...prev, address: e.target.value }))}
                  placeholder="Street address or landmark"
                />
              </label>
            </div>
            <div className="coords">
              <label>
                Lat
                <input
                  type="number"
                  value={formState.lat}
                  onChange={(e) => setFormState((prev) => ({ ...prev, lat: parseFloat(e.target.value) }))}
                />
              </label>
              <label>
                Lng
                <input
                  type="number"
                  value={formState.lng}
                  onChange={(e) => setFormState((prev) => ({ ...prev, lng: parseFloat(e.target.value) }))}
                />
              </label>
              <label className="file-input">
                Photo
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {formState.fileName && <span>{formState.fileName}</span>}
              </label>
            </div>
            <div className="form-actions">
              <button type="button" className="ghost" onClick={handleAnalyze}>
                Run Groq analysis
              </button>
              <button type="submit" className="primary" disabled={isSubmittingPin}>
                {isSubmittingPin ? "Submitting…" : "Drop pin (+10 XP)"}
              </button>
            </div>
          </form>
          {aiResult && (
            <div className="ai-panel">
              <div>
                <p className="label">AI route</p>
                <h3>{aiResult.recommendedAgency}</h3>
                <p>{aiResult.summary}</p>
              </div>
              <div className="ai-meta">
                <p>Category: {aiResult.category}</p>
                <p>Severity: {aiResult.severity}</p>
                <p>Confidence: {(aiResult.confidence * 100).toFixed(0)}%</p>
                {aiResult.fraudFlags && (
                  <p className="fraud">
                    Fraud flags: {Object.entries(aiResult.fraudFlags).filter(([, value]) => value).length || 0}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="verification-panel">
          <p className="eyebrow">Community verification</p>
          <h3>Vote to boost trust scores</h3>
          <ul>
            {verificationCandidates.map((candidate) => (
              <li key={candidate.id}>
                <div>
                  <p>{candidate.description}</p>
                  <span>
                    {candidate.location.address} • score {candidate.verificationStats.score}
                  </span>
                </div>
                <div className="vote-buttons">
                  <button
                    onClick={() => handleVerification(candidate.id, "valid")}
                    disabled={verifyingPinId === candidate.id}
                  >
                    Looks real (+10)
                  </button>
                  <button
                    className="ghost"
                    onClick={() => handleVerification(candidate.id, "invalid")}
                    disabled={verifyingPinId === candidate.id}
                  >
                    Not sure
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="confirmation-section">
        <div>
          <p className="eyebrow">Upload confirmations</p>
          <h2>Attach 311 emails, agency letters, or final photos</h2>
          <form onSubmit={handleConfirmationSubmit} className="confirmation-form">
            <label>
              Pin
              <select
                value={confirmationState.pinId}
                onChange={(e) => setConfirmationState((prev) => ({ ...prev, pinId: e.target.value }))}
              >
                <option value="">Choose pin</option>
                {pins.map((pin) => (
                  <option key={pin.id} value={pin.id}>
                    {pin.description.slice(0, 32)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Submission type
              <select
                value={confirmationState.reportType}
                onChange={(e) =>
                  setConfirmationState((prev) => ({ ...prev, reportType: e.target.value as ConfirmationState["reportType"] }))
                }
              >
                <option value="official-report">Official 311 / agency report (+40)</option>
                <option value="confirmation">Resolved confirmation (+80)</option>
              </select>
            </label>
            <label>
              Notes / OCR text
              <textarea
                value={confirmationState.reportText}
                onChange={(e) => setConfirmationState((prev) => ({ ...prev, reportText: e.target.value }))}
                placeholder="Paste the email or confirmation number so OCR can validate it"
              />
            </label>
            <div className="form-actions">
              <button type="submit" className="primary">
                Upload evidence
              </button>
            </div>
          </form>
        </div>
        <div className="leaderboard">
          <p className="eyebrow">Leaderboard</p>
          <h3>Neighbors earning XP</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Points</th>
                <th>Level</th>
                <th>Badges</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr key={entry.userId}>
                  <td>{entry.name}</td>
                  <td>{entry.points}</td>
                  <td>{entry.level}</td>
                  <td>{entry.badges.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="levels-section">
        <p className="eyebrow">Level guide</p>
        <div className="levels-grid">
          {levelCopy.map((level) => (
            <article key={level.name}>
              <h3>{level.name}</h3>
              <p>Reached at {level.points} XP</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;
