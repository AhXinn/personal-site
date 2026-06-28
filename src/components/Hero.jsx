import React, { useEffect, useRef, useState, useMemo } from 'react'

export default function Hero({ onEnter }) {
  const canvasRef = useRef(null)
  const sectionRef = useRef(null)
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(true)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (exiting) { const t = setTimeout(() => { setVisible(false); onEnter() }, 1000); return () => clearTimeout(t) }
  }, [exiting, onEnter])

  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const h = (e) => { el.style.setProperty('--mx', (e.clientX / window.innerWidth - 0.5) * 20); el.style.setProperty('--my', (e.clientY / window.innerHeight - 0.5) * 20) }
    window.addEventListener('mousemove', h, { passive: true }); return () => window.removeEventListener('mousemove', h)
  }, [])

  useEffect(() => {
    const c = canvasRef.current; if (!c) return; const ctx = c.getContext('2d'); let id
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }; resize(); window.addEventListener('resize', resize)
    const p = Array.from({ length: 50 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, vx: (Math.random() - 0.5) * 0.2, vy: (Math.random() - 0.55) * 0.2, size: Math.random() * 110 + 35, opacity: Math.random() * 0.05 + 0.01, hue: 38 + Math.random() * 15 }))
    const s = Array.from({ length: 15 }, () => ({ x: Math.random() * c.width, y: c.height + 20, vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.65) * 0.12, size: Math.random() * 1 + 0.2, opacity: Math.random() * 0.3 + 0.06, life: Math.random() * 220 + 70, age: 0 }))
    const anim = () => { ctx.clearRect(0, 0, c.width, c.height)
      p.forEach(q => { q.x += q.vx; q.y += q.vy; if (q.x < -100) q.x = c.width + 100; if (q.x > c.width + 100) q.x = -100; if (q.y < -150) q.y = c.height + 150; if (q.y > c.height + 150) q.y = -150; const g = ctx.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.size); g.addColorStop(0, 'hsla(' + q.hue + ', 30%, 55%, ' + q.opacity + ')'); g.addColorStop(0.5, 'hsla(' + q.hue + ', 25%, 40%, ' + (q.opacity * 0.4) + ')'); g.addColorStop(1, 'hsla(' + q.hue + ', 20%, 35%, 0)'); ctx.beginPath(); ctx.arc(q.x, q.y, q.size, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill() })
      s.forEach(q => { q.x += q.vx; q.y += q.vy; q.age++; if (q.age > q.life) { q.x = Math.random() * c.width; q.y = c.height + 20; q.age = 0; q.life = Math.random() * 220 + 70; q.opacity = Math.random() * 0.3 + 0.06 }; const f = q.age < q.life * 0.2 ? q.age / (q.life * 0.2) : 1 - (q.age - q.life * 0.2) / (q.life * 0.8); ctx.beginPath(); ctx.arc(q.x, q.y, q.size, 0, Math.PI * 2); ctx.fillStyle = 'rgba(180,150,110,' + (q.opacity * Math.max(0, f)) + ')'; ctx.fill() }); id = requestAnimationFrame(anim) }; anim()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])

  const imgs = useMemo(() => {
    const arr = [1, 2, 3, 4, 5, 1, 2, 3, 4, 5]; for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]] }
    const res = []; for (let i = 0; i < 10; i++) { const col = i % 5, row = Math.floor(i / 5); res.push({ src: '/personal-site/flying/' + arr[i] + '.png', top: (row / 2) * 40 + 2 + Math.random() * 8 + '%', left: (col / 5) * 85 + 8 + Math.random() * 10 + '%', size: 45 + Math.random() * 60, rotate: (Math.random() - 0.5) * 35, delay: Math.random() * 0.5, opacity: 0.2 + Math.random() * 0.28 }) }; return res
  }, [])

  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t) }, [])
  if (!visible) return null

  return (
    <section ref={sectionRef}
      className={"fixed inset-0 z-50 flex items-center justify-center overflow-visible bg-[#d4c098] transition-all duration-1000 ease-in-out" + (exiting ? ' opacity-0 scale-105 blur-sm' : ' opacity-100 scale-100')}
      style={{ transitionDuration: '1000ms' }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="vignette" />
      <div className="film-grain" />
      {imgs.map((img, i) => (
        <div key={i} className="absolute pointer-events-none z-5 animate-float" style={{ top: img.top, left: img.left, opacity: loaded ? img.opacity : 0, transform: 'rotate(' + img.rotate + 'deg)', transition: 'opacity 1s ease ' + (img.delay + 0.5) + 's' }}>
          <img src={img.src} alt="" style={{ width: img.size, height: 'auto', filter: 'grayscale(0.5) sepia(0.25) brightness(1.05) contrast(1.15)' }} />
        </div>
      ))}
      <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none parallax-glow" style={{ background: 'radial-gradient(circle, rgba(160,130,90,0.08) 0%, transparent 70%)', left: '50%', top: '45%' }} />
      <div className={"relative text-center z-10 px-6 transition-all duration-1000 delay-200" + (exiting ? ' opacity-0 translate-y-10' : loaded ? ' opacity-100 translate-y-0' : ' opacity-0 translate-y-4')}>
        <h1 className="text-7xl sm:text-8xl md:text-[10rem] tracking-[0.02em] mb-6 text-[#2a1a08] transition-all duration-1000 delay-300" style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, letterSpacing: '0.03em', lineHeight: 1, opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(8px)' }}>AhXinn</h1>
        <p className="text-sm sm:text-base tracking-[0.4em] uppercase mb-16 text-[#6b5540] transition-all duration-1000 delay-500" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300, opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(6px)' }}>Be Myself</p>
        <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'translateY(0)' : 'translateY(8px)', transition: 'opacity 0.7s ease, transform 0.7s ease', transitionDelay: '700ms' }}>
          <button onClick={() => setExiting(true)} className="hero-enter-btn">
            <img src="/personal-site/enter-btn.png" alt="Enter" style={{ width: 100, height: 'auto' }} />
          </button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none" style={{ height: '45%' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(212,192,152,0.4) 0%, rgba(212,192,152,0.15) 60%, transparent 100%)', zIndex: 1 }} />
        <img src="/personal-site/retouch.png" alt="" className="w-full h-full object-cover object-top opacity-65 wave-animate" style={{ filter: 'grayscale(0.5) sepia(0.25) brightness(1.05) contrast(1.15)' }} />
      </div>
    </section>
  )
}