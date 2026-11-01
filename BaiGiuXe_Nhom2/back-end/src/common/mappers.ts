import { BadRequestException } from '@nestjs/common'
import { MovementType, PermitStatus, VehicleType } from '@prisma/client'

export function toPermitStatus(status: string): PermitStatus {
  const value: Record<string, PermitStatus> = {
    'Đang hoạt động': PermitStatus.ACTIVE,
    'Sắp hết hạn': PermitStatus.EXPIRING,
    'Hết hạn': PermitStatus.EXPIRED,
  }
  const result = value[status]
  if (!result) throw new BadRequestException('Trạng thái thẻ gửi xe không hợp lệ.')
  return result
}

export function fromPermitStatus(status: PermitStatus) {
  const value: Record<PermitStatus, string> = {
    [PermitStatus.ACTIVE]: 'Đang hoạt động',
    [PermitStatus.EXPIRING]: 'Sắp hết hạn',
    [PermitStatus.EXPIRED]: 'Hết hạn',
  }
  return value[status]
}

export function toVehicleType(type: string): VehicleType {
  const value: Record<string, VehicleType> = {
    'Xe máy': VehicleType.MOTORCYCLE,
    'Xe đạp điện': VehicleType.ELECTRIC_BICYCLE,
    'Xe đạp': VehicleType.BICYCLE,
  }
  const result = value[type]
  if (!result) throw new BadRequestException('Loại phương tiện không hợp lệ.')
  return result
}

export function fromVehicleType(type: VehicleType) {
  const value: Record<VehicleType, string> = {
    [VehicleType.MOTORCYCLE]: 'Xe máy',
    [VehicleType.ELECTRIC_BICYCLE]: 'Xe đạp điện',
    [VehicleType.BICYCLE]: 'Xe đạp',
  }
  return value[type]
}

export function toMovementType(type: string): MovementType {
  const value: Record<string, MovementType> = {
    'Vào bãi': MovementType.ENTRY,
    'Ra bãi': MovementType.EXIT,
  }
  const result = value[type]
  if (!result) throw new BadRequestException('Loại lượt xe không hợp lệ.')
  return result
}

export function fromMovementType(type: MovementType) {
  return type === MovementType.ENTRY ? 'Vào bãi' : 'Ra bãi'
}

export function toDate(value: string) {
  const date = new Date(`${value}T00:00:00.000Z`)
  if (Number.isNaN(date.getTime())) throw new BadRequestException('Ngày không hợp lệ.')
  if (date.toISOString().slice(0, 10) !== value) throw new BadRequestException('Ngày không hợp lệ.')
  return date
}

export function localDayStart() {
  const vietnamNow = new Date(Date.now() + 7 * 60 * 60 * 1000)
  return new Date(Date.UTC(
    vietnamNow.getUTCFullYear(),
    vietnamNow.getUTCMonth(),
    vietnamNow.getUTCDate(),
  ) - 7 * 60 * 60 * 1000)
}

export function localNextDayStart() {
  return new Date(localDayStart().getTime() + 24 * 60 * 60 * 1000)
}
