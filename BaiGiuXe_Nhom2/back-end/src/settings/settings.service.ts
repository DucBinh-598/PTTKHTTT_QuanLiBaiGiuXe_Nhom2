import { BadRequestException, Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { UpdateSettingsDto } from './dto/settings.dto'

const defaultSettings = {
  id: 'default',
  schoolName: 'Trường Đại học Công nghệ',
  lotName: 'Bãi xe sinh viên',
  capacity: 180,
  mainGate: 'Cổng chính',
  contactEmail: 'baixe@university.edu.vn',
}

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async find() {
    const settings = await this.prisma.parkingSettings.upsert({
      where: { id: 'default' },
      create: defaultSettings,
      update: {},
    })
    return this.toResponse(settings)
  }

  async update(dto: UpdateSettingsDto) {
    const occupied = await this.prisma.vehicle.count({ where: { inParking: true } })
    if (dto.capacity < occupied) {
      throw new BadRequestException(`Sức chứa không thể thấp hơn số xe hiện có trong bãi (${occupied}).`)
    }
    const settings = await this.prisma.parkingSettings.upsert({
      where: { id: 'default' },
      create: { ...dto, id: 'default' },
      update: dto,
    })
    return this.toResponse(settings)
  }

  private toResponse(settings: Prisma.ParkingSettingsGetPayload<object>) {
    return {
      schoolName: settings.schoolName,
      lotName: settings.lotName,
      capacity: settings.capacity,
      mainGate: settings.mainGate,
      contactEmail: settings.contactEmail,
    }
  }
}
