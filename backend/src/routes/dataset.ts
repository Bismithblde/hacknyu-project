import { Router } from "express";
import { exportDataset } from "../controllers/datasetController";

const router = Router();

router.get("/", exportDataset);

export default router;
