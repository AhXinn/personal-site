import { useEffect, useRef, useState } from 'react'

export default function Hero({ onEnter }) {
  const canvasRef = useRef(null)
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(true)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [loaded, setLoaded] = useState(false)

  const handleEnter = () => {
    setExiting(true)
    setTimeout(() => { setVisible(false); onEnter() }, 1000)
  }

  // 鼠标视差
  useEffect(() => {
    const handleMouse = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  // 黑白烟雾 Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let id

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.6) * 0.25,
      size: Math.random() * 100 + 30,
      opacity: Math.random() * 0.05 + 0.01,
      hue: Math.random() > 0.5 ? 220 : 240,
    }))

    const sparks = Array.from({ length: 20 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.7) * 0.15,
      size: Math.random() * 1.2 + 0.2,
      opacity: Math.random() * 0.35 + 0.08,
      life: Math.random() * 250 + 80,
      age: 0,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy
        if (p.x < -100) p.x = canvas.width + 100
        if (p.x > canvas.width + 100) p.x = -100
        if (p.y < -150) p.y = canvas.height + 150
        if (p.y > canvas.height + 150) p.y = -150
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        g.addColorStop(0, `hsla(${p.hue}, 3%, 65%, ${p.opacity})`)
        g.addColorStop(0.5, `hsla(${p.hue}, 2%, 40%, ${p.opacity * 0.4})`)
        g.addColorStop(1, `hsla(${p.hue}, 0%, 25%, 0)`)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
      })
      sparks.forEach((s) => {
        s.x += s.vx; s.y += s.vy; s.age++
        if (s.age > s.life) {
          s.x = Math.random() * canvas.width; s.y = canvas.height + 20
          s.age = 0; s.life = Math.random() * 250 + 80; s.opacity = Math.random() * 0.35 + 0.08
        }
        const fade = s.age < s.life * 0.2 ? s.age / (s.life * 0.2) : 1 - (s.age - s.life * 0.2) / (s.life * 0.8)
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 200, 210, ${s.opacity * Math.max(0, fade)})`; ctx.fill()
      })
      id = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100)
    return () => clearTimeout(t)
  }, [])

  if (!visible) return null

  return (
    <section
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#0a0a0a] transition-all duration-1000 ease-in-out ${
        exiting ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100'
      }`}
      style={{ transitionDuration: '1000ms' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="vignette" />
      <div className="film-grain" />

      <div
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,200,200,0.03) 0%, transparent 70%)',
          left: '50%', top: '45%',
          transform: `translate(-50%, -50%) translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
        }}
      />

      <div
        className={`relative text-center z-10 px-6 transition-all duration-1000 delay-200 ${
          exiting ? 'opacity-0 translate-y-10' : loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div
          className="mx-auto mb-12 h-px w-16 transition-all duration-1000 delay-100"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(180,160,140,0.5), transparent)',
            opacity: loaded ? 1 : 0,
          }}
        />

        <h1
          className="text-7xl sm:text-8xl md:text-[10rem] tracking-[0.02em] mb-6 text-white transition-all duration-1000 delay-300"
          style={{
            fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            letterSpacing: '0.03em',
            lineHeight: 1,
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(8px)',
            textShadow: '0 0 80px rgba(180,160,140,0.06)',
          }}
        >
          AhXinn
        </h1>

        <p
          className="text-sm sm:text-base tracking-[0.4em] uppercase mb-16 text-zinc-500 transition-all duration-1000 delay-500"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(6px)',
          }}
        >
          Be Myself
        </p>

        <button
          onClick={handleEnter}
          className="group relative inline-flex items-center gap-3 px-10 py-4 cursor-pointer"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            transitionDelay: '700ms',
          }}
        >
          <span
            className="text-sm tracking-[0.3em] uppercase text-zinc-600 group-hover:text-zinc-300 transition-colors duration-500"
            style={{ fontFamily: "'Inter', system-ui, sans-serif", fontWeight: 300 }}
          >
            Enter
          </span>
          <span className="h-px w-8 bg-zinc-700 group-hover:bg-zinc-400 group-hover:w-12 transition-all duration-500" />
        </button>
      </div>

      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 h-px transition-all duration-1000 delay-1000"
        style={{
          width: '40px',
          background: 'linear-gradient(90deg, transparent, rgba(180,160,140,0.3), transparent)',
          opacity: loaded ? 1 : 0,
        }}
      />
    </section>
  )
}