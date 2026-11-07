import { Router } from "express";
import { getVehicles, createVehicle, deleteVehicle } from "../controllers/vehicleController.js";

const router = Router();
router.get("/", getVehicles);
router.post("/", createVehicle);
router.delete("/:id", deleteVehicle);
export default router;
