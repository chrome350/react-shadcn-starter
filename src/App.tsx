import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react"
import * as Dialog from "@radix-ui/react-dialog"
import {
  ArrowLeft,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Inbox,
  Lightbulb,
  Play,
  Plus,
  X,
  Zap,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const weekdayLetters = ["П", "В", "С", "Ч", "П", "С", "В"]

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
  compact?: boolean
  duration?: string
  note?: string
}

function Appointment({ className, compact, duration, note }: AppointmentProps) {
  return (
    <article className={`appointment ${compact ? "appointment--compact" : ""} ${className}`}>
      <span className="appointment__stripe" />
      <div className="appointment__head">
        <strong>Ангелина Петрова</strong>
        <span className="status-pill">НОВЫЙ</span>
        <CheckCircle2 className="status-check" aria-label="Подтверждено" />
      </div>
      <p>Маникюр, покрытие гель-лак, педикюр</p>
      {duration && <p className="appointment__meta">{duration}</p>}
      {note && <p className="appointment__note">{note}</p>}
    </article>
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

const pendingAppointments = [
  { id: "angelina", name: "Ангелина Петрова", time: "16:00–17:00" },
  { id: "olga", name: "Ольга Будкова", time: "17:00–18:00" },
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
  return (
    <section className="pending-screen">
      <header className="pending-header">
        <Button variant="ghost" size="icon" className="pending-back" aria-label="Назад" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <Dialog.Title>Ждут подтверждения</Dialog.Title>
      </header>

      <p className="pending-intro">Эти записи уже сегодня, но клиенты еще<br />{" "}не подтвердили визит</p>

      <div className="pending-list">
        {pendingAppointments.map((appointment) => (
          <article className="pending-card" key={appointment.id}>
            <span className="pending-card__stripe" />
            <div className="pending-card__head">
              <strong>{appointment.name}</strong>
              <span>НОВЫЙ</span>
            </div>
            <p>Маникюр, покрытие гель-лак, педикюр</p>
            <p className="pending-card__meta">{appointment.time} · 1 час · 7 500 ₽</p>
            <div className="pending-card__actions">
              <Button variant="ghost" className="contact-button">Связаться</Button>
              <Button
                variant="ghost"
                className="arrival-switch"
                data-checked={confirmed[appointment.id]}
                role="switch"
                aria-checked={confirmed[appointment.id]}
                onClick={() => onToggle(appointment.id)}
              >
                <span />
                Клиент придёт
              </Button>
            </div>
          </article>
        ))}
      </div>
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

function NewAppointments({ onBack }: { onBack: () => void }) {
  return (
    <section className="new-screen">
      <header className="pending-header">
        <Button variant="ghost" size="icon" className="pending-back" aria-label="Назад" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <Dialog.Title>Новые записи</Dialog.Title>
      </header>

      <div className="new-groups">
        {newAppointmentGroups.map((group) => (
          <section className="new-group" key={group.date} aria-labelledby={`date-${group.date}`}>
            <h3 id={`date-${group.date}`}>{group.date}</h3>
            <div className="new-list">
              {group.appointments.map((appointment) => (
                <article className="pending-card new-card" key={appointment.id}>
                  <span className="pending-card__stripe" />
                  <div className="pending-card__head">
                    <strong>{appointment.name}</strong>
                    <span>НОВЫЙ</span>
                  </div>
                  <p>Маникюр, покрытие гель-лак, педикюр</p>
                  <p className="pending-card__meta">{appointment.time} · {appointment.duration} · 7 500 ₽</p>
                  <Button variant="ghost" className="new-card__accept">Принять</Button>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <Button className="accept-all-button">Принять все</Button>
    </section>
  )
}

function ConfirmationDrawer({ selectedDate }: { selectedDate: Date }) {
  const [open, setOpen] = useState(false)
  const [drawerView, setDrawerView] = useState<"summary" | "pending" | "new">("summary")
  const [confirmedAppointments, setConfirmedAppointments] = useState<Record<string, boolean>>({})
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef(0)
  const dragStartedAt = useRef(0)
  const dragOffsetRef = useRef(0)
  const isDraggingRef = useRef(false)
  const weekday = new Intl.DateTimeFormat("ru-RU", { weekday: "long" }).format(selectedDate).toUpperCase()
  const date = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(selectedDate)

  const resetDrag = () => {
    dragOffsetRef.current = 0
    isDraggingRef.current = false
    setDragOffset(0)
    setIsDragging(false)
  }

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      resetDrag()
      setDrawerView("summary")
    }
    setOpen(nextOpen)
  }

  const handleDragStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragStart.current = event.clientY
    dragStartedAt.current = performance.now()
    dragOffsetRef.current = 0
    isDraggingRef.current = true
    setIsDragging(true)
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
          setDrawerView("summary")
          dragOffsetRef.current = 0
          setDragOffset(0)
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
      <Dialog.Trigger asChild>
        <Button className="confirm-button" type="button">
          <span className="confirm-button__icon"><Zap /></span>
          <span>Подтвердите</span>
          <span className="confirm-button__count">2 записи</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="drawer-overlay" />
        <Dialog.Content
          className={`drawer-content ${drawerView !== "summary" ? "drawer-content--pending" : ""}`}
          data-dragging={isDragging}
          style={{ "--drawer-drag-y": `${dragOffset}px` } as CSSProperties}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <div
            className="drawer-handle"
            aria-hidden="true"
            onPointerDown={handleDragStart}
          />
          <Dialog.Description className="sr-only">
            Сводка записей, важные уведомления и советы
          </Dialog.Description>

          {drawerView === "pending" ? (
            <PendingConfirmations
              confirmed={confirmedAppointments}
              onBack={() => setDrawerView("summary")}
              onToggle={(id) => setConfirmedAppointments((current) => ({ ...current, [id]: !current[id] }))}
            />
          ) : drawerView === "new" ? (
            <NewAppointments onBack={() => setDrawerView("summary")} />
          ) : (
            <>
              <header className="drawer-header">
                <span>{weekday}</span>
                <Dialog.Title>{date}</Dialog.Title>
              </header>

              <section className="drawer-stats" aria-label="Статистика записей">
            <article className="stat-card">
              <span>Сегодня</span>
              <strong>5 записей</strong>
              <small>6 990 ₽</small>
              <p>Загрузка <b className="load-good">80%</b></p>
              <div className="progress-track"><i className="progress-good" /></div>
            </article>
            <article className="stat-card">
              <span>Неделя</span>
              <strong>15 записей</strong>
              <small>46 990 ₽</small>
              <p>Загрузка <b className="load-low">15%</b></p>
              <div className="progress-track"><i className="progress-low" /></div>
            </article>
              </section>

              <section className="important-list" aria-labelledby="important-title">
                <h2 id="important-title">Важно!</h2>
                <button type="button" onClick={() => setDrawerView("pending")}><Zap /><span>Подтвердите <mark>2 записи</mark></span><ChevronRight /></button>
            <button type="button" onClick={() => setDrawerView("new")}><Zap /><span>У вас <mark>2 новые</mark> записи</span><ChevronRight /></button>
            <button type="button"><Zap /><span>Клиент <mark>отменил</mark> запись</span><ChevronRight /></button>
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
              <h2>Привлекайте новых<br />клиентов с <u>Авито</u></h2>
              <p>Вау! А что так можно было?</p>
              <svg className="promo-illustration" viewBox="0 0 280 210" aria-hidden="true">
                <path d="M176 38c12-25 35-20 42-2 11-16 31-7 25 10 20-5 28 17 8 24 18 12 4 33-14 24-1 20-29 22-36 3-14 11-35-1-27-19-22-1-32-26-7-38 8-12 28-16 42-6Z" />
                <path d="M151 79c-14 15-18 34-12 54l-24 41m40-76 34 35-14 55m-37-56 45 17m-75 25h81M95 183h103M119 75c-18 6-27 26-18 42m-18 65 12-43m-25 44h31" />
                <circle cx="105" cy="65" r="17" />
                <path d="M84 68c2-25 37-31 44-5M49 181h38v-59H55Zm12-59v-14h12v14" />
              </svg>
            </article>
              </section>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function App() {
  const today = new Date()
  const todayKey = dateKey(today)
  const week = getCurrentWeek(today)
  const [selectedDay, setSelectedDay] = useState(todayKey)
  const selectedDayIndex = week.findIndex((day) => day.key === selectedDay)
  const selectedDate = week[selectedDayIndex]?.date ?? today
  const isToday = selectedDay === todayKey
  const monthTitle = new Intl.DateTimeFormat("ru-RU", { month: "long" }).format(selectedDate)
  const scheduleDate = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(selectedDate)

  return (
    <main className="phone-shell">
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
                onClick={() => setSelectedDay(day.key)}
              >
                <span className="weekday">{day.weekday}</span>
                <span className="date-circle">{day.date.getDate()}</span>
                {day.dots > 0 && (
                  <span className="day-dots" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, index) => <i className={index < day.dots ? "is-filled" : ""} key={index} />)}
                  </span>
                )}
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
                duration="11:00–12:00 · 1 час · 7 500 ₽"
                note="Хочет веселый летний дизайн, обещала показать референсы"
              />
              <Appointment className="event-two" compact />
              <Appointment
                className="event-three"
                duration="13:00–14:30 · 1 час 30 минут · 7 500 ₽"
                note="Хочет веселый летний дизайн, обещала показать референсы"
              />
              <BreakCard />
            </>
          ) : selectedDayIndex === 1 ? (
            <>
              <Appointment
                className="tuesday-event-one"
                duration="14:00–15:30 · 2 часа · 7 500 ₽"
                note="Хочет веселый летний дизайн, обещала показать референсы"
              />
              <Appointment className="tuesday-event-two" compact />
            </>
          ) : null}
        </div>
      </section>

      {selectedDayIndex === 1 && (
        <ConfirmationDrawer selectedDate={selectedDate} />
      )}

      <nav className="bottom-nav" aria-label="Основная навигация">
        <div className="bottom-nav__group">
          <Button variant="ghost" className="nav-button nav-button--active" aria-label="Календарь">
            <CalendarDays />
          </Button>
          <Button variant="ghost" size="icon" className="nav-avatar" aria-label="Профиль">
            <img src="./avatar.png" alt="" />
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="nav-inbox" aria-label="Входящие">
          <Inbox />
        </Button>
        <Button size="icon" className="add-button" aria-label="Добавить запись">
          <Plus />
        </Button>
      </nav>
    </main>
  )
}
