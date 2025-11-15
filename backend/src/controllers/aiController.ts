import { Request, Response } from "express";
import { analyzeHazard } from "../services/aiService";
import { AiAnalysisResult, ApiResponse } from "../types";

export const analyzeHazardHandler = (
  req: Request,
  res: Response<ApiResponse<AiAnalysisResult>>,
) => {
  const { description, photoUrl } = req.body;
  if (!description) {
    return res.status(400).json({ success: false, message: "description is required" });
  }

  const ai = analyzeHazard(description, photoUrl);
  res.json({ success: true, data: ai });
};
