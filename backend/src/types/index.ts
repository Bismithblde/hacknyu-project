import { Request } from "express";

export type Severity = "low" | "medium" | "high" | "critical";
export type PinStatus = "open" | "escalated" | "resolved";
export type HazardCategory =
  | "pothole"
  | "flooding"
  | "streetlight"
  | "sanitation"
  | "infrastructure"
  | "other";

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

export interface VerificationVote {
  id: string;
  pinId: string;
  userId: string;
  vote: "valid" | "invalid";
  comment?: string;
  createdAt: string;
}

export type ReportType = "official-report" | "confirmation";

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

export interface CreatePinPayload {
  userId: string;
  description: string;
  severity: Severity;
  location: Location;
  photoUrl?: string;
  category?: HazardCategory;
  recommendedAgency?: string;
}

export interface VerificationPayload {
  userId: string;
  pinId: string;
  vote: "valid" | "invalid";
  comment?: string;
}

export interface ConfirmationPayload {
  userId: string;
  pinId: string;
  fileUrl?: string;
  reportText?: string;
  reportType: ReportType;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, unknown>;
}

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

export interface LeaderboardEntry {
  userId: string;
  name: string;
  points: number;
  level: string;
  badges: string[];
}

export type PointsAction =
  | "create_pin"
  | "verify_pin"
  | "submit_report"
  | "upload_confirmation"
  | "mark_resolved";

export interface PointsAward {
  action: PointsAction;
  amount: number;
  totalPoints: number;
  level: string;
}

export interface AuthUser {
  userId: string;
  email?: string;
  [key: string]: unknown;
}

export interface AuthRequest extends Request {
  auth?: AuthUser;
}
