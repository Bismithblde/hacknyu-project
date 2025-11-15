import { Request, Response } from "express";
import { analyzeHazard } from "../services/aiService";
import { createPin, getPinById, getPins, markResolved } from "../services/pinService";
import { ApiResponse, Pin } from "../types";

export const listPins = (_req: Request, res: Response<ApiResponse<Pin[]>>) => {
  const pins = getPins();
  res.json({ success: true, data: pins });
};

export const getPin = (req: Request, res: Response<ApiResponse<Pin>>) => {
  const pin = getPinById(req.params.id);
  if (!pin) {
    return res.status(404).json({ success: false, message: "Pin not found" });
  }
  res.json({ success: true, data: pin });
};

export const createPinHandler = async (
  req: Request,
  res: Response<ApiResponse<Pin>>,
) => {
  const { userId, description, severity, location, photoUrl } = req.body;
  if (!userId || !description || !severity || !location) {
    return res.status(400).json({ success: false, message: "Missing pin fields" });
  }

  const aiResult = analyzeHazard(description, photoUrl);
  const pin = createPin({ userId, description, severity, location, photoUrl }, aiResult);
  res.status(201).json({ success: true, data: pin, meta: { ai: aiResult } });
};

export const resolvePinHandler = (req: Request, res: Response<ApiResponse<Pin>>) => {
  const { id } = req.params;
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: "userId is required" });
  }

  try {
    const pin = markResolved(id, userId);
    res.json({ success: true, data: pin });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
};
