import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { Toaster, toast } from "sonner"
import {
  ArrowLeft,
  CalendarClock,
  Calendar as CalendarIcon,
  Clock2,
  CircleMinus,
  CircleCheck,
  CheckCircle2,
  ChevronRight,
  Inbox as InboxIcon,
  Lightbulb,
  Play,
  Pencil,
  Plus,
  Share,
  X,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const weekdayLetters = ["П", "В", "С", "Ч", "П", "С", "В"]
type RecordsPage = "pending" | "new" | "canceled"
type ViewedRecordPages = Record<RecordsPage, boolean>
const importantPageOrder: RecordsPage[] = ["pending", "new", "canceled"]

function dateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getCurrentWeek(today: Date) {
  const dayFromMonday = today.getDay() === 0 ? 6 : today.getDay() - 1
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - dayFromMonday)

  return weekdayLetters.map((weekday, index) => {
    const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + index)
    return {
      weekday,
      date,
      key: dateKey(date),
      label: new Intl.DateTimeFormat("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(date),
      dots: index === 0 ? 3 : index === 1 ? 1 : 0,
      state: index === 5 ? "muted" : index === 6 ? "weekend" : "default",
    }
  })
}

const hours = [
  "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
  "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "00:00",
]

type AppointmentProps = {
  className: string
  name?: string
  service?: string
  compact?: boolean
  duration?: string
  note?: string
  status?: AppointmentStatus
  details?: AppointmentDetails
  showNewBadge?: boolean
}

type AppointmentStatus = "confirmed" | "pending" | "new" | "canceled"

type AppointmentDetails = {
  name: string
  phone: string
  initials: string
  date: string
  time: string
  services: string[]
  total: string
  comment?: string
}

const defaultAppointmentDetails: AppointmentDetails = {
  name: "Ольга Будкова",
  phone: "8 (926) 234-45-23",
  initials: "ОБ",
  date: "Понедельник, 27 сентября",
  time: "16:00–16:45 · 45 минут",
  services: ["Маникюр аппаратный", "Снятие гель-лака"],
  total: "3 500 ₽",
}

const mondayAppointmentDetails = {
  olga: {
    name: "Ольга Будкова",
    phone: "8 (926) 234-45-23",
    initials: "ОБ",
    date: "Понедельник, 27 сентября",
    time: "11:00–12:00 · 1 час",
    services: ["Маникюр аппаратный", "Покрытие гель-лак"],
    total: "3 500 ₽",
  },
  angelina: {
    name: "Ангелина Петрова",
    phone: "8 (926) 635-23-25",
    initials: "АП",
    date: "Понедельник, 27 сентября",
    time: "12:00–13:00 · 1 час",
    services: ["Маникюр аппаратный", "Покрытие гель-лак"],
    total: "3 500 ₽",
  },
  valentina: {
    name: "Валентина Демидова",
    phone: "8 (926) 234-45-23",
    initials: "ВД",
    date: "Понедельник, 27 сентября",
    time: "13:00–14:30 · 1 час 30 минут",
    services: ["Маникюр аппаратный", "Покрытие гель-лак", "Педикюр"],
    total: "7 500 ₽",
    comment: "Хочет веселый летний дизайн, обещала показать референсы",
  },
} satisfies Record<string, AppointmentDetails>

const tuesdayAppointmentDetails = {
  anastasia: {
    name: "Анастасия Артемьева",
    phone: "8 (926) 234-45-23",
    initials: "АА",
    date: "Вторник, 28 сентября",
    time: "11:00–12:30 · 1 час 30 минут",
    services: ["Маникюр аппаратный", "Покрытие гель-лак", "Педикюр"],
    total: "7 500 ₽",
  },
  diana: {
    name: "Диана",
    phone: "8 (926) 234-45-23",
    initials: "Д",
    date: "Вторник, 28 сентября",
    time: "14:00–14:30 · 30 минут",
    services: ["Ремонт ногтя"],
    total: "2 500 ₽",
  },
} satisfies Record<string, AppointmentDetails>

function Appointment({ className, name = "Ангелина Петрова", service = "Маникюр, покрытие гель-лак, педикюр", compact, duration, note, status = "confirmed", details, showNewBadge }: AppointmentProps) {
  const shouldShowNewBadge = showNewBadge ?? (status === "confirmed" || status === "new")

  return (
    <AppointmentDetailsDrawer
      status={status}
      details={details}
      trigger={(
        <article className={`appointment appointment--interactive appointment--${status} ${compact ? "appointment--compact" : ""} ${className}`}>
          <span className="appointment__stripe" />
          <div className="appointment__head">
            <strong>{name}</strong>
            {shouldShowNewBadge && <span className="status-pill">НОВЫЙ</span>}
            {status === "pending" ? (
              <Clock2 className="status-check status-check--standalone" aria-label="Ожидает подтверждения" />
            ) : status === "canceled" ? (
              <CircleMinus className="status-check status-check--standalone" aria-label="Отменено" />
            ) : (
              <CheckCircle2 className="status-check" aria-label="Подтверждено" />
            )}
          </div>
          <p>{service}</p>
          {duration && <p className="appointment__meta">{duration}</p>}
          {note && <p className="appointment__note">{note}</p>}
        </article>
      )}
    />
  )
}

