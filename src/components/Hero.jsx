import { useEffect, useRef, useState } from 'react'

/**
 * Hero 封面页 —— 黑白烟雾风格
 * Canvas 黑白烟雾粒子 + CSS 雾层
 */
export default function Hero({ onEnter }) {
  const canvasRef = useRef(null)
  const [exiting, setExiting] = useState(false)
  const [visible, setVisible] = useState(true)

  const handleEnter = () => {
    setExiting(true)
    // 等退出动画播完再隐藏 Hero
    setTimeout(() => {
      setVisible(false)
      onEnter()
    }, 900)
  }

  // ===== 烟雾粒子 Canvas =====
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

    // 烟雾粒子：大量低透明度的大粒子模拟雾气飘动
    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.6) * 0.3, // 偏向上飘
      size: Math.random() * 120 + 40,   // 大粒子
      opacity: Math.random() * 0.06 + 0.015,
      hue: Math.random() > 0.5 ? 220 : 240, // 冷灰蓝系
    }))

    // 额外的小亮点模拟烟雾中的微光
    const sparks = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.7) * 0.2,
      size: Math.random() * 1.5 + 0.3,
      opacity: Math.random() * 0.4 + 0.1,
      life: Math.random() * 300 + 100,
      age: 0,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 绘制大烟雾粒子
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // 循环边界
        if (p.x < -100) p.x = canvas.width + 100
        if (p.x > canvas.width + 100) p.x = -100
        if (p.y < -150) p.y = canvas.height + 150
        if (p.y > canvas.height + 150) p.y = -150

        // 径向渐变模拟烟雾软边
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
        gradient.addColorStop(0, `hsla(${p.hue}, 5%, 70%, ${p.opacity})`)
        gradient.addColorStop(0.5, `hsla(${p.hue}, 3%, 45%, ${p.opacity * 0.5})`)
        gradient.addColorStop(1, `hsla(${p.hue}, 0%, 30%, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      // 绘制微光粒子
      sparks.forEach((s, i) => {
        s.x += s.vx
        s.y += s.vy
        s.age++

        if (s.age > s.life) {
          // 重置粒子
          s.x = Math.random() * canvas.width
          s.y = canvas.height + 20
          s.age = 0
          s.life = Math.random() * 300 + 100
          s.opacity = Math.random() * 0.4 + 0.1
        }

        const fade = s.age < s.life * 0.2
          ? s.age / (s.life * 0.2)
          : 1 - (s.age - s.life * 0.2) / (s.life * 0.8)

        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 200, 210, ${s.opacity * Math.max(0, fade)})`
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

  if (!visible) return null

  return (
    <section
      className={`fixed inset-0 z-50 flex items-center justify-center px-6 overflow-hidden bg-[#060508] transition-all duration-900 ease-in-out ${
        exiting ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0'
      }`}
      style={{ transitionDuration: '900ms' }}
    >
      {/* Canvas 烟雾背景 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* 中心光晕 */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.03] blur-[150px] pointer-events-none" />

      {/* 底部雾层 */}
      <div className="absolute bottom-0 left-0 right-0 h-[40vh] bg-gradient-to-t from-zinc-800/10 via-zinc-700/5 to-transparent pointer-events-none" />

      {/* 内容 */}
      <div
        className={`relative text-center max-w-3xl z-10 transition-all duration-700 delay-100 ${
          exiting ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'
        }`}
      >


        {/* 名字 */}
        <h1
          className="text-6xl sm:text-7xl md:text-9xl tracking-tight mb-8 text-white animate-fade-in-up opacity-0 animate-delay-100" style={{ fontFamily: 'Soul Seashell', fontWeight: 400 }}
          style={{ animationFillMode: 'forwards' }}
        >
          AhXinn
        </h1>

        {/* 引言 */}
        <p
          className="text-zinc-400 text-lg md:text-xl mb-14 animate-fade-in-up opacity-0 animate-delay-300"
          style={{ animationFillMode: 'forwards' }}
        >
          be myself.
        </p>

        {/* 进入按钮 */}
        <button
          onClick={handleEnter}
          className="group relative inline-flex items-center gap-3 px-10 py-4 rounded-full bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:text-white hover:border-zinc-500/40 hover:bg-zinc-500/10 transition-all duration-500 animate-fade-in-up opacity-0 animate-delay-500 cursor-pointer backdrop-blur-sm"
          style={{ animationFillMode: 'forwards' }}
        >
          <span className="text-base font-medium tracking-widest">进入</span>

        </button>


      </div>
    </section>
  )
}