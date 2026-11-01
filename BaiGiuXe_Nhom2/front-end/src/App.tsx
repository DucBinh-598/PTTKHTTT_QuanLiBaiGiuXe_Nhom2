import { startTransition, useCallback, useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowDownToLine,
  ArrowDownUp,
  ArrowUpFromLine,
  BarChart3,
  Bell,
  Bike,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleHelp,
  Clock3,
  Download,
  Edit3,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  ParkingSquare,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  TicketCheck,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react'
import { initialStore } from './demoData'
import { ApiError, api, type ApiUser } from './api'
import type {
  DemoStore,
  Movement,
  MovementType,
  Page,
  ParkingSettings,
  PermitStatus,
  Student,
  UserRole,
  Vehicle,
} from './types'

const storageKey = 'parkly-demo-v1'
const sessionKey = 'parkly-demo-role'
const appYear = new Date().getFullYear()
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'

const navigation: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Tổng quan', icon: LayoutDashboard },
  { id: 'movements', label: 'Lượt gửi xe', icon: ArrowDownUp },
  { id: 'students', label: 'Sinh viên', icon: UsersRound },
  { id: 'vehicles', label: 'Phương tiện', icon: Bike },
  { id: 'tickets', label: 'Vé gửi xe', icon: TicketCheck },
  { id: 'reports', label: 'Báo cáo', icon: BarChart3 },
]

const pageInfo: Record<Page, { title: string; subtitle: string }> = {
  overview: { title: 'Tổng quan', subtitle: 'Tình hình hoạt động bãi xe trong hôm nay.' },
  movements: { title: 'Lượt gửi xe', subtitle: 'Theo dõi và ghi nhận xe vào, xe ra khỏi bãi.' },
  students: { title: 'Sinh viên', subtitle: 'Quản lý thông tin và quyền sử dụng bãi xe.' },
  vehicles: { title: 'Phương tiện', subtitle: 'Quản lý xe đã đăng ký và trạng thái gửi xe.' },
  tickets: { title: 'Vé gửi xe', subtitle: 'Theo dõi thời hạn và tình trạng vé của sinh viên.' },
  reports: { title: 'Báo cáo', subtitle: 'Tổng hợp hoạt động và công suất bãi xe.' },
  settings: { title: 'Cài đặt', subtitle: 'Cấu hình thông tin bãi xe và liên hệ.' },
}

type Dialog =
  | { type: 'movement'; movementType: MovementType }
  | { type: 'student'; student?: Student }
  | { type: 'vehicle'; vehicle?: Vehicle }
  | null

function readStore(): DemoStore {
  try {
    const saved = localStorage.getItem(storageKey)
    if (!saved) return initialStore
    const value: unknown = JSON.parse(saved)
    if (
      typeof value === 'object' &&
      value !== null &&
      'students' in value &&
      Array.isArray(value.students) &&
      'vehicles' in value &&
      Array.isArray(value.vehicles) &&
      'movements' in value &&
      Array.isArray(value.movements) &&
      'settings' in value &&
      'occupiedCount' in value
    ) {
      return value as DemoStore
    }
    console.warn('Dữ liệu demo đã lưu không đúng định dạng; khởi tạo lại dữ liệu mẫu.')
  } catch (error) {
    console.error('Không thể đọc dữ liệu demo đã lưu.', error)
  }
  return initialStore
}

function readRole(): UserRole | null {
  if (!demoMode) return null
  try {
    const role = localStorage.getItem(sessionKey)
    return role === 'admin' || role === 'staff' ? role : null
  } catch (error) {
    console.error('Không thể đọc phiên demo đã lưu.', error)
    return null
  }
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value))
}

function dateTimeLabel(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' }).format(new Date(value))
}

function currentDateKey() {
  return localDateKey(new Date())
}

function dateAfterDays(days: number) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return localDateKey(date)
}

function localDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function initials(name: string) {
  return name.trim().split(/\s+/).slice(-2).map((part) => part[0]).join('').toLocaleUpperCase('vi')
}

function normalized(value: string) {
  return value.trim().toLocaleLowerCase('vi').normalize('NFD').replace(/\p{Diacritic}/gu, '').replace(/đ/g, 'd')
}

