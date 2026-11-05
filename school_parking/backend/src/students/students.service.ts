import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { fromPermitStatus, toDate, toPermitStatus } from '../common/mappers'
import { PrismaService } from '../prisma/prisma.service'
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto'

function mapStudent(student: {
  id: string
  name: string
  className: string
  program: string
  phone: string
  permitUntil: Date
  status: 'ACTIVE' | 'EXPIRING' | 'EXPIRED'
}) {
  return {
    id: student.id,
    name: student.name,
    className: student.className,
    program: student.program,
    phone: student.phone,
    permitUntil: student.permitUntil.toISOString().slice(0, 10),
    status: fromPermitStatus(student.status),
  }
}

@Injectable()
export class StudentsService {
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
        ...(status ? { status: toPermitStatus(status) } : {}),
      },
      orderBy: [{ name: 'asc' }],
    })
    return students.map(mapStudent)
  }

  async create(dto: CreateStudentDto) {
    try {
      const student = await this.prisma.student.create({
        data: {
          id: dto.id.trim(),
          name: dto.name.trim(),
          className: dto.className.trim(),
          program: dto.program.trim(),
          phone: dto.phone.trim(),
          permitUntil: toDate(dto.permitUntil),
          status: toPermitStatus(dto.status),
        },
      })
      return mapStudent(student)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Mã sinh viên này đã tồn tại.')
      }
      throw error
    }
  }

  async update(id: string, dto: UpdateStudentDto) {
    try {
      const student = await this.prisma.student.update({
        where: { id },
        data: {
          name: dto.name.trim(),
          className: dto.className.trim(),
          program: dto.program.trim(),
          phone: dto.phone.trim(),
          permitUntil: toDate(dto.permitUntil),
          status: toPermitStatus(dto.status),
        },
      })
      return mapStudent(student)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Không tìm thấy sinh viên.')
      }
      throw error
    }
  }

  async remove(id: string) {
    const linkedVehicle = await this.prisma.vehicle.findFirst({ where: { studentId: id }, select: { id: true } })
    if (linkedVehicle) {
      throw new ConflictException('Không thể xóa sinh viên đang có phương tiện đã đăng ký.')
    }
    try {
      await this.prisma.student.delete({ where: { id } })
      return { success: true }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Không tìm thấy sinh viên.')
      }
      throw error
    }
  }
}
