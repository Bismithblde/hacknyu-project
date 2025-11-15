import { DatasetRecord } from "../types";
import { store } from "./dataStore";

export const getPublicDataset = (): DatasetRecord[] => {
  return store.listPins().map((pin) => ({
    id: pin.id,
    description: pin.description,
    severity: pin.severity,
    category: pin.category,
    recommendedAgency: pin.recommendedAgency,
    location: pin.location,
    status: pin.status,
    verificationScore: pin.verificationStats.score,
    createdAt: pin.createdAt,
  }));
};
