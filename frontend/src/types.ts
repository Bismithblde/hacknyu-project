export type Severity = "low" | "medium" | "high" | "critical";
export type PinStatus = "open" | "escalated" | "resolved";

export interface Location {
  lat: number;
  lng: number;
  address: string;
}

export interface VerificationStats {
  upvotes: number;
  downvotes: number;
  score: number;
}

export interface Pin {
  id: string;
  userId: string;
  description: string;
  severity: Severity;
  category: string;
  recommendedAgency: string;
  location: Location;
  status: PinStatus;
  photoUrl?: string;
  aiConfidence: number;
  createdAt: string;
  lastVerifiedAt?: string;
  verificationStats: VerificationStats;
}

export interface DatasetRecord {
  id: string;
  description: string;
  severity: Severity;
  category: string;
  recommendedAgency: string;
  location: Location;
  status: PinStatus;
  verificationScore: number;
  createdAt: string;
}

export interface AiResult {
  category: string;
  severity: Severity;
  recommendedAgency: string;
  confidence: number;
  summary: string;
  fraudFlags?: Record<string, boolean | undefined>;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  points: number;
  level: string;
  badges: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  xp: number;
  trustScore: number;
  level: string;
  badges: string[];
  createdPins: number;
  verifiedPins: number;
  submittedReports: number;
  resolvedPins: number;
}
