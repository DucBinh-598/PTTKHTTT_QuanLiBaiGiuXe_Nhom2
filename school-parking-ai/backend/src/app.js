import express from "express";
import cors from "cors";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import parkingRoutes from "./routes/parkingRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173"
}));
app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "School Parking AI API is running." });
});

app.use("/api/vehicles", vehicleRoutes);
app.use("/api/parking", parkingRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/ai", aiRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "API không tồn tại." });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ message: "Đã xảy ra lỗi máy chủ." });
});

export default app;
