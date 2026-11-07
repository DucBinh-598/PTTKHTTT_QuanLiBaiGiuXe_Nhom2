import { Router } from "express";
import { chatAI } from "../controllers/aiController.js";

const router = Router();
router.post("/chat", chatAI);
export default router;
