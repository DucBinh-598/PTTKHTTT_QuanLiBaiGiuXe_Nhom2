export type Page =
  | 'overview'
  | 'movements'
  | 'students'
  | 'vehicles'
  | 'tickets'
  | 'reports'
  | 'settings'
  | 'help'
  | 'account'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type MovementType = 'Vào bãi' | 'Ra bãi'
export type VehicleType = 'Xe máy' | 'Xe đạp điện' | 'Xe đạp'
export type PermitStatus = 'Đang hoạt động' | 'Sắp hết hạn' | 'Hết hạn'

export type Student = {
  id: string
  name: string
  className: string
  program: string
  phone: string
  permitUntil: string
  status: PermitStatus
}

export type Vehicle = {
  id: string
  studentId: string
  plate: string
  type: VehicleType
  color: string
  registeredAt: string
  inParking: boolean
}

export type Movement = {
  id: string
  studentId: string
  studentName: string
  plate: string
  vehicleType: VehicleType
  type: MovementType
  timestamp: string
  gate: string
}

export type ParkingSettings = {
  schoolName: string
  lotName: string
  capacity: number
  mainGate: string
  contactEmail: string
}

export type ParkingStore = {
  students: Student[]
  vehicles: Vehicle[]
  movements: Movement[]
  settings: ParkingSettings
  occupiedCount: number
}
