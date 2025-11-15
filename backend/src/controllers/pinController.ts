import { Request, Response } from "express";
import { analyzeHazard } from "../services/aiService";
import {
  createPin,
  getPinById,
  getPins,
  markResolved,
} from "../services/pinService";
import {
  ApiResponse,
  Pin,
  PinStatus,
  Severity,
  HazardCategory,
} from "../types";
import {
  isValidId,
  isValidLocation,
  isValidSeverity,
  isValidString,
  isValidOptionalUrl,
} from "../utils/validation";

interface ListPinsQuery {
  status?: PinStatus;
  severity?: Severity;
  category?: HazardCategory;
  userId?: string;
  sortBy?: "createdAt" | "severity" | "verificationScore" | "aiConfidence";
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}

export const listPins = (
  req: Request<{}, {}, {}, ListPinsQuery>,
  res: Response<ApiResponse<Pin[]>>
) => {
  const {
    status,
    severity,
    category,
    userId,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = "1",
    limit = "20",
  } = req.query;

  // Parse pagination parameters
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;

  // Get all pins
  let pins = getPins();

  // Apply filters
  if (status) {
    pins = pins.filter((pin) => pin.status === status);
  }
  if (severity) {
    pins = pins.filter((pin) => pin.severity === severity);
  }
  if (category) {
    pins = pins.filter((pin) => pin.category === category);
  }
  if (userId) {
    pins = pins.filter((pin) => pin.userId === userId);
  }

  // Apply sorting
  pins.sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortBy) {
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "severity":
        const severityOrder: Record<Severity, number> = {
          low: 1,
          medium: 2,
          high: 3,
          critical: 4,
        };
        aValue = severityOrder[a.severity];
        bValue = severityOrder[b.severity];
        break;
      case "verificationScore":
        aValue = a.verificationStats.score;
        bValue = b.verificationStats.score;
        break;
      case "aiConfidence":
        aValue = a.aiConfidence;
        bValue = b.aiConfidence;
        break;
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
    return sortOrder === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  // Apply pagination
  const total = pins.length;
  const paginatedPins = pins.slice(offset, offset + limitNum);

  res.json({
    success: true,
    data: paginatedPins,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

export const getPin = (req: Request, res: Response<ApiResponse<Pin>>) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid pin ID" });
  }

  const pin = getPinById(id);
  if (!pin) {
    return res.status(404).json({ success: false, message: "Pin not found" });
  }
  res.json({ success: true, data: pin });
};

export const createPinHandler = async (
  req: Request,
  res: Response<ApiResponse<Pin>>
) => {
  const { userId, description, severity, location, photoUrl } = req.body;

  // Validate required fields
  if (!isValidId(userId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing userId" });
  }
  if (!isValidString(description)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing description" });
  }
  if (!isValidSeverity(severity)) {
    return res.status(400).json({
      success: false,
      message: "Invalid severity. Must be one of: low, medium, high, critical",
    });
  }
  if (!isValidLocation(location)) {
    return res.status(400).json({
      success: false,
      message:
        "Invalid location. Must be an object with lat (number, -90 to 90), lng (number, -180 to 180), and address (non-empty string)",
    });
  }
  if (photoUrl !== undefined && !isValidOptionalUrl(photoUrl)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid photoUrl format" });
  }

  const aiResult = analyzeHazard(description, photoUrl);
  const pin = createPin(
    { userId, description, severity, location, photoUrl },
    aiResult
  );
  res.status(201).json({ success: true, data: pin, meta: { ai: aiResult } });
};

export const resolvePinHandler = (
  req: Request,
  res: Response<ApiResponse<Pin>>
) => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!isValidId(id)) {
    return res.status(400).json({ success: false, message: "Invalid pin ID" });
  }
  if (!isValidId(userId)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing userId" });
  }

  try {
    const pin = markResolved(id, userId);
    res.json({ success: true, data: pin });
  } catch (error) {
    res.status(404).json({ success: false, message: (error as Error).message });
  }
};
