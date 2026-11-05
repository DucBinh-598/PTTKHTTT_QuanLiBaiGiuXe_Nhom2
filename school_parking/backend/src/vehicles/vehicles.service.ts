import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PermitStatus, Prisma } from '@prisma/client'
import { fromVehicleType, toVehicleType } from '../common/mappers'
import { PrismaService } from '../prisma/prisma.service'
import { CreateVehicleDto, UpdateVehicleDto } from './dto/vehicle.dto'

function mapVehicle(vehicle: {
  id: string
  studentId: string
  plate: string
  type: 'MOTORCYCLE' | 'ELECTRIC_BICYCLE' | 'BICYCLE'
  color: string
  registeredAt: Date
  inParking: boolean
}) {
  return {
    id: vehicle.id,
    studentId: vehicle.studentId,
    plate: vehicle.plate,
    type: fromVehicleType(vehicle.type),
    color: vehicle.color,
    registeredAt: vehicle.registeredAt.toISOString().slice(0, 10),
    inParking: vehicle.inParking,
  }
}

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, inParking?: string) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: {
        ...(search ? {
          OR: [
            { plate: { contains: search, mode: 'insensitive' } },
            { student: { name: { contains: search, mode: 'insensitive' } } },
          ],
        } : {}),
        ...(inParking === 'true' ? { inParking: true } : {}),
        ...(inParking === 'false' ? { inParking: false } : {}),
      },
      orderBy: [{ registeredAt: 'desc' }],
    })
    return vehicles.map(mapVehicle)
  }

  async create(dto: CreateVehicleDto) {
    await this.assertStudentCanRegister(dto.studentId)
    try {
      const vehicle = await this.prisma.vehicle.create({
        data: {
          studentId: dto.studentId,
          plate: dto.plate.trim().toLocaleUpperCase('vi'),
          type: toVehicleType(dto.type),
          color: dto.color.trim(),
        },
      })
      return mapVehicle(vehicle)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ConflictException('Biển số xe này đã được đăng ký.')
        if (error.code === 'P2003') throw new NotFoundException('Không tìm thấy sinh viên sở hữu phương tiện.')
      }
      throw error
    }
  }

  async update(id: string, dto: UpdateVehicleDto) {
    const existing = await this.prisma.vehicle.findUnique({ where: { id } })
    if (!existing) throw new NotFoundException('Không tìm thấy phương tiện.')
    if (dto.studentId !== existing.studentId) await this.assertStudentCanRegister(dto.studentId)

    try {
      const vehicle = await this.prisma.vehicle.update({
        where: { id },
        data: {
          studentId: dto.studentId,
          plate: dto.plate.trim().toLocaleUpperCase('vi'),
          type: toVehicleType(dto.type),
          color: dto.color.trim(),
        },
      })
      return mapVehicle(vehicle)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') throw new ConflictException('Biển số xe này đã được đăng ký.')
        if (error.code === 'P2003') throw new NotFoundException('Không tìm thấy sinh viên sở hữu phương tiện.')
      }
      throw error
    }
  }

  async remove(id: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id },
      include: { _count: { select: { movements: true } } },
    })
    if (!vehicle) throw new NotFoundException('Không tìm thấy phương tiện.')
    if (vehicle.inParking) throw new ConflictException('Xe đang trong bãi. Hãy ghi nhận xe ra trước khi xóa.')
    if (vehicle._count.movements > 0) {
      throw new ConflictException('Không thể xóa phương tiện đã có lịch sử gửi xe.')
    }
    await this.prisma.vehicle.delete({ where: { id } })
    return { success: true }
  }

  private async assertStudentCanRegister(studentId: string) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true, status: true },
    })
    if (!student) throw new NotFoundException('Không tìm thấy sinh viên sở hữu phương tiện.')
    if (student.status === PermitStatus.EXPIRED) {
      throw new ConflictException('Không thể đăng ký xe khi thẻ gửi xe đã hết hạn.')
    }
  }
}
