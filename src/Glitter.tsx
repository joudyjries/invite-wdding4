import { useEffect, useRef } from 'react'

type Particle = { x: number; y: number; radius: number; phase: number; speed: number }

export default function Glitter({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pausedRef = useRef(paused)

  useEffect(() => { pausedRef.current = paused }, [paused])

  useEffect(() => {
    const canvas = canvasRef.current!
    const context = canvas.getContext('2d')
    if (!context) return
    let width = 1
    let height = 1
    let frame = 0
    let lastTime = 0
    let time = 0
    let seed = 291
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0
      return seed / 4294967296
    }
    const particles: Particle[] = Array.from({ length: 125 }, () => ({
      x: random(), y: random(), radius: 0.35 + random() * 0.75,
      phase: random() * Math.PI * 2, speed: 0.25 + random() * 0.6,
    }))
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const ratio = Math.min(window.devicePixelRatio, 2)
      width = bounds.width
      height = bounds.height
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()
    const animate = (now: number) => {
      const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0
      lastTime = now
      if (!pausedRef.current && !document.hidden) {
        time += delta
        context.clearRect(0, 0, width, height)
        for (const particle of particles) {
          const pulse = Math.pow(Math.max(0, Math.sin(time * particle.speed * 2 + particle.phase)), 6)
          const x = (particle.x + Math.sin(time * 0.12 + particle.phase) * 0.012) * width
          const y = ((particle.y - time * 0.003 * particle.speed + 100) % 1) * height
          context.globalAlpha = 0.16 + pulse * 0.75
          context.fillStyle = '#f8d894'
          context.beginPath()
          context.arc(x, y, particle.radius, 0, Math.PI * 2)
          context.fill()
          if (pulse > 0.8 && particle.radius > 0.8) {
            context.globalAlpha = (pulse - 0.8) * 1.4
            context.strokeStyle = '#ffe3ab'
            context.lineWidth = 0.55
            context.beginPath()
            context.moveTo(x - 3, y)
            context.lineTo(x + 3, y)
            context.moveTo(x, y - 3)
            context.lineTo(x, y + 3)
            context.stroke()
          }
        }
        context.globalAlpha = 1
      }
      frame = requestAnimationFrame(animate)
    }
    frame = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [])

  return <canvas ref={canvasRef} className="glitter" aria-hidden="true" />
}
