import OpenAI from "openai";
import { prisma } from "../config/database.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function askParkingAI(question) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Chưa cấu hình OPENAI_API_KEY trong backend/.env");
  }

  const [totalVehicles, totalUsers, parkingNow, areas, vehicleTypes] = await Promise.all([
    prisma.vehicle.count(),
    prisma.user.count(),
    prisma.parkingSession.count({ where: { status: "PARKING" } }),
    prisma.parkingArea.findMany({ select: { id: true, name: true, capacity: true } }),
    prisma.vehicle.groupBy({ by: ["type"], _count: { id: true } })
  ]);

  const areaStats = await Promise.all(areas.map(async (area) => {
    const occupied = await prisma.parkingSession.count({
      where: { areaId: area.id, status: "PARKING" }
    });
    return {
      name: area.name,
      capacity: area.capacity,
      occupied,
      available: Math.max(area.capacity - occupied, 0)
    };
  }));

  const totalCapacity = areas.reduce((sum, area) => sum + area.capacity, 0);
  const context = {
    totalVehicles,
    totalUsers,
    parkingNow,
    totalCapacity,
    availableSlots: Math.max(totalCapacity - parkingNow, 0),
    vehicleTypes,
    areas: areaStats
  };

  const response = await openai.responses.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    instructions: [
      "Bạn là trợ lý AI cho hệ thống quản lý bãi giữ xe trường học.",
      "Trả lời bằng tiếng Việt, rõ ràng, dễ hiểu.",
      "Chỉ sử dụng số liệu trong dữ liệu được cung cấp; không tự bịa dữ liệu.",
      "Nếu dữ liệu không đủ để kết luận, hãy nói rõ.",
      "Không yêu cầu hoặc tiết lộ thông tin cá nhân của học sinh.",
      "Bạn chỉ tư vấn; không tự thực hiện thao tác gửi xe, lấy xe hoặc sửa dữ liệu."
    ].join("\n"),
    input: `DỮ LIỆU TỔNG HỢP BÃI XE:\n${JSON.stringify(context, null, 2)}\n\nCÂU HỎI:\n${question}`
  });

  return response.output_text;
}
