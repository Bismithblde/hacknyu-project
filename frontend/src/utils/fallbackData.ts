import type { AiResult, LeaderboardEntry, Pin, UserProfile } from "../types";

export const fallbackPins: Pin[] = [
  {
    id: "pin-1",
    userId: "guardian-1",
    description: "Giant pothole spilling into bike lane on Grand St.",
    severity: "high",
    category: "pothole",
    recommendedAgency: "DOT Street Maintenance",
    location: { lat: 40.718, lng: -73.993, address: "Grand St & Chrystie" },
    status: "open",
    photoUrl: "https://placehold.co/400x240/bbdefb/1d4ed8?text=Pothole",
    aiConfidence: 0.79,
    createdAt: new Date().toISOString(),
    verificationStats: { upvotes: 4, downvotes: 0, score: 4 },
  },
  {
    id: "pin-2",
    userId: "guardian-1",
    description: "Storm drain clogged, entire curb flooding when it rains.",
    severity: "medium",
    category: "flooding",
    recommendedAgency: "DEP Sewer",
    location: { lat: 40.705, lng: -73.94, address: "Jackson Ave" },
    status: "open",
    photoUrl: "https://placehold.co/400x240/c7d2fe/3730a3?text=Flood",
    aiConfidence: 0.74,
    createdAt: new Date().toISOString(),
    verificationStats: { upvotes: 3, downvotes: 1, score: 2 },
  },
];

export const fallbackLeaderboard: LeaderboardEntry[] = [
  { userId: "guardian-1", name: "Avery Ranger", points: 240, level: "Guardian", badges: ["Rapid Responder"] },
  { userId: "scout-9", name: "Imani Scout", points: 160, level: "Inspector", badges: ["Top Verifier"] },
  { userId: "scout-12", name: "Leo Scout", points: 120, level: "Ranger", badges: ["Neighborhood Watch"] },
];

export const fallbackProfile: UserProfile = {
  id: "guardian-1",
  name: "Avery Ranger",
  email: "avery@belli.city",
  avatar: "https://placehold.co/96x96/1d4ed8/fff?text=AR",
  points: 240,
  xp: 240,
  trustScore: 82,
  level: "Guardian",
  badges: ["Rapid Responder", "Data Steward"],
  createdPins: 4,
  verifiedPins: 11,
  submittedReports: 3,
  resolvedPins: 2,
};

export const fallbackAiResult: AiResult = {
  category: "pothole",
  severity: "high",
  recommendedAgency: "DOT Street Maintenance",
  confidence: 0.78,
  summary: "Detected pothole hazard and routed to DOT Street Maintenance.",
};
