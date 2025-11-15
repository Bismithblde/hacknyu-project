import { Router } from "express";
import { createPinHandler, getPin, listPins, resolvePinHandler } from "../controllers/pinController";

const router = Router();

router.get("/", listPins);
router.post("/", createPinHandler);
router.get("/:id", getPin);
router.post("/:id/resolve", resolvePinHandler);

export default router;
