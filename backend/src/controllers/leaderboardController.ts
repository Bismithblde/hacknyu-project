import { Request, Response } from "express";
import { getLeaderboard } from "../services/userService";
import { ApiResponse, LeaderboardEntry } from "../types";

export const listLeaderboard = (
  _req: Request,
  res: Response<ApiResponse<LeaderboardEntry[]>>,
) => {
  try {
    const leaderboard = getLeaderboard();
    res.json({ success: true, data: leaderboard });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch leaderboard",
    });
  }
};
