import { prisma } from "../config/database.js";

const allowedTypes = [
  "BICYCLE",
  "ELECTRIC_BICYCLE",
  "ELECTRIC_MOTORBIKE",
  "MOTORBIKE"
];

export async function getVehicles(req, res) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      include: { owner: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: vehicles });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể lấy danh sách phương tiện." });
  }
}

export async function createVehicle(req, res) {
  try {
    const { plateNumber, type, ownerId, description } = req.body;
    if (typeof plateNumber !== "string" || !plateNumber.trim() ||
        !allowedTypes.includes(type) || !Number.isInteger(Number(ownerId))) {
      return res.status(400).json({ message: "Thông tin phương tiện không hợp lệ." });
    }

    const owner = await prisma.user.findUnique({ where: { id: Number(ownerId) } });
    if (!owner) return res.status(404).json({ message: "Không tìm thấy chủ phương tiện." });

    const vehicle = await prisma.vehicle.create({
      data: {
        plateNumber: plateNumber.trim().toUpperCase(),
        type,
        ownerId: Number(ownerId),
        description: typeof description === "string" ? description.trim() : null
      },
      include: { owner: { select: { id: true, name: true } } }
    });
    res.status(201).json({ success: true, data: vehicle, message: "Thêm phương tiện thành công." });
  } catch (error) {
    if (error.code === "P2002") return res.status(409).json({ message: "Biển số xe đã tồn tại." });
    console.error(error);
    res.status(500).json({ message: "Không thể thêm phương tiện." });
  }
}

export async function deleteVehicle(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "ID không hợp lệ." });

    const count = await prisma.parkingSession.count({ where: { vehicleId: id } });
    if (count > 0) return res.status(409).json({ message: "Xe đã có lịch sử gửi, không thể xóa." });

    await prisma.vehicle.delete({ where: { id } });
    res.json({ success: true, message: "Xóa phương tiện thành công." });
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ message: "Không tìm thấy phương tiện." });
    console.error(error);
    res.status(500).json({ message: "Không thể xóa phương tiện." });
  }
}
