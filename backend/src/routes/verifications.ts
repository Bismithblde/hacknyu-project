import { Router } from "express";
import { submitVerification } from "../controllers/verificationController";

const router = Router();

router.post("/", submitVerification);

export default router;
