import { Request, Response } from "express";
import { recordVerification } from "../services/pinService";
import { ApiResponse, Pin } from "../types";
import { isValidId, isValidVote, isValidString } from "../utils/validation";

export const submitVerification = (req: Request, res: Response<ApiResponse<Pin>>) => {
  const { userId, pinId, vote, comment } = req.body;

  // Validate required fields
  if (!isValidId(userId)) {
    return res.status(400).json({ success: false, message: "Invalid or missing userId" });
  }
  if (!isValidId(pinId)) {
    return res.status(400).json({ success: false, message: "Invalid or missing pinId" });
  }
  if (!isValidVote(vote)) {
    return res.status(400).json({
      success: false,
      message: "Invalid vote. Must be 'valid' or 'invalid'",
    });
  }
  if (comment !== undefined && !isValidString(comment)) {
    return res.status(400).json({ success: false, message: "Invalid comment format" });
  }

  try {
    const pin = recordVerification({ userId, pinId, vote, comment });
    res.json({ success: true, data: pin });
  } catch (error) {
    const errorMessage = (error as Error).message;
    if (errorMessage === "Pin not found") {
      return res.status(404).json({ success: false, message: errorMessage });
    }
    if (errorMessage === "User has already voted on this pin") {
      return res.status(409).json({ success: false, message: errorMessage });
    }
    res.status(400).json({ success: false, message: errorMessage });
  }
};
