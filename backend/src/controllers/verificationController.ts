import { Request, Response } from "express";
import { recordVerification } from "../services/pinService";
import { ApiResponse, Pin } from "../types";

export const submitVerification = (req: Request, res: Response<ApiResponse<Pin>>) => {
  const { userId, pinId, vote, comment } = req.body;
  if (!userId || !pinId || !vote) {
    return res.status(400).json({ success: false, message: "Missing verification fields" });
  }

  try {
    const pin = recordVerification({ userId, pinId, vote, comment });
    res.json({ success: true, data: pin });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
};
