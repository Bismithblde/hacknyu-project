import {
  Severity,
  PinStatus,
  HazardCategory,
  ReportType,
  Location,
  PointsAction,
} from "../types";

/**
 * Validates latitude coordinate
 * @param lat - Latitude value
 * @returns true if valid, false otherwise
 */
export function isValidLatitude(lat: unknown): lat is number {
  return typeof lat === "number" && !isNaN(lat) && lat >= -90 && lat <= 90;
}

/**
 * Validates longitude coordinate
 * @param lng - Longitude value
 * @returns true if valid, false otherwise
 */
export function isValidLongitude(lng: unknown): lng is number {
  return typeof lng === "number" && !isNaN(lng) && lng >= -180 && lng <= 180;
}

/**
 * Validates a Location object
 * @param location - Location object to validate
 * @returns true if valid, false otherwise
 */
export function isValidLocation(location: unknown): location is Location {
  if (!location || typeof location !== "object") {
    return false;
  }
  const loc = location as Record<string, unknown>;
  return (
    isValidLatitude(loc.lat) &&
    isValidLongitude(loc.lng) &&
    typeof loc.address === "string" &&
    loc.address.trim().length > 0
  );
}

/**
 * Validates Severity enum
 * @param severity - Severity value to validate
 * @returns true if valid, false otherwise
 */
export function isValidSeverity(severity: unknown): severity is Severity {
  return (
    typeof severity === "string" &&
    ["low", "medium", "high", "critical"].includes(severity)
  );
}

/**
 * Validates PinStatus enum
 * @param status - Status value to validate
 * @returns true if valid, false otherwise
 */
export function isValidPinStatus(status: unknown): status is PinStatus {
  return (
    typeof status === "string" && ["open", "escalated", "resolved"].includes(status)
  );
}

/**
 * Validates HazardCategory enum
 * @param category - Category value to validate
 * @returns true if valid, false otherwise
 */
export function isValidHazardCategory(category: unknown): category is HazardCategory {
  return (
    typeof category === "string" &&
    [
      "pothole",
      "flooding",
      "streetlight",
      "sanitation",
      "infrastructure",
      "other",
    ].includes(category)
  );
}

/**
 * Validates ReportType enum
 * @param reportType - ReportType value to validate
 * @returns true if valid, false otherwise
 */
export function isValidReportType(reportType: unknown): reportType is ReportType {
  return (
    typeof reportType === "string" &&
    ["official-report", "confirmation"].includes(reportType)
  );
}

/**
 * Validates vote type for verifications
 * @param vote - Vote value to validate
 * @returns true if valid, false otherwise
 */
export function isValidVote(vote: unknown): vote is "valid" | "invalid" {
  return typeof vote === "string" && ["valid", "invalid"].includes(vote);
}

/**
 * Validates PointsAction enum
 * @param action - Action value to validate
 * @returns true if valid, false otherwise
 */
export function isValidPointsAction(action: unknown): action is PointsAction {
  return (
    typeof action === "string" &&
    [
      "create_pin",
      "verify_pin",
      "submit_report",
      "upload_confirmation",
      "mark_resolved",
    ].includes(action)
  );
}

/**
 * Validates that a value is a non-empty string
 * @param value - Value to validate
 * @returns true if valid, false otherwise
 */
export function isValidString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates that a value is a valid UUID-like string (basic check)
 * @param value - Value to validate
 * @returns true if valid, false otherwise
 */
export function isValidId(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validates that a value is a valid URL (basic check)
 * @param url - URL to validate
 * @returns true if valid, false otherwise
 */
export function isValidUrl(url: unknown): url is string {
  if (typeof url !== "string") {
    return false;
  }
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validates that a value is an optional valid URL
 * @param url - URL to validate
 * @returns true if valid or undefined, false otherwise
 */
export function isValidOptionalUrl(url: unknown): url is string | undefined {
  return url === undefined || isValidUrl(url);
}

/**
 * Validates email format (basic check)
 * @param email - Email to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: unknown): email is string {
  if (typeof email !== "string") {
    return false;
  }
  // Basic email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