function BreakCard() {
  return (
    <article className="appointment break-card">
      <span className="appointment__stripe" />
      <div className="appointment__head">
        <strong>Перерыв</strong>
      </div>
      <p className="appointment__meta">15:00–16:00 · 1 час</p>
      <p className="appointment__note">Коментарий который оставил мастер</p>
    </article>
  )
}

function AppointmentDetailsDrawer({ trigger, status, details = defaultAppointmentDetails }: { trigger: ReactElement; status: AppointmentStatus; details?: AppointmentDetails }) {
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState(details.comment ?? "")
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const dragStart = useRef(0)
  const dragStartedAt = useRef(0)
  const dragOffsetRef = useRef(0)
  const isDraggingRef = useRef(false)
  const statusContent = {
    confirmed: { label: "Клиент подтвердил визит", icon: <CircleCheck /> },
    pending: { label: "Ждем подтверждения клиента", icon: <Clock2 /> },
    new: { label: "Новая запись", icon: <Plus /> },
    canceled: { label: "Клиент отменил запись", icon: <CircleMinus /> },
  }[status]

  const resetDrag = () => {
    dragOffsetRef.current = 0
    isDraggingRef.current = false
    setDragOffset(0)
    setIsDragging(false)
    setHasInteracted(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetDrag()
    setOpen(nextOpen)
  }

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientY
    dragStartedAt.current = performance.now()
    dragOffsetRef.current = 0
    isDraggingRef.current = true
    setIsDragging(true)
    setHasInteracted(true)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // pointer capture is a progressive enhancement; ignore if unsupported
    }
    event.preventDefault()
  }

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current) return
      const nextOffset = Math.max(0, event.clientY - dragStart.current)
      dragOffsetRef.current = nextOffset
      setDragOffset(nextOffset)
    }

    const handlePointerEnd = () => {
      if (!isDraggingRef.current) return
      const elapsed = performance.now() - dragStartedAt.current
      const shouldClose = dragOffsetRef.current >= 96 || (dragOffsetRef.current >= 42 && elapsed < 260)
      isDraggingRef.current = false
      setIsDragging(false)

      if (shouldClose) {
        setDragOffset(window.innerHeight)
        window.setTimeout(() => {
          setOpen(false)
          resetDrag()
        }, 180)
        return
      }

      dragOffsetRef.current = 0
      setDragOffset(0)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerEnd)
    window.addEventListener("pointercancel", handlePointerEnd)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerEnd)
      window.removeEventListener("pointercancel", handlePointerEnd)
    }
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay" />
        <Dialog.Content
          className="drawer-content appointment-detail-drawer"
          data-dragging={isDragging}
          data-interacted={hasInteracted}
          style={{ "--drawer-drag-y": `${dragOffset}px` } as CSSProperties}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="drawer-handle-area" aria-hidden="true" onPointerDown={handleDragStart}>
            <span className="drawer-handle" />
          </div>
          <Dialog.Description className="sr-only">Подробная информация о записи клиента</Dialog.Description>

          <div className="drawer-scroll-area">
            <div className="appointment-summary">
            <header className="client-header">
              <div>
                <Dialog.Title>{details.name}</Dialog.Title>
                <a href={`tel:${details.phone.replace(/\D/g, "")}`}>{details.phone}</a>
                <p className={`appointment-status appointment-status--${status}`}>
                  {statusContent.icon}{statusContent.label}
                </p>
              </div>
              <span className="client-avatar">{details.initials}</span>
            </header>

            <section className={`appointment-date ${status === "canceled" ? "appointment-date--canceled" : ""}`} aria-label="Дата и время записи">
              <p>{details.date}</p>
              <strong>{details.time}</strong>
            </section>
          </div>

            <div className="appointment-details-body">
            <section className="services-card" aria-label="Услуги и стоимость">
              <span>{details.services.length === 1 ? "1 услуга" : `${details.services.length} услуги`}</span>
              {details.services.map((service) => <p key={service}>{service}</p>)}
              <i />
              <div><strong>Общая стоимость</strong><strong>{details.total}</strong></div>
            </section>

            <section className="comment-card" aria-label="Комментарий">
              <textarea
                maxLength={100}
                placeholder="Ваш комментарий"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
              <span>{comment.length} из 100</span>
            </section>

            <div className={`detail-actions ${status === "canceled" ? "detail-actions--single" : ""}`}>
              <div><Button variant="ghost" size="icon" className="detail-action detail-action--cancel" aria-label={status === "canceled" ? "Удалить запись" : "Отменить запись"}><X /></Button><span>{status === "canceled" ? "Удалить" : "Отменить"}</span></div>
              {status !== "canceled" && <div><Button variant="ghost" size="icon" className="detail-action" aria-label="Изменить запись"><Pencil /></Button><span>Изменить</span></div>}
              {status !== "canceled" && <div><Button variant="ghost" size="icon" className="detail-action" aria-label="Поделиться записью"><Share /></Button><span>Поделиться</span></div>}
            </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const pendingAppointments = [
  {
    id: "olga",
    name: "Ольга Будкова",
    service: "Маникюр, покрытие гель-лак",
    time: "11:00–12:00",
    duration: "1 час",
    total: "3 500 ₽",
    details: mondayAppointmentDetails.olga,
  },
  {
    id: "kristina",
    name: "Кристина Петрова",
    service: "Маникюр, педикюр",
    time: "17:00–18:00",
    duration: "1 час",
    total: "5 500 ₽",
    details: {
      name: "Кристина Петрова",
      phone: "8 (926) 234-45-23",
      initials: "КП",
      date: "Понедельник, 27 сентября",
      time: "17:00–18:00 · 1 час",
      services: ["Маникюр", "Педикюр"],
      total: "5 500 ₽",
    } satisfies AppointmentDetails,
  },
]

