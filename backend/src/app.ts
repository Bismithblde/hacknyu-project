import express, { Express } from "express";
import cors from "cors";
import routes from "./routes";

const app: Express = express();

// Middleware
// CORS configuration - allow requests from frontend development server
app.use(cors({
  origin: process.env.FRONTEND_URL || [
    "http://localhost:5173", // Vite default port
    "http://localhost:3000",  // Common React dev port
    "http://localhost:5174",  // Alternative Vite port
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/v1", routes);

// Debug: Test route
app.get("/api/v1/test-route", (_req, res) => {
  res.json({ message: "Test route works!" });
});

// Root route
app.get("/", (_req, res) => {
  res.json({
    message: "Welcome to the API",
    version: "1.0.0",
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;
