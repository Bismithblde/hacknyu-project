import { Request, Response } from "express";
import { awardPoints, getPointRules } from "../services/pointsService";
import { ApiResponse, PointsAward } from "../types";
import { isValidId, isValidPointsAction } from "../utils/validation";

export const awardPointsHandler = (
  req: Request,
  res: Response<ApiResponse<PointsAward>>,
) => {
  const { userId, action } = req.body;

  // Validate required fields
  if (!isValidId(userId)) {
    return res.status(400).json({ success: false, message: "Invalid or missing userId" });
  }
  if (!isValidPointsAction(action)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid action. Must be one of: create_pin, verify_pin, submit_report, upload_confirmation, mark_resolved",
    });
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
