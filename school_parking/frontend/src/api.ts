import type { ChatMessage, Movement, ParkingSettings, ParkingStore, Student, Vehicle } from './types'

const apiBaseUrl = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api').replace(/\/+$/, '')
const tokenKey = 'parkly-access-token'
let accessToken = sessionStorage.getItem(tokenKey)

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export type ApiUser = {
  id: string
  name: string
  email: string
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  let response: Response
  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...init.headers,
      },
    })
  } catch {
    throw new ApiError(`Không kết nối được API (${apiBaseUrl}). Hãy kiểm tra server và DATABASE_URL.`, 0)
  }

  if (!response.ok) {
    let message = `API trả về lỗi ${response.status}.`
    try {
      const body: unknown = await response.json()
      if (typeof body === 'object' && body !== null && 'message' in body) {
        const apiMessage = body.message
        message = Array.isArray(apiMessage) ? apiMessage.join(' ') : String(apiMessage)
      }
    } catch {}
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  async login(email: string, password: string): Promise<ApiUser> {
    return this.authenticate('/auth/login', { email, password })
  },

  async register(name: string, email: string, password: string): Promise<ApiUser> {
    return this.authenticate('/auth/register', { name, email, password })
  },

  async authenticate(path: string, body: Record<string, string>): Promise<ApiUser> {
    const result = await request<{
      accessToken: string
      user: ApiUser
    }>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    })
    accessToken = result.accessToken
    sessionStorage.setItem(tokenKey, accessToken)
    return result.user
  },

  async currentUser(): Promise<ApiUser> {
    return request<ApiUser>('/auth/me')
  },

  hasSession() {
    return Boolean(accessToken)
  },

  chat(messages: ChatMessage[]) {
    return request<{ message: ChatMessage }>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    })
  },

  clearSession() {
    accessToken = null
    sessionStorage.removeItem(tokenKey)
  },

  async loadStore(): Promise<ParkingStore> {
    const [students, vehicles, movements, settings, dashboard] = await Promise.all([
      request<Student[]>('/students'),
      request<Vehicle[]>('/vehicles'),
      request<Movement[]>('/movements?date=all'),
      request<ParkingSettings>('/settings'),
      request<{ occupiedCount: number }>('/dashboard'),
    ])
    return { students, vehicles, movements, settings, occupiedCount: dashboard.occupiedCount }
  },

  createMovement(vehicleId: string, type: Movement['type']) {
    return request<Movement>('/movements', {
      method: 'POST',
      body: JSON.stringify({ vehicleId, type }),
    })
  },

  createStudent(student: Student) {
    return request<Student>('/students', { method: 'POST', body: JSON.stringify(student) })
  },

  updateStudent(student: Student) {
    const { id, ...body } = student
    return request<Student>(`/students/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },

  deleteStudent(id: string) {
    return request<{ success: boolean }>(`/students/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  createVehicle(vehicle: Vehicle) {
    const { id: _id, registeredAt: _registeredAt, inParking: _inParking, ...body } = vehicle
    return request<Vehicle>('/vehicles', { method: 'POST', body: JSON.stringify(body) })
  },

  updateVehicle(vehicle: Vehicle) {
    const { id, registeredAt: _registeredAt, inParking: _inParking, ...body } = vehicle
    return request<Vehicle>(`/vehicles/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    })
  },

  deleteVehicle(id: string) {
    return request<{ success: boolean }>(`/vehicles/${encodeURIComponent(id)}`, { method: 'DELETE' })
  },

  updateSettings(settings: ParkingSettings) {
    return request<ParkingSettings>('/settings', { method: 'PUT', body: JSON.stringify(settings) })
  },

  renewTicket(studentId: string) {
    return request<{ permitUntil: string }>(`/tickets/${encodeURIComponent(studentId)}/renew`, { method: 'PUT' })
  },
}
