import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const particles = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  angle: (i / 20) * 360,
  distance: 80 + Math.random() * 120,
  size: 2 + Math.random() * 4,
  delay: Math.random() * 0.15,
}))

export default function BaroqueEnter({ onEnter }) {
  const [stage, setStage] = useState('idle') // idle→shake→sword→impact→shatter→done

  const handleClick = () => {
    if (stage !== 'idle') return
    setStage('shake')
    setTimeout(() => setStage('sword'), 400)
    setTimeout(() => setStage('impact'), 900)
    setTimeout(() => setStage('shatter'), 1600)
    setTimeout(() => setStage('done'), 2200)
    setTimeout(() => onEnter(), 2400)
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: 200, height: 80 }}>
      {/* ===== 剑 ===== */}
      <AnimatePresence>
        {(stage === 'sword' || stage === 'impact' || stage === 'shatter') && (
          <motion.div
            className="absolute z-20 pointer-events-none"
            initial={{ y: -600, x: 0, rotate: 0, opacity: 1 }}
            animate={
              stage === 'sword'
                ? { y: -20, rotate: 0, opacity: 1 }
                : stage === 'impact'
                ? { y: 8, rotate: 3, opacity: 1 }
                : stage === 'shatter'
                ? { y: 20, rotate: 15, opacity: 0 }
                : {}
            }
            transition={
              stage === 'sword'
                ? { duration: 0.5, ease: [0.2, 0, 0.4, 1] }
                : stage === 'impact'
                ? { duration: 0.15, ease: 'easeOut' }
                : stage === 'shatter'
                ? { duration: 0.6, ease: 'easeIn' }
                : {}
            }
          >
            <SwordSVG stage={stage} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== 冲击波 ===== */}
      <AnimatePresence>
        {(stage === 'impact' || stage === 'shatter') && (
          <motion.div
            className="absolute z-30 pointer-events-none"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: '2px solid rgba(212, 175, 55, 0.6)',
              boxShadow: '0 0 40px rgba(212, 175, 55, 0.4), 0 0 80px rgba(212, 175, 55, 0.2)',
            }}
          />
        )}
      </AnimatePresence>

      {/* ===== 金色粒子 ===== */}
      <AnimatePresence>
        {stage === 'impact' &&
          particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute z-30 pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
                y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
                opacity: 0,
                scale: 0,
              }}
              transition={{ duration: 0.8, delay: p.delay, ease: 'easeOut' }}
              style={{
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: `radial-gradient(circle, rgba(200,200,210,0.9), rgba(192,192,200,0.4))`,
                boxShadow: `0 0 ${p.size * 2}px rgba(200,200,210,0.5)`,
              }}
            />
          ))}
      </AnimatePresence>

      {/* ===== 裂纹 ===== */}
      <AnimatePresence>
        {(stage === 'shatter' || stage === 'done') && (
          <motion.svg
            className="absolute z-25 pointer-events-none"
            width="200" height="80" viewBox="0 0 200 80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.path
              d="M100 40 L70 20 L50 10"
              stroke="rgba(192,192,200,0.7)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0 }}
            />
            <motion.path
              d="M100 40 L130 25 L160 15"
              stroke="rgba(192,192,200,0.7)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            />
            <motion.path
              d="M100 40 L90 60 L75 75"
              stroke="rgba(192,192,200,0.7)"
              strokeWidth="1"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            />
            <motion.path
              d="M100 40 L120 55 L140 70"
              stroke="rgba(192,192,200,0.7)"
              strokeWidth="0.8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            />
            <motion.path
              d="M100 40 L55 35 L30 30"
              stroke="rgba(192,192,200,0.5)"
              strokeWidth="0.8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.25, delay: 0.25 }}
            />
            <motion.path
              d="M100 40 L150 38 L175 35"
              stroke="rgba(192,192,200,0.5)"
              strokeWidth="0.8"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.25, delay: 0.3 }}
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* ===== 按钮本体 ===== */}
      <motion.button
        onClick={handleClick}
        className="relative z-10 cursor-pointer outline-none"
        style={{ background: 'transparent', border: 'none', width: 200, height: 80 }}
        animate={
          stage === 'shake'
            ? { x: [0, -4, 4, -3, 3, -1, 1, 0] }
            : stage === 'impact'
            ? { scale: 1.05 }
            : stage === 'shatter'
            ? { scale: 1.1, opacity: 0, filter: 'blur(8px)' }
            : stage === 'done'
            ? { opacity: 0, scale: 0 }
            : {}
        }
        transition={
          stage === 'shake'
            ? { duration: 0.4, ease: 'easeInOut' }
            : stage === 'impact'
            ? { duration: 0.1 }
            : stage === 'shatter'
            ? { duration: 0.5, ease: 'easeIn' }
            : {}
        }
      >
        {/* 按钮背景 */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            background: 'rgba(10,8,5,0.9)',
            border: '1.5px solid rgba(192,192,200,0.5)',
            boxShadow: '0 0 20px rgba(192,192,200,0.15), inset 0 0 20px rgba(192,192,200,0.05)',
          }}
        />

        {/* 四角装饰 */}
        <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-slate-400/60" />
        <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-slate-400/60" />
        <span className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-slate-400/60" />
        <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-slate-400/60" />

        {/* 装饰线 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-px bg-gradient-to-r from-transparent via-slate-400/40 to-transparent" />

        {/* 文字 */}
        <span
          className="relative text-xs tracking-[0.5em] uppercase"
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 300,
            color: 'rgba(192,192,200,0.9)',
            textShadow: '0 0 10px rgba(192,192,200,0.3)',
          }}
        >
          ENTER
        </span>
      </motion.button>
    </div>
  )
}

