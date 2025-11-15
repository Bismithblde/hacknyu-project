import { useState, useEffect } from "react";
import {
  signUp as authSignUp,
  signIn as authSignIn,
  signOut as authSignOut,
  getValidAccessToken,
  isAuthenticated,
  clearTokens,
} from "../utils/auth";

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuth: boolean;
}

/**
 * React hook for authentication
 * Automatically handles token refresh
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const token = await getValidAccessToken();
          if (token) {
            // Fetch user info
            const response = await fetch(
              "http://localhost:4000/api/v1/auth/me",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              if (data.success) {
                setUser(data.data);
              }
            }
          }
        } catch (error) {
          console.error("Error checking auth:", error);
          clearTokens();
        }
      }
      setLoading(false);
    };

    checkAuth();

    // Set up interval to refresh token before it expires (every 50 minutes)
    const refreshInterval = setInterval(async () => {
      if (isAuthenticated()) {
        await getValidAccessToken();
      }
    }, 50 * 60 * 1000); // 50 minutes

    return () => clearInterval(refreshInterval);
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name?: string
  ): Promise<void> => {
    const response = await authSignUp(email, password, name);
    if (response.success && response.data) {
      setUser(response.data.user);
    } else {
      throw new Error(response.message || "Sign up failed");
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    const response = await authSignIn(email, password);
    if (response.success && response.data) {
      setUser(response.data.user);
    } else {
      throw new Error(response.message || "Sign in failed");
    }
  };

  const signOut = async (): Promise<void> => {
    await authSignOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAuth: isAuthenticated(),
  };
};

