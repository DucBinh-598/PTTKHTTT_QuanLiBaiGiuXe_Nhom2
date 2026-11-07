import { Router } from "express";
import {
  getAreas, createArea, getParkingSessions, checkIn, checkOut
} from "../controllers/parkingController.js";

const router = Router();
router.get("/areas", getAreas);
router.post("/areas", createArea);
router.get("/", getParkingSessions);
router.post("/check-in", checkIn);
router.put("/check-out/:id", checkOut);
export default router;
