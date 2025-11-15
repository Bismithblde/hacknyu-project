import { Request, Response } from "express";
import { analyzeHazard } from "../services/aiService";
import { AiAnalysisResult, ApiResponse } from "../types";
import { isValidString, isValidOptionalUrl } from "../utils/validation";

export const analyzeHazardHandler = (
  req: Request,
  res: Response<ApiResponse<AiAnalysisResult>>,
) => {
  const { description, photoUrl } = req.body;
  if (!isValidString(description)) {
    return res.status(400).json({ success: false, message: "Invalid or missing description" });
  }
  if (photoUrl !== undefined && !isValidOptionalUrl(photoUrl)) {
    return res.status(400).json({ success: false, message: "Invalid photoUrl format" });
  }

  const ai = analyzeHazard(description, photoUrl);
  res.json({ success: true, data: ai });
};
