import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './calendar.css'
import { wedding } from './weddingDetails'

type CalendarDate = { year: number; month: number; day: number }
const weddingDate: CalendarDate = wedding.date
const weddingISO = `${weddingDate.year}-${String(weddingDate.month).padStart(2, '0')}-${String(weddingDate.day).padStart(2, '0')}`
const weddingWeekday = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' })
  .format(new Date(Date.UTC(weddingDate.year, weddingDate.month - 1, weddingDate.day)))

function todayInDamascus(): CalendarDate {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Damascus', year: 'numeric', month: 'numeric', day: 'numeric',
  }).formatToParts(new Date())
  const part = (type: string) => Number(parts.find(value => value.type === type)?.value)
  return { year: part('year'), month: part('month'), day: part('day') }
}

function monthName(date: CalendarDate) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' })
    .format(new Date(Date.UTC(date.year, date.month - 1, 1)))
}

function dateLabel(date: CalendarDate) {
  return `${date.day} ${monthName(date)} ${date.year}`
}

function buildMonths(today: CalendarDate) {
  const first = today.year * 12 + today.month - 1
  const last = weddingDate.year * 12 + weddingDate.month - 1
  // On or after the wedding month, keep the selected wedding date on display.
  if (first >= last) return [weddingDate]
  // Bound long intervals while preserving the starting month and destination.
  const distance = last - first
  const stride = Math.max(1, Math.ceil(distance / 12))
  const months: CalendarDate[] = []
  for (let value = first; value < last; value += stride) {
    months.push({ year: Math.floor(value / 12), month: value % 12 + 1, day: 1 })
  }
  return [...months, weddingDate]
}

function MonthPage({ date, today, target }: { date: CalendarDate; today: CalendarDate; target: boolean }) {
  const weekdayOffset = (new Date(Date.UTC(date.year, date.month - 1, 1)).getUTCDay() + 6) % 7
  const days = new Date(Date.UTC(date.year, date.month, 0)).getUTCDate()
  return (
    <div className="calendar-page-content">
      <h3>{monthName(date)}</h3>
      <p className="calendar-year">{date.year}</p>
      <div className="calendar-weekdays" aria-hidden="true">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => <span key={index}>{day}</span>)}
      </div>
      <div className="calendar-days" aria-hidden="true">
        {Array.from({ length: 42 }, (_, index) => {
          const day = index - weekdayOffset + 1
          if (day < 1 || day > days) return <span key={index} />
          const isToday = date.year === today.year && date.month === today.month && day === today.day
          const selected = target && day === weddingDate.day
          return <span key={index} className={`calendar-day ${isToday ? 'is-today' : ''} ${selected ? 'is-wedding-day' : ''}`} data-day={day}>
            {day}
            {selected && <svg className="wedding-date-ring" viewBox="0 0 48 48"><path d="M35 7C19-1 4 9 5 26c1 18 29 24 37 7C51 15 33 0 17 5" /></svg>}
          </span>
        })}
      </div>
      <p className="calendar-page-footnote">{target ? 'A day to remember, forever.' : 'Every day brings us closer.'}</p>
    </div>
  )
}

export default function WeddingCalendar({ bride, groom, reducedMotion }: {
  bride: string
  groom: string
  reducedMotion: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [today] = useState(todayInDamascus)
  const [months] = useState(() => buildMonths(today))
  const [entered, setEntered] = useState(() => !('IntersectionObserver' in window))
  const [finished, setFinished] = useState(false)
  const complete = entered && (finished || reducedMotion || months.length === 1)

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.6)) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: [0.6] })
    observer.observe(sectionRef.current!)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="save-the-date"
      className={`calendar-scene ${entered ? 'has-arrived' : ''} ${complete ? 'is-complete' : ''} ${reducedMotion ? 'calendar-reduced-motion' : ''}`}
      lang="en"
      dir="ltr"
      aria-labelledby="save-date-title"
    >
      <img className="calendar-satin" src="/images/burgundy-satin.png" alt="" loading="lazy" />
      <div className="calendar-shade" aria-hidden="true" />
      <header className="calendar-heading">
        <h2 id="save-date-title">Save the date</h2>
        <p>Turning the pages to our forever</p>
      </header>

      <div className="calendar-frame" aria-label={`Wedding calendar, ${dateLabel(weddingDate)}`}>
        <div className="calendar-monogram" aria-hidden="true">{bride.charAt(0)} <span>&amp;</span> {groom.charAt(0)}</div>
        <span className="binding-ring binding-left" aria-hidden="true" />
        <span className="binding-ring binding-right" aria-hidden="true" />
        <div className="calendar-book" aria-hidden="true">
          {months.map((date, index) => {
            const target = index === months.length - 1
            return <div
              key={`${date.year}-${date.month}`}
              className={`calendar-leaf ${target ? 'target-leaf' : 'turning-leaf'}`}
              style={{ '--leaf-order': months.length - index, '--turn-delay': `${1.3 + index * 1.8}s` } as CSSProperties}
              data-month={`${date.year}-${String(date.month).padStart(2, '0')}`}
              onAnimationEnd={event => {
                if (event.animationName === 'calendar-page-turn' && index === months.length - 2) setFinished(true)
              }}
            >
              <div className="calendar-page calendar-page-front"><MonthPage date={date} today={today} target={target} /></div>
              {!target && <div className="calendar-page calendar-page-back"><span>Our story continues…</span></div>}
            </div>
          })}
        </div>
        <svg className="calendar-gold-chain" viewBox="0 0 60 180" aria-hidden="true">
          <path d="M45 8C3 13 15 44 25 74S6 136 20 153s39-6 12-38" />
        </svg>
      </div>

      <div className="calendar-status" role="status" aria-live="polite">
        {!complete ? <p className="calendar-today-label">Today · {dateLabel(today)}</p> : <>
          <p className="calendar-final-eyebrow">Our forever begins</p>
          <time dateTime={weddingISO}>{String(weddingDate.day).padStart(2, '0')} <span>·</span> {String(weddingDate.month).padStart(2, '0')} <span>·</span> {weddingDate.year}</time>
          <p className="calendar-final-weekday">{weddingWeekday}</p>
        </>}
      </div>
    </section>
  )
}
