import {
  BatteryFull,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Inbox,
  Plus,
  Wifi,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const week = [
  { weekday: "П", date: "27", state: "selected", dots: 3 },
  { weekday: "В", date: "28", state: "progress", dots: 1 },
  { weekday: "С", date: "29" },
  { weekday: "Ч", date: "30" },
  { weekday: "П", date: "1" },
  { weekday: "С", date: "2", state: "muted" },
  { weekday: "В", date: "3", state: "weekend" },
]

const hours = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]

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

function StatusBar() {
  return (
    <div className="status-bar" aria-label="Строка состояния">
      <time>10:15</time>
      <div className="status-icons" aria-hidden="true">
        <span className="cellular"><i /><i /><i /><i /></span>
        <Wifi />
        <BatteryFull className="battery" />
      </div>
    </div>
  )
}

export function App() {
  return (
    <main className="phone-shell">
      <StatusBar />

      <section className="calendar-header" aria-label="Календарь на сентябрь">
        <div className="month-row">
          <h1>Сентябрь</h1>
          <ChevronRight aria-hidden="true" />
          <Button variant="ghost" size="icon" className="history-button" aria-label="История записей">
            <CalendarClock />
          </Button>
        </div>

        <div className="week-strip">
          {week.map((day) => (
            <Button
              variant="ghost"
              className={`week-day h-auto rounded-none px-0 py-0 week-day--${day.state ?? "default"}`}
              key={day.date}
              type="button"
            >
              <span className="weekday">{day.weekday}</span>
              <span className="date-circle">{day.date}</span>
              {day.dots && (
                <span className="day-dots" aria-hidden="true">
                  {Array.from({ length: 5 }, (_, index) => <i className={index < day.dots ? "is-filled" : ""} key={index} />)}
                </span>
              )}
            </Button>
          ))}
        </div>
      </section>

      <section className="schedule" aria-label="Расписание на 27 сентября">
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
      </section>

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
