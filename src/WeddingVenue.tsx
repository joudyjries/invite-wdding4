import { useEffect, useRef, useState } from 'react'
import './venue.css'

// Demo location selected at the user's request; replace all details together.
// Address source: Comune di Tremezzina's official Villa Balbiano listing.
const venue = {
  name: 'Villa Balbiano',
  street: 'Piazza Cardinal Durini, Ossuccio',
  region: 'Lake Como, Italy',
  mapQuery: 'Villa Balbiano, Piazza Cardinal Durini, 22010 Ossuccio CO, Italy',
}
const mapQuery = encodeURIComponent(venue.mapQuery)
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`
const embedUrl = `https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`

function PinIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
}

export default function WeddingVenue({ reducedMotion }: { reducedMotion: boolean }) {
  const sectionRef = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(() => !('IntersectionObserver' in window))
  const [mapLoaded, setMapLoaded] = useState(false)

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
    <section ref={sectionRef} id="the-venue" className={`venue-scene ${entered ? 'has-arrived' : ''} ${reducedMotion ? 'venue-reduced-motion' : ''}`} lang="en" dir="ltr" aria-labelledby="venue-heading">
      <div className="venue-backdrop" aria-hidden="true" />
      <img className="venue-lace" src="/images/evening-stationery.png" alt="" loading="lazy" />
      <h2 id="venue-heading" className="venue-heading venue-reveal">Where</h2>
      <figure className="venue-portrait venue-reveal">
        <div className="venue-photo-window">
          <img src="/images/venue-atmosphere.png" alt="Illustrative wedding atmosphere: a candlelit reception table in a cypress garden at sunset" loading="lazy" />
          <div className="venue-photo-shade" />
        </div>
        <figcaption>Wedding atmosphere</figcaption>
      </figure>
      <div className="venue-details venue-reveal">
        <h3>{venue.name}</h3>
        <address>{venue.street}<br />{venue.region}</address>
      </div>
      <a className="venue-button venue-directions venue-reveal" href={directionsUrl} target="_blank" rel="noopener noreferrer"><PinIcon />Get directions</a>

      <div className="venue-map-block venue-reveal">
        <div className="venue-map">
          {!mapLoaded && <a className="venue-map-loading" href={mapsUrl} target="_blank" rel="noopener noreferrer"><PinIcon /><span>{venue.name}</span><small>View on Google Maps</small></a>}
          {entered && <iframe
            title={`Map of ${venue.name}, ${venue.region}`}
            src={embedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            onLoad={() => setMapLoaded(true)}
          />}
        </div>
        <a className="venue-map-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">Open in Google Maps<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true"><path d="M6 4h10v10M16 4 4 16" /></svg></a>
      </div>

    </section>
  )
}
