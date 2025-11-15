import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {
  signUp,
  signIn,
  signOut,
  getCurrentUser,
  refreshToken,
  updateProfile,
  testAuth,
} from "../controllers/authController";

const router = Router();

// Public routes (no authentication required)
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/refresh", refreshToken); // Uses refresh_token in body, not access_token in header

// Protected routes (require authentication via access_token)
router.use(authenticate); // All routes below require authentication
router.get("/me", getCurrentUser);
router.post("/signout", signOut);
router.put("/profile", updateProfile);
router.get("/test", testAuth);

// Debug: Log auth routes
console.log("✅ Auth routes registered:");
console.log("  Public:");
console.log("    - POST /api/v1/auth/signup");
console.log("    - POST /api/v1/auth/signin");
console.log("    - POST /api/v1/auth/refresh");
console.log("  Protected:");
console.log("    - GET /api/v1/auth/me");
console.log("    - POST /api/v1/auth/signout");
console.log("    - PUT /api/v1/auth/profile");
console.log("    - GET /api/v1/auth/test");

export default router;

