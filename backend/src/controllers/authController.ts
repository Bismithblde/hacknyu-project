import { Response } from "express";
import { AuthRequest, ApiResponse } from "../types";
import { authService } from "../services/authService";

/**
 * Sign up a new user
 * POST /api/v1/auth/signup
 * Public endpoint
 */
export const signUp = async (
  req: AuthRequest,
  res: Response<ApiResponse<any>>
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const authResponse = await authService.signUp({
      email,
      password,
      data: name ? { name } : undefined,
    });

    res.status(201).json({
      success: true,
      data: {
        access_token: authResponse.access_token,
        token_type: authResponse.token_type,
        expires_in: authResponse.expires_in,
        refresh_token: authResponse.refresh_token,
        user: {
          id: authResponse.user.id,
          email: authResponse.user.email,
        },
      },
      message: "User created successfully",
    });
  } catch (error) {
    console.error("Error signing up:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to sign up";
    
    // Check if it's an email confirmation error
    if (errorMessage.includes("check your email")) {
      res.status(201).json({
        success: true,
        message: errorMessage,
        data: {
          requiresEmailConfirmation: true,
        },
      });
      return;
    }
    
    res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
};

/**
 * Sign in an existing user
 * POST /api/v1/auth/signin
 * Public endpoint
 */
export const signIn = async (
  req: AuthRequest,
  res: Response<ApiResponse<any>>
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
      return;
    }

    const authResponse = await authService.signIn({
      email,
      password,
    });

    res.status(200).json({
      success: true,
      data: {
        access_token: authResponse.access_token,
        token_type: authResponse.token_type,
        expires_in: authResponse.expires_in,
        refresh_token: authResponse.refresh_token,
        user: {
          id: authResponse.user.id,
          email: authResponse.user.email,
        },
      },
      message: "Signed in successfully",
    });
  } catch (error) {
    console.error("Error signing in:", error);
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to sign in",
    });
  }
};

/**
 * Sign out the current user
 * POST /api/v1/auth/signout
 * Requires authentication
 */
export const signOut = async (
  req: AuthRequest,
  res: Response<ApiResponse<null>>
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7); // Remove 'Bearer ' prefix

    if (token) {
      await authService.signOut(token);
    }

    res.status(200).json({
      success: true,
      message: "Signed out successfully",
    });
  } catch (error) {
    console.error("Error signing out:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to sign out",
    });
  }
};

/**
 * Get current authenticated user
 * GET /api/v1/auth/me
 * Requires authentication
 */
export const getCurrentUser = async (
  req: AuthRequest,
  res: Response<ApiResponse<any>>
): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Missing token",
      });
      return;
    }

    const user = await authService.getCurrentUser(token);

    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name,
        email_verified: user.email_confirmed_at !== null,
        created_at: user.created_at,
        metadata: user.user_metadata,
      },
      message: "User retrieved successfully",
    });
  } catch (error) {
    console.error("Error getting current user:", error);
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to get user",
    });
  }
};

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 * Requires refresh token (not access token)
 */
export const refreshToken = async (
  req: AuthRequest,
  res: Response<ApiResponse<any>>
): Promise<void> => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
      return;
    }

    const authResponse = await authService.refreshToken({ refresh_token });

    res.status(200).json({
      success: true,
      data: {
        access_token: authResponse.access_token,
        token_type: authResponse.token_type,
        expires_in: authResponse.expires_in,
        refresh_token: authResponse.refresh_token,
        user: {
          id: authResponse.user.id,
          email: authResponse.user.email,
        },
      },
      message: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Error refreshing token:", error);
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to refresh token",
    });
  }
};

/**
 * Update user profile
 * PUT /api/v1/auth/profile
 * Requires authentication
 */
export const updateProfile = async (
  req: AuthRequest,
  res: Response<ApiResponse<any>>
): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.substring(7);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Missing token",
      });
      return;
    }

    const { name, ...otherData } = req.body;

    const updatedUser = await authService.updateProfile(token, {
      name,
      ...otherData,
    });

    res.status(200).json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.user_metadata?.name,
        metadata: updatedUser.user_metadata,
      },
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update profile",
    });
  }
};

/**
 * Test endpoint to verify authentication
 * GET /api/v1/auth/test
 * Requires authentication
 */
export const testAuth = async (
  req: AuthRequest,
  res: Response<ApiResponse<{ userId: string; email?: string }>>
): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        userId: req.auth.userId,
        email: req.auth.email,
      },
      message: "Authentication successful!",
    });
  } catch (error) {
    console.error("Error in auth test:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({
      success: false,
      message: `Internal server error: ${errorMessage}`,
    });
  }
};