function PendingConfirmations({
  confirmed,
  onBack,
  onToggle,
}: {
  confirmed: Record<string, boolean>
  onBack: () => void
  onToggle: (id: string) => void
}) {
  const waitingAppointments = pendingAppointments.filter((appointment) => !confirmed[appointment.id])
  const confirmedItems = pendingAppointments.filter((appointment) => confirmed[appointment.id])

  const renderAppointment = (appointment: (typeof pendingAppointments)[number]) => {
    const isConfirmed = Boolean(confirmed[appointment.id])

    return (
      <AppointmentDetailsDrawer
        key={appointment.id}
        status={isConfirmed ? "confirmed" : "pending"}
        details={appointment.details}
        trigger={<article className="pending-card appointment--interactive">
        <span className="pending-card__stripe" />
        <div className="pending-card__head">
          <strong>{appointment.name}</strong>
          <span>НОВЫЙ</span>
        </div>
        <p>{appointment.service}</p>
        <p className="pending-card__meta">{appointment.time} · {appointment.duration} · {appointment.total}</p>
        <div className="pending-card__actions">
          <Button variant="ghost" className="contact-button" onClick={(event) => event.stopPropagation()}>Связаться</Button>
          <Button
            variant="ghost"
            className="arrival-switch"
            data-checked={isConfirmed}
            role="switch"
            aria-checked={isConfirmed}
            onClick={(event) => {
              event.stopPropagation()
              onToggle(appointment.id)
            }}
          >
            {isConfirmed ? <CheckCircle2 aria-hidden="true" /> : <span />}
            Клиент придёт
          </Button>
        </div>
        </article>}
      />
    )
  }

  return (
    <section className="pending-screen">
      <header className="pending-header">
        <Button variant="ghost" size="icon" className="pending-back" aria-label="Назад" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <h2>Ждут подтверждения</h2>
      </header>

      <p className="pending-intro">Эти записи уже сегодня, но клиенты еще<br />{" "}не подтвердили визит</p>

      <div className="pending-list">
        {waitingAppointments.map(renderAppointment)}
      </div>

      {confirmedItems.length > 0 && (
        <section className="confirmed-appointments" aria-labelledby="confirmed-title">
          <h3 id="confirmed-title">Подтверждены</h3>
          <div className="pending-list">
            {confirmedItems.map(renderAppointment)}
          </div>
        </section>
      )}
    </section>
  )
}

const newAppointmentGroups = [
  {
    date: "28 сентября",
    appointments: [
      { id: "new-angelina", name: "Ангелина Петрова", time: "16:00–17:00", duration: "1 час" },
      { id: "new-olga", name: "Ольга Будкова", time: "17:00–18:00", duration: "1 час" },
    ],
  },
  {
    date: "1 октября",
    appointments: [
      { id: "new-alexandra", name: "Александра Алексашенкова", time: "09:00–11:00", duration: "2 часа" },
    ],
  },
]

