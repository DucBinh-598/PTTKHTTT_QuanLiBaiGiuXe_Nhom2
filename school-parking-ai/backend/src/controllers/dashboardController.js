import { prisma } from "../config/database.js";

export async function getDashboard(req, res) {
  try {
    const [totalVehicles, totalUsers, totalAreas, parkingNow, areas, vehicleTypes] = await Promise.all([
      prisma.vehicle.count(),
      prisma.user.count(),
      prisma.parkingArea.count(),
      prisma.parkingSession.count({ where: { status: "PARKING" } }),
      prisma.parkingArea.findMany({ select: { capacity: true } }),
      prisma.vehicle.groupBy({ by: ["type"], _count: { id: true } })
    ]);

    const totalCapacity = areas.reduce((sum, area) => sum + area.capacity, 0);
    res.json({
      success: true,
      data: {
        totalVehicles,
        totalUsers,
        totalAreas,
        parkingNow,
        totalCapacity,
        availableSlots: Math.max(totalCapacity - parkingNow, 0),
        vehicleTypes
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể thống kê dữ liệu." });
  }
}
