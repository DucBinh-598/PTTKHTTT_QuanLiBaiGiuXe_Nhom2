import { Injectable } from '@nestjs/common'
import { MovementType } from '@prisma/client'
import { localDayStart, localNextDayStart } from '../common/mappers'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async summary() {
    const [settings, occupiedCount, entriesToday, exitsToday, attentionTickets, studentsCount, vehiclesCount] =
      await Promise.all([
        this.prisma.parkingSettings.upsert({
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
        }),
        this.prisma.vehicle.count({ where: { inParking: true } }),
        this.prisma.movement.count({
          where: {
            type: MovementType.ENTRY,
            timestamp: { gte: localDayStart(), lt: localNextDayStart() },
          },
        }),
        this.prisma.movement.count({
          where: {
            type: MovementType.EXIT,
            timestamp: { gte: localDayStart(), lt: localNextDayStart() },
          },
        }),
        this.prisma.student.count({ where: { status: { not: 'ACTIVE' } } }),
        this.prisma.student.count(),
        this.prisma.vehicle.count(),
      ])

    return {
      occupiedCount,
      capacity: settings.capacity,
      availableSpots: Math.max(0, settings.capacity - occupiedCount),
      entriesToday,
      exitsToday,
      attentionTickets,
      studentsCount,
      vehiclesCount,
    }
  }
}
