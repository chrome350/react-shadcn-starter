import { useState } from "react"
import {
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Inbox,
  Plus,
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
        <Button className="confirm-button" type="button">
          <span className="confirm-button__icon"><Zap /></span>
          <span>Подтвердите</span>
          <span className="confirm-button__count">2 записи</span>
        </Button>
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
