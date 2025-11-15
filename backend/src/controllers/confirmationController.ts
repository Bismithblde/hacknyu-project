import { Request, Response } from "express";
import { listConfirmations, submitConfirmation } from "../services/confirmationService";
import { ApiResponse, ReportConfirmation } from "../types";
import {
  isValidId,
  isValidReportType,
  isValidOptionalUrl,
  isValidString,
} from "../utils/validation";

export const createConfirmation = (
  req: Request,
  res: Response<ApiResponse<ReportConfirmation>>,
) => {
  const { userId, pinId, reportType, fileUrl, reportText } = req.body;

  // Validate required fields
  if (!isValidId(userId)) {
    return res.status(400).json({ success: false, message: "Invalid or missing userId" });
  }
  if (!isValidId(pinId)) {
    return res.status(400).json({ success: false, message: "Invalid or missing pinId" });
  }
  if (!isValidReportType(reportType)) {
    return res.status(400).json({
      success: false,
      message: "Invalid reportType. Must be 'official-report' or 'confirmation'",
    });
  }
  if (fileUrl !== undefined && !isValidOptionalUrl(fileUrl)) {
    return res.status(400).json({ success: false, message: "Invalid fileUrl format" });
  }
  if (reportText !== undefined && !isValidString(reportText)) {
    return res.status(400).json({ success: false, message: "Invalid reportText format" });
  }

  const confirmation = submitConfirmation(req.body);
  res.status(201).json({ success: true, data: confirmation });
};

export const listConfirmationHandler = (
  req: Request,
  res: Response<ApiResponse<ReportConfirmation[]>>,
) => {
  const pinId = req.query.pinId as string | undefined;
  if (pinId !== undefined && !isValidId(pinId)) {
    return res.status(400).json({ success: false, message: "Invalid pinId query parameter" });
  }

  const confirmations = listConfirmations(pinId);
  res.json({ success: true, data: confirmations });
};
