import { useEffect, useRef } from 'react'

/**
 * 个性展示界面
 * 独立页面，黑白烟雾背景 + 返回按钮
 */
export default function PersonalityShowcase({ onBack }) {
  const canvasRef = useRef(null)

  // 黑白烟雾背景（和 Hero 一样的粒子效果）
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
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      })

      sparks.forEach((s) => {
        s.x += s.vx; s.y += s.vy; s.age++
        if (s.age > s.life) {
          s.x = Math.random() * canvas.width
          s.y = canvas.height + 20
          s.age = 0
          s.life = Math.random() * 250 + 80
          s.opacity = Math.random() * 0.35 + 0.08
        }
        const fade = s.age < s.life * 0.2
          ? s.age / (s.life * 0.2)
          : 1 - (s.age - s.life * 0.2) / (s.life * 0.8)
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 200, 210, ${s.opacity * Math.max(0, fade)})`
        ctx.fill()
      })

      id = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <section className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 overflow-hidden bg-[#060508]">
      {/* 烟雾背景 */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* 光晕 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-[30vh] bg-gradient-to-t from-zinc-800/8 via-zinc-700/3 to-transparent pointer-events-none" />

      {/* 标题 */}
      <div className="relative text-center z-10 animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-light text-white mb-12 tracking-wide">
          个性展示
        </h1>

        <p className="text-zinc-500 text-lg mb-16">
          即将上线，敬请期待
        </p>

        {/* 返回按钮 —— 和 Hero 进入按钮同款 */}
        <button
          onClick={onBack}
          className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-zinc-500/40 hover:bg-zinc-500/10 transition-all duration-500 cursor-pointer backdrop-blur-sm"
        >
          <img src="/poker.png" alt="返回" className="w-14 h-14 object-contain" />

        </button>
      </div>
    </section>
  )
}