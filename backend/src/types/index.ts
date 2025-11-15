import { Request } from 'express';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

// Auth types
export interface AuthUser {
  userId: string;
  email?: string;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  auth?: AuthUser;
}

