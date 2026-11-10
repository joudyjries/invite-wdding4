import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './notes-rsvp.css'

const notes = [
  { title: 'Gifts', text: 'Your presence is our favourite gift. If you would like to add something, a contribution to our honeymoon in Lake Como would make us very happy.' },
  { title: 'An evening for grown-ups', text: 'We love your little ones, yet this night is planned for adults only.' },
  { title: 'Unplugged vows', text: 'Please keep your phones away during the ceremony. Let our photographer capture the magic while you enjoy it with us.' },
]

export default function WeddingNotes({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(() => !('IntersectionObserver' in window))

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.3)) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: [0.3] })
    observer.observe(sectionRef.current!)
    return () => observer.disconnect()
  }, [])

  return <section ref={sectionRef} id="a-few-notes" className={`notes-scene ${entered ? 'has-arrived' : ''} ${reducedMotion ? 'notes-reduced-motion' : ''}`} aria-labelledby="notes-title" lang="en" dir="ltr">
    <img src="/images/evening-stationery.png" className="notes-paper-background" alt="" loading="lazy" />
    <h2 id="notes-title">A few little notes</h2>
    <div className="notes-cards">
      {notes.map((note, index) => <article className="wedding-note" key={note.title} style={{ '--note-delay': `${index * 0.2}s` } as CSSProperties}>
        <h3>{note.title}</h3>
        <p>{note.text}</p>
      </article>)}
    </div>
  </section>
}
