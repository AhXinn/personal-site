import { useEffect, useRef, useState, useMemo } from 'react'

export default function Hero({ onEnter }) {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (exiting) {
      const t = setTimeout(() => { setVisible(false); onEnter() }, 1000)
      return () => clearTimeout(t)
    }
  }, [exiting, onEnter])

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const handleMouse = (e) => {
      el.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5) * 20)
      el.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5) * 20)
    }
    window.addEventListener('mousemove', handleMouse, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let id
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.55) * 0.2,
      size: Math.random() * 110 + 35, opacity: Math.random() * 0.05 + 0.01,
      hue: 38 + Math.random() * 15,
    }))
    const sparks = Array.from({ length: 15 }, () => ({
      x: Math.random() * canvas.width, y: canvas.height + 20,
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.65) * 0.12,
      size: Math.random() * 1 + 0.2, opacity: Math.random() * 0.3 + 0.06,
      life: Math.random() * 220 + 70, age: 0,
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
        g.addColorStop(0, `hsla(${p.hue}, 30%, 55%, ${p.opacity})`)
        g.addColorStop(0.5, `hsla(${p.hue}, 25%, 40%, ${p.opacity * 0.4})`)
        g.addColorStop(1, `hsla(${p.hue}, 20%, 35%, 0)`)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill()
      })
      sparks.forEach((s) => {
        s.x += s.vx; s.y += s.vy; s.age++
        if (s.age > s.life) { s.x = Math.random() * canvas.width; s.y = canvas.height + 20; s.age = 0; s.life = Math.random() * 220 + 70; s.opacity = Math.random() * 0.3 + 0.06 }
        const fade = s.age < s.life * 0.2 ? s.age / (s.life * 0.2) : 1 - (s.age - s.life * 0.2) / (s.life * 0.8)
        ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 150, 110, ${s.opacity * Math.max(0, fade)})`; ctx.fill()
      })
      id = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])

    const imagePositions = useMemo(() => {
    const imgs = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]
    for (let i = imgs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)); [imgs[i], imgs[j]] = [imgs[j], imgs[i]]
    }
    // 上1/2区域，5列×2行，互不遮挡
    const cols = 5, rows = 2
    const result = []
    for (let i = 0; i < 10; i++) {
      const col = i % cols, row = Math.floor(i / cols)
      result.push({
        src: `/personal-site/flying/${imgs[i]}.png`,
        top: (row / rows) * 40 + 2 + Math.random() * 8 + '%',
        left: (col / cols) * 80 + 5 + Math.random() * 10 + '%',
        size: 45 + Math.random() * 60,
        rotate: (Math.random() - 0.5) * 35,
        delay: Math.random() * 0.5,
        opacity: 0.2 + Math.random() * 0.28,
      })
    }
    return result
  }, [])

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t) }, [])
  if (!visible) return null

  return (
    <section ref={sectionRef}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#d4c098] transition-all duration-1000 ease-in-out ${
        exiting ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100'
      }`}
      style={{ transitionDuration: '1000ms' }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="vignette" />
      <div className="film-grain" />

      {imagePositions.map((img, i) => (
        <div key={i} className="absolute pointer-events-none z-5 animate-float" style={{
          top: img.top, left: img.left,
          opacity: loaded ? img.opacity : 0,
          transform: `rotate(${img.rotate}deg)`,
          transition: `opacity 1s ease ${img.delay + 0.5}s`,
        }}>
          <img src={img.src} alt="" style={{
            width: img.size, height: 'auto',
            filter: 'grayscale(0.5) sepia(0.25) brightness(0.9)',
          }} />
        </div>
      ))}

      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none parallax-glow"
        style={{ background: 'radial-gradient(circle, rgba(160,130,90,0.08) 0%, transparent 70%)', left: '50%', top: '45%' }}
      />

      <div className={`relative text-center z-10 px-6 transition-all duration-1000 delay-200 ${
        exiting ? 'opacity-0 translate-y-10' : loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}>
        <h1 className="text-7xl sm:text-8xl md:text-[10rem] tracking-[0.02em] mb-6 text-[#2a1a08] transition-all duration-1000 delay-300"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, letterSpacing: '0.03em', lineHeight: 1,
            opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(8px)' }}
        >AhXinn</h1>

        <p className="text-sm sm:text-base tracking-[0.4em] uppercase mb-16 text-[#6b5540] transition-all duration-1000 delay-500"
          style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(6px)' }}
        >Be Myself</p>

        <button onClick={() => setExiting(true)}
          className="cursor-pointer transition-all duration-500"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(8px)', transitionDelay: '700ms', filter: 'grayscale(0.3) sepia(0.2)' }}
          onMouseEnter={(e) => { e.currentTarget.style.filter = 'grayscale(0) sepia(0) brightness(1.2) drop-shadow(0 0 16px rgba(255,255,255,0.6))'; e.currentTarget.style.transform = 'scale(1.1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.filter = 'grayscale(0.3) sepia(0.2)'; e.currentTarget.style.transform = 'scale(1)' }}
        >
          <img src="/personal-site/enter-btn.png" alt="Enter" style={{ width: 100, height: 'auto' }} />
        </button>
      </div>
    </section>
  )
}