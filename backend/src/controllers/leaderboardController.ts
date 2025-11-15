import { Request, Response } from "express";
import { getLeaderboard } from "../services/userService";
import { ApiResponse, LeaderboardEntry } from "../types";

export const listLeaderboard = (
  _req: Request,
  res: Response<ApiResponse<LeaderboardEntry[]>>,
) => {
  const leaderboard = getLeaderboard();
  res.json({ success: true, data: leaderboard });
};
