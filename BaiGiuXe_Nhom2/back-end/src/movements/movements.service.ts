import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { MovementType, Prisma } from '@prisma/client'
import { fromMovementType, fromVehicleType, localDayStart, localNextDayStart, toMovementType } from '../common/mappers'
import { PrismaService } from '../prisma/prisma.service'
import { CreateMovementDto } from './dto/movement.dto'

function mapMovement(movement: {
  id: string
  studentId: string
  type: MovementType
  timestamp: Date
  gate: string
  student: { name: string }
  vehicle: { plate: string; type: 'MOTORCYCLE' | 'ELECTRIC_BICYCLE' | 'BICYCLE' }
}) {
  return {
    id: movement.id,
    studentId: movement.studentId,
    studentName: movement.student.name,
    plate: movement.vehicle.plate,
    vehicleType: fromVehicleType(movement.vehicle.type),
    type: fromMovementType(movement.type),
    timestamp: movement.timestamp.toISOString(),
    gate: movement.gate,
  }
}

@Injectable()
export class MovementsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(date?: string, search?: string, type?: string) {
    const where: Prisma.MovementWhereInput = {}
    if (date === 'today') {
      where.timestamp = { gte: localDayStart(), lt: localNextDayStart() }
    } else if (date && date !== 'all') {
      throw new BadRequestException('Khoảng thời gian không hợp lệ.')
    }
    if (search) {
      where.OR = [
        { student: { name: { contains: search, mode: 'insensitive' } } },
        { studentId: { contains: search, mode: 'insensitive' } },
        { vehicle: { plate: { contains: search, mode: 'insensitive' } } },
      ]
    }
    if (type) where.type = toMovementType(type)

    const movements = await this.prisma.movement.findMany({
      where,
      include: { student: true, vehicle: true },
      orderBy: { timestamp: 'desc' },
    })
    return movements.map(mapMovement)
  }

  async create(dto: CreateMovementDto) {
    const type = toMovementType(dto.type)
    try {
      const movement = await this.prisma.$transaction(async (transaction) => {
        const vehicle = await transaction.vehicle.findUnique({
          where: { id: dto.vehicleId },
          include: { student: true },
        })
        if (!vehicle) throw new NotFoundException('Không tìm thấy phương tiện.')

        const entering = type === MovementType.ENTRY
        if (vehicle.inParking === entering) {
          throw new ConflictException(entering ? 'Xe này hiện đang ở trong bãi.' : 'Xe này hiện không ở trong bãi.')
        }
        if (entering && vehicle.student.status === 'EXPIRED') {
          throw new ConflictException('Thẻ gửi xe của sinh viên đã hết hạn.')
        }

        const settings = await transaction.parkingSettings.findUnique({ where: { id: 'default' } })
        if (!settings) throw new ConflictException('Chưa cấu hình bãi xe.')

        const occupied = await transaction.vehicle.count({ where: { inParking: true } })
        if (entering && occupied >= settings.capacity) throw new ConflictException('Bãi xe đã hết chỗ trống.')

        await transaction.vehicle.update({
          where: { id: vehicle.id },
          data: { inParking: entering },
        })
        return transaction.movement.create({
          data: {
            studentId: vehicle.studentId,
            vehicleId: vehicle.id,
            type,
            gate: dto.gate?.trim() || settings.mainGate,
          },
          include: { student: true, vehicle: true },
        })
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
      return mapMovement(movement)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2034') {
        throw new ConflictException('Bãi xe vừa được cập nhật. Hãy tải lại trạng thái xe và thử lại.')
      }
      throw error
    }
  }
}
