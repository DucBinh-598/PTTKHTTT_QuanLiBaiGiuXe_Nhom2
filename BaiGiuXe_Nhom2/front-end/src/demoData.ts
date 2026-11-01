import type { DemoStore, Movement, Student, Vehicle } from './types'

const localDateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const dateOnly = (dayOffset: number) => {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  return localDateKey(date)
}

const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString()

const students: Student[] = [
  { id: '23DTHA01', name: 'Nguyễn Minh Anh', className: '23DTHA1', program: 'Công nghệ thông tin', phone: '0901 234 567', permitUntil: dateOnly(48), status: 'Đang hoạt động' },
  { id: '22DTHB03', name: 'Trần Quốc Bảo', className: '22DTHB2', program: 'Hệ thống thông tin', phone: '0912 345 678', permitUntil: dateOnly(18), status: 'Sắp hết hạn' },
  { id: '24DTHA02', name: 'Lê Hoàng Yến', className: '24DTHA1', program: 'Công nghệ thông tin', phone: '0934 567 890', permitUntil: dateOnly(75), status: 'Đang hoạt động' },
  { id: '23DTHC01', name: 'Phạm Gia Huy', className: '23DTHC1', program: 'Khoa học dữ liệu', phone: '0987 654 321', permitUntil: dateOnly(-2), status: 'Hết hạn' },
  { id: '22DTHA04', name: 'Đỗ Khánh Linh', className: '22DTHA2', program: 'Công nghệ thông tin', phone: '0908 765 432', permitUntil: dateOnly(105), status: 'Đang hoạt động' },
  { id: '24DTHB02', name: 'Võ Đức Thành', className: '24DTHB1', program: 'An toàn thông tin', phone: '0918 223 344', permitUntil: dateOnly(12), status: 'Sắp hết hạn' },
  { id: '23DTHD05', name: 'Phan Ngọc Mai', className: '23DTHD2', program: 'Thương mại điện tử', phone: '0938 112 233', permitUntil: dateOnly(68), status: 'Đang hoạt động' },
  { id: '21DTHC07', name: 'Bùi Hoàng Nam', className: '21DTHC1', program: 'Kỹ thuật phần mềm', phone: '0977 456 123', permitUntil: dateOnly(-8), status: 'Hết hạn' },
  { id: '24DTHC06', name: 'Đặng Thu Hà', className: '24DTHC2', program: 'Khoa học dữ liệu', phone: '0966 771 122', permitUntil: dateOnly(34), status: 'Đang hoạt động' },
  { id: '22DTHD08', name: 'Lý Thanh Tùng', className: '22DTHD1', program: 'An toàn thông tin', phone: '0944 229 881', permitUntil: dateOnly(25), status: 'Đang hoạt động' },
]

const vehicles: Vehicle[] = [
  { id: 'vehicle-1', studentId: '23DTHA01', plate: '59-X3 284.16', type: 'Xe máy', color: 'Đen', registeredAt: dateOnly(-125), inParking: true },
  { id: 'vehicle-2', studentId: '22DTHB03', plate: '59-MD2 719.05', type: 'Xe máy', color: 'Trắng', registeredAt: dateOnly(-203), inParking: false },
  { id: 'vehicle-3', studentId: '24DTHA02', plate: '59-X3 631.88', type: 'Xe đạp điện', color: 'Xanh dương', registeredAt: dateOnly(-72), inParking: true },
  { id: 'vehicle-4', studentId: '23DTHC01', plate: '59-MD2 120.47', type: 'Xe máy', color: 'Đỏ', registeredAt: dateOnly(-310), inParking: true },
  { id: 'vehicle-5', studentId: '22DTHA04', plate: '59-X3 498.21', type: 'Xe đạp', color: 'Bạc', registeredAt: dateOnly(-178), inParking: false },
  { id: 'vehicle-6', studentId: '24DTHB02', plate: '59-MD2 842.63', type: 'Xe máy', color: 'Xám', registeredAt: dateOnly(-61), inParking: true },
  { id: 'vehicle-7', studentId: '23DTHD05', plate: '59-X3 506.79', type: 'Xe máy', color: 'Đen', registeredAt: dateOnly(-97), inParking: false },
  { id: 'vehicle-8', studentId: '21DTHC07', plate: '59-MD2 319.28', type: 'Xe đạp điện', color: 'Trắng', registeredAt: dateOnly(-402), inParking: false },
  { id: 'vehicle-9', studentId: '24DTHC06', plate: '59-X3 770.51', type: 'Xe máy', color: 'Xanh lá', registeredAt: dateOnly(-43), inParking: false },
  { id: 'vehicle-10', studentId: '22DTHD08', plate: '59-MD2 882.03', type: 'Xe máy', color: 'Đen', registeredAt: dateOnly(-229), inParking: false },
]

function movement(
  vehicle: Vehicle,
  type: Movement['type'],
  minutes: number,
  gate: string,
): Movement {
  const student = students.find((item) => item.id === vehicle.studentId)!
  return {
    id: `movement-${minutes}`,
    studentId: student.id,
    studentName: student.name,
    plate: vehicle.plate,
    vehicleType: vehicle.type,
    type,
    timestamp: minutesAgo(minutes),
    gate,
  }
}

function movementDaysAgo(
  vehicle: Vehicle,
  type: Movement['type'],
  daysAgo: number,
  index: number,
): Movement {
  const timestamp = new Date(Date.now() - daysAgo * 86_400_000 - index * 35 * 60_000).toISOString()
  return {
    ...movement(vehicle, type, daysAgo * 1_440 + index * 35, index % 2 ? 'Cổng phụ' : 'Cổng chính'),
    id: `history-${daysAgo}-${index}`,
    timestamp,
  }
}

export const initialStore: DemoStore = {
  students,
  vehicles,
  movements: [
    movement(vehicles[0], 'Vào bãi', 4, 'Cổng chính'),
    movement(vehicles[1], 'Ra bãi', 8, 'Cổng chính'),
    movement(vehicles[2], 'Vào bãi', 12, 'Cổng phụ'),
    movement(vehicles[3], 'Vào bãi', 17, 'Cổng chính'),
    movement(vehicles[4], 'Ra bãi', 22, 'Cổng phụ'),
    movement(vehicles[5], 'Vào bãi', 29, 'Cổng chính'),
    movement(vehicles[6], 'Ra bãi', 47, 'Cổng chính'),
    movement(vehicles[7], 'Vào bãi', 65, 'Cổng phụ'),
    movement(vehicles[8], 'Vào bãi', 96, 'Cổng chính'),
    movement(vehicles[9], 'Ra bãi', 124, 'Cổng chính'),
    ...Array.from({ length: 6 }, (_, index) => {
      const daysAgo = index + 1
      return [
        movementDaysAgo(vehicles[index % vehicles.length], 'Vào bãi', daysAgo, 1),
        movementDaysAgo(vehicles[(index + 2) % vehicles.length], 'Ra bãi', daysAgo, 2),
        ...(index % 2 === 0 ? [movementDaysAgo(vehicles[(index + 4) % vehicles.length], 'Vào bãi', daysAgo, 3)] : []),
      ]
    }).flat(),
  ],
  settings: {
    schoolName: 'Trường Đại học Công nghệ',
    lotName: 'Bãi xe sinh viên',
    capacity: 180,
    mainGate: 'Cổng chính',
    contactEmail: 'baixe@university.edu.vn',
  },
  occupiedCount: 128,
}
