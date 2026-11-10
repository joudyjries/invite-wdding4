import { useEffect, useRef, useState } from 'react'
import './envelope.css'

const letterAssets = ['/images/burgundy-satin.png', '/images/embroidered-envelope.png']

export default function EnvelopeLetter({ bride, groom, reducedMotion }: {
  bride: string
  groom: string
  reducedMotion: boolean
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(() => !('IntersectionObserver' in window))
  const [artReady, setArtReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.allSettled(letterAssets.map(src => new Promise<void>((resolve, reject) => {
      const image = new Image()
      image.onload = () => { image.decode().then(resolve).catch(reject) }
      image.onerror = reject
      image.src = src
    }))).then(() => { if (!cancelled) setArtReady(true) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const section = sectionRef.current!
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= 0.6)) {
        setEntered(true)
        observer.disconnect()
      }
    }, { threshold: [0.6] })
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="our-letter"
      className={`letter-scene ${entered && artReady ? 'is-open' : ''} ${reducedMotion ? 'letter-reduced-motion' : ''}`}
      aria-labelledby="letter-title"
      lang="en"
      dir="ltr"
    >
      <img src="/images/burgundy-satin.png" className="letter-satin" alt="" loading="lazy" />
      <div className="letter-scene-shade" aria-hidden="true" />
      <p className="letter-intro">For the ones we love</p>

      <div className="envelope-composition">
        <div className="envelope-floor-shadow" aria-hidden="true" />
        <div className="envelope-back" aria-hidden="true" />
        <div className="letter-slot">
          <article className="letter-paper">
            <div className="paper-frame" aria-hidden="true" />
            <span className="paper-ornament" aria-hidden="true">❦</span>
            <h2 id="letter-title">Dear family<br />and friends,</h2>
            <div className="letter-message">
              <p>We’ve waited for this moment, and we can’t imagine it without you.</p>
              <p>Join us for a night of love, laughter, and a little magic as we begin our forever.</p>
            </div>
            <div className="letter-signature">
              <p>With all our love,</p>
              <span>{bride} &amp; {groom}</span>
            </div>
            <span className="paper-bottom-ornament" aria-hidden="true">✧</span>
          </article>
        </div>

        <div className="envelope-flap" aria-hidden="true">
          <svg viewBox="0 0 100 60" preserveAspectRatio="none">
            <defs>
              <pattern id="flap-fabric" width="1" height="1" patternContentUnits="objectBoundingBox">
                <image href="/images/embroidered-envelope.png" x="-0.1" y="-0.9" width="1.2" height="2.4" preserveAspectRatio="none" />
              </pattern>
              <linearGradient id="flap-light" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#9a3b33" stopOpacity="0.2" />
                <stop offset="1" stopColor="#250411" stopOpacity="0.45" />
              </linearGradient>
            </defs>
            <path d="M2 1H98L50 57Z" fill="#5e1023" />
            <path d="M2 1H98L50 57Z" fill="url(#flap-fabric)" />
            <path d="M2 1H98L50 57Z" fill="url(#flap-light)" stroke="#d2ab6f" strokeWidth="0.65" />
            <path d="M7 3H93L50 53Z" fill="none" stroke="#e4be7c" strokeWidth="0.2" />
          </svg>
          <span className="envelope-seal">{bride.charAt(0)}<span>&amp;</span>{groom.charAt(0)}</span>
        </div>
        <img src="/images/embroidered-envelope.png" className="envelope-front" alt="An ornate burgundy envelope embroidered with gold" loading="lazy" />
      </div>
      <p className="letter-closing">The next chapter is sweeter with you.</p>
    </section>
  )
}
