import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@school.edu.vn" },
    update: {},
    create: {
      name: "Quản trị viên mẫu",
      email: "admin@school.edu.vn",
      studentId: "ADMIN001",
      role: "ADMIN"
    }
  });

  const student = await prisma.user.upsert({
    where: { email: "student@school.edu.vn" },
    update: {},
    create: {
      name: "Nguyễn Văn A",
      email: "student@school.edu.vn",
      studentId: "SV001",
      role: "STUDENT"
    }
  });

  const bicycleArea = await prisma.parkingArea.upsert({
    where: { id: 1 },
    update: { name: "Khu vực xe đạp", capacity: 100 },
    create: { name: "Khu vực xe đạp", capacity: 100 }
  });

  await prisma.parkingArea.upsert({
    where: { id: 2 },
    update: { name: "Khu vực xe điện", capacity: 100 },
    create: { name: "Khu vực xe điện", capacity: 100 }
  });

  await prisma.parkingArea.upsert({
    where: { id: 3 },
    update: { name: "Khu vực xe máy", capacity: 150 },
    create: { name: "Khu vực xe máy", capacity: 150 }
  });

  await prisma.vehicle.upsert({
    where: { plateNumber: "XE-DAP-001" },
    update: {},
    create: {
      plateNumber: "XE-DAP-001",
      type: "BICYCLE",
      ownerId: student.id,
      description: "Xe đạp mẫu"
    }
  });

  console.log("Seed hoàn tất:", { admin: admin.email, student: student.email, area: bicycleArea.name });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
