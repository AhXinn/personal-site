import { useEffect, useRef } from 'react'

export default function Hero() {
  const canvasRef = useRef(null)

  // 背景粒子动画
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.05,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(167, 139, 250, ${p.opacity})`
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
    >
      {/* 粒子背景 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      <div className="relative text-center max-w-3xl">
        {/* 名字 */}
        <h1
          className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tight mb-6 text-text-primary animate-fade-in-up opacity-0"
          style={{ animationFillMode: 'forwards' }}
        >
          AhXinn
        </h1>

        {/* 一句话 */}
        <p
          className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-xl mx-auto animate-fade-in-up opacity-0 animate-delay-200"
          style={{ animationFillMode: 'forwards' }}
        >
          be myself.
        </p>

        {/* CTA 按钮 */}
        <div
          className="mt-10 animate-fade-in-up opacity-0 animate-delay-400"
          style={{ animationFillMode: 'forwards' }}
        >
          <a
            href="#works"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-medium hover:bg-accent-hover transition-colors"
          >
            查看作品
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>
        </div>

        {/* 底部滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717a" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
