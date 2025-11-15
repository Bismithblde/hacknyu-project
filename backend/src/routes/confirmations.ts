import { Router } from "express";
import { createConfirmation, listConfirmationHandler } from "../controllers/confirmationController";

const router = Router();

router.get("/", listConfirmationHandler);
router.post("/", createConfirmation);

export default router;