const newAppointmentIds = newAppointmentGroups.flatMap((group) => group.appointments.map((appointment) => appointment.id))

function NewAppointments({ accepted, onBack, onAccept, onAcceptAll }: { accepted: Record<string, boolean>; onBack: () => void; onAccept: (id: string) => void; onAcceptAll: () => void }) {
  const visibleGroups = newAppointmentGroups
    .map((group) => ({ ...group, appointments: group.appointments.filter((appointment) => !accepted[appointment.id]) }))
    .filter((group) => group.appointments.length > 0)

  return (
    <section className="new-screen">
      <header className="pending-header">
        <Button variant="ghost" size="icon" className="pending-back" aria-label="Назад" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <h2>Новые записи</h2>
      </header>

      <div className="new-groups">
        {visibleGroups.map((group) => (
          <section className="new-group" key={group.date} aria-labelledby={`date-${group.date}`}>
            <h3 id={`date-${group.date}`}>{group.date}</h3>
            <div className="new-list">
              {group.appointments.map((appointment) => (
                <AppointmentDetailsDrawer
                  key={appointment.id}
                  status="new"
                  trigger={<article className="pending-card new-card appointment--interactive">
                  <span className="pending-card__stripe" />
                  <div className="pending-card__head">
                    <strong>{appointment.name}</strong>
                    <span>НОВЫЙ</span>
                  </div>
                  <p>Маникюр, покрытие гель-лак, педикюр</p>
                  <p className="pending-card__meta">{appointment.time} · {appointment.duration} · 7 500 ₽</p>
                  <Button variant="ghost" className="new-card__accept" onClick={(event) => {
                    event.stopPropagation()
                    onAccept(appointment.id)
                  }}>Принять</Button>
                  </article>}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Button className="accept-all-button" onClick={onAcceptAll}>Принять все</Button>
    </section>
  )
}

const canceledAppointments = [
  { id: "canceled-angelina", name: "Ангелина Петрова", time: "28 сент, 16:00–17:00" },
  { id: "canceled-olga", name: "Ольга Будкова", time: "28 сент, 17:00–18:00" },
]

function CanceledAppointments({ deleted, onBack, onDelete, onDeleteAll }: { deleted: Record<string, boolean>; onBack: () => void; onDelete: (id: string) => void; onDeleteAll: () => void }) {
  const visibleAppointments = canceledAppointments.filter((appointment) => !deleted[appointment.id])

  return (
    <section className="new-screen canceled-screen">
      <header className="pending-header">
        <Button variant="ghost" size="icon" className="pending-back" aria-label="Назад" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <h2>Отмененные записи</h2>
      </header>

      <div className="canceled-list">
        {visibleAppointments.map((appointment) => (
          <AppointmentDetailsDrawer
            key={appointment.id}
            status="canceled"
            trigger={<article className="pending-card canceled-card appointment--interactive">
            <span className="pending-card__stripe" />
            <div className="pending-card__head">
              <strong>{appointment.name}</strong>
              <span>НОВЫЙ</span>
            </div>
            <p className="canceled-card__details">Маникюр, покрытие гель-лак, педикюр</p>
            <p className="pending-card__meta canceled-card__details">{appointment.time}</p>
            <div className="canceled-card__actions">
              <Button variant="ghost" className="delete-record-button" onClick={(event) => {
                event.stopPropagation()
                onDelete(appointment.id)
              }}>Удалить</Button>
              <Button variant="ghost" className="restore-record-button" onClick={(event) => event.stopPropagation()}>В расписание</Button>
            </div>
            </article>}
          />
        ))}
      </div>

      <Button className="accept-all-button" onClick={onDeleteAll}>Удалить все</Button>
    </section>
  )
}

function OccupancyInfoDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const dragStart = useRef(0)
  const dragStartedAt = useRef(0)
  const dragOffsetRef = useRef(0)
  const isDraggingRef = useRef(false)
  const isClosingRef = useRef(false)

  // Mirror the 0.64s slide-up open animation on close.
  const CLOSE_DURATION = 640

  const resetDrag = () => {
    dragOffsetRef.current = 0
    isDraggingRef.current = false
    isClosingRef.current = false
    setDragOffset(0)
    setIsDragging(false)
    setHasInteracted(false)
    setIsClosing(false)
  }

  const animateClose = () => {
    if (isClosingRef.current) return
    isClosingRef.current = true
    isDraggingRef.current = false
    setIsDragging(false)
    setIsClosing(true)
    // Travel exactly the sheet's own height so the close mirrors the open distance.
    const distance = contentRef.current ? contentRef.current.offsetHeight + 24 : window.innerHeight
    setDragOffset(distance)
    window.setTimeout(() => {
      onOpenChange(false)
      resetDrag()
    }, CLOSE_DURATION)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetDrag()
    onOpenChange(nextOpen)
  }

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isClosingRef.current) return
    if ((event.target as HTMLElement).closest(".occupancy-info-button")) return
    dragStart.current = event.clientY
    dragStartedAt.current = performance.now()
    dragOffsetRef.current = 0
    isDraggingRef.current = true
    setIsDragging(true)
    setHasInteracted(true)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // pointer capture is a progressive enhancement; ignore if unsupported
    }
    event.preventDefault()
  }

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current) return
      const nextOffset = Math.max(0, event.clientY - dragStart.current)
      dragOffsetRef.current = nextOffset
      setDragOffset(nextOffset)
    }

    const handlePointerEnd = () => {
      if (!isDraggingRef.current) return
      const elapsed = performance.now() - dragStartedAt.current
      const shouldClose = dragOffsetRef.current >= 96 || (dragOffsetRef.current >= 42 && elapsed < 260)
      isDraggingRef.current = false
      setIsDragging(false)

      if (shouldClose) {
        animateClose()
        return
      }

      dragOffsetRef.current = 0
      setDragOffset(0)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerEnd)
    window.addEventListener("pointercancel", handlePointerEnd)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerEnd)
      window.removeEventListener("pointercancel", handlePointerEnd)
    }
  }, [])

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay occupancy-info-overlay" />
        <Dialog.Content
          ref={contentRef}
          className="drawer-content occupancy-info-drawer"
          data-dragging={isDragging}
          data-interacted={hasInteracted}
          data-closing={isClosing}
          style={{ "--drawer-drag-y": `${dragOffset}px` } as CSSProperties}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="drawer-handle-area" aria-hidden="true" onPointerDown={handleDragStart}>
            <span className="drawer-handle" />
          </div>

          <div className="occupancy-info-illustration" aria-hidden="true">
            <img src="./occupancy-info.svg" alt="" />
          </div>

          <div className="occupancy-info-copy">
            <Dialog.Title>Загрузка показывает,<br />насколько заполнены ваши<br />окошки</Dialog.Title>
            <Dialog.Description>Это процент времени из всех<br />созданных окошек, которое уже<br />заняли клиенты</Dialog.Description>
          </div>

          <Button className="occupancy-info-button" type="button" onClick={animateClose}>Понятно</Button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function ConfirmationDrawer({ open, isStatic, viewedPages, hiddenPages, pendingCount, newCount, onOpenChange, onOpenPage, onMarkUnread, onOpenOccupancy }: { open: boolean; isStatic: boolean; viewedPages: ViewedRecordPages; hiddenPages: ViewedRecordPages; pendingCount: number; newCount: number; onOpenChange: (open: boolean) => void; onOpenPage: (page: RecordsPage) => void; onMarkUnread: (page: RecordsPage) => void; onOpenOccupancy: () => void }) {
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const dragStart = useRef(0)
  const dragStartedAt = useRef(0)
  const dragOffsetRef = useRef(0)
  const isDraggingRef = useRef(false)
  const weekday = "ПОНЕДЕЛЬНИК"
  const date = "27 сентября"
  const visibleImportantPages = importantPageOrder.filter((page) => !hiddenPages[page])
  const sortedImportantPages = [
    ...visibleImportantPages.filter((page) => !viewedPages[page]),
    ...visibleImportantPages.filter((page) => viewedPages[page]),
  ]

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen)
    if (!nextOpen) {
      window.setTimeout(() => {
        dragOffsetRef.current = 0
        isDraggingRef.current = false
        setDragOffset(0)
        setIsDragging(false)
        setHasInteracted(false)
      }, 0)
    }
  }

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientY
    dragStartedAt.current = performance.now()
    dragOffsetRef.current = 0
    isDraggingRef.current = true
    setIsDragging(true)
    setHasInteracted(true)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      // pointer capture is a progressive enhancement; ignore if unsupported
    }
    event.preventDefault()
  }

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!isDraggingRef.current) return
      const nextOffset = Math.max(0, event.clientY - dragStart.current)
      dragOffsetRef.current = nextOffset
      setDragOffset(nextOffset)
    }

    const handlePointerEnd = () => {
      if (!isDraggingRef.current) return
      const elapsed = performance.now() - dragStartedAt.current
      const shouldClose = dragOffsetRef.current >= 96 || (dragOffsetRef.current >= 42 && elapsed < 260)

      isDraggingRef.current = false
      setIsDragging(false)
      if (shouldClose) {
        setDragOffset(window.innerHeight)
        window.setTimeout(() => {
          onOpenChange(false)
          window.setTimeout(() => {
            dragOffsetRef.current = 0
            isDraggingRef.current = false
            setDragOffset(0)
            setIsDragging(false)
            setHasInteracted(false)
          }, 0)
        }, 180)
        return
      }

      dragOffsetRef.current = 0
      setDragOffset(0)
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerEnd)
    window.addEventListener("pointercancel", handlePointerEnd)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerEnd)
      window.removeEventListener("pointercancel", handlePointerEnd)
    }
  }, [onOpenChange])

  const openPage = (page: RecordsPage) => {
    onOpenChange(false)
    onOpenPage(page)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay" />
        <Dialog.Content
          className="drawer-content"
          data-dragging={isDragging}
          data-static={isStatic}
          data-interacted={hasInteracted}
          style={{ "--drawer-drag-y": `${dragOffset}px` } as CSSProperties}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div className="drawer-handle-area" aria-hidden="true" onPointerDown={handleDragStart}>
            <span className="drawer-handle" />
          </div>
          <Dialog.Description className="sr-only">
            Сводка записей, важные уведомления и советы
          </Dialog.Description>

          <div className="drawer-scroll-area">
            <header className="drawer-header">
              <span>{weekday}</span>
              <Dialog.Title>{date}</Dialog.Title>
            </header>

            <section className="drawer-stats" aria-label="Статистика записей">
            <button className="stat-card" type="button" onClick={onOpenOccupancy}>
              <span>Сегодня</span>
              <strong>5 записей</strong>
              <small>6 990 ₽</small>
              <p>Загрузка <b className="load-good">80%</b></p>
              <div className="progress-track"><i className="progress-good" /></div>
            </button>
            <button className="stat-card" type="button" onClick={onOpenOccupancy}>
              <span>Неделя</span>
              <strong>15 записей</strong>
              <small>46 990 ₽</small>
              <p>Загрузка <b className="load-low">15%</b></p>
              <div className="progress-track"><i className="progress-low" /></div>
            </button>
            </section>

            <section className="important-list" aria-labelledby="important-title">
              <h2 id="important-title">Важно!</h2>
              {sortedImportantPages.length === 0 && (
                <p className="important-list__empty">Как здорово, все задачи решены!</p>
              )}
              {sortedImportantPages.map((page) => (
                <button className={viewedPages[page] ? "is-viewed" : undefined} key={page} type="button" onClick={() => openPage(page)}>
                  <Zap
                    role={viewedPages[page] ? "button" : undefined}
                    tabIndex={viewedPages[page] ? 0 : undefined}
                    aria-label={viewedPages[page] ? "Отметить как новое" : undefined}
                    onClick={(event) => {
                      if (!viewedPages[page]) return
                      event.stopPropagation()
                      onMarkUnread(page)
                    }}
                    onKeyDown={(event) => {
                      if (!viewedPages[page] || (event.key !== "Enter" && event.key !== " ")) return
                      event.preventDefault()
                      event.stopPropagation()
                      onMarkUnread(page)
                    }}
                  />
                  {page === "pending" ? (
                    <span>Подтвердите <mark>{pendingCount} {pendingCount === 1 ? "запись" : "записи"}</mark></span>
                  ) : page === "new" ? (
                    <span>У вас <mark>{newCount} {newCount === 1 ? "новая" : "новые"}</mark> {newCount === 1 ? "запись" : "записи"}</span>
                  ) : (
                    <span>Клиент <mark>отменил</mark> запись</span>
                  )}
                  <ChevronRight />
                </button>
              ))}
            </section>

            <section className="drawer-feed" aria-label="Советы">
            <article className="advice-card">
              <div className="advice-card__title"><Lightbulb /><strong>Совет</strong><Button variant="ghost" size="icon" aria-label="Скрыть совет"><X /></Button></div>
              <p>Не забывайте настраивать ваше расписание <mark>Онлайн-записи</mark> чтобы клиенты могли к вам записаться</p>
            </article>

            <article className="advice-card advice-card--video">
              <div className="advice-card__title"><Lightbulb /><strong>Совет</strong><Button variant="ghost" size="icon" aria-label="Скрыть совет"><X /></Button></div>
              <p>Как настроить свою публичную страницу? Посмотрите короткое видео:</p>
              <div className="video-preview" aria-label="Видео о публичной странице">
                <img src="./avatar.png" alt="" />
                <span><Play /></span>
              </div>
            </article>

            <article className="promo-card">
              <h2>Как эффективно привлекать <span className="promo-brand"><span>новых</span><img src="./avito-underline.svg" alt="" /></span> клиентов?</h2>
              <p>Разбираемся в статье</p>
              <img className="promo-illustration" src="./promo-illustration.svg" alt="" />
            </article>
            </section>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function App() {
  const today = new Date(2026, 8, 22)
  const todayKey = dateKey(today)
  const week = getCurrentWeek(today)
  const [selectedDay, setSelectedDay] = useState(todayKey)
  const [recordsPage, setRecordsPage] = useState<RecordsPage | null>(null)
  const [confirmedAppointments, setConfirmedAppointments] = useState<Record<string, boolean>>({})
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [isSummaryStatic, setIsSummaryStatic] = useState(false)
  const [viewedRecordPages, setViewedRecordPages] = useState<ViewedRecordPages>({ pending: false, new: false, canceled: false })
  const [completedRecordPages, setCompletedRecordPages] = useState<ViewedRecordPages>({ pending: false, new: false, canceled: false })
  const [acceptedNewAppointments, setAcceptedNewAppointments] = useState<Record<string, boolean>>({})
  const [deletedCanceledAppointments, setDeletedCanceledAppointments] = useState<Record<string, boolean>>({})
  const [isOccupancyInfoOpen, setIsOccupancyInfoOpen] = useState(false)
  const selectedDayIndex = week.findIndex((day) => day.key === selectedDay)
  const selectedDate = week[selectedDayIndex]?.date ?? today
  const isToday = selectedDay === todayKey
  const monthTitle = new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(selectedDate)
  const scheduleDate = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(selectedDate)
  const allPendingAppointmentsConfirmed = pendingAppointments.every((appointment) => confirmedAppointments[appointment.id])
  const pendingAppointmentsCount = pendingAppointments.filter((appointment) => !confirmedAppointments[appointment.id]).length
  const newAppointmentsCount = newAppointmentIds.filter((id) => !acceptedNewAppointments[id]).length
  const hiddenRecordPages: ViewedRecordPages = {
    ...completedRecordPages,
    pending: allPendingAppointmentsConfirmed,
    new: newAppointmentsCount === 0,
  }

  const openRecordsPage = (page: RecordsPage) => {
    setViewedRecordPages((current) => ({ ...current, [page]: true }))
    setRecordsPage(page)
  }

  const returnToSummary = () => {
    setRecordsPage(null)
    setIsSummaryStatic(true)
    setIsSummaryOpen(true)
  }

  const handleSummaryOpenChange = (open: boolean) => {
    if (!open) setIsSummaryStatic(false)
    setIsSummaryOpen(open)
  }

  if (recordsPage) {
    return (
      <main className="phone-shell records-page-shell">
        <Toaster position="bottom-center" toastOptions={{ unstyled: true, classNames: { toast: "records-toast" } }} />
        {recordsPage === "pending" ? (
          <PendingConfirmations
            confirmed={confirmedAppointments}
            onBack={returnToSummary}
            onToggle={(id) => setConfirmedAppointments((current) => ({ ...current, [id]: !current[id] }))}
          />
        ) : recordsPage === "new" ? (
          <NewAppointments
            accepted={acceptedNewAppointments}
            onBack={returnToSummary}
            onAccept={(id) => setAcceptedNewAppointments((current) => ({ ...current, [id]: true }))}
            onAcceptAll={() => {
              setAcceptedNewAppointments(Object.fromEntries(newAppointmentIds.map((id) => [id, true])))
              returnToSummary()
            }}
          />
        ) : (
          <CanceledAppointments
            deleted={deletedCanceledAppointments}
            onBack={returnToSummary}
            onDelete={(id) => {
              setDeletedCanceledAppointments((current) => ({ ...current, [id]: true }))
              setCompletedRecordPages((current) => ({ ...current, canceled: true }))
            }}
            onDeleteAll={() => {
              setDeletedCanceledAppointments(Object.fromEntries(canceledAppointments.map((appointment) => [appointment.id, true])))
              setCompletedRecordPages((current) => ({ ...current, canceled: true }))
              returnToSummary()
              toast("Записи удалены", { duration: 3000 })
            }}
          />
        )}
      </main>
    )
  }

  return (
    <main className="phone-shell">
      <Toaster position="bottom-center" toastOptions={{ unstyled: true, classNames: { toast: "records-toast" } }} />
      <section className="calendar-header" aria-label={`Календарь на ${monthTitle}`}>
        <div className="month-row">
          <div className="month-title">
            <h1>{monthTitle[0].toUpperCase() + monthTitle.slice(1)}</h1>
            <ChevronRight aria-hidden="true" />
          </div>
          {!isToday && (
            <Button variant="ghost" className="today-button" type="button" onClick={() => setSelectedDay(todayKey)}>
              Сегодня
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`history-button ${isToday ? "history-button--only" : ""}`}
            aria-label="История записей"
          >
            <CalendarClock />
          </Button>
        </div>

        <div className="week-strip">
          {week.map((day) => {
            const isActive = day.key === selectedDay
            const state = isActive ? "active" : day.dots ? "progress" : day.state

            return (
              <Button
                variant="ghost"
                className={`week-day h-auto rounded-none px-0 py-0 week-day--${state}`}
                key={day.key}
                type="button"
                aria-label={day.label}
                aria-pressed={isActive}
                data-dots={day.dots || undefined}
                style={{ "--progress-angle": `${day.dots * 72}deg` } as CSSProperties}
                onClick={() => setSelectedDay(day.key)}
              >
                <span className="weekday">{day.weekday}</span>
                <span className="date-circle">{day.date.getDate()}</span>
              </Button>
            )
          })}
        </div>
      </section>

      <section className="schedule" aria-label={`Расписание на ${scheduleDate}`}>
        <div className="schedule-grid">
          {hours.map((hour, index) => (
            <div className="hour-row" style={{ top: `calc(20px + ${index} * var(--hour-height))` }} key={hour}>
              <time>{hour}</time>
              <span />
            </div>
          ))}

          <div className="current-time" aria-label="Текущее время 10:15">
            <time>10:15</time>
            <span />
          </div>

          {selectedDayIndex === 0 ? (
            <>
              <Appointment
                className="event-one"
                name="Ольга Будкова"
                service="Маникюр, покрытие гель-лак"
                duration="11:00–12:00 · 1 час · 3 500 ₽"
                status="pending"
                details={mondayAppointmentDetails.olga}
              />
              <Appointment
                className="event-two"
                name="Ангелина Петрова"
                service="Маникюр, покрытие гель-лак"
                duration="12:00–13:00 · 1 час · 3 500 ₽"
                status="canceled"
                details={mondayAppointmentDetails.angelina}
              />
              <Appointment
                className="event-three"
                name="Валентина Демидова"
                duration="13:00–14:30 · 1 час 30 минут · 7 500 ₽"
                note="Хочет веселый летний дизайн, обещала показать референсы"
                status="confirmed"
                details={mondayAppointmentDetails.valentina}
              />
              <BreakCard />
            </>
          ) : selectedDayIndex === 1 ? (
            <>
              <Appointment
                className="tuesday-event-one"
                name="Анастасия Артемьева"
                duration="11:00–12:30 · 1 час 30 минут · 7 500 ₽"
                status="confirmed"
                showNewBadge={false}
                details={tuesdayAppointmentDetails.anastasia}
              />
              <Appointment
                className="tuesday-event-two"
                name="Диана"
                service="Ремонт ногтя"
                compact
                status="confirmed"
                showNewBadge={false}
                details={tuesdayAppointmentDetails.diana}
              />
            </>
          ) : null}
        </div>
      </section>

      {selectedDayIndex === 1 && (
        <Button className="confirm-button" type="button" onClick={() => setIsSummaryOpen(true)}>
          <span className="confirm-button__icon"><Zap /></span>
          <span>Подтвердите</span>
          <span className="confirm-button__count">2 записи</span>
        </Button>
      )}

      <ConfirmationDrawer
        open={isSummaryOpen}
        isStatic={isSummaryStatic}
        viewedPages={viewedRecordPages}
        hiddenPages={hiddenRecordPages}
        pendingCount={pendingAppointmentsCount}
        newCount={newAppointmentsCount}
        onOpenChange={handleSummaryOpenChange}
        onOpenPage={openRecordsPage}
        onMarkUnread={(page) => setViewedRecordPages((current) => ({ ...current, [page]: false }))}
        onOpenOccupancy={() => setIsOccupancyInfoOpen(true)}
      />

      <OccupancyInfoDrawer open={isOccupancyInfoOpen} onOpenChange={setIsOccupancyInfoOpen} />

      <nav className="bottom-nav" aria-label="Основная навигация">
        <div className="bottom-nav__group">
          <Button variant="ghost" className="nav-button nav-button--active" aria-label="Календарь">
            <CalendarIcon />
          </Button>
          <Button variant="ghost" size="icon" className="nav-avatar" aria-label="Профиль">
            <img src="./avatar.png" alt="" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="nav-inbox" aria-label="Входящие" onClick={() => setIsSummaryOpen(true)}>
          <InboxIcon />
        </Button>
        <Button size="icon" className="add-button" aria-label="Добавить запись">
          <Plus />
        </Button>
      </nav>
    </main>
  )
}
