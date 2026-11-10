import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'


export default function FloatingReply() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const evening = document.getElementById('the-evening')
      const rsvp = document.getElementById('rsvp')
      const formReached = !!rsvp && rsvp.getBoundingClientRect().top < window.innerHeight * 0.85
      setVisible(!!evening && evening.getBoundingClientRect().top < window.innerHeight * 0.85 && !formReached)
    }
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])

  if (!visible) return null
  return createPortal(
    <div className="floating-reply-bar">
      <a className="floating-reply" href="#rsvp">
        Reply to the invitation
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
      </a>
    </div>,
    document.body,
  )
}
