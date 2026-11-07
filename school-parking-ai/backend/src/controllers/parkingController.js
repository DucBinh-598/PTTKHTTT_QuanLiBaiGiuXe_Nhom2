import { prisma } from "../config/database.js";

export async function getAreas(req, res) {
  try {
    const areas = await prisma.parkingArea.findMany({ orderBy: { id: "asc" } });
    const result = await Promise.all(areas.map(async (area) => {
      const occupied = await prisma.parkingSession.count({
        where: { areaId: area.id, status: "PARKING" }
      });
      return { ...area, occupied, available: Math.max(area.capacity - occupied, 0) };
    }));
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể lấy khu vực bãi xe." });
  }
}

export async function createArea(req, res) {
  try {
    const { name, capacity } = req.body;
    if (typeof name !== "string" || !name.trim() ||
        !Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
      return res.status(400).json({ message: "Tên khu vực hoặc sức chứa không hợp lệ." });
    }
    const area = await prisma.parkingArea.create({
      data: { name: name.trim(), capacity: Number(capacity) }
    });
    res.status(201).json({ success: true, data: area });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể tạo khu vực." });
  }
}

export async function getParkingSessions(req, res) {
  try {
    const sessions = await prisma.parkingSession.findMany({
      where: { status: "PARKING" },
      include: {
        vehicle: { include: { owner: { select: { id: true, name: true } } } },
        area: true
      },
      orderBy: { entryAt: "desc" }
    });
    res.json({ success: true, data: sessions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể lấy danh sách xe đang gửi." });
  }
}

export async function checkIn(req, res) {
  try {
    const vehicleId = Number(req.body.vehicleId);
    const areaId = Number(req.body.areaId);
    if (!Number.isInteger(vehicleId) || !Number.isInteger(areaId)) {
      return res.status(400).json({ message: "Vui lòng chọn xe và khu vực hợp lệ." });
    }

    const [vehicle, area, activeSession] = await Promise.all([
      prisma.vehicle.findUnique({ where: { id: vehicleId } }),
      prisma.parkingArea.findUnique({ where: { id: areaId } }),
      prisma.parkingSession.findFirst({ where: { vehicleId, status: "PARKING" } })
    ]);

    if (!vehicle || !area) return res.status(404).json({ message: "Không tìm thấy xe hoặc khu vực." });
    if (activeSession) return res.status(409).json({ message: "Xe này đang ở trong bãi." });

    const occupied = await prisma.parkingSession.count({
      where: { areaId, status: "PARKING" }
    });
    if (occupied >= area.capacity) return res.status(409).json({ message: "Khu vực đã đầy." });

    const session = await prisma.parkingSession.create({
      data: { vehicleId, areaId },
      include: { vehicle: true, area: true }
    });
    res.status(201).json({ success: true, data: session, message: "Ghi nhận xe vào thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể ghi nhận xe vào." });
  }
}

export async function checkOut(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ message: "ID lượt gửi không hợp lệ." });

    const session = await prisma.parkingSession.findUnique({ where: { id } });
    if (!session || session.status !== "PARKING") {
      return res.status(404).json({ message: "Không tìm thấy lượt gửi xe đang hoạt động." });
    }

    const updated = await prisma.parkingSession.update({
      where: { id },
      data: { exitAt: new Date(), status: "COMPLETED" }
    });
    res.json({ success: true, data: updated, message: "Ghi nhận lấy xe thành công." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Không thể ghi nhận lấy xe." });
  }
}
