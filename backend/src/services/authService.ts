import { createClient } from "@supabase/supabase-js";
import { config } from "../config/env";

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

export interface SignUpData {
  email: string;
  password: string;
  data?: {
    name?: string;
    [key: string]: any;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export interface RefreshTokenData {
  refresh_token: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: {
    id: string;
    email?: string;
    [key: string]: any;
  };
}

export interface UserProfile {
  name?: string;
  [key: string]: any;
}

export const authService = {
  /**
   * Sign up a new user with Supabase
   */
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: data.data || {},
        emailRedirectTo: undefined, // Let Supabase handle redirect
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.user) {
      throw new Error("Failed to create user");
    }

    // If email confirmation is required, session might be null
    // In that case, we still return user info but indicate email confirmation is needed
    if (!authData.session) {
      // User created but needs email confirmation
      throw new Error(
        "User created successfully. Please check your email to confirm your account before signing in."
      );
    }

    return {
      access_token: authData.session.access_token,
      token_type: authData.session.token_type,
      expires_in: authData.session.expires_in || 3600,
      refresh_token: authData.session.refresh_token || "",
      user: {
        ...authData.user,
        id: authData.user.id,
        email: authData.user.email,
      },
    };
  },

  /**
   * Sign in an existing user with Supabase
   */
  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.session || !authData.user) {
      throw new Error("Failed to create user session");
    }

    return {
      access_token: authData.session.access_token,
      token_type: authData.session.token_type,
      expires_in: authData.session.expires_in || 3600,
      refresh_token: authData.session.refresh_token || "",
      user: {
        ...authData.user,
        id: authData.user.id,
        email: authData.user.email,
      },
    };
  },

  /**
   * Get current user info
   */
  getCurrentUser: async (token: string): Promise<any> => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      throw new Error(error.message);
    }

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (data: RefreshTokenData): Promise<AuthResponse> => {
    const { data: authData, error } = await supabase.auth.refreshSession({
      refresh_token: data.refresh_token,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!authData.session || !authData.user) {
      throw new Error("Failed to refresh session");
    }

    return {
      access_token: authData.session.access_token,
      token_type: authData.session.token_type,
      expires_in: authData.session.expires_in || 3600,
      refresh_token: authData.session.refresh_token || "",
      user: {
        ...authData.user,
        id: authData.user.id,
        email: authData.user.email,
      },
    };
  },

  /**
   * Update user profile/metadata
   */
  updateProfile: async (token: string, profile: UserProfile): Promise<any> => {
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError || !user) {
      throw new Error("Invalid token");
    }

    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        ...profile,
      },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  },

  /**
   * Delete user account
   */
  deleteAccount: async (token: string): Promise<void> => {
    const {
      data: { user },
      error: getUserError,
    } = await supabase.auth.getUser(token);

    if (getUserError || !user) {
      throw new Error("Invalid token");
    }

    // Note: Supabase doesn't have a direct delete user method via admin API
    // You would need to use the Supabase Admin API or handle this differently
    // For now, we'll just sign them out
    await supabase.auth.signOut();
    
    // In production, you'd want to call Supabase Admin API to delete the user
    // This requires service_role key, not anon key
    throw new Error("Account deletion requires admin API. User signed out.");
  },

  /**
   * Sign out the current user
   */
  signOut: async (token: string): Promise<void> => {
    // Set the session using the token
    const { error } = await supabase.auth.setSession({
      access_token: token,
      refresh_token: "",
    });

    if (error) {
      throw new Error(error.message);
    }

    await supabase.auth.signOut();
  },
};

