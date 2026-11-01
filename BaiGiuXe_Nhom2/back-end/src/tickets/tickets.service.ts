import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PermitStatus } from '@prisma/client'
import { fromPermitStatus } from '../common/mappers'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string, status?: string) {
    const students = await this.prisma.student.findMany({
      where: {
        ...(search ? {
          OR: [
            { id: { contains: search, mode: 'insensitive' } },
            { name: { contains: search, mode: 'insensitive' } },
            { className: { contains: search, mode: 'insensitive' } },
          ],
        } : {}),
        ...(status ? { status: this.mapStatus(status) } : {}),
      },
      include: { _count: { select: { vehicles: true } } },
      orderBy: [{ permitUntil: 'asc' }, { name: 'asc' }],
    })
    return students.map((student) => ({
      id: student.id,
      studentId: student.id,
      studentName: student.name,
      className: student.className,
      permitUntil: student.permitUntil.toISOString().slice(0, 10),
      status: fromPermitStatus(student.status),
      vehicleCount: student._count.vehicles,
    }))
  }

  async renew(studentId: string) {
    const student = await this.prisma.student.findUnique({ where: { id: studentId } })
    if (!student) throw new NotFoundException('Không tìm thấy sinh viên.')

    const today = new Date()
    today.setUTCHours(0, 0, 0, 0)
    const base = student.permitUntil < today ? today : student.permitUntil
    const permitUntil = new Date(base)
    permitUntil.setUTCFullYear(permitUntil.getUTCFullYear() + 1)

    const updated = await this.prisma.student.update({
      where: { id: studentId },
      data: { permitUntil, status: 'ACTIVE' },
    })
    return {
      studentId: updated.id,
      studentName: updated.name,
      permitUntil: updated.permitUntil.toISOString().slice(0, 10),
      status: fromPermitStatus(updated.status),
    }
  }

  private mapStatus(status: string) {
    const values: Record<string, PermitStatus> = {
      'Đang hoạt động': PermitStatus.ACTIVE,
      'Sắp hết hạn': PermitStatus.EXPIRING,
      'Hết hạn': PermitStatus.EXPIRED,
    }
    const result = values[status]
    if (!result) throw new BadRequestException('Trạng thái vé không hợp lệ.')
    return result
  }
}
