/**
 * API Client Utility
 * 
 * Centralized API client for all backend communication.
 * Handles authentication, error handling, and request/response formatting.
 */

import type {
  Pin,
  User,
  VerificationVote,
  ReportConfirmation,
  AiAnalysisResult,
  CreatePinPayload,
  VerificationPayload,
  ConfirmationPayload,
  ApiResponse,
  DatasetRecord,
  LeaderboardEntry,
  PointsAward,
  PointsAction,
} from "@/types/api";

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";
const DEFAULT_TIMEOUT = 10000; // 10 seconds

// Request/Response interceptors
interface RequestOptions extends RequestInit {
  timeout?: number;
  skipAuth?: boolean;
}

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  statusCode: number;
  data?: unknown;

  constructor(statusCode: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Make a fetch request with timeout and error handling
 */
async function fetchWithTimeout(
  url: string,
  options: RequestOptions = {},
): Promise<Response> {
  const { timeout = DEFAULT_TIMEOUT, skipAuth = false, ...fetchOptions } = options;

  // Add auth token if available and not skipped
  if (!skipAuth) {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  // Set default content type
  if (
    !fetchOptions.headers ||
    typeof fetchOptions.headers === "object" &&
    !("Content-Type" in fetchOptions.headers)
  ) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      "Content-Type": "application/json",
    };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new ApiError(
        408,
        `Request timeout after ${timeout}ms`,
      );
    }
    throw error;
  }
}

/**
 * Handle API response and parse JSON
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  let data: unknown;
  if (isJson) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (data as ApiResponse<unknown>)?.message ||
      `HTTP ${response.status}: ${response.statusText}`;
    throw new ApiError(response.status, errorMessage, data);
  }

  return data as T;
}

/**
 * Generic request handler
 */
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetchWithTimeout(url, options);
    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      500,
      error instanceof Error ? error.message : "Unknown error occurred",
      error,
    );
  }
}

/**
 * Health & Status
 */
export const health = {
  check: () => request<{ status: string; timestamp: string }>("/health"),
};

/**
 * Authentication
 */
export const auth = {
  signup: (email: string, password: string, name: string) =>
    request<{ user: User; token: string }>("/auth/signup", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password, name }),
    }),

  signin: (email: string, password: string) =>
    request<{ user: User; token: string }>("/auth/signin", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ email, password }),
    }),

  refreshToken: (token: string) =>
    request<{ token: string }>("/auth/refresh", {
      method: "POST",
      skipAuth: true,
      body: JSON.stringify({ token }),
    }),

  logout: () =>
    request<{ message: string }>("/auth/logout", {
      method: "POST",
    }),
};

/**
 * Users
 */
export const users = {
  getProfile: (userId: string) =>
    request<User>(`/users/${userId}`),

  updateProfile: (userId: string, updates: Partial<User>) =>
    request<User>(`/users/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  getStats: (userId: string) =>
    request<{
      createdPins: number;
      verifiedPins: number;
      submittedReports: number;
      resolvedPins: number;
    }>(`/users/${userId}/stats`),
};

/**
 * Pins (Hazard Reports)
 */
export const pins = {
  list: (filters?: {
    category?: string;
    severity?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const queryParams = new URLSearchParams(
      filters ? Object.entries(filters).map(([k, v]) => [k, String(v)]) : [],
    );
    return request<Pin[]>(
      `/pins${queryParams.toString() ? `?${queryParams}` : ""}`,
    );
  },

  get: (pinId: string) =>
    request<Pin>(`/pins/${pinId}`),

  create: (payload: CreatePinPayload) =>
    request<Pin>("/pins", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (pinId: string, updates: Partial<Pin>) =>
    request<Pin>(`/pins/${pinId}`, {
      method: "PATCH",
      body: JSON.stringify(updates),
    }),

  delete: (pinId: string) =>
    request<{ message: string }>(`/pins/${pinId}`, {
      method: "DELETE",
    }),
};

/**
 * Verifications
 */
export const verifications = {
  list: (pinId: string) =>
    request<VerificationVote[]>(`/verifications?pinId=${pinId}`),

  submit: (payload: VerificationPayload) =>
    request<VerificationVote>("/verifications", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getStats: (pinId: string) =>
    request<{
      upvotes: number;
      downvotes: number;
      score: number;
    }>(`/verifications/${pinId}/stats`),
};

/**
 * Confirmations
 */
export const confirmations = {
  list: (pinId?: string) =>
    request<ReportConfirmation[]>(
      `/confirmations${pinId ? `?pinId=${pinId}` : ""}`,
    ),

  create: (payload: ConfirmationPayload) =>
    request<ReportConfirmation>("/confirmations", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};

/**
 * AI Analysis
 */
export const ai = {
  analyzeHazard: (description: string, photoUrl?: string) =>
    request<AiAnalysisResult>("/ai/analyze", {
      method: "POST",
      body: JSON.stringify({ description, photoUrl }),
    }),
};

/**
 * Leaderboard
 */
export const leaderboard = {
  list: (limit = 50, offset = 0) =>
    request<LeaderboardEntry[]>(
      `/leaderboard?limit=${limit}&offset=${offset}`,
    ),

  getPosition: (userId: string) =>
    request<LeaderboardEntry & { position: number }>(
      `/leaderboard/${userId}`,
    ),
};

/**
 * Dataset (Public Data Export)
 */
export const dataset = {
  export: () =>
    request<DatasetRecord[]>("/dataset"),

  exportFiltered: (filters?: {
    category?: string;
    severity?: string;
    status?: string;
  }) => {
    const queryParams = new URLSearchParams(
      filters ? Object.entries(filters).map(([k, v]) => [k, String(v)]) : [],
    );
    return request<DatasetRecord[]>(
      `/dataset${queryParams.toString() ? `?${queryParams}` : ""}`,
    );
  },
};

/**
 * Points System
 */
export const points = {
  award: (userId: string, action: PointsAction) =>
    request<PointsAward>("/points/award", {
      method: "POST",
      body: JSON.stringify({ userId, action }),
    }),

  getRules: () =>
    request<Record<PointsAction, number>>("/points/rules"),

  getBalance: (userId: string) =>
    request<{ userId: string; totalPoints: number; level: string }>(
      `/points/${userId}`,
    ),
};

/**
 * Utility: Set auth token
 */
export function setAuthToken(token: string): void {
  localStorage.setItem("authToken", token);
}

/**
 * Utility: Clear auth token
 */
export function clearAuthToken(): void {
  localStorage.removeItem("authToken");
}

/**
 * Utility: Get auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem("authToken");
}

/**
 * Utility: Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

export default {
  health,
  auth,
  users,
  pins,
  verifications,
  confirmations,
  ai,
  leaderboard,
  dataset,
  points,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
  isAuthenticated,
};
