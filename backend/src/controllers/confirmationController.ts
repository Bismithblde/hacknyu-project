import { Request, Response } from "express";
import { listConfirmations, submitConfirmation } from "../services/confirmationService";
import { ApiResponse, ReportConfirmation } from "../types";

export const createConfirmation = (
  req: Request,
  res: Response<ApiResponse<ReportConfirmation>>,
) => {
  const { userId, pinId, reportType } = req.body;
  if (!userId || !pinId || !reportType) {
    return res.status(400).json({ success: false, message: "Missing confirmation fields" });
  }

  const confirmation = submitConfirmation(req.body);
  res.status(201).json({ success: true, data: confirmation });
};

export const listConfirmationHandler = (req: Request, res: Response<ApiResponse<ReportConfirmation[]>>) => {
  const confirmations = listConfirmations(req.query.pinId as string | undefined);
  res.json({ success: true, data: confirmations });
};
