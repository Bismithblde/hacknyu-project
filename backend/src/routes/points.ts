import { Router } from "express";
import { awardPointsHandler, listPointRules } from "../controllers/pointsController";

const router = Router();

router.get("/rules", listPointRules);
router.post("/", awardPointsHandler);

export default router;
