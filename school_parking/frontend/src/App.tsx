import { startTransition, useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react'
import {
  ArrowDownToLine,
  ArrowDownUp,
  ArrowUpFromLine,
  BarChart3,
  Bell,
  Bike,
  Bot,
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
  MessageCircle,
  Moon,
  ParkingSquare,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  TicketCheck,
  Trash2,
  UsersRound,
  X,
} from 'lucide-react'
import { ApiError, api, type ApiUser } from './api'
import type {
  ParkingStore,
  Movement,
  MovementType,
  Page,
  ParkingSettings,
  PermitStatus,
  Student,
  ChatMessage,
  Vehicle,
} from './types'

const themeKey = 'parkly-theme'
const appYear = new Date().getFullYear()
type Theme = 'light' | 'dark'

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
  help: { title: 'Trợ giúp', subtitle: 'Hướng dẫn sử dụng và kết nối với trợ lý Parkly.' },
  account: { title: 'Tài khoản', subtitle: 'Thông tin tài khoản đang đăng nhập.' },
}

type AppNotification = {
  title: string
  detail: string
  page: Page
}

type Dialog =
  | { type: 'movement'; movementType: MovementType }
  | { type: 'student'; student?: Student }
  | { type: 'vehicle'; vehicle?: Vehicle }
  | null

