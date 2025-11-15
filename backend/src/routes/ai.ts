import { Router } from "express";
import { analyzeHazardHandler } from "../controllers/aiController";

const router = Router();

router.post("/analyze", analyzeHazardHandler);

export default router;
