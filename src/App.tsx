import { useEffect, useRef, useState } from 'react'
import Glitter from './Glitter'
import DancingCouple from './DancingCouple'
import EnvelopeLetter from './EnvelopeLetter'
import WeddingCalendar from './WeddingCalendar'
import EveningDetails from './EveningDetails'
import WeddingVenue from './WeddingVenue'
import FloatingReply from './FloatingReply'
import DressCode from './DressCode'
import WeddingNotes from './WeddingNotes'
import RsvpForm from './RsvpForm'
import BackgroundMusic from './BackgroundMusic'
import { wedding } from './weddingDetails'

const assets = ['/images/velvet-curtains.png', '/images/romantic-stage.png', '/images/dancing-couple.png']

export default function App() {
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [paused, setPaused] = useState(false)
  const [replay, setReplay] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const invitationRef = useRef<HTMLElement>(null)

  useEffect(() => {
    let cancelled = false
    const load = assets.map(src => new Promise<void>((resolve, reject) => {
      const image = new Image()
      image.onload = () => { image.decode().then(() => resolve()).catch(reject) }
      image.onerror = reject
      image.src = src
    }))
    const fonts = document.fonts.ready
    Promise.all([...load, fonts]).then(() => {
      if (!cancelled) setReady(true)
    }).catch(() => { if (!cancelled) setFailed(true) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', change)
    const visibility = () => {
      const animations = invitationRef.current?.getAnimations({ subtree: true }) ?? []
      for (const animation of animations) {
        if (document.hidden) animation.pause()
        else if (!paused) animation.play()
      }
    }
    document.addEventListener('visibilitychange', visibility)
    return () => {
      preference.removeEventListener('change', change)
      document.removeEventListener('visibilitychange', visibility)
    }
  }, [paused])

  return (
    <main className="wedding-experience">
      <div className="ambient-light" aria-hidden="true" />
      <section
        ref={invitationRef}
        key={replay}
        className={`invitation ${ready ? 'is-ready' : ''} ${paused ? 'is-paused' : ''} ${reducedMotion ? 'reduced-motion' : ''}`}
        aria-label={`The wedding of ${wedding.bride} and ${wedding.groom}`}
        aria-busy={!ready}
      >
        <div className="romantic-scene" aria-hidden="true">
          <img src="/images/romantic-stage.png" className="stage-backdrop" alt="" fetchPriority="high" />
          <div className="stage-light" />
          <div className="couple-shadow" />
          <div className="dance-position">
            <DancingCouple paused={paused || !ready || reducedMotion} />
          </div>
          <div className="scene-vignette" />
        </div>

        <div className="invitation-copy" lang="en" dir="ltr">
          <p className="family-line reveal">Together with their families</p>
          <h1 className="couple-names">
            <span className="bride-name reveal">{wedding.bride}</span>
            <span className="ampersand reveal">&amp;</span>
            <span className="groom-name reveal">{wedding.groom}</span>
          </h1>
          <div className="invitation-rule reveal" aria-hidden="true"><span />✧<span /></div>
          <p className="invitation-line reveal">A lifetime of love.<br />One beautiful beginning.</p>
        </div>

        <div className="curtains" aria-hidden="true">
          <div className="curtain-panel curtain-left"><img src="/images/velvet-curtains.png" alt="" fetchPriority="high" /></div>
          <div className="curtain-panel curtain-right"><img src="/images/velvet-curtains.png" alt="" /></div>
          <div className="curtain-seam" />
        </div>
        <Glitter paused={paused || !ready || reducedMotion} />
        <div className="opening-whisper" aria-hidden="true"><span />A love story unfolds<span /></div>

        {!ready && <div className="loading-state" role={failed ? 'alert' : 'status'}>
          {failed ? <><p>The invitation couldn’t load.</p><button onClick={() => window.location.reload()}>Try again</button></> : <><span className="loading-ring" /><span>Preparing a little magic</span></>}
        </div>}

        {ready && <a className="scroll-invitation reveal" href="#our-letter">
          A little note for you
          <svg viewBox="0 0 20 12" fill="none" aria-hidden="true"><path d="m3 3 7 6 7-6" stroke="currentColor" strokeWidth="1" /></svg>
        </a>}
        {ready && !reducedMotion && <div className="scene-controls" dir="ltr">
          <button className="quiet-button" onClick={() => setPaused(!paused)} aria-label={paused ? 'Play animation' : 'Pause animation'} title={paused ? 'Play' : 'Pause'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
              {paused ? <path d="m9 5 10 7-10 7V5Z" /> : <path d="M8 6v12M16 6v12" />}
            </svg>
          </button>
          <button className="quiet-button replay-button" onClick={() => { setPaused(false); setReplay(value => value + 1) }} aria-label="Replay invitation" title="Replay invitation">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M4 10a8 8 0 1 1 1.6 7M4 4v6h6" /></svg>
          </button>
        </div>}
      </section>
      <EnvelopeLetter bride={wedding.bride} groom={wedding.groom} reducedMotion={reducedMotion} />
      <WeddingCalendar bride={wedding.bride} groom={wedding.groom} reducedMotion={reducedMotion} />
      <EveningDetails reducedMotion={reducedMotion} />
      <WeddingVenue reducedMotion={reducedMotion} />
      <DressCode reducedMotion={reducedMotion} />
      <WeddingNotes reducedMotion={reducedMotion} />
      <RsvpForm />
      <FloatingReply />
      <BackgroundMusic />
    </main>
  )
}
