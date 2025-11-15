import { Router } from "express";
import { listLeaderboard } from "../controllers/leaderboardController";

const router = Router();

router.get("/", listLeaderboard);

export default router;