/* ===== 巴洛克长剑 SVG ===== */
function SwordSVG({ stage }) {
  return (
    <svg width="40" height="580" viewBox="0 0 40 580" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 剑身 */}
      <defs>
        <linearGradient id="blade" x1="20" y1="0" x2="20" y2="400" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="50%" stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#909090" />
        </linearGradient>
        <linearGradient id="guardGold" x1="0" y1="395" x2="40" y2="395" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6B6B78" />
          <stop offset="30%" stopColor="#C0C0C8" />
          <stop offset="50%" stopColor="#E0E0E8" />
          <stop offset="70%" stopColor="#C0C0C8" />
          <stop offset="100%" stopColor="#6B6B78" />
        </linearGradient>
      </defs>

      {/* 剑尖 */}
      <polygon points="20,0 16,50 24,50" fill="url(#blade)" />

      {/* 剑身主体 */}
      <rect x="18" y="40" width="4" height="340" fill="url(#blade)" rx="1" />

      {/* 剑身中线 */}
      <line x1="20" y1="40" x2="20" y2="375" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />

      {/* 护手 */}
      <path d="M0 390 Q10 380 20 395 Q30 380 40 390" fill="url(#guardGold)" />
      <rect x="5" y="388" width="30" height="6" rx="2" fill="url(#guardGold)" />

      {/* 剑柄 */}
      <rect x="17" y="400" width="6" height="80" rx="2" fill="#1a1a1a" stroke="#6B6B78" strokeWidth="0.5" />

      {/* 剑柄金色缠绕 */}
      <line x1="17" y1="410" x2="23" y2="415" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="23" y1="410" x2="17" y2="415" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="17" y1="420" x2="23" y2="425" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="23" y1="420" x2="17" y2="425" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="17" y1="430" x2="23" y2="435" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="23" y1="430" x2="17" y2="435" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="17" y1="440" x2="23" y2="445" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="23" y1="440" x2="17" y2="445" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="17" y1="450" x2="23" y2="455" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="23" y1="450" x2="17" y2="455" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="17" y1="460" x2="23" y2="465" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />
      <line x1="23" y1="460" x2="17" y2="465" stroke="rgba(192,192,200,0.6)" strokeWidth="1" />

      {/* 剑首 */}
      <circle cx="20" cy="490" r="8" fill="url(#guardGold)" />
      <circle cx="20" cy="490" r="4" fill="#1a1a1a" />
    </svg>
  )
}