function downloadMovements(store: DemoStore) {
  const rows = [
    ['Thời gian', 'Mã sinh viên', 'Sinh viên', 'Biển số', 'Loại xe', 'Trạng thái', 'Cổng'],
    ...store.movements.map((item) => [
      dateTimeLabel(item.timestamp),
      item.studentId,
      item.studentName,
      item.plate,
      item.vehicleType,
      item.type,
      item.gate,
    ]),
  ]
  const csv = `\uFEFF${rows.map((row) => row.map((cell) => {
    const safeCell = /^[=+\-@]/.test(cell) ? `'${cell}` : cell
    return `"${safeCell.replaceAll('"', '""')}"`
  }).join(',')).join('\r\n')}`
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `parkly-luot-xe-${currentDateKey()}.csv`
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000)
}

function reportApiLoadFailure(
  setStatus: (status: 'error') => void,
  notify: (message: string) => void,
  error: unknown,
) {
  startTransition(() => setStatus('error'))
  notify(error instanceof Error ? error.message : 'Không thể tải dữ liệu từ API.')
}

function App() {
  const [store, setStore] = useState<DemoStore>(demoMode ? readStore : () => initialStore)
  const [appDate] = useState(() => new Date())
  const [userRole, setUserRole] = useState<UserRole | null>(readRole)
  const [userName, setUserName] = useState(demoMode ? 'Admin Parkly' : '')
  const [authLoading, setAuthLoading] = useState(!demoMode)
  const [authError, setAuthError] = useState('')
  const [dataStatus, setDataStatus] = useState<'loading' | 'ready' | 'error'>(demoMode ? 'ready' : 'loading')
  const [activePage, setActivePage] = useState<Page>('overview')
  const [dialog, setDialog] = useState<Dialog>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const refreshStore = useCallback(async () => {
    const nextStore = await api.loadStore()
    setStore(nextStore)
    setDataStatus('ready')
  }, [])

  useEffect(() => {
    if (demoMode) return
    let active = true
    api.currentUser()
      .then((user) => {
        if (!active) return
        setUserRole(user.role)
        setUserName(user.name)
        setAuthError('')
      })
      .catch((error: unknown) => {
        if (!active) return
        api.clearSession()
        setUserRole(null)
        if (error instanceof ApiError) {
          setAuthError(error.status === 401
            ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
            : error.message)
        }
      })
      .finally(() => {
        if (active) setAuthLoading(false)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (demoMode || !userRole) return
    let active = true
    // eslint-disable-next-line react/set-state-in-effect
    refreshStore().catch((error: unknown) => {
      if (!active) return
      reportApiLoadFailure(setDataStatus, notify, error)
    })
    return () => { active = false }
  }, [refreshStore, userRole])

  useEffect(() => {
    if (!demoMode) return
    try {
      localStorage.setItem(storageKey, JSON.stringify(store))
    } catch (error) {
      console.error('Không thể lưu dữ liệu demo vào trình duyệt.', error)
    }
  }, [store])

  const todayMovements = useMemo(
    () => store.movements.filter((movement) => localDateKey(new Date(movement.timestamp)) === currentDateKey()),
    [store.movements],
  )

  function notify(message: string) {
    setNotice(message)
  }

  async function recordMovement(movementType: MovementType, vehicleId: string) {
    if (!demoMode) {
      try {
        const movement = await api.createMovement(vehicleId, movementType)
        await refreshStore()
        setDialog(null)
        notify(`Đã ghi nhận ${movementType.toLocaleLowerCase('vi')} cho ${movement.studentName}.`)
      } catch (error) {
        handleRequestError(error)
      }
      return
    }

    const vehicle = store.vehicles.find((item) => item.id === vehicleId)
    if (!vehicle) {
      notify('Không tìm thấy phương tiện đã chọn.')
      return
    }
    const isEntry = movementType === 'Vào bãi'
    if (vehicle.inParking === isEntry) {
      notify(isEntry ? 'Xe này hiện đang ở trong bãi.' : 'Xe này hiện không ở trong bãi.')
      return
    }
    if (isEntry && store.occupiedCount >= store.settings.capacity) {
      notify('Bãi xe đã hết chỗ trống.')
      return
    }
    const student = store.students.find((item) => item.id === vehicle.studentId)
    if (!student) {
      notify('Sinh viên sở hữu xe không còn trong danh sách.')
      return
    }
    if (isEntry && student.status === 'Hết hạn') {
      notify('Thẻ gửi xe của sinh viên đã hết hạn.')
      return
    }

    const entry: Movement = {
      id: crypto.randomUUID(),
      studentId: student.id,
      studentName: student.name,
      plate: vehicle.plate,
      vehicleType: vehicle.type,
      type: movementType,
      timestamp: new Date().toISOString(),
      gate: store.settings.mainGate,
    }
    setStore((current) => ({
      ...current,
      movements: [entry, ...current.movements],
      vehicles: current.vehicles.map((item) => item.id === vehicleId ? { ...item, inParking: isEntry } : item),
      occupiedCount: Math.max(0, Math.min(current.settings.capacity, current.occupiedCount + (isEntry ? 1 : -1))),
    }))
    setDialog(null)
    notify(`Đã ghi nhận ${movementType.toLocaleLowerCase('vi')} cho ${student.name}.`)
  }

  async function saveStudent(student: Student, isEdit: boolean): Promise<boolean> {
    if (!demoMode) {
      try {
        if (isEdit) await api.updateStudent(student)
        else await api.createStudent(student)
        await refreshStore()
        setDialog(null)
        notify(isEdit ? 'Đã cập nhật thông tin sinh viên.' : 'Đã thêm sinh viên mới.')
        return true
      } catch (error) {
        handleRequestError(error)
        return false
      }
    }

    const duplicate = store.students.some((item) => item.id === student.id && item.id !== dialogStudentId(dialog))
    if (duplicate) {
      notify('Mã sinh viên này đã tồn tại.')
      return false
    }
    setStore((current) => ({
      ...current,
      students: isEdit
        ? current.students.map((item) => item.id === student.id ? student : item)
        : [student, ...current.students],
    }))
    setDialog(null)
    notify(isEdit ? 'Đã cập nhật thông tin sinh viên.' : 'Đã thêm sinh viên mới.')
    return true
  }

  async function saveVehicle(vehicle: Vehicle, isEdit: boolean): Promise<boolean> {
    if (!demoMode) {
      try {
        if (isEdit) await api.updateVehicle(vehicle)
        else await api.createVehicle(vehicle)
        await refreshStore()
        setDialog(null)
        notify(isEdit ? 'Đã cập nhật phương tiện.' : 'Đã đăng ký phương tiện mới.')
        return true
      } catch (error) {
        handleRequestError(error)
        return false
      }
    }

    const duplicate = store.vehicles.some((item) => normalized(item.plate) === normalized(vehicle.plate) && item.id !== dialogVehicleId(dialog))
    if (duplicate) {
      notify('Biển số xe này đã được đăng ký.')
      return false
    }
    setStore((current) => ({
      ...current,
      vehicles: isEdit
        ? current.vehicles.map((item) => item.id === vehicle.id ? { ...vehicle, inParking: item.inParking } : item)
        : [vehicle, ...current.vehicles],
    }))
    setDialog(null)
    notify(isEdit ? 'Đã cập nhật phương tiện.' : 'Đã đăng ký phương tiện mới.')
    return true
  }

  async function deleteStudent(student: Student) {
    const linkedVehicles = store.vehicles.filter((vehicle) => vehicle.studentId === student.id)
    if (linkedVehicles.length > 0) {
      notify(`Không thể xóa: ${student.name} còn ${linkedVehicles.length} phương tiện đã đăng ký.`)
      return
    }
    if (!window.confirm(`Xóa sinh viên ${student.name}?`)) return
    if (!demoMode) {
      try {
        await api.deleteStudent(student.id)
        await refreshStore()
        notify('Đã xóa sinh viên.')
      } catch (error) {
        handleRequestError(error)
      }
      return
    }
    setStore((current) => ({ ...current, students: current.students.filter((item) => item.id !== student.id) }))
    notify('Đã xóa sinh viên.')
  }

  async function deleteVehicle(vehicle: Vehicle) {
    if (vehicle.inParking) {
      notify('Xe đang trong bãi. Hãy ghi nhận xe ra trước khi xóa.')
      return
    }
    if (!window.confirm(`Xóa phương tiện ${vehicle.plate}?`)) return
    if (!demoMode) {
      try {
        await api.deleteVehicle(vehicle.id)
        await refreshStore()
        notify('Đã xóa phương tiện.')
      } catch (error) {
        handleRequestError(error)
      }
      return
    }
    setStore((current) => ({ ...current, vehicles: current.vehicles.filter((item) => item.id !== vehicle.id) }))
    notify('Đã xóa phương tiện.')
  }

  async function updateSettings(settings: ParkingSettings) {
    if (settings.capacity < store.occupiedCount) {
      notify(`Sức chứa không thể thấp hơn số xe hiện có trong bãi (${store.occupiedCount}).`)
      return
    }
    if (!demoMode) {
      try {
        await api.updateSettings(settings)
        await refreshStore()
        notify('Đã lưu cài đặt bãi xe.')
      } catch (error) {
        handleRequestError(error)
      }
      return
    }
    setStore((current) => ({
      ...current,
      settings,
    }))
    notify('Đã lưu cài đặt bãi xe.')
  }

  async function renewTicket(student: Student) {
    if (!demoMode) {
      try {
        await api.renewTicket(student.id)
        await refreshStore()
        notify(`Đã gia hạn vé gửi xe cho ${student.name}.`)
      } catch (error) {
        handleRequestError(error)
      }
      return
    }
    const expiration = new Date(`${student.permitUntil}T00:00:00`)
    const today = new Date()
    if (expiration < today) {
      expiration.setTime(today.getTime())
    }
    expiration.setFullYear(expiration.getFullYear() + 1)
    const permitUntil = localDateKey(expiration)
    setStore((current) => ({
      ...current,
      students: current.students.map((item) => item.id === student.id
        ? { ...item, permitUntil, status: 'Đang hoạt động' }
        : item),
    }))
    notify(`Đã gia hạn vé gửi xe cho ${student.name} đến ${dateLabel(permitUntil)}.`)
  }

  function resetDemo() {
    if (!demoMode) return
    if (!window.confirm('Khôi phục toàn bộ dữ liệu mẫu? Các thay đổi hiện tại sẽ bị xóa.')) return
    setStore(initialStore)
    notify('Đã khôi phục dữ liệu mẫu.')
  }

  function handleRequestError(error: unknown) {
    const message = error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
    notify(message)
    if (error instanceof ApiError && error.status === 401) {
      api.clearSession()
      setUserRole(null)
      setAuthError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    }
  }

  async function logIn(email: string, password: string, demoRole: UserRole = 'admin') {
    if (demoMode) {
      try {
        localStorage.setItem(sessionKey, demoRole)
      } catch (error) {
        console.error('Không thể lưu phiên demo đã lưu.', error)
      }
      setUserRole(demoRole)
      setUserName(demoRole === 'admin' ? 'Admin Parkly' : 'Nhân viên bãi xe')
      setAuthError('')
      setActivePage('overview')
      return
    }
    try {
      const user: ApiUser = await api.login(email, password)
      setUserRole(user.role)
      setUserName(user.name)
      setDataStatus('loading')
      setAuthError('')
      setActivePage('overview')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Không thể đăng nhập.')
    }
  }

  async function register(name: string, email: string, password: string) {
    try {
      const user = await api.register(name, email, password)
      setUserRole(user.role)
      setUserName(user.name)
      setDataStatus('loading')
      setAuthError('')
      setActivePage('overview')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Không thể tạo tài khoản.')
    }
  }

  function logOut() {
    if (demoMode) {
      try {
        localStorage.removeItem(sessionKey)
      } catch (error) {
        console.error('Không thể xóa phiên demo khỏi trình duyệt.', error)
      }
    } else {
      api.clearSession()
    }
    setUserRole(null)
    setUserName('')
    setActivePage('overview')
  }

  if (authLoading) return <LoadingScreen label="Đang kiểm tra phiên đăng nhập..." />
  if (!userRole) return <LoginScreen demoMode={demoMode} error={authError} onLogin={logIn} onRegister={register} onClearError={() => setAuthError('')} />
  if (!demoMode && dataStatus === 'loading') return <LoadingScreen label="Đang tải dữ liệu bãi xe..." />
  if (!demoMode && dataStatus === 'error') {
    return <ApiUnavailableScreen onRetry={() => {
      setDataStatus('loading')
      refreshStore().catch((error: unknown) => {
        setDataStatus('error')
        notify(error instanceof Error ? error.message : 'Không thể tải dữ liệu từ API.')
      })
    }} onLogOut={logOut} message={notice} />
  }

  const visibleNavigation = userRole === 'admin'
    ? navigation
    : navigation.filter(({ id }) => id === 'overview' || id === 'movements' || id === 'vehicles')
  const activeInfo = pageInfo[activePage]
  const pageActions = activePage === 'overview'
    ? <button className="button button-primary" onClick={() => setDialog({ type: 'movement', movementType: 'Vào bãi' })} type="button"><Plus size={16} /> Ghi nhận xe</button>
    : activePage === 'movements'
      ? <div className="action-group">
          <button className="button button-secondary" onClick={() => setDialog({ type: 'movement', movementType: 'Ra bãi' })} type="button"><ArrowUpFromLine size={16} /> Xe ra</button>
          <button className="button button-primary" onClick={() => setDialog({ type: 'movement', movementType: 'Vào bãi' })} type="button"><ArrowDownToLine size={16} /> Xe vào</button>
        </div>
      : activePage === 'students'
        ? <button className="button button-primary" onClick={() => setDialog({ type: 'student' })} type="button"><Plus size={16} /> Thêm sinh viên</button>
        : activePage === 'vehicles'
          ? <button className="button button-primary" onClick={() => setDialog({ type: 'vehicle' })} type="button"><Plus size={16} /> Đăng ký xe</button>
          : activePage === 'reports'
            ? <button className="button button-secondary" onClick={() => downloadMovements(store)} type="button"><Download size={16} /> Xuất CSV</button>
            : null

  const sidebar = (
    <>
      <a className="brand" href="#" onClick={(event) => event.preventDefault()}>
        <span className="brand-mark"><ParkingSquare size={22} strokeWidth={2.2} /></span>
        <span className="brand-copy"><strong>parkly</strong><small>CAMPUS PARKING</small></span>
      </a>
      <div className="sidebar-heading">MENU CHÍNH</div>
      <nav className="nav-list" aria-label="Điều hướng chính">
        {visibleNavigation.map(({ id, label, icon: Icon }) => (
          <button className={`nav-item ${activePage === id ? 'nav-item-active' : ''}`} key={id} onClick={() => {
            setActivePage(id)
            setMobileMenuOpen(false)
          }} type="button">
            <Icon size={18} strokeWidth={1.9} /><span>{label}</span>
            {id === 'movements' ? <span className="nav-count">{todayMovements.length}</span> : null}
          </button>
        ))}
      </nav>
      <div className="sidebar-heading sidebar-heading-spaced">HỆ THỐNG</div>
      <nav className="nav-list" aria-label="Cài đặt và trợ giúp">
        {userRole === 'admin' ? <button className={`nav-item ${activePage === 'settings' ? 'nav-item-active' : ''}`} onClick={() => {
          setActivePage('settings')
          setMobileMenuOpen(false)
        }} type="button"><Settings size={18} strokeWidth={1.9} /><span>Cài đặt</span></button> : null}
        <button className="nav-item" onClick={() => notify('Hỗ trợ: liên hệ quản trị viên hệ thống của trường.')} type="button"><CircleHelp size={18} strokeWidth={1.9} /><span>Trợ giúp</span></button>
      </nav>
      <div className="sidebar-bottom">
        <div className="support-card"><div className="support-icon"><ShieldCheck size={18} /></div><div><strong>Bãi xe an toàn</strong><span>Đang hoạt động</span></div><span className="online-dot" /></div>
        <button className="profile-button" onClick={logOut} type="button" title="Đăng xuất">
          <span className="avatar avatar-admin">{userRole === 'admin' ? initials(userName || 'Admin') : initials(userName || 'Nhân viên')}</span><span className="profile-copy"><strong>{userName}</strong><small>{userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên'}</small></span><LogOut size={16} className="profile-more" />
        </button>
      </div>
    </>
  )

  return (
    <div className="app-shell min-h-screen bg-slate-50 text-slate-800">
      <aside className="sidebar">{sidebar}</aside>
      {mobileMenuOpen ? (
        <div className="mobile-sidebar-overlay" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setMobileMenuOpen(false)
        }}>
          <aside className="mobile-sidebar">
            <button className="mobile-close" onClick={() => setMobileMenuOpen(false)} type="button" aria-label="Đóng menu"><X size={20} /></button>
            {sidebar}
          </aside>
        </div>
      ) : null}
      <main className="main-panel">
        <header className="topbar">
          <button className="mobile-menu-button icon-button" onClick={() => setMobileMenuOpen(true)} type="button" aria-label="Mở menu"><Menu size={20} /></button>
          <div className="breadcrumb"><span>Parkly</span><ChevronRight size={14} /><strong>{activeInfo.title}</strong></div>
          <div className="topbar-actions">
            <div className="date-chip"><CalendarDays size={15} /><span>{new Intl.DateTimeFormat('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' }).format(appDate)}</span></div>
            <button className="icon-button notification-button" aria-label="Thông báo" onClick={() => notify('Không có thông báo mới.')} type="button"><Bell size={18} /></button>
            <button className="topbar-user" onClick={() => notify(`${userName} · ${userRole === 'admin' ? 'Quản trị viên' : 'Nhân viên'}.`)} type="button"><span className="avatar avatar-admin">{userRole === 'admin' ? 'AD' : 'NV'}</span><ChevronDown size={15} /></button>
          </div>
        </header>
        <div className="page-content">
          {notice ? <div className="notice-banner" role="status"><Check size={16} /><span>{notice}</span><button onClick={() => setNotice('')} type="button" aria-label="Đóng thông báo"><X size={16} /></button></div> : null}
          <PageHeading title={activeInfo.title} subtitle={activeInfo.subtitle} actions={pageActions} />
          {activePage === 'overview' ? <OverviewPage store={store} todayMovements={todayMovements} onNavigate={setActivePage} onMovement={(movementType) => setDialog({ type: 'movement', movementType })} /> : null}
          {activePage === 'movements' ? <MovementsPage store={store} onMovement={(movementType) => setDialog({ type: 'movement', movementType })} /> : null}
          {activePage === 'students' ? <StudentsPage students={store.students} vehicles={store.vehicles} onAdd={() => setDialog({ type: 'student' })} onEdit={(student) => setDialog({ type: 'student', student })} onDelete={deleteStudent} /> : null}
          {activePage === 'vehicles' ? <VehiclesPage store={store} onAdd={() => setDialog({ type: 'vehicle' })} onEdit={(vehicle) => setDialog({ type: 'vehicle', vehicle })} onDelete={deleteVehicle} onMovement={(movementType) => setDialog({ type: 'movement', movementType })} /> : null}
          {activePage === 'tickets' && userRole === 'admin' ? <TicketsPage students={store.students} vehicles={store.vehicles} onRenew={renewTicket} /> : null}
          {activePage === 'reports' ? <ReportsPage store={store} todayMovements={todayMovements} /> : null}
          {activePage === 'settings' ? <SettingsPage settings={store.settings} onSave={updateSettings} onReset={demoMode ? resetDemo : undefined} /> : null}
          <footer className="page-footer"><span>© {appDate.getFullYear()} {store.settings.schoolName}</span><span><span className="footer-status" /> {demoMode ? 'Dữ liệu demo lưu trên trình duyệt' : 'Dữ liệu từ API NestJS'} <span className="footer-divider">·</span> Parkly 1.0</span></footer>
        </div>
      </main>
      {dialog ? <AppDialog dialog={dialog} store={store} onClose={() => setDialog(null)} onMovement={recordMovement} onSaveStudent={saveStudent} onSaveVehicle={saveVehicle} /> : null}
    </div>
  )
}

function dialogStudentId(dialog: Dialog) {
  return dialog?.type === 'student' ? dialog.student?.id : undefined
}

function dialogVehicleId(dialog: Dialog) {
  return dialog?.type === 'vehicle' ? dialog.vehicle?.id : undefined
}

function LoginScreen({ demoMode: isDemoMode, error, onLogin, onRegister, onClearError }: {
  demoMode: boolean
  error: string
  onLogin: (email: string, password: string, demoRole?: UserRole) => Promise<void>
  onRegister: (name: string, email: string, password: string) => Promise<void>
  onClearError: () => void
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [role, setRole] = useState<UserRole>('admin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError('')
    if (mode === 'register' && password !== confirmPassword) {
      setFormError('Mật khẩu xác nhận không khớp.')
      return
    }
    setSubmitting(true)
    try {
      if (mode === 'register') {
        await onRegister(name, email, password)
      } else {
        await onLogin(email, password, role)
      }
    } finally {
      setSubmitting(false)
    }
  }

  function changeMode(nextMode: 'login' | 'register') {
    setMode(nextMode)
    setFormError('')
    onClearError()
  }

  return (
    <main className="login-shell">
      <section className="login-card">
        <a className="brand login-brand" href="#" onClick={(event) => event.preventDefault()}>
          <span className="brand-mark"><ParkingSquare size={22} strokeWidth={2.2} /></span>
          <span className="brand-copy"><strong>parkly</strong><small>CAMPUS PARKING</small></span>
        </a>
        <div className="login-eyebrow"><span className="eyebrow-dot" /> {isDemoMode ? 'CHẾ ĐỘ XEM TRƯỚC' : mode === 'login' ? 'ĐĂNG NHẬP HỆ THỐNG' : 'TẠO TÀI KHOẢN'}</div>
        <h1>{mode === 'login' ? 'Chào mừng đến với Parkly' : 'Tạo tài khoản Parkly'}</h1>
        <p className="login-description">{isDemoMode ? 'Chọn vai trò để xem trước giao diện quản lý bãi xe.' : mode === 'login' ? 'Đăng nhập để tiếp tục quản lý bãi xe.' : 'Đăng ký tài khoản nhân viên để bắt đầu sử dụng hệ thống.'}</p>
        {isDemoMode ? (
          <div className="role-picker" aria-label="Chọn vai trò demo">
            <button className={`role-option ${role === 'admin' ? 'role-option-active' : ''}`} onClick={() => setRole('admin')} type="button" aria-pressed={role === 'admin'}>
              <span className="role-icon role-icon-admin"><Settings size={19} /></span>
              <span><strong>Quản trị viên</strong><small>Quản lý toàn bộ hệ thống</small></span>
              <span className="role-radio" />
            </button>
            <button className={`role-option ${role === 'staff' ? 'role-option-active' : ''}`} onClick={() => setRole('staff')} type="button" aria-pressed={role === 'staff'}>
              <span className="role-icon role-icon-staff"><ParkingSquare size={19} /></span>
              <span><strong>Nhân viên bãi xe</strong><small>Ghi nhận lượt xe và tra cứu</small></span>
              <span className="role-radio" />
            </button>
          </div>
        ) : null}
        <form className="login-form" onSubmit={submit}>
          {!isDemoMode ? <>
            {mode === 'register' ? <label className="form-label">Họ và tên<input autoComplete="name" maxLength={100} onChange={(event) => setName(event.target.value)} required type="text" value={name} /></label> : null}
            <label className="form-label">Email<input autoComplete="username" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
            <label className="form-label">Mật khẩu<input autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 8 : undefined} maxLength={mode === 'register' ? 72 : undefined} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
            {mode === 'register' ? <label className="form-label">Xác nhận mật khẩu<input autoComplete="new-password" minLength={8} maxLength={72} onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} /></label> : null}
          </> : null}
          {formError || error ? <div className="form-error" role="alert">{formError || error}</div> : null}
          <button className="button button-primary login-submit" disabled={submitting} type="submit">{submitting ? mode === 'register' ? 'Đang tạo tài khoản...' : 'Đang đăng nhập...' : isDemoMode ? 'Vào giao diện demo' : mode === 'register' ? 'Tạo tài khoản' : 'Đăng nhập'} <ChevronRight size={16} /></button>
        </form>
        {!isDemoMode ? <p className="auth-switch">{mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'} <button onClick={() => changeMode(mode === 'login' ? 'register' : 'login')} type="button">{mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}</button></p> : null}
        <div className="login-disclaimer"><ShieldCheck size={15} /><span>{isDemoMode ? 'Dữ liệu mẫu chỉ lưu trên trình duyệt này.' : mode === 'register' ? 'Tài khoản tự đăng ký có quyền nhân viên; quyền quản trị do hệ thống cấp.' : 'Kết nối bảo mật tới API NestJS; tài khoản được quản lý bởi hệ thống.'}</span></div>
      </section>
      <div className="login-footer">© {appYear} Parkly Campus Parking</div>
    </main>
  )
}

function LoadingScreen({ label }: { label: string }) {
  return <main className="loading-screen"><span className="loading-spinner" /><p>{label}</p></main>
}

function ApiUnavailableScreen({ onRetry, onLogOut, message }: {
  onRetry: () => void
  onLogOut: () => void
  message: string
}) {
  return (
    <main className="loading-screen">
      <span className="api-error-icon"><CircleAlert size={24} /></span>
      <h1>Không tải được dữ liệu</h1>
      <p>{message || 'Kiểm tra kết nối tới API và PostgreSQL rồi thử lại.'}</p>
      <div className="api-error-actions"><button className="button button-primary" onClick={onRetry} type="button">Thử lại</button><button className="button button-secondary" onClick={onLogOut} type="button">Đăng xuất</button></div>
    </main>
  )
}

function PageHeading({ title, subtitle, actions }: { title: string; subtitle: string; actions?: ReactNode }) {
  return (
    <section className="page-heading">
      <div><div className="eyebrow"><span className="eyebrow-dot" /> QUẢN LÝ BÃI XE</div><h1>{title}</h1><p>{subtitle}</p></div>
      {actions ? <div className="heading-actions">{actions}</div> : null}
    </section>
  )
}

function OverviewPage({ store, todayMovements, onNavigate, onMovement }: {
  store: DemoStore
  todayMovements: Movement[]
  onNavigate: (page: Page) => void
  onMovement: (type: MovementType) => void
}) {
  const entries = todayMovements.filter((item) => item.type === 'Vào bãi').length
  const exits = todayMovements.length - entries
  const occupancyPercent = Math.min(100, Math.round(store.occupiedCount / store.settings.capacity * 100))
  const expiring = store.students.filter((student) => student.status !== 'Đang hoạt động').length
  const recent = store.movements.slice(0, 5)

  return (
    <>
      <section className="stats-grid" aria-label="Thống kê hôm nay">
        <StatCard label="Xe đang trong bãi" value={store.occupiedCount} unit="xe" icon={<ParkingSquare size={18} />} color="blue" foot={`${occupancyPercent}% công suất bãi`} progress={occupancyPercent} />
        <StatCard label="Lượt xe vào hôm nay" value={entries} unit="lượt" icon={<ArrowDownToLine size={18} />} color="green" foot="Từ đầu ngày đến nay" />
        <StatCard label="Lượt xe ra hôm nay" value={exits} unit="lượt" icon={<ArrowUpFromLine size={18} />} color="orange" foot="Từ đầu ngày đến nay" />
        <StatCard label="Thẻ cần kiểm tra" value={expiring} unit="trường hợp" icon={<CircleAlert size={18} />} color="red" foot="Hết hạn hoặc sắp hết hạn" />
      </section>
      <section className="overview-grid">
        <article className="panel occupancy-panel">
          <PanelHeading title="Tình trạng bãi xe" subtitle="Sức chứa và số xe đang gửi" />
          <div className="occupancy-summary"><div className="occupancy-number">{store.occupiedCount} <span>/ {store.settings.capacity} chỗ</span></div><div className="occupancy-percent"><span className="occupancy-dot" />{occupancyPercent}% đang sử dụng</div></div>
          <div className="capacity-track capacity-track-large"><span style={{ width: `${occupancyPercent}%` }} /></div>
          <div className="zone-list">
            {[
              { label: 'Khu A', detail: 'Xe máy', used: Math.round(store.occupiedCount * .34), total: Math.round(store.settings.capacity * .34), color: 'blue' },
              { label: 'Khu B', detail: 'Xe máy', used: Math.round(store.occupiedCount * .4), total: Math.round(store.settings.capacity * .39), color: 'green' },
              { label: 'Khu C', detail: 'Xe điện & xe đạp', used: Math.round(store.occupiedCount * .26), total: store.settings.capacity - Math.round(store.settings.capacity * .73), color: 'orange' },
            ].map((area) => <div className="zone-row" key={area.label}><span className={`area-badge area-${area.color}`}>{area.label.slice(-1)}</span><span className="zone-name"><strong>{area.label}</strong><small>{area.detail}</small></span><div className="zone-track"><span className={`zone-fill fill-${area.color}`} style={{ width: `${Math.min(100, area.used / Math.max(1, area.total) * 100)}%` }} /></div><span className="zone-count">{area.used}<small> / {area.total}</small></span></div>)}
          </div>
          <button className="text-link" onClick={() => onNavigate('vehicles')} type="button">Xem danh sách phương tiện <ChevronRight size={14} /></button>
        </article>
        <article className="panel trend-panel">
          <PanelHeading title="Hoạt động hôm nay" subtitle="Các lượt xe vào và ra mới nhất" action={<button className="select-button" onClick={() => onNavigate('movements')} type="button">Xem tất cả <ChevronRight size={14} /></button>} />
          <div className="mini-chart" aria-label={`Hôm nay có ${entries} lượt vào và ${exits} lượt ra`}>
            <div className="chart-legend"><span><i className="legend-line line-in" /> Xe vào</span><span><i className="legend-line line-out" /> Xe ra</span></div>
            <div className="mini-chart-bars">{[0, 1, 2, 3, 4, 5].map((index) => <div className="bar-group" key={index}><span className="bar-pair"><i style={{ height: `${18 + ((entries + index * 11) % 46)}%` }} /><i style={{ height: `${15 + ((exits + index * 7) % 36)}%` }} /></span><small>{['07:00', '08:00', '09:00', '10:00', '11:00', '12:00'][index]}</small></div>)}</div>
          </div>
          <div className="peak-note"><span className="peak-icon"><Clock3 size={15} /></span><span><strong>Giờ cao điểm</strong><small>Lưu lượng thường đông nhất vào 07:30 – 08:15</small></span></div>
        </article>
      </section>
      <section className="panel activity-panel">
        <PanelHeading title="Lượt gửi xe gần đây" subtitle="Cập nhật mới nhất trong hệ thống" action={<button className="view-all-button" onClick={() => onNavigate('movements')} type="button">Xem lịch sử <ChevronRight size={14} /></button>} />
        <MovementTable movements={recent} emptyMessage="Chưa có lượt gửi xe nào." />
        <div className="table-footer"><span>Hiển thị <strong>{recent.length}</strong> lượt mới nhất</span><button className="pagination-button" onClick={() => onMovement('Vào bãi')} type="button"><Plus size={13} /> Ghi nhận lượt xe</button></div>
      </section>
    </>
  )
}

function StatCard({ label, value, unit, icon, color, foot, progress }: {
  label: string
  value: number
  unit: string
  icon: ReactNode
  color: string
  foot: string
  progress?: number
}) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span className="stat-label">{label}</span><span className={`stat-icon stat-icon-${color}`}>{icon}</span></div>
      <div className="stat-value">{value.toLocaleString('vi-VN')} <span>{unit}</span></div>
      <div className="stat-foot"><span>{foot}</span></div>
      {progress !== undefined ? <div className="capacity-track"><span style={{ width: `${progress}%` }} /></div> : null}
    </article>
  )
}

function PanelHeading({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return <div className="panel-heading"><div><h2>{title}</h2><p>{subtitle}</p></div>{action}</div>
}

function MovementsPage({ store, onMovement }: { store: DemoStore; onMovement: (type: MovementType) => void }) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<'Tất cả' | MovementType>('Tất cả')
  const [period, setPeriod] = useState('today')
  const movements = useMemo(() => store.movements.filter((item) => {
    const query = normalized(search)
    const matchesText = !query || normalized(item.studentName).includes(query) || normalized(item.studentId).includes(query) || normalized(item.plate).includes(query)
    const matchesType = typeFilter === 'Tất cả' || item.type === typeFilter
    const matchesDate = period === 'all' || localDateKey(new Date(item.timestamp)) === currentDateKey()
    return matchesText && matchesType && matchesDate
  }), [period, search, store.movements, typeFilter])

  return (
    <section className="panel list-panel">
      <div className="list-summary"><span><strong>{movements.length}</strong> lượt xe {period === 'today' ? 'hôm nay' : 'được ghi nhận'}</span><span className="summary-dot" /> <span>{store.vehicles.filter((vehicle) => vehicle.inParking).length} xe đã đăng ký đang ở trong bãi</span></div>
      <div className="list-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Lọc trạng thái lượt xe">
          {(['Tất cả', 'Vào bãi', 'Ra bãi'] as const).map((filter) => <button className={`filter-tab ${typeFilter === filter ? 'filter-tab-active' : ''}`} key={filter} onClick={() => setTypeFilter(filter)} role="tab" aria-selected={typeFilter === filter} type="button">{filter}</button>)}
        </div>
        <div className="table-actions">
          <label className="search-field"><Search size={16} /><input aria-label="Tìm tên, mã sinh viên hoặc biển số" onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, biển số..." value={search} /></label>
          <select className="filter-button" aria-label="Khoảng thời gian" onChange={(event) => setPeriod(event.target.value)} value={period}><option value="today">Hôm nay</option><option value="all">Tất cả thời gian</option></select>
        </div>
      </div>
      <MovementTable movements={movements} emptyMessage="Không tìm thấy lượt xe phù hợp." />
      <div className="table-footer"><span>Đang hiển thị <strong>{movements.length}</strong> lượt xe</span><span className="demo-caption">Bản demo lưu dữ liệu trên thiết bị này</span></div>
      <div className="inline-quick-actions"><span>Ghi nhận nhanh</span><button className="button button-secondary" onClick={() => onMovement('Ra bãi')} type="button"><ArrowUpFromLine size={15} /> Xe ra</button><button className="button button-primary" onClick={() => onMovement('Vào bãi')} type="button"><ArrowDownToLine size={15} /> Xe vào</button></div>
    </section>
  )
}

function MovementTable({ movements, emptyMessage }: { movements: Movement[]; emptyMessage: string }) {
  return (
    <div className="table-scroll">
      <table className="activity-table">
        <thead><tr><th>SINH VIÊN</th><th>BIỂN SỐ XE</th><th>LOẠI XE</th><th>TRẠNG THÁI</th><th>THỜI GIAN</th><th>CỔNG</th></tr></thead>
        <tbody>
          {movements.length ? movements.map((movement) => <tr key={movement.id}>
            <td><div className="student-cell"><span className="avatar student-avatar avatar-0">{initials(movement.studentName)}</span><span><strong>{movement.studentName}</strong><small>{movement.studentId}</small></span></div></td>
            <td><span className="plate-number">{movement.plate}</span></td>
            <td><span className="vehicle-type"><Bike size={15} />{movement.vehicleType}</span></td>
            <td><MovementBadge type={movement.type} /></td>
            <td><span className="time-cell"><Clock3 size={14} />{dateTimeLabel(movement.timestamp)}</span></td>
            <td><span className="gate-cell">{movement.gate}</span></td>
          </tr>) : <tr><td className="empty-state" colSpan={6}>{emptyMessage}</td></tr>}
        </tbody>
      </table>
    </div>
  )
}

function MovementBadge({ type }: { type: MovementType }) {
  const isEntry = type === 'Vào bãi'
  return <span className={`movement-badge ${isEntry ? 'movement-in' : 'movement-out'}`}><i />{type}</span>
}

function StudentsPage({ students, vehicles, onAdd, onEdit, onDelete }: {
  students: Student[]
  vehicles: Vehicle[]
  onAdd: () => void
  onEdit: (student: Student) => void
  onDelete: (student: Student) => void
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | PermitStatus>('Tất cả')
  const filtered = useMemo(() => students.filter((student) => {
    const query = normalized(search)
    const matchesSearch = !query || normalized(student.name).includes(query) || normalized(student.id).includes(query) || normalized(student.className).includes(query)
    return matchesSearch && (statusFilter === 'Tất cả' || student.status === statusFilter)
  }), [search, statusFilter, students])

  return (
    <section className="panel list-panel">
      <div className="list-summary"><span><strong>{students.length}</strong> sinh viên</span><span className="summary-dot" /><span>{students.filter((item) => item.status === 'Đang hoạt động').length} thẻ đang hoạt động</span></div>
      <div className="list-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Lọc trạng thái thẻ">
          {(['Tất cả', 'Đang hoạt động', 'Sắp hết hạn', 'Hết hạn'] as const).map((filter) => <button className={`filter-tab ${statusFilter === filter ? 'filter-tab-active' : ''}`} key={filter} onClick={() => setStatusFilter(filter)} role="tab" aria-selected={statusFilter === filter} type="button">{filter}</button>)}
        </div>
        <label className="search-field"><Search size={16} /><input aria-label="Tìm sinh viên" onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên, mã sinh viên..." value={search} /></label>
      </div>
      <div className="table-scroll">
        <table className="activity-table management-table">
          <thead><tr><th>SINH VIÊN</th><th>LỚP / CHUYÊN NGÀNH</th><th>LIÊN HỆ</th><th>PHƯƠNG TIỆN</th><th>THẺ GỬI XE</th><th>HẠN SỬ DỤNG</th><th>THAO TÁC</th></tr></thead>
          <tbody>{filtered.length ? filtered.map((student, index) => {
            const count = vehicles.filter((vehicle) => vehicle.studentId === student.id).length
            return <tr key={student.id}>
              <td><div className="student-cell"><span className={`avatar student-avatar avatar-${index % 4}`}>{initials(student.name)}</span><span><strong>{student.name}</strong><small>{student.id}</small></span></div></td>
              <td><span className="stack-cell"><strong>{student.className}</strong><small>{student.program}</small></span></td>
              <td>{student.phone}</td>
              <td><span className="count-pill">{count} xe</span></td>
              <td><StatusBadge status={student.status} /></td>
              <td>{dateLabel(student.permitUntil)}</td>
              <td><RowActions onEdit={() => onEdit(student)} onDelete={() => onDelete(student)} /></td>
            </tr>
          }) : <tr><td className="empty-state" colSpan={7}>Không tìm thấy sinh viên phù hợp.</td></tr>}</tbody>
        </table>
      </div>
      <div className="table-footer"><span>Hiển thị <strong>{filtered.length}</strong> trên <strong>{students.length}</strong> sinh viên</span><button className="pagination-button" onClick={onAdd} type="button"><Plus size={13} /> Thêm sinh viên</button></div>
    </section>
  )
}

function TicketsPage({ students, vehicles, onRenew }: {
  students: Student[]
  vehicles: Vehicle[]
  onRenew: (student: Student) => void
}) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'Tất cả' | PermitStatus>('Tất cả')
  const filtered = useMemo(() => students.filter((student) => {
    const query = normalized(search)
    const matchesSearch = !query || normalized(student.name).includes(query) || normalized(student.id).includes(query) || normalized(student.className).includes(query)
    return matchesSearch && (statusFilter === 'Tất cả' || student.status === statusFilter)
  }), [search, statusFilter, students])
  const activeTickets = students.filter((student) => student.status === 'Đang hoạt động').length
  const attentionTickets = students.length - activeTickets

  return (
    <section className="panel list-panel">
      <div className="ticket-summary">
        <div><span>Vé đang hoạt động</span><strong>{activeTickets}</strong></div>
        <div><span>Cần gia hạn / hết hạn</span><strong className="ticket-attention">{attentionTickets}</strong></div>
        <div><span>Phương tiện đã đăng ký</span><strong>{vehicles.length}</strong></div>
      </div>
      <div className="list-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Lọc trạng thái vé">
          {(['Tất cả', 'Đang hoạt động', 'Sắp hết hạn', 'Hết hạn'] as const).map((filter) => <button className={`filter-tab ${statusFilter === filter ? 'filter-tab-active' : ''}`} key={filter} onClick={() => setStatusFilter(filter)} role="tab" aria-selected={statusFilter === filter} type="button">{filter}</button>)}
        </div>
        <label className="search-field"><Search size={16} /><input aria-label="Tìm vé gửi xe" onChange={(event) => setSearch(event.target.value)} placeholder="Tìm sinh viên, mã vé..." value={search} /></label>
      </div>
      <div className="table-scroll">
        <table className="activity-table management-table">
          <thead><tr><th>MÃ VÉ</th><th>SINH VIÊN</th><th>PHƯƠNG TIỆN</th><th>NGÀY HẾT HẠN</th><th>TRẠNG THÁI</th><th>THAO TÁC</th></tr></thead>
          <tbody>{filtered.length ? filtered.map((student, index) => {
            const studentVehicles = vehicles.filter((vehicle) => vehicle.studentId === student.id)
            return <tr key={student.id}>
              <td><span className="ticket-id">PK-{student.id}</span></td>
              <td><div className="student-cell"><span className={`avatar student-avatar avatar-${index % 4}`}>{initials(student.name)}</span><span><strong>{student.name}</strong><small>{student.className}</small></span></div></td>
              <td><span className="count-pill">{studentVehicles.length} xe đăng ký</span></td>
              <td>{dateLabel(student.permitUntil)}</td>
              <td><StatusBadge status={student.status} /></td>
              <td>{student.status === 'Đang hoạt động'
                ? <span className="ticket-current">Còn hiệu lực</span>
                : <button className="renew-button" onClick={() => onRenew(student)} type="button"><Check size={13} /> Gia hạn</button>}</td>
            </tr>
          }) : <tr><td className="empty-state" colSpan={6}>Không tìm thấy vé gửi xe phù hợp.</td></tr>}</tbody>
        </table>
      </div>
      <div className="table-footer"><span>Hiển thị <strong>{filtered.length}</strong> trên <strong>{students.length}</strong> vé</span><span className="demo-caption">Mỗi sinh viên có một vé trong bản demo</span></div>
    </section>
  )
}

function VehiclesPage({ store, onAdd, onEdit, onDelete, onMovement }: {
  store: DemoStore
  onAdd: () => void
  onEdit: (vehicle: Vehicle) => void
  onDelete: (vehicle: Vehicle) => void
  onMovement: (type: MovementType) => void
}) {
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState<'Tất cả' | 'Trong bãi' | 'Ngoài bãi'>('Tất cả')
  const filtered = useMemo(() => store.vehicles.filter((vehicle) => {
    const student = store.students.find((item) => item.id === vehicle.studentId)
    const query = normalized(search)
    const matchesSearch = !query || normalized(vehicle.plate).includes(query) || normalized(student?.name ?? '').includes(query) || normalized(vehicle.type).includes(query)
    const matchesState = stateFilter === 'Tất cả' || (stateFilter === 'Trong bãi' ? vehicle.inParking : !vehicle.inParking)
    return matchesSearch && matchesState
  }), [search, stateFilter, store.students, store.vehicles])

  return (
    <section className="panel list-panel">
      <div className="list-summary"><span><strong>{store.vehicles.length}</strong> phương tiện</span><span className="summary-dot" /><span>{store.vehicles.filter((item) => item.inParking).length} xe đang ở trong bãi</span></div>
      <div className="list-toolbar">
        <div className="filter-tabs" role="tablist" aria-label="Lọc trạng thái phương tiện">
          {(['Tất cả', 'Trong bãi', 'Ngoài bãi'] as const).map((filter) => <button className={`filter-tab ${stateFilter === filter ? 'filter-tab-active' : ''}`} key={filter} onClick={() => setStateFilter(filter)} role="tab" aria-selected={stateFilter === filter} type="button">{filter}</button>)}
        </div>
        <label className="search-field"><Search size={16} /><input aria-label="Tìm phương tiện" onChange={(event) => setSearch(event.target.value)} placeholder="Tìm biển số, sinh viên..." value={search} /></label>
      </div>
      <div className="table-scroll">
        <table className="activity-table management-table">
          <thead><tr><th>PHƯƠNG TIỆN</th><th>CHỦ SỞ HỮU</th><th>LOẠI XE</th><th>MÀU XE</th><th>ĐĂNG KÝ</th><th>TRẠNG THÁI</th><th>THAO TÁC</th></tr></thead>
          <tbody>{filtered.length ? filtered.map((vehicle, index) => {
            const student = store.students.find((item) => item.id === vehicle.studentId)
            return <tr key={vehicle.id}>
              <td><span className="stack-cell"><strong className="plate-number">{vehicle.plate}</strong><small>Mã xe · {vehicle.id.slice(-4).toUpperCase()}</small></span></td>
              <td><div className="student-cell"><span className={`avatar student-avatar avatar-${index % 4}`}>{initials(student?.name ?? '?')}</span><span><strong>{student?.name ?? 'Không xác định'}</strong><small>{vehicle.studentId}</small></span></div></td>
              <td><span className="vehicle-type"><Bike size={15} />{vehicle.type}</span></td>
              <td>{vehicle.color}</td>
              <td>{dateLabel(vehicle.registeredAt)}</td>
              <td><span className={`movement-badge ${vehicle.inParking ? 'movement-in' : 'movement-out'}`}><i />{vehicle.inParking ? 'Trong bãi' : 'Ngoài bãi'}</span></td>
              <td><RowActions onEdit={() => onEdit(vehicle)} onDelete={() => onDelete(vehicle)} /></td>
            </tr>
          }) : <tr><td className="empty-state" colSpan={7}>Không tìm thấy phương tiện phù hợp.</td></tr>}</tbody>
        </table>
      </div>
      <div className="table-footer"><span>Hiển thị <strong>{filtered.length}</strong> trên <strong>{store.vehicles.length}</strong> phương tiện</span><button className="pagination-button" onClick={() => onMovement('Vào bãi')} type="button"><ArrowDownToLine size={13} /> Ghi nhận xe vào</button></div>
      <div className="inline-quick-actions"><span>Chú ý: xe đang trong bãi cần ghi nhận xe ra trước khi xóa.</span><button className="button button-secondary" onClick={() => onAdd()} type="button"><Plus size={14} /> Đăng ký phương tiện</button></div>
    </section>
  )
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return <div className="row-actions"><button className="row-action" aria-label="Chỉnh sửa" onClick={onEdit} type="button"><Edit3 size={15} /></button><button className="row-action row-action-delete" aria-label="Xóa" onClick={onDelete} type="button"><Trash2 size={15} /></button></div>
}

function StatusBadge({ status }: { status: PermitStatus }) {
  const className = status === 'Đang hoạt động' ? 'status-active' : status === 'Sắp hết hạn' ? 'status-expiring' : 'status-expired'
  return <span className={`status-badge ${className}`}><i />{status}</span>
}

function ReportsPage({ store, todayMovements }: { store: DemoStore; todayMovements: Movement[] }) {
  const [period, setPeriod] = useState('7')
  const [asOfDate] = useState(() => new Date())
  const weekdays = useMemo(() => {
    const days = Number(period)
    return Array.from({ length: days }, (_, index) => {
      const date = new Date(asOfDate)
      date.setDate(date.getDate() - (days - index - 1))
      const key = localDateKey(date)
      const rows = store.movements.filter((movement) => localDateKey(new Date(movement.timestamp)) === key)
      return {
        label: new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(date),
        entries: rows.filter((movement) => movement.type === 'Vào bãi').length,
        exits: rows.filter((movement) => movement.type === 'Ra bãi').length,
      }
    })
  }, [asOfDate, period, store.movements])
  const peak = Math.max(1, ...weekdays.flatMap((day) => [day.entries, day.exits]))

  return (
    <>
      <section className="report-stats">
        <StatCard label="Lượt xe trong ngày" value={todayMovements.length} unit="lượt" icon={<ArrowDownUp size={18} />} color="blue" foot="Tất cả lượt vào và ra" />
        <StatCard label="Xe đang trong bãi" value={store.occupiedCount} unit="xe" icon={<ParkingSquare size={18} />} color="green" foot={`Sức chứa ${store.settings.capacity} chỗ`} />
        <StatCard label="Sinh viên hoạt động" value={store.students.filter((student) => student.status === 'Đang hoạt động').length} unit="người" icon={<UsersRound size={18} />} color="orange" foot={`${store.vehicles.length} phương tiện đã đăng ký`} />
      </section>
      <section className="panel report-panel">
        <div className="panel-heading"><div><h2>Lưu lượng xe</h2><p>Thống kê lượt xe vào và ra theo ngày{demoMode ? ' · Dữ liệu demo' : ''}</p></div><select className="filter-button" aria-label="Khoảng thời gian báo cáo" onChange={(event) => setPeriod(event.target.value)} value={period}><option value="7">7 ngày gần nhất</option><option value="14">14 ngày gần nhất</option></select></div>
        <div className="chart-legend"><span><i className="legend-line line-in" /> Xe vào</span><span><i className="legend-line line-out" /> Xe ra</span></div>
        <div className="report-chart" style={{ gridTemplateColumns: `repeat(${weekdays.length}, minmax(0, 1fr))` }}>{weekdays.map((day) => <div className="report-day" key={day.label}><div className="report-bars"><span className="report-bar bar-entry" style={{ height: `${day.entries / peak * 100}%` }} title={`${day.entries} lượt vào`} /><span className="report-bar bar-exit" style={{ height: `${day.exits / peak * 100}%` }} title={`${day.exits} lượt ra`} /></div><small>{day.label}</small></div>)}</div>
        {demoMode ? <div className="report-note"><CircleAlert size={15} /><span>Đây là dữ liệu mẫu để xem trước giao diện.</span></div> : null}
      </section>
      <section className="panel report-breakdown">
        <PanelHeading title="Tổng quan hệ thống" subtitle="Số liệu hiện tại" />
        <div className="breakdown-grid">
          <Breakdown label="Tổng sinh viên" value={store.students.length.toString()} detail="Hồ sơ đã đăng ký" />
          <Breakdown label="Tổng phương tiện" value={store.vehicles.length.toString()} detail="Xe đang quản lý" />
          <Breakdown label="Thẻ cần chú ý" value={store.students.filter((student) => student.status !== 'Đang hoạt động').length.toString()} detail="Sắp hết hạn hoặc hết hạn" />
          <Breakdown label="Chỗ còn trống" value={Math.max(0, store.settings.capacity - store.occupiedCount).toString()} detail={`Trên ${store.settings.capacity} chỗ đỗ`} />
        </div>
      </section>
    </>
  )
}

function Breakdown({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="breakdown-card"><span>{label}</span><strong>{value}</strong><small>{detail}</small></div>
}

function SettingsPage({ settings, onSave, onReset }: {
  settings: ParkingSettings
  onSave: (settings: ParkingSettings) => void
  onReset?: () => void
}) {
  const [form, setForm] = useState(settings)
  const update = (key: keyof ParkingSettings, value: string | number) => setForm((current) => ({ ...current, [key]: value }))

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave(form)
  }

  return (
    <form className="settings-layout" onSubmit={submit}>
      <section className="panel settings-panel">
        <PanelHeading title="Thông tin bãi xe" subtitle="Thông tin hiển thị trong hệ thống quản lý." />
        <div className="settings-form-grid">
          <label className="form-label">Tên trường<input onChange={(event) => update('schoolName', event.target.value)} required value={form.schoolName} /></label>
          <label className="form-label">Tên bãi xe<input onChange={(event) => update('lotName', event.target.value)} required value={form.lotName} /></label>
          <label className="form-label">Sức chứa tối đa<input min={storeMinCapacity} onChange={(event) => update('capacity', Number(event.target.value))} required type="number" value={form.capacity} /></label>
          <label className="form-label">Tên cổng mặc định<input onChange={(event) => update('mainGate', event.target.value)} required value={form.mainGate} /></label>
          <label className="form-label settings-full-width">Email liên hệ<input onChange={(event) => update('contactEmail', event.target.value)} required type="email" value={form.contactEmail} /></label>
        </div>
        <div className="settings-actions"><span>Thay đổi được lưu trong trình duyệt hiện tại.</span><button className="button button-primary" type="submit"><Check size={15} /> Lưu thay đổi</button></div>
      </section>
      <aside className="panel settings-info">
        <div className="support-icon"><ShieldCheck size={18} /></div><h3>Chế độ demo</h3>
        <p>Dữ liệu được lưu cục bộ trên trình duyệt. Khi kết nối backend NestJS, các thao tác sẽ được chuyển sang API và PostgreSQL.</p>
        <div className="settings-info-row"><span>Trạng thái</span><strong><i className="online-dot" /> Đang hoạt động</strong></div>
        <div className="settings-info-row"><span>Phiên bản</span><strong>Parkly 1.0</strong></div>
        {onReset ? <button className="reset-demo-button" onClick={onReset} type="button"><Trash2 size={14} /> Khôi phục dữ liệu mẫu</button> : null}
      </aside>
    </form>
  )
}

const storeMinCapacity = 1

function AppDialog({ dialog, store, onClose, onMovement, onSaveStudent, onSaveVehicle }: {
  dialog: Exclude<Dialog, null>
  store: DemoStore
  onClose: () => void
  onMovement: (type: MovementType, vehicleId: string) => void
  onSaveStudent: (student: Student, isEdit: boolean) => boolean | Promise<boolean>
  onSaveVehicle: (vehicle: Vehicle, isEdit: boolean) => boolean | Promise<boolean>
}) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="capture-modal app-modal" aria-modal="true" role="dialog">
        {dialog.type === 'movement' ? <MovementForm type={dialog.movementType} store={store} onClose={onClose} onSubmit={onMovement} /> : null}
        {dialog.type === 'student' ? <StudentForm student={dialog.student} onClose={onClose} onSubmit={onSaveStudent} /> : null}
        {dialog.type === 'vehicle' ? <VehicleForm vehicle={dialog.vehicle} students={store.students} onClose={onClose} onSubmit={onSaveVehicle} /> : null}
      </section>
    </div>
  )
}

function ModalHeader({ icon, title, description, onClose }: { icon: ReactNode; title: string; description: string; onClose: () => void }) {
  return <><div className="modal-heading"><span className="modal-icon modal-icon-in">{icon}</span><button className="modal-close" onClick={onClose} type="button" aria-label="Đóng"><X size={18} /></button></div><h2>{title}</h2><p className="modal-description">{description}</p></>
}

function MovementForm({ type, store, onClose, onSubmit }: {
  type: MovementType
  store: DemoStore
  onClose: () => void
  onSubmit: (type: MovementType, vehicleId: string) => void
}) {
  const options = store.vehicles.filter((vehicle) => {
    const owner = store.students.find((student) => student.id === vehicle.studentId)
    return type === 'Vào bãi' ? !vehicle.inParking && owner?.status !== 'Hết hạn' : vehicle.inParking
  })
  const [vehicleId, setVehicleId] = useState(options[0]?.id ?? '')
  const [error, setError] = useState('')

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!vehicleId) {
      setError(type === 'Vào bãi' ? 'Không có xe đủ điều kiện để vào bãi.' : 'Không có xe nào đang ở trong bãi.')
      return
    }
    onSubmit(type, vehicleId)
  }

  return (
    <>
      <ModalHeader icon={type === 'Vào bãi' ? <ArrowDownToLine size={20} /> : <ArrowUpFromLine size={20} />} title={`Ghi nhận xe ${type.toLocaleLowerCase('vi')}`} description="Chọn phương tiện đã đăng ký để cập nhật trạng thái bãi xe." onClose={onClose} />
      <form className="dialog-form" onSubmit={submit}>
        <label className="form-label">Phương tiện
          <select onChange={(event) => setVehicleId(event.target.value)} required value={vehicleId}>
            <option value="" disabled>Chọn phương tiện</option>
            {options.map((vehicle) => {
              const owner = store.students.find((student) => student.id === vehicle.studentId)
              return <option key={vehicle.id} value={vehicle.id}>{vehicle.plate} · {owner?.name} · {vehicle.type}</option>
            })}
          </select>
        </label>
        {vehicleId ? <div className="form-hint"><GraduationCap size={15} />{store.students.find((student) => student.id === store.vehicles.find((vehicle) => vehicle.id === vehicleId)?.studentId)?.name}</div> : null}
        {error || options.length === 0 ? <div className="form-error">{error || (type === 'Vào bãi' ? 'Chưa có xe hợp lệ. Hãy đăng ký xe hoặc kiểm tra hạn thẻ.' : 'Không có xe nào đang ở trong bãi.')}<button className="text-link" onClick={onClose} type="button">Đóng</button></div> : null}
        <div className="modal-actions"><button className="button button-secondary" onClick={onClose} type="button">Hủy</button><button className="button button-primary" disabled={!options.length} type="submit"><Check size={16} /> Xác nhận</button></div>
      </form>
    </>
  )
}

function StudentForm({ student, onClose, onSubmit }: {
  student?: Student
  onClose: () => void
  onSubmit: (student: Student, isEdit: boolean) => boolean | Promise<boolean>
}) {
  const [form, setForm] = useState<Student>(() => student ?? ({
    id: '',
    name: '',
    className: '',
    program: '',
    phone: '',
    permitUntil: dateAfterDays(90),
    status: 'Đang hoạt động',
  }))
  const [error, setError] = useState('')
  const update = (key: keyof Student, value: string) => {
    setError('')
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!await onSubmit(form, Boolean(student))) setError('Mã sinh viên này đã tồn tại.')
  }

  return (
    <>
      <ModalHeader icon={<GraduationCap size={20} />} title={student ? 'Chỉnh sửa sinh viên' : 'Thêm sinh viên'} description="Nhập thông tin hồ sơ và hạn sử dụng thẻ gửi xe." onClose={onClose} />
      <form className="dialog-form" onSubmit={submit}>
        <label className="form-label">Mã sinh viên<input disabled={Boolean(student)} onChange={(event) => update('id', event.target.value.trim().toUpperCase())} placeholder="Ví dụ: 24DTHA01" required value={form.id} /></label>
        <label className="form-label">Họ và tên<input onChange={(event) => update('name', event.target.value)} placeholder="Nguyễn Văn A" required value={form.name} /></label>
        <div className="settings-form-grid">
          <label className="form-label">Lớp<input onChange={(event) => update('className', event.target.value)} placeholder="24DTHA1" required value={form.className} /></label>
          <label className="form-label">Số điện thoại<input onChange={(event) => update('phone', event.target.value)} placeholder="0900 000 000" required value={form.phone} /></label>
          <label className="form-label settings-full-width">Chuyên ngành<input onChange={(event) => update('program', event.target.value)} placeholder="Công nghệ thông tin" required value={form.program} /></label>
          <label className="form-label">Hạn thẻ<input onChange={(event) => update('permitUntil', event.target.value)} required type="date" value={form.permitUntil} /></label>
          <label className="form-label">Trạng thái thẻ<select onChange={(event) => update('status', event.target.value)} value={form.status}><option>Đang hoạt động</option><option>Sắp hết hạn</option><option>Hết hạn</option></select></label>
        </div>
        {error ? <div className="form-error">{error}</div> : null}
        <div className="modal-actions"><button className="button button-secondary" onClick={onClose} type="button">Hủy</button><button className="button button-primary" type="submit"><Check size={16} /> {student ? 'Lưu thay đổi' : 'Thêm sinh viên'}</button></div>
      </form>
    </>
  )
}

function VehicleForm({ vehicle, students, onClose, onSubmit }: {
  vehicle?: Vehicle
  students: Student[]
  onClose: () => void
  onSubmit: (vehicle: Vehicle, isEdit: boolean) => boolean | Promise<boolean>
}) {
  const eligibleStudents = students.filter((student) => student.status !== 'Hết hạn' || vehicle?.studentId === student.id)
  const [form, setForm] = useState<Vehicle>(() => vehicle ?? {
      id: '',
      studentId: eligibleStudents[0]?.id ?? '',
      plate: '',
      type: 'Xe máy',
      color: '',
      registeredAt: currentDateKey(),
      inParking: false,
    })
  const [error, setError] = useState('')
  const update = (key: keyof Vehicle, value: string) => {
    setError('')
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!await onSubmit({ ...form, id: vehicle?.id ?? crypto.randomUUID(), plate: form.plate.trim().toLocaleUpperCase('vi') }, Boolean(vehicle))) {
      setError('Biển số xe này đã được đăng ký.')
    }
  }

  return (
    <>
      <ModalHeader icon={<Bike size={20} />} title={vehicle ? 'Chỉnh sửa phương tiện' : 'Đăng ký phương tiện'} description="Gắn phương tiện với sinh viên đang có thẻ gửi xe hợp lệ." onClose={onClose} />
      <form className="dialog-form" onSubmit={submit}>
        <label className="form-label">Chủ sở hữu<select onChange={(event) => update('studentId', event.target.value)} required value={form.studentId}><option value="" disabled>Chọn sinh viên</option>{eligibleStudents.map((student) => <option key={student.id} value={student.id}>{student.name} · {student.id}</option>)}</select></label>
        <label className="form-label">Biển số xe<input onChange={(event) => update('plate', event.target.value)} placeholder="59-X3 123.45" required value={form.plate} /></label>
        <div className="settings-form-grid">
          <label className="form-label">Loại xe<select onChange={(event) => update('type', event.target.value)} value={form.type}><option>Xe máy</option><option>Xe đạp điện</option><option>Xe đạp</option></select></label>
          <label className="form-label">Màu xe<input onChange={(event) => update('color', event.target.value)} placeholder="Đen" required value={form.color} /></label>
        </div>
        {error ? <div className="form-error">{error}</div> : null}
        {eligibleStudents.length === 0 ? <div className="form-error">Chưa có sinh viên đủ điều kiện đăng ký xe.</div> : null}
        <div className="form-hint"><ShieldCheck size={15} /> Phương tiện đăng ký mới bắt đầu ở trạng thái ngoài bãi.</div>
        <div className="modal-actions"><button className="button button-secondary" onClick={onClose} type="button">Hủy</button><button className="button button-primary" disabled={!eligibleStudents.length} type="submit"><Check size={16} /> {vehicle ? 'Lưu thay đổi' : 'Đăng ký xe'}</button></div>
      </form>
    </>
  )
}

export default App
