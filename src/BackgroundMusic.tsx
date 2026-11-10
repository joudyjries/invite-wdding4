import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const playRef = useRef<() => void>(() => {})
  const wantsMusic = useRef(true)
  const [playing, setPlaying] = useState(false)
  const [awaitingInteraction, setAwaitingInteraction] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const audio = audioRef.current!
    let disposed = false
    audio.volume = 0.45

    const tryPlay = () => {
      if (disposed || !wantsMusic.current || !audio.paused) return
      void audio.play().catch((error: unknown) => {
        if (disposed) return
        if (error instanceof DOMException && error.name === 'NotAllowedError') setAwaitingInteraction(true)
        else if (error instanceof DOMException && error.name === 'NotSupportedError') setFailed(true)
      })
    }
    const onGesture = (event: Event) => {
      // The music button handles its own click, avoiding a start-then-pause race.
      if (event.target instanceof Element && event.target.closest('[data-music-control]')) return
      tryPlay()
    }
    const removeGestures = () => {
      document.removeEventListener('pointerdown', onGesture)
      document.removeEventListener('click', onGesture)
      document.removeEventListener('touchend', onGesture)
      document.removeEventListener('keydown', onGesture)
    }
    const onPlaying = () => {
      setPlaying(true)
      setAwaitingInteraction(false)
      removeGestures()
    }
    const onPause = () => setPlaying(false)
    const onError = () => {
      setFailed(true)
      setPlaying(false)
      removeGestures()
    }
    playRef.current = tryPlay
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    document.addEventListener('pointerdown', onGesture, { passive: true })
    document.addEventListener('click', onGesture, { passive: true })
    document.addEventListener('touchend', onGesture, { passive: true })
    document.addEventListener('keydown', onGesture)
    tryPlay()
    return () => {
      disposed = true
      playRef.current = () => {}
      removeGestures()
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audio.pause()
    }
  }, [])

  const label = failed ? 'Music unavailable' : playing ? 'Pause music' : 'Play music'
  return <>
    <audio ref={audioRef} src="/audio/skyfall.m4a" preload="auto" loop aria-label="Adele — Skyfall" />
    {createPortal(<div className="music-control-bar">
      <button className="music-control" data-music-control aria-label={label} aria-pressed={playing} title={label} disabled={failed} onClick={() => {
        const audio = audioRef.current!
        if (audio.paused) {
          wantsMusic.current = true
          playRef.current()
        } else {
          wantsMusic.current = false
          audio.pause()
        }
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
          <path d="m11 5-5 4H3v6h3l5 4V5Z" />
          {playing ? <><path d="M15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14" /></> : <path d="m16 9 5 6m0-6-5 6" />}
        </svg>
        {awaitingInteraction && !playing && !failed && <span>Play music</span>}
      </button>
    </div>, document.body)}
  </>
}
