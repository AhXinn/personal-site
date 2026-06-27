import { useEffect, useRef } from 'react'

export default function Hero({ onEnter }) {
  const canvasRef = useRef(null)

  // 背景粒子
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let id
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.25 + 0.05,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`; ctx.fill()
      })
      id = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      <div className="relative text-center max-w-3xl z-10">
        <p className="text-accent/70 text-sm tracking-[0.3em] uppercase mb-8 animate-fade-in opacity-0" style={{ animationFillMode: 'forwards' }}>
          Portfolio
        </p>

        <h1 className="text-6xl sm:text-7xl md:text-9xl font-extrabold tracking-tight mb-8 text-text-primary animate-fade-in-up opacity-0 animate-delay-100" style={{ animationFillMode: 'forwards' }}>
          AhXinn
        </h1>

        <p className="text-text-secondary text-lg md:text-xl mb-12 animate-fade-in-up opacity-0 animate-delay-300" style={{ animationFillMode: 'forwards' }}>
          be myself.
        </p>

        {/* 进入按钮 */}
        <button
          onClick={onEnter}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.05] border border-white/[0.08] text-text-secondary hover:text-white hover:border-accent/40 hover:bg-accent/10 transition-all duration-500 animate-fade-in-up opacity-0 animate-delay-500 cursor-pointer"
          style={{ animationFillMode: 'forwards' }}
        >
          <span className="text-base font-medium tracking-wide">进入</span>
          <svg className="w-5 h-5 transition-transform duration-500 group-hover:translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  )
}
