import { randomUUID } from "crypto";
import { ConfirmationPayload, ReportConfirmation } from "../types";
import { store } from "./dataStore";
import { awardPoints } from "./pointsService";

const containsAgencyMarker = (text?: string) => {
  if (!text) return false;
  const normalized = text.toLowerCase();
  return normalized.includes("311") || normalized.includes("case#") || normalized.includes("agency");
};

export const submitConfirmation = (payload: ConfirmationPayload): ReportConfirmation => {
  const confirmation: ReportConfirmation = {
    id: randomUUID(),
    pinId: payload.pinId,
    userId: payload.userId,
    fileUrl: payload.fileUrl,
    extractedText: payload.reportText,
    isValid: containsAgencyMarker(payload.reportText),
    reportType: payload.reportType,
    createdAt: new Date().toISOString(),
  };

  store.addConfirmation(confirmation);

  const action = payload.reportType === "official-report" ? "submit_report" : "upload_confirmation";
  awardPoints(payload.userId, action);

  return confirmation;
};

export const listConfirmations = (pinId?: string) => store.listConfirmations(pinId);
