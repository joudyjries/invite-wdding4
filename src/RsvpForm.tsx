import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { wedding } from './weddingDetails'
import './notes-rsvp.css'

const attendanceOptions = [
  { value: 'yes', label: 'Yes, with pleasure' },
  { value: 'no', label: 'Sadly, I can’t come' },
  { value: 'later', label: 'I’ll reply a little later' },
]
type Errors = Partial<Record<'name' | 'attendance', string>>

export default function RsvpForm() {
  const [fullName, setFullName] = useState('')
  const [attendance, setAttendance] = useState('')
  const [note, setNote] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [messageUrl, setMessageUrl] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)
  const firstOptionRef = useRef<HTMLInputElement>(null)

  function submitReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const name = fullName.trim().replace(/\s+/g, ' ')
    const selected = attendanceOptions.find(option => option.value === attendance)
    const nextErrors: Errors = {}
    if (!name) nextErrors.name = 'Please enter your full name.'
    if (!selected) nextErrors.attendance = 'Please choose a reply.'
    setErrors(nextErrors)
    if (!name || !selected) {
      if (!name) nameRef.current?.focus()
      else firstOptionRef.current?.focus()
      return
    }

    const date = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
      .format(new Date(Date.UTC(wedding.date.year, wedding.date.month - 1, wedding.date.day)))
    const message = [
      `Wedding RSVP — ${wedding.bride} & ${wedding.groom}`,
      `Date: ${date}`,
      `Name: ${name}`,
      `Reply: ${selected.label}`,
      ...(note.trim() ? [`A note for the couple:\n${note.trim()}`] : []),
    ].join('\n\n')
    const url = `https://wa.me/${wedding.replyPhone}?text=${encodeURIComponent(message)}`
    setMessageUrl(url)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return <section id="rsvp" className="rsvp-scene" aria-labelledby="rsvp-title" lang="en" dir="ltr">
    <div className="rsvp-backdrop" aria-hidden="true" />
    <div className="rsvp-paper">
      <div className="rsvp-paper-frame" aria-hidden="true" />
      <header className="rsvp-heading">
        <h2 id="rsvp-title">Will you join us?</h2>
        <p>We can’t wait to celebrate with you.</p>
      </header>
      <form className="rsvp-form" onSubmit={submitReply} noValidate>
        <div className="rsvp-field">
          <label htmlFor="guest-name">Your full name</label>
          <input ref={nameRef} id="guest-name" name="fullName" autoComplete="name" maxLength={80} required value={fullName} aria-invalid={!!errors.name} aria-describedby={errors.name ? 'guest-name-error' : undefined} onChange={event => {
            setFullName(event.target.value)
            setMessageUrl('')
            if (errors.name) setErrors(current => ({ ...current, name: undefined }))
          }} />
          {errors.name && <p id="guest-name-error" className="rsvp-error" role="alert">{errors.name}</p>}
        </div>

        <fieldset className="rsvp-attendance" aria-describedby={errors.attendance ? 'attendance-error' : undefined}>
          <legend>Will you come?</legend>
          {attendanceOptions.map((option, index) => <label key={option.value}>
            <input ref={index === 0 ? firstOptionRef : undefined} type="radio" name="attendance" value={option.value} checked={attendance === option.value} required aria-invalid={!!errors.attendance} onChange={() => {
              setAttendance(option.value)
              setMessageUrl('')
              if (errors.attendance) setErrors(current => ({ ...current, attendance: undefined }))
            }} />
            <span>{option.label}</span>
          </label>)}
          {errors.attendance && <p id="attendance-error" className="rsvp-error" role="alert">{errors.attendance}</p>}
        </fieldset>

        <div className="rsvp-field">
          <label htmlFor="couple-note">A note for the couple <span>(optional)</span></label>
          <textarea id="couple-note" name="note" rows={4} maxLength={1000} value={note} onChange={event => { setNote(event.target.value); setMessageUrl('') }} />
        </div>

        <button type="submit" className="rsvp-submit">Send my reply<span>via WhatsApp</span></button>
        <p className="rsvp-help">Opens WhatsApp with your reply ready to send.</p>
        {messageUrl && <div className="rsvp-handoff" role="status">
          <p>Your message is ready. Send it in WhatsApp to confirm.</p>
          <a href={messageUrl} target="_blank" rel="noopener noreferrer">Open my reply in WhatsApp<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M5 4h11v11M16 4 4 16" /></svg></a>
        </div>}
      </form>
    </div>
    <p className="rsvp-signature">With love, <span>{wedding.bride} &amp; {wedding.groom}</span></p>
  </section>
}
