import 'dotenv/config'
import { MovementType, PrismaClient, VehicleType } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const dateOnly = (offset: number) => {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
}

const students = [
  { id: '23DTHA01', name: 'Nguyễn Minh Anh', className: '23DTHA1', program: 'Công nghệ thông tin', phone: '0901 234 567', permitUntil: dateOnly(48), status: 'ACTIVE' as const },
  { id: '22DTHB03', name: 'Trần Quốc Bảo', className: '22DTHB2', program: 'Hệ thống thông tin', phone: '0912 345 678', permitUntil: dateOnly(18), status: 'EXPIRING' as const },
  { id: '24DTHA02', name: 'Lê Hoàng Yến', className: '24DTHA1', program: 'Công nghệ thông tin', phone: '0934 567 890', permitUntil: dateOnly(75), status: 'ACTIVE' as const },
  { id: '23DTHC01', name: 'Phạm Gia Huy', className: '23DTHC1', program: 'Khoa học dữ liệu', phone: '0987 654 321', permitUntil: dateOnly(-2), status: 'EXPIRED' as const },
  { id: '22DTHA04', name: 'Đỗ Khánh Linh', className: '22DTHA2', program: 'Công nghệ thông tin', phone: '0908 765 432', permitUntil: dateOnly(105), status: 'ACTIVE' as const },
  { id: '24DTHB02', name: 'Võ Đức Thành', className: '24DTHB1', program: 'An toàn thông tin', phone: '0918 223 344', permitUntil: dateOnly(12), status: 'EXPIRING' as const },
]

const vehicleSeeds = [
  { id: 'demo-vehicle-1', studentId: '23DTHA01', plate: '59-X3 284.16', type: VehicleType.MOTORCYCLE, color: 'Đen', inParking: true },
  { id: 'demo-vehicle-2', studentId: '22DTHB03', plate: '59-MD2 719.05', type: VehicleType.MOTORCYCLE, color: 'Trắng', inParking: false },
  { id: 'demo-vehicle-3', studentId: '24DTHA02', plate: '59-X3 631.88', type: VehicleType.ELECTRIC_BICYCLE, color: 'Xanh dương', inParking: true },
  { id: 'demo-vehicle-5', studentId: '22DTHA04', plate: '59-X3 498.21', type: VehicleType.BICYCLE, color: 'Bạc', inParking: false },
  { id: 'demo-vehicle-6', studentId: '24DTHB02', plate: '59-MD2 842.63', type: VehicleType.MOTORCYCLE, color: 'Xám', inParking: true },
]

async function seed() {
  for (const student of students) {
    await prisma.student.upsert({
      where: { id: student.id },
      create: student,
      update: {},
    })
  }

  for (const vehicle of vehicleSeeds) {
    await prisma.vehicle.upsert({
      where: { id: vehicle.id },
      create: vehicle,
      update: {},
    })
  }

  await prisma.parkingSettings.upsert({
    where: { id: 'default' },
    create: {
      id: 'default',
      schoolName: 'Trường Đại học Công nghệ',
      lotName: 'Bãi xe sinh viên',
      capacity: 180,
      mainGate: 'Cổng chính',
      contactEmail: 'baixe@university.edu.vn',
    },
    update: {},
  })

  for (const [key, role, name] of [
    ['ADMIN', 'ADMIN', 'Quản trị viên'],
    ['STAFF', 'STAFF', 'Nhân viên bãi xe'],
  ] as const) {
    const email = process.env[`${key}_EMAIL`]?.trim().toLocaleLowerCase('en-US')
    const password = process.env[`${key}_PASSWORD`]
    if (!email || !password) continue
    if (password.length < 12) {
      throw new Error(`${key}_PASSWORD must contain at least 12 characters.`)
    }
    const passwordHash = await hash(password, 12)
    await prisma.user.upsert({
      where: { email },
      create: { email, passwordHash, role, name },
      update: { passwordHash, role, name },
    })
  }

  const movementCount = await prisma.movement.count()
  if (movementCount === 0) {
    const seedMovements = [
      { vehicleId: 'demo-vehicle-1', studentId: '23DTHA01', type: MovementType.ENTRY, minutesAgo: 4, gate: 'Cổng chính' },
      { vehicleId: 'demo-vehicle-2', studentId: '22DTHB03', type: MovementType.EXIT, minutesAgo: 8, gate: 'Cổng chính' },
      { vehicleId: 'demo-vehicle-3', studentId: '24DTHA02', type: MovementType.ENTRY, minutesAgo: 12, gate: 'Cổng phụ' },
      { vehicleId: 'demo-vehicle-5', studentId: '22DTHA04', type: MovementType.EXIT, minutesAgo: 22, gate: 'Cổng phụ' },
      { vehicleId: 'demo-vehicle-6', studentId: '24DTHB02', type: MovementType.ENTRY, minutesAgo: 29, gate: 'Cổng chính' },
    ]
    await prisma.movement.createMany({
      data: seedMovements.map(({ minutesAgo, ...movement }) => ({
        ...movement,
        timestamp: new Date(Date.now() - minutesAgo * 60_000),
      })),
    })
  }

  console.log('Demo data is ready.')
}

seed()
  .catch((error: unknown) => {
    console.error('Failed to seed demo data.', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