function readTheme(): Theme {
  try {
    return localStorage.getItem(themeKey) === 'dark' ? 'dark' : 'light'
  } catch (error) {
    console.error('Không thể đọc giao diện đã lưu.', error)
    return 'light'
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

function downloadMovements(store: ParkingStore) {
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
  const [store, setStore] = useState<ParkingStore | null>(null)
  const [appDate] = useState(() => new Date())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [theme, setTheme] = useState<Theme>(readTheme)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState('')
  const [dataStatus, setDataStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [activePage, setActivePage] = useState<Page>('overview')
  const [dialog, setDialog] = useState<Dialog>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notice, setNotice] = useState('')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [assistantOpen, setAssistantOpen] = useState(false)
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(themeKey, theme)
    } catch (error) {
      console.error('Không thể lưu giao diện đã chọn.', error)
    }
  }, [theme])

  const refreshStore = useCallback(async () => {
    const nextStore = await api.loadStore()
    setStore(nextStore)
    setDataStatus('ready')
  }, [])

  useEffect(() => {
    let active = true
    const hasExistingSession = api.hasSession()
    api.currentUser()
      .then((user) => {
        if (!active) return
        setIsAuthenticated(true)
        setUserName(user.name)
        setUserEmail(user.email)
        setAuthError('')
      })
      .catch((error: unknown) => {
        if (!active) return
        api.clearSession()
        setIsAuthenticated(false)
        if (error instanceof ApiError) {
          setAuthError(error.status === 401
            ? hasExistingSession ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' : ''
            : error.message)
        } else if (error instanceof Error) {
          setAuthError(error.message)
        }
      })
      .finally(() => {
        if (active) setAuthLoading(false)
      })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) return
    let active = true
    // eslint-disable-next-line react/set-state-in-effect
    refreshStore().catch((error: unknown) => {
      if (!active) return
      reportApiLoadFailure(setDataStatus, notify, error)
    })
    return () => { active = false }
  }, [refreshStore, isAuthenticated])

  const todayMovements = useMemo(
    () => (store?.movements ?? []).filter((movement) => localDateKey(new Date(movement.timestamp)) === currentDateKey()),
    [store?.movements],
  )
  const notifications = useMemo<AppNotification[]>(() => {
    if (!store) return []
    const expired = store.students.filter((student) => student.status === 'Hết hạn').length
    const expiring = store.students.filter((student) => student.status === 'Sắp hết hạn').length
    const occupancy = store.occupiedCount / Math.max(1, store.settings.capacity)
    const items: AppNotification[] = []

    if (expired > 0) {
      items.push({
        title: `${expired} thẻ gửi xe đã hết hạn`,
        detail: 'Kiểm tra thẻ trước khi ghi nhận xe vào bãi.',
        page: 'tickets',
      })
    }
    if (expiring > 0) {
      items.push({
        title: `${expiring} thẻ sắp hết hạn`,
        detail: 'Có thể gia hạn trong mục Vé gửi xe.',
        page: 'tickets',
      })
    }
    if (occupancy >= 0.9) {
      items.push({
        title: occupancy >= 1 ? 'Bãi xe đã đầy' : 'Bãi xe gần đầy',
        detail: `${store.occupiedCount} / ${store.settings.capacity} chỗ đang sử dụng.`,
        page: 'overview',
      })
    }
    return items
  }, [store])

  useEffect(() => {
    if (!notificationsOpen) return
    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !notificationRef.current?.contains(event.target)) {
        setNotificationsOpen(false)
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setNotificationsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [notificationsOpen])

  function notify(message: string) {
    setNotice(message)
  }

  async function recordMovement(movementType: MovementType, vehicleId: string) {
    try {
      const movement = await api.createMovement(vehicleId, movementType)
      await refreshStore()
      setDialog(null)
      notify(`Đã ghi nhận ${movementType.toLocaleLowerCase('vi')} cho ${movement.studentName}.`)
    } catch (error) {
      handleRequestError(error)
    }
  }

  async function saveStudent(student: Student, isEdit: boolean): Promise<boolean> {
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

  async function saveVehicle(vehicle: Vehicle, isEdit: boolean): Promise<boolean> {
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

  async function deleteStudent(student: Student) {
    if (!store) return
    const linkedVehicles = store.vehicles.filter((vehicle) => vehicle.studentId === student.id)
    if (linkedVehicles.length > 0) {
      notify(`Không thể xóa: ${student.name} còn ${linkedVehicles.length} phương tiện đã đăng ký.`)
      return
    }
    if (!window.confirm(`Xóa sinh viên ${student.name}?`)) return
    try {
      await api.deleteStudent(student.id)
      await refreshStore()
      notify('Đã xóa sinh viên.')
    } catch (error) {
      handleRequestError(error)
    }
  }

  async function deleteVehicle(vehicle: Vehicle) {
    if (vehicle.inParking) {
      notify('Xe đang trong bãi. Hãy ghi nhận xe ra trước khi xóa.')
      return
    }
    if (!window.confirm(`Xóa phương tiện ${vehicle.plate}?`)) return
    try {
      await api.deleteVehicle(vehicle.id)
      await refreshStore()
      notify('Đã xóa phương tiện.')
    } catch (error) {
      handleRequestError(error)
    }
  }

  async function updateSettings(settings: ParkingSettings) {
    if (!store) return
    if (settings.capacity < store.occupiedCount) {
      notify(`Sức chứa không thể thấp hơn số xe hiện có trong bãi (${store.occupiedCount}).`)
      return
    }
    try {
      await api.updateSettings(settings)
      await refreshStore()
      notify('Đã lưu cài đặt bãi xe.')
    } catch (error) {
      handleRequestError(error)
    }
  }

  async function renewTicket(student: Student) {
    try {
      await api.renewTicket(student.id)
      await refreshStore()
      notify(`Đã gia hạn vé gửi xe cho ${student.name}.`)
    } catch (error) {
      handleRequestError(error)
    }
  }

  function handleRequestError(error: unknown) {
    const message = error instanceof Error ? error.message : 'Không thể hoàn tất yêu cầu.'
    notify(message)
    if (error instanceof ApiError && error.status === 401) {
      api.clearSession()
      setIsAuthenticated(false)
      setAuthError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    }
  }

  async function logIn(email: string, password: string) {
    try {
      const user: ApiUser = await api.login(email, password)
      setIsAuthenticated(true)
      setUserName(user.name)
      setUserEmail(user.email)
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
      setIsAuthenticated(true)
      setUserName(user.name)
      setUserEmail(user.email)
      setDataStatus('loading')
      setAuthError('')
      setActivePage('overview')
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Không thể tạo tài khoản.')
    }
  }

  function logOut() {
    api.clearSession()
    setIsAuthenticated(false)
    setUserName('')
    setUserEmail('')
    setActivePage('overview')
  }

  if (authLoading) return <LoadingScreen label="Đang kiểm tra phiên đăng nhập..." />
  if (!isAuthenticated) return <LoginScreen error={authError} onLogin={logIn} onRegister={register} onClearError={() => setAuthError('')} />
  if (dataStatus === 'loading') return <LoadingScreen label="Đang tải dữ liệu bãi xe..." />
  if (dataStatus === 'error') {
    return <ApiUnavailableScreen onRetry={() => {
      setDataStatus('loading')
      refreshStore().catch((error: unknown) => {
        setDataStatus('error')
        notify(error instanceof Error ? error.message : 'Không thể tải dữ liệu từ API.')
      })
    }} onLogOut={logOut} message={notice} />
  }
  if (!store) return <LoadingScreen label="Đang chuẩn bị dữ liệu bãi xe..." />

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
        {navigation.map(({ id, label, icon: Icon }) => (
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
        <button className={`nav-item ${activePage === 'settings' ? 'nav-item-active' : ''}`} onClick={() => {
          setActivePage('settings')
          setMobileMenuOpen(false)
        }} type="button"><Settings size={18} strokeWidth={1.9} /><span>Cài đặt</span></button>
        <button className={`nav-item ${activePage === 'help' ? 'nav-item-active' : ''}`} onClick={() => {
          setActivePage('help')
          setMobileMenuOpen(false)
        }} type="button"><CircleHelp size={18} strokeWidth={1.9} /><span>Trợ giúp</span></button>
        <button className={`nav-item ${activePage === 'account' ? 'nav-item-active' : ''}`} onClick={() => {
          setActivePage('account')
          setMobileMenuOpen(false)
        }} type="button"><UsersRound size={18} strokeWidth={1.9} /><span>Tài khoản</span></button>
      </nav>
      <div className="sidebar-bottom">
        <div className="support-card"><div className="support-icon"><ShieldCheck size={18} /></div><div><strong>Bãi xe an toàn</strong><span>Đang hoạt động</span></div><span className="online-dot" /></div>
        <button className="profile-button" onClick={logOut} type="button" title="Đăng xuất">
          <span className="avatar avatar-admin">{initials(userName || 'Người dùng')}</span><span className="profile-copy"><strong>{userName}</strong><small>Tài khoản</small></span><LogOut size={16} className="profile-more" />
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
            <button className="icon-button" aria-label={theme === 'light' ? 'Bật giao diện tối' : 'Bật giao diện sáng'} onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} title={theme === 'light' ? 'Giao diện tối' : 'Giao diện sáng'} type="button">{theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
            <div className="notification-menu" ref={notificationRef}>
              <button className="icon-button notification-button" aria-label="Thông báo" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((open) => !open)} type="button">
                <Bell size={18} />
                {notifications.length > 0 ? <span className="notification-count">{notifications.length}</span> : null}
              </button>
              {notificationsOpen ? (
                <section className="notification-popover" aria-label="Thông báo bãi xe">
                  <header><strong>Thông báo</strong><span>{notifications.length}</span></header>
                  {notifications.length ? notifications.map((item) => (
                    <button className="notification-item" key={item.title} onClick={() => {
                      setActivePage(item.page)
                      setNotificationsOpen(false)
                    }} type="button">
                      <CircleAlert size={16} />
                      <span><strong>{item.title}</strong><small>{item.detail}</small></span>
                      <ChevronRight size={15} />
                    </button>
                  )) : <p className="notification-empty">Chưa có thông báo cần xử lý.</p>}
                </section>
              ) : null}
            </div>
            <button className="topbar-user" onClick={() => setActivePage('account')} type="button" aria-label="Mở tài khoản">
              <span className="avatar avatar-admin">{initials(userName || 'Người dùng')}</span><ChevronDown size={15} />
            </button>
          </div>
        </header>
        <div className="page-content">
          {notice ? <div className="notice-banner" role="status"><Check size={16} /><span>{notice}</span><button onClick={() => setNotice('')} type="button" aria-label="Đóng thông báo"><X size={16} /></button></div> : null}
          <PageHeading title={activeInfo.title} subtitle={activeInfo.subtitle} actions={pageActions} />
          {activePage === 'overview' ? <OverviewPage store={store} todayMovements={todayMovements} onNavigate={setActivePage} onMovement={(movementType) => setDialog({ type: 'movement', movementType })} /> : null}
          {activePage === 'movements' ? <MovementsPage store={store} onMovement={(movementType) => setDialog({ type: 'movement', movementType })} /> : null}
          {activePage === 'students' ? <StudentsPage students={store.students} vehicles={store.vehicles} onAdd={() => setDialog({ type: 'student' })} onEdit={(student) => setDialog({ type: 'student', student })} onDelete={deleteStudent} /> : null}
          {activePage === 'vehicles' ? <VehiclesPage store={store} onAdd={() => setDialog({ type: 'vehicle' })} onEdit={(vehicle) => setDialog({ type: 'vehicle', vehicle })} onDelete={deleteVehicle} onMovement={(movementType) => setDialog({ type: 'movement', movementType })} /> : null}
          {activePage === 'tickets' ? <TicketsPage students={store.students} vehicles={store.vehicles} onRenew={renewTicket} /> : null}
          {activePage === 'reports' ? <ReportsPage store={store} todayMovements={todayMovements} /> : null}
          {activePage === 'settings' ? <SettingsPage settings={store.settings} onSave={updateSettings} /> : null}
          {activePage === 'help' ? <HelpPage contactEmail={store.settings.contactEmail} onAskAssistant={() => setAssistantOpen(true)} /> : null}
          {activePage === 'account' ? <AccountPage name={userName} email={userEmail} onLogOut={logOut} /> : null}
          <footer className="page-footer"><span>© {appDate.getFullYear()} {store.settings.schoolName}</span><span><span className="footer-status" /> Dữ liệu trực tiếp từ hệ thống <span className="footer-divider">·</span> Parkly 1.0</span></footer>
        </div>
      </main>
      {dialog ? <AppDialog dialog={dialog} store={store} onClose={() => setDialog(null)} onMovement={recordMovement} onSaveStudent={saveStudent} onSaveVehicle={saveVehicle} /> : null}
      <ChatAssistant isOpen={assistantOpen} onOpenChange={setAssistantOpen} />
    </div>
  )
}

function HelpPage({ contactEmail, onAskAssistant }: { contactEmail: string; onAskAssistant: () => void }) {
  return (
    <div className="help-layout">
      <section className="panel help-intro">
        <span className="support-icon"><Bot size={19} /></span>
        <div>
          <h2>Cần hỗ trợ nhanh?</h2>
          <p>Hỏi trợ lý Parkly về cách sử dụng các chức năng. Trợ lý không xem được dữ liệu cá nhân hoặc số liệu bãi xe.</p>
        </div>
        <button className="button button-primary" onClick={onAskAssistant} type="button"><MessageCircle size={16} /> Trò chuyện với AI</button>
      </section>
      <section className="panel help-faq">
        <PanelHeading title="Câu hỏi thường gặp" subtitle="Hướng dẫn các thao tác phổ biến trong Parkly." />
        <details>
          <summary>Làm thế nào để ghi nhận xe vào hoặc ra?</summary>
          <p>Mở mục Lượt gửi xe hoặc Phương tiện, chọn Xe vào / Xe ra, sau đó chọn phương tiện đã đăng ký và xác nhận.</p>
        </details>
        <details>
          <summary>Làm thế nào để gia hạn vé gửi xe?</summary>
          <p>Mở mục Vé gửi xe, tìm sinh viên cần gia hạn và chọn nút Gia hạn. Trạng thái vé sẽ được cập nhật theo dữ liệu hệ thống.</p>
        </details>
        <details>
          <summary>Tại sao không thể xóa sinh viên hoặc phương tiện?</summary>
          <p>Sinh viên còn phương tiện đăng ký cần được gỡ liên kết trước. Phương tiện đang trong bãi phải được ghi nhận xe ra trước khi xóa.</p>
        </details>
        <details>
          <summary>Làm thế nào để xuất báo cáo?</summary>
          <p>Vào mục Báo cáo và chọn Xuất CSV để tải lịch sử lượt xe về máy.</p>
        </details>
      </section>
      <section className="panel help-contact">
        <div><h2>Liên hệ quản trị viên</h2><p>Nếu gặp sự cố với tài khoản hoặc dữ liệu, hãy liên hệ bộ phận quản lý bãi xe.</p></div>
        <a className="button button-secondary" href={`mailto:${contactEmail}`}><CircleHelp size={15} /> {contactEmail}</a>
      </section>
    </div>
  )
}

function AccountPage({ name, email, onLogOut }: { name: string; email: string; onLogOut: () => void }) {
  return (
    <section className="panel account-panel">
      <div className="account-avatar">{initials(name || 'Người dùng')}</div>
      <div className="account-copy">
        <span className="eyebrow"><span className="eyebrow-dot" /> TÀI KHOẢN ĐANG ĐĂNG NHẬP</span>
        <h2>{name}</h2>
        <p>{email}</p>
      </div>
      <div className="account-meta">
        <div><span>Hệ thống</span><strong>Parkly Campus Parking</strong></div>
        <div><span>Quyền truy cập</span><strong>Tài khoản quản lý bãi xe</strong></div>
      </div>
      <div className="account-actions">
        <p>Để thay đổi tên hoặc email, vui lòng liên hệ quản trị viên.</p>
        <button className="button button-secondary" onClick={onLogOut} type="button"><LogOut size={15} /> Đăng xuất</button>
      </div>
    </section>
  )
}

function ChatAssistant({ isOpen, onOpenChange }: { isOpen: boolean; onOpenChange: (open: boolean) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Xin chào! Mình là trợ lý Parkly. Mình có thể hướng dẫn bạn sử dụng hệ thống; mình không truy cập dữ liệu cá nhân hay dữ liệu bãi xe.' },
  ])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState('')
  const messagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [isOpen, messages, isSending])

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const content = input.trim()
    if (!content || isSending) return

    const nextMessages = [...messages, { role: 'user' as const, content }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setIsSending(true)
    try {
      const { message } = await api.chat(nextMessages.slice(-12))
      setMessages((current) => [...current, message])
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Không thể gửi tin nhắn.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="assistant-widget">
      {isOpen ? (
        <section className="assistant-panel" aria-label="Trợ lý AI Parkly" aria-modal="false" role="dialog">
          <header className="assistant-header">
            <span className="assistant-avatar"><Bot size={19} /></span>
            <span><strong>Trợ lý Parkly</strong><small><i className="online-dot" /> Hỗ trợ trực tuyến</small></span>
            <button className="assistant-close" onClick={() => onOpenChange(false)} type="button" aria-label="Đóng trò chuyện"><X size={18} /></button>
          </header>
          <div className="assistant-messages" ref={messagesRef} aria-live="polite">
            {messages.map((message, index) => (
              <div className={`assistant-message assistant-message-${message.role}`} key={`${index}-${message.role}`}>
                {message.content}
              </div>
            ))}
            {isSending ? <div className="assistant-message assistant-message-assistant assistant-typing">Đang trả lời…</div> : null}
            {messages.length === 1 ? (
              <div className="assistant-prompts" aria-label="Câu hỏi gợi ý">
                {['Ghi nhận xe vào bãi thế nào?', 'Cách gia hạn vé gửi xe?', 'Làm sao xuất báo cáo CSV?'].map((prompt) => (
                  <button key={prompt} onClick={() => setInput(prompt)} type="button">{prompt}</button>
                ))}
              </div>
            ) : null}
          </div>
          {error ? <div className="assistant-error" role="alert">{error}</div> : null}
          <form className="assistant-form" onSubmit={sendMessage}>
            <input aria-label="Tin nhắn cho trợ lý" maxLength={1500} onChange={(event) => setInput(event.target.value)} placeholder="Nhập câu hỏi của bạn…" value={input} />
            <button aria-label="Gửi tin nhắn" className="assistant-send" disabled={!input.trim() || isSending} type="submit"><Send size={17} /></button>
          </form>
          <p className="assistant-note"><Sparkles size={12} /> Câu trả lời được tạo bởi AI.</p>
        </section>
      ) : null}
      <button className={`assistant-launcher ${isOpen ? 'assistant-launcher-open' : ''}`} onClick={() => onOpenChange(!isOpen)} type="button" aria-label={isOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}>
        {isOpen ? <X size={21} /> : <MessageCircle size={21} />}
      </button>
    </div>
  )
}

function LoginScreen({ error, onLogin, onRegister, onClearError }: {
  error: string
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (name: string, email: string, password: string) => Promise<void>
  onClearError: () => void
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
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
        await onLogin(email, password)
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
        <div className="login-eyebrow"><span className="eyebrow-dot" /> {mode === 'login' ? 'ĐĂNG NHẬP HỆ THỐNG' : 'TẠO TÀI KHOẢN'}</div>
        <h1>{mode === 'login' ? 'Chào mừng đến với Parkly' : 'Tạo tài khoản Parkly'}</h1>
        <p className="login-description">{mode === 'login' ? 'Đăng nhập để tiếp tục sử dụng hệ thống.' : 'Tạo tài khoản để bắt đầu sử dụng Parkly.'}</p>
        <form className="login-form" onSubmit={submit}>
          {mode === 'register' ? <label className="form-label">Họ và tên<input autoComplete="name" maxLength={100} onChange={(event) => setName(event.target.value)} required type="text" value={name} /></label> : null}
          <label className="form-label">Email<input autoComplete="username" onChange={(event) => setEmail(event.target.value)} required type="email" value={email} /></label>
          <label className="form-label">Mật khẩu<input autoComplete={mode === 'register' ? 'new-password' : 'current-password'} minLength={mode === 'register' ? 8 : undefined} maxLength={mode === 'register' ? 72 : undefined} onChange={(event) => setPassword(event.target.value)} required type="password" value={password} /></label>
          {mode === 'register' ? <label className="form-label">Xác nhận mật khẩu<input autoComplete="new-password" minLength={8} maxLength={72} onChange={(event) => setConfirmPassword(event.target.value)} required type="password" value={confirmPassword} /></label> : null}
          {formError || error ? <div className="form-error" role="alert">{formError || error}</div> : null}
          <button className="button button-primary login-submit" disabled={submitting} type="submit">{submitting ? mode === 'register' ? 'Đang tạo tài khoản...' : 'Đang đăng nhập...' : mode === 'register' ? 'Tạo tài khoản' : 'Đăng nhập'} <ChevronRight size={16} /></button>
        </form>
        <p className="auth-switch">{mode === 'login' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'} <button onClick={() => changeMode(mode === 'login' ? 'register' : 'login')} type="button">{mode === 'login' ? 'Đăng ký' : 'Đăng nhập'}</button></p>
        <div className="login-disclaimer"><ShieldCheck size={15} /><span>Tài khoản được bảo vệ bằng mật khẩu và kết nối tới API NestJS.</span></div>
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
  store: ParkingStore
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

function MovementsPage({ store, onMovement }: { store: ParkingStore; onMovement: (type: MovementType) => void }) {
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
      <div className="table-footer"><span>Đang hiển thị <strong>{movements.length}</strong> lượt xe</span><span>Dữ liệu đồng bộ từ hệ thống</span></div>
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
      <div className="table-footer"><span>Hiển thị <strong>{filtered.length}</strong> trên <strong>{students.length}</strong> vé</span><span>Mỗi sinh viên có một vé gửi xe</span></div>
    </section>
  )
}

function VehiclesPage({ store, onAdd, onEdit, onDelete, onMovement }: {
  store: ParkingStore
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

function ReportsPage({ store, todayMovements }: { store: ParkingStore; todayMovements: Movement[] }) {
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
        <div className="panel-heading"><div><h2>Lưu lượng xe</h2><p>Thống kê lượt xe vào và ra theo ngày</p></div><select className="filter-button" aria-label="Khoảng thời gian báo cáo" onChange={(event) => setPeriod(event.target.value)} value={period}><option value="7">7 ngày gần nhất</option><option value="14">14 ngày gần nhất</option></select></div>
        <div className="chart-legend"><span><i className="legend-line line-in" /> Xe vào</span><span><i className="legend-line line-out" /> Xe ra</span></div>
        <div className="report-chart" style={{ gridTemplateColumns: `repeat(${weekdays.length}, minmax(0, 1fr))` }}>{weekdays.map((day) => <div className="report-day" key={day.label}><div className="report-bars"><span className="report-bar bar-entry" style={{ height: `${day.entries / peak * 100}%` }} title={`${day.entries} lượt vào`} /><span className="report-bar bar-exit" style={{ height: `${day.exits / peak * 100}%` }} title={`${day.exits} lượt ra`} /></div><small>{day.label}</small></div>)}</div>
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

function SettingsPage({ settings, onSave }: {
  settings: ParkingSettings
  onSave: (settings: ParkingSettings) => void
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
        <div className="settings-actions"><span>Thay đổi được lưu vào cơ sở dữ liệu.</span><button className="button button-primary" type="submit"><Check size={15} /> Lưu thay đổi</button></div>
      </section>
      <aside className="panel settings-info">
        <div className="support-icon"><ShieldCheck size={18} /></div><h3>Hệ thống bãi xe</h3>
        <p>Dữ liệu được quản lý tập trung trong PostgreSQL và đồng bộ qua API.</p>
        <div className="settings-info-row"><span>Trạng thái</span><strong><i className="online-dot" /> Đang hoạt động</strong></div>
        <div className="settings-info-row"><span>Phiên bản</span><strong>Parkly 1.0</strong></div>
      </aside>
    </form>
  )
}

const storeMinCapacity = 1

function AppDialog({ dialog, store, onClose, onMovement, onSaveStudent, onSaveVehicle }: {
  dialog: Exclude<Dialog, null>
  store: ParkingStore
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
  store: ParkingStore
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
