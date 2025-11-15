import { Request, Response } from "express";
import { getPublicDataset } from "../services/datasetService";
import { ApiResponse, DatasetRecord } from "../types";

export const exportDataset = (_req: Request, res: Response<ApiResponse<DatasetRecord[]>>) => {
  const data = getPublicDataset();
  res.json({ success: true, data, meta: { recordCount: data.length } });
};
