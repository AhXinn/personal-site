import { useEffect, useRef, useCallback } from 'react'

/**
 * FlipCardReveal — 滚轮翻卡效果
 * 鼠标滚轮每次一"格"，卡片翻转式切换
 * 支持受控模式：current + onChange
 */
export default function FlipCardReveal({ children, current = 0, onChange }) {
  const totalCards = Array.isArray(children) ? children.length : 1
  const wheelAccumRef = useRef(0)
  const wheelThrottleRef = useRef(false)

  const goTo = useCallback((index) => {
    if (index < 0 || index >= totalCards) return
    if (wheelThrottleRef.current) return
    wheelThrottleRef.current = true
    onChange && onChange(index)
    setTimeout(() => { wheelThrottleRef.current = false }, 650)
  }, [totalCards, onChange])

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault()
      if (wheelThrottleRef.current) return

      wheelAccumRef.current += e.deltaY

      if (Math.abs(wheelAccumRef.current) >= 80) {
        if (wheelAccumRef.current > 0) {
          goTo(current + 1)
        } else {
          goTo(current - 1)
        }
        wheelAccumRef.current = 0
      }
    }

    const handleKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        goTo(current + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        goTo(current - 1)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKey)
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKey)
    }
  }, [current, goTo])

  // 触摸支持
  const touchStartY = useRef(0)
  useEffect(() => {
    const ts = (e) => { touchStartY.current = e.touches[0].clientY }
    const te = (e) => {
      const diff = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(diff) > 50) {
        if (diff > 0) goTo(current + 1)
        else goTo(current - 1)
      }
    }
    window.addEventListener('touchstart', ts, { passive: true })
    window.addEventListener('touchend', te, { passive: true })
    return () => {
      window.removeEventListener('touchstart', ts)
      window.removeEventListener('touchend', te)
    }
  }, [current, goTo])

  return (
    <div className="relative min-h-screen bg-surface overflow-hidden">
      {Array.isArray(children) ? children.map((child, i) => {
        const isActive = i === current
        const offset = i - current

        return (
          <div
            key={i}
            className="absolute inset-0 flex items-center justify-center px-6 transition-all duration-500 ease-out"
            style={{
              opacity: isActive ? 1 : 0,
              transform: `translateY(${offset * 60}px) scale(${isActive ? 1 : 0.94})`,
              pointerEvents: isActive ? 'auto' : 'none',
              filter: isActive ? 'blur(0px)' : 'blur(4px)',
              zIndex: isActive ? 10 : 0,
            }}
          >
            <div className="w-full">
              {child}
            </div>
          </div>
        )
      }) : children}

      {/* 卡片指示器 */}
      {totalCards > 1 && (
        <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
          {Array.from({ length: totalCards }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-white scale-125'
                  : 'bg-white/20 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* 页码 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 text-zinc-600 text-sm tracking-widest">
        {current + 1} / {totalCards}
      </div>
    </div>
  )
}