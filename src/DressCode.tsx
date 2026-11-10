import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import './dress-code.css'

const fabrics = [
  { name: 'Satin', position: '0% 0%' },
  { name: 'Velvet', position: '100% 0%' },
  { name: 'Sequins', position: '0% 100%' },
  { name: 'Pearls', position: '100% 100%' },
]
const palette = [
  { name: 'Midnight', color: '#161014' },
  { name: 'Bordeaux', color: '#4e0b1b' },
  { name: 'Ruby', color: '#9d132b' },
  { name: 'Champagne', color: '#d8b579' },
  { name: 'Blush', color: '#cc8d7c' },
]
const guidance = [
  { title: 'For her', text: 'Floor-length gowns in satin, velvet or sequins. Pearls are welcome.' },
  { title: 'For him', text: 'A tuxedo or a dark suit.' },
  { title: 'Kindly note', text: 'White and ivory are reserved for the bride.' },
]

export default function DressCode({ reducedMotion }: { reducedMotion: boolean }) {
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

  return (
    <section ref={sectionRef} id="dress-code" className={`dress-scene ${entered ? 'has-arrived' : ''} ${reducedMotion ? 'dress-reduced-motion' : ''}`} aria-labelledby="dress-code-title" lang="en" dir="ltr">
      <div className="dress-backdrop" aria-hidden="true" />
      <header className="dress-heading dress-reveal">
        <h2 id="dress-code-title">Dress code</h2>
        <p>An evening in elegance</p>
      </header>

      <ul className="dress-fabrics" aria-label="Suggested fabrics and accessories">
        {fabrics.map((fabric, index) => <li className="dress-fabric dress-reveal" key={fabric.name} style={{ '--reveal-delay': `${0.15 + index * 0.13}s` } as CSSProperties}>
          <span className="dress-fabric-image" style={{ backgroundPosition: fabric.position }} aria-hidden="true" />
          <span className="dress-fabric-shade" aria-hidden="true" />
          <span className="dress-fabric-label">{fabric.name}</span>
        </li>)}
      </ul>

      <ul className="dress-palette dress-reveal" aria-label="Suggested colour palette">
        {palette.map(colour => <li key={colour.name}>
          <span className="dress-colour" style={{ '--swatch-colour': colour.color } as CSSProperties} aria-hidden="true" />
          <span>{colour.name}</span>
        </li>)}
      </ul>

      <div className="dress-guidance">
        {guidance.map((item, index) => <div className="dress-guidance-item dress-reveal" key={item.title} style={{ '--reveal-delay': `${0.7 + index * 0.16}s` } as CSSProperties}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </div>)}
      </div>
      <img src="/images/evening-stationery.png" className="dress-lace" alt="" loading="lazy" />
    </section>
  )
}
