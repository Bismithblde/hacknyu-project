import { Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';
import { AuthRequest } from '../types';

// Initialize Supabase client
const supabase = createClient(config.supabase.url, config.supabase.anonKey);

/**
 * Middleware to verify Supabase JWT token from Authorization header
 * Validates: Authorization: Bearer <token>
 * On success: attaches decoded user info to req.auth
 * On failure: returns 401 Unauthorized
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Missing or invalid Authorization header. Expected: Bearer <token>',
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Missing authentication token',
      });
      return;
    }

    // Verify JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
        error: error?.message,
      });
      return;
    }

    // Attach user info to request object
    req.auth = {
      userId: user.id,
      email: user.email,
      ...user,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

