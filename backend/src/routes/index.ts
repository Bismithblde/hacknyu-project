import { Router } from "express";
import healthRouter from "./health";
import usersRouter from "./users";
import authRouter from "./auth";
import pinsRouter from "./pins";
import aiRouter from "./ai";
import verificationsRouter from "./verifications";
import confirmationsRouter from "./confirmations";
import leaderboardRouter from "./leaderboard";
import datasetRouter from "./dataset";
import pointsRouter from "./points";

const router = Router();

router.use("/health", healthRouter);
router.use("/users", usersRouter);
router.use("/auth", authRouter);
router.use("/pins", pinsRouter);
router.use("/ai", aiRouter);
router.use("/verifications", verificationsRouter);
router.use("/confirmations", confirmationsRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/dataset", datasetRouter);
router.use("/points", pointsRouter);

export default router;

