import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './evening.css'

// Draft itinerary, following the supplied reference. Edit these items together
// when the hosts confirm the evening's actual schedule.
const eveningSchedule = [
  { time: '5:30', dateTime: '17:30', title: 'Welcome', description: 'A warm welcome and a toast to the night.' },
  { time: '6:00', dateTime: '18:00', title: 'Ceremony', description: 'Our vows beneath the crystal chandelier.' },
  { time: '7:00', dateTime: '19:00', title: 'Dinner', description: 'An evening of flavours, served by candlelight.' },
  { time: '9:00', dateTime: '21:00', title: 'First dance', description: 'Then the dance floor belongs to everyone.' },
  { time: '11:30', dateTime: '23:30', title: 'Sparklers', description: 'One last sparkle beneath the stars.' },
]


export default function EveningDetails({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.35)) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: [0.35] })
    observer.observe(sectionRef.current!)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="the-evening" className={`evening-scene ${entered ? 'has-arrived' : ''} ${reducedMotion ? 'evening-reduced-motion' : ''}`} lang="en" dir="ltr" aria-labelledby="evening-title">
      <div className="evening-backdrop" aria-hidden="true" />
      <article className="evening-paper">
        <img src="/images/evening-stationery.png" className="evening-stationery" alt="" loading="lazy" />
        <header className="evening-heading">
          <h2 id="evening-title">The evening</h2>
          <p>How the night will unfold</p>
        </header>
        <ol className="evening-timeline" aria-label="Evening itinerary">
          {eveningSchedule.map((event, index) => <li className="evening-event" key={event.dateTime} style={{ '--event-delay': `${0.25 + index * 0.22}s` } as CSSProperties}>
            <time className="evening-event-time" dateTime={event.dateTime}>{event.time}<span>PM</span></time>
            <span className="evening-event-marker" aria-hidden="true" />
            <div className="evening-event-copy">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          </li>)}
        </ol>
        <div className="evening-signoff" aria-hidden="true"><span />✧<span /></div>
      </article>
    </section>
  )
}
