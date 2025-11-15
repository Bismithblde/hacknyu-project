/**
 * Frontend Type Definitions
 * 
 * Shared types between frontend and API client
 */

// Severity levels for hazards
export type Severity = "low" | "medium" | "high" | "critical";

// Pin/Hazard status
export type PinStatus = "open" | "escalated" | "resolved";

// Hazard categories
export type HazardCategory =
  | "pothole"
  | "flooding"
  | "streetlight"
  | "sanitation"
  | "infrastructure"
  | "other";

// Location information
export interface Location {
  lat: number;
  lng: number;
  address: string;
}

// Verification statistics
export interface VerificationStats {
  upvotes: number;
  downvotes: number;
  score: number;
}

// Pin/Hazard Report
export interface Pin {
  id: string;
  userId: string;
  description: string;
  severity: Severity;
  category: HazardCategory;
  recommendedAgency: string;
  location: Location;
  photoUrl?: string;
  status: PinStatus;
  aiConfidence: number;
  createdAt: string;
  lastVerifiedAt?: string;
  verificationStats: VerificationStats;
  hashedImage?: string;
  attachments?: string[];
}

// User Profile
export interface User {
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

// Verification Vote
export interface VerificationVote {
  id: string;
  pinId: string;
  userId: string;
  vote: "valid" | "invalid";
  comment?: string;
  createdAt: string;
}

// Report types
export type ReportType = "official-report" | "confirmation";

// Report Confirmation
export interface ReportConfirmation {
  id: string;
  pinId: string;
  userId: string;
  fileUrl?: string;
  extractedText?: string;
  isValid: boolean;
  reportType: ReportType;
  createdAt: string;
}

// AI Analysis Result
export interface AiAnalysisResult {
  category: HazardCategory;
  severity: Severity;
  recommendedAgency: string;
  confidence: number;
  summary: string;
  fraudFlags: {
    duplicateImage?: boolean;
    isLikelyFake?: boolean;
    missingHazard?: boolean;
  };
}

// Create Pin Payload
export interface CreatePinPayload {
  userId: string;
  description: string;
  severity: Severity;
  location: Location;
  photoUrl?: string;
  category?: HazardCategory;
  recommendedAgency?: string;
}

// Verification Payload
export interface VerificationPayload {
  userId: string;
  pinId: string;
  vote: "valid" | "invalid";
  comment?: string;
}

// Confirmation Payload
export interface ConfirmationPayload {
  userId: string;
  pinId: string;
  fileUrl?: string;
  reportText?: string;
  reportType: ReportType;
}

// Generic API Response
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
}

// Dataset Record
export interface DatasetRecord {
  id: string;
  description: string;
  severity: Severity;
  category: HazardCategory;
  recommendedAgency: string;
  location: Location;
  status: PinStatus;
  verificationScore: number;
  createdAt: string;
}

// Leaderboard Entry
export interface LeaderboardEntry {
  userId: string;
  name: string;
  points: number;
  level: string;
  badges: string[];
}

// Points Action Types
export type PointsAction =
  | "create_pin"
  | "verify_pin"
  | "submit_report"
  | "upload_confirmation"
  | "mark_resolved";

// Points Award
export interface PointsAward {
  action: PointsAction;
  amount: number;
  totalPoints: number;
  level: string;
}
