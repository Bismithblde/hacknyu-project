import { randomUUID } from "crypto";
import {
  AiAnalysisResult,
  CreatePinPayload,
  Pin,
  PinStatus,
  VerificationPayload,
} from "../types";
import { store } from "./dataStore";
import { awardPoints } from "./pointsService";

export const getPins = (): Pin[] => store.listPins();

export const getPinById = (id: string): Pin | undefined => store.getPin(id);

export const createPin = (
  payload: CreatePinPayload,
  aiResult?: AiAnalysisResult,
): Pin => {
  const hashedImage = payload.photoUrl ? store.hashString(payload.photoUrl) : undefined;
  const pin: Pin = {
    id: randomUUID(),
    userId: payload.userId,
    description: payload.description,
    severity: aiResult?.severity ?? payload.severity,
    category: aiResult?.category ?? payload.category ?? "other",
    recommendedAgency: aiResult?.recommendedAgency ?? payload.recommendedAgency ?? "311",
    location: payload.location,
    photoUrl: payload.photoUrl,
    status: "open",
    aiConfidence: aiResult?.confidence ?? 0.6,
    createdAt: new Date().toISOString(),
    verificationStats: { upvotes: 0, downvotes: 0, score: 0 },
    hashedImage,
    attachments: [],
  };

  store.savePin(pin);
  awardPoints(payload.userId, "create_pin");
  return pin;
};

export const markPinStatus = (pinId: string, status: PinStatus): Pin => {
  const existing = store.getPin(pinId);
  if (!existing) {
    throw new Error("Pin not found");
  }
  existing.status = status;
  store.savePin(existing);
  return existing;
};

export const markResolved = (pinId: string, userId: string): Pin => {
  const updated = markPinStatus(pinId, "resolved");
  awardPoints(userId, "mark_resolved");
  return updated;
};

export const recordVerification = (payload: VerificationPayload) => {
  const pin = store.getPin(payload.pinId);
  if (!pin) {
    throw new Error("Pin not found");
  }

  const voteValue = payload.vote === "valid" ? 1 : -1;
  pin.verificationStats.upvotes += voteValue > 0 ? 1 : 0;
  pin.verificationStats.downvotes += voteValue < 0 ? 1 : 0;
  pin.verificationStats.score = pin.verificationStats.upvotes - pin.verificationStats.downvotes;
  pin.lastVerifiedAt = new Date().toISOString();
  store.addVerification({
    id: randomUUID(),
    pinId: payload.pinId,
    userId: payload.userId,
    vote: payload.vote,
    comment: payload.comment,
    createdAt: pin.lastVerifiedAt,
  });

  store.savePin(pin);
  awardPoints(payload.userId, "verify_pin");
  return pin;
};
