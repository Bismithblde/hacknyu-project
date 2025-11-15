import { AiAnalysisResult, HazardCategory, Severity } from "../types";
import { store } from "./dataStore";

const CATEGORY_MAPPINGS = [
  { keyword: "pothole", category: "pothole", agency: "DOT Street Maintenance" },
  { keyword: "flood", category: "flooding", agency: "DEP Sewer" },
  { keyword: "drain", category: "flooding", agency: "DEP Sewer" },
  { keyword: "streetlight", category: "streetlight", agency: "DOT Lighting" },
  { keyword: "trash", category: "sanitation", agency: "DSNY" },
  { keyword: "graffiti", category: "sanitation", agency: "DSNY" },
  { keyword: "scaffolding", category: "infrastructure", agency: "DOB" },
];

const severityHeuristics = [
  { keyword: "massive", severity: "critical" },
  { keyword: "giant", severity: "high" },
  { keyword: "urgent", severity: "high" },
  { keyword: "minor", severity: "low" },
];

export const analyzeHazard = (description: string, photoUrl?: string): AiAnalysisResult => {
  const normalized = description.toLowerCase();
  const mapping = CATEGORY_MAPPINGS.find((item) => normalized.includes(item.keyword));
  const severityMatch = severityHeuristics.find((item) => normalized.includes(item.keyword));

  const category = (mapping?.category ?? "other") as HazardCategory;
  const recommendedAgency = mapping?.agency ?? "311 Triage";
  const severity = (severityMatch?.severity ?? (normalized.includes("flood") ? "high" : "medium")) as Severity;

  const baseConfidence = mapping ? 0.82 : 0.65;
  const summary = `Detected ${category} with ${severity} severity. Routing to ${recommendedAgency}.`;

  const hash = photoUrl ? store.hashString(photoUrl) : undefined;
  const duplicateImage = hash
    ? store
        .listPins()
        .some((pin) => pin.hashedImage && pin.hashedImage === hash)
    : false;

  const fraudFlags = {
    duplicateImage,
    isLikelyFake: normalized.includes("ai generated"),
    missingHazard: normalized.length < 12,
  };

  return {
    category,
    severity,
    recommendedAgency,
    confidence: duplicateImage ? baseConfidence - 0.2 : baseConfidence,
    summary,
    fraudFlags,
  };
};
