import { Request, Response } from "express";
import { awardPoints, getPointRules } from "../services/pointsService";
import { ApiResponse, PointsAction, PointsAward } from "../types";

export const awardPointsHandler = (
  req: Request,
  res: Response<ApiResponse<PointsAward>>,
) => {
  const { userId, action } = req.body as { userId: string; action: PointsAction };
  if (!userId || !action) {
    return res.status(400).json({ success: false, message: "userId and action required" });
  }

  try {
    const award = awardPoints(userId, action);
    res.json({ success: true, data: award });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
};

export const listPointRules = (_req: Request, res: Response<ApiResponse<Record<string, number>>>) => {
  res.json({ success: true, data: getPointRules() });
};
