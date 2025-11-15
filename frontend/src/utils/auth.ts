/**
 * Authentication utility for handling tokens and automatic refresh
 * Prevents tokens from expiring during demos
 */

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const TOKEN_EXPIRY_KEY = "token_expiry";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api/v1";

interface AuthResponse {
  success: boolean;
  message?: string;
  data: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    user: {
      id: string;
      email?: string;
    };
  };
}

/**
 * Store tokens in localStorage
 */
export const storeTokens = (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  
  // Calculate expiry time (current time + expires_in seconds)
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Check if token is expired or about to expire (within 5 minutes)
 */
export const isTokenExpired = (): boolean => {
  const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryTime) return true;
  
  const expiry = parseInt(expiryTime, 10);
  const now = Date.now();
  const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
  
  // Return true if expired or expiring within 5 minutes
  return now >= expiry - fiveMinutes;
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    console.error("No refresh token available");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }

    const data: AuthResponse = await response.json();
    
    if (data.success && data.data) {
      storeTokens(
        data.data.access_token,
        data.data.refresh_token,
        data.data.expires_in
      );
      return data.data.access_token;
    }

    return null;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Clear tokens on refresh failure
    clearTokens();
    return null;
  }
};

/**
 * Get valid access token, refreshing if necessary
 */
export const getValidAccessToken = async (): Promise<string | null> => {
  // If token is expired or about to expire, refresh it
  if (isTokenExpired()) {
    console.log("Token expired or expiring soon, refreshing...");
    const newToken = await refreshAccessToken();
    return newToken;
  }

  return getAccessToken();
};

/**
 * Clear all tokens (logout)
 */
export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
};

/**
 * Make authenticated API request with automatic token refresh
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  // Get valid token (refresh if needed)
  const token = await getValidAccessToken();
  
  if (!token) {
    throw new Error("No valid token available");
  }

  // Add Authorization header
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  let response = await fetch(url, {
    ...options,
    headers,
  });

  // If token expired during request, try refreshing once
  if (response.status === 401) {
    console.log("Got 401, attempting token refresh...");
    const newToken = await refreshAccessToken();
    
    if (newToken) {
      // Retry request with new token
      headers.Authorization = `Bearer ${newToken}`;
      response = await fetch(url, {
        ...options,
        headers,
      });
    }
  }

  return response;
};

/**
 * Sign up a new user
 */
export const signUp = async (
  email: string,
  password: string,
  name?: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, name }),
  });

  const data: AuthResponse = await response.json();

  if (data.success && data.data) {
    storeTokens(
      data.data.access_token,
      data.data.refresh_token,
      data.data.expires_in
    );
  }

  return data;
};

/**
 * Sign in an existing user
 */
export const signIn = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data: AuthResponse = await response.json();

  if (data.success && data.data) {
    storeTokens(
      data.data.access_token,
      data.data.refresh_token,
      data.data.expires_in
    );
  }

  return data;
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  const token = getAccessToken();
  
  if (token) {
    try {
      await authenticatedFetch(`${API_BASE_URL}/auth/signout`, {
        method: "POST",
      });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  clearTokens();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null && !isTokenExpired();
};

