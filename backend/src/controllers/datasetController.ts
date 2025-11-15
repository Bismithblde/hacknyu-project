import { Request, Response } from "express";
import { getPublicDataset } from "../services/datasetService";
import { ApiResponse, DatasetRecord } from "../types";

export const exportDataset = (_req: Request, res: Response<ApiResponse<DatasetRecord[]>>) => {
  try {
    const data = getPublicDataset();
    res.json({ success: true, data, meta: { recordCount: data.length } });
  } catch (error) {
    console.error("Error exporting dataset:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export dataset",
    });
  }
};
