import { useEffect, useRef, useState } from 'react'

/**
 * ScrollCardReveal — 滚动卡片容器
 * 每个子元素是一张全屏卡片，随滚动淡入/淡出
 */
export default function ScrollCardReveal({ children }) {
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState({})
  const cardRefs = useRef([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = container.querySelectorAll('.scroll-card')
    cardRefs.current = Array.from(cards)

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const windowHeight = window.innerHeight

      cardRefs.current.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const cardCenter = rect.top + rect.height / 2
        const viewCenter = windowHeight / 2
        const distance = Math.abs(cardCenter - viewCenter)
        const maxDist = windowHeight * 0.7
        const opacity = Math.max(0, 1 - distance / maxDist)
        const scale = 0.92 + 0.08 * opacity
        const blur = (1 - opacity) * 8

        card.style.opacity = opacity
        card.style.transform = `scale(${scale})`
        card.style.filter = `blur(${blur}px)`
      })

      // Find most visible card
      let bestIdx = 0
      let bestVisibility = 0
      cardRefs.current.forEach((card, i) => {
        const rect = card.getBoundingClientRect()
        const visibleTop = Math.max(0, rect.top)
        const visibleBottom = Math.min(windowHeight, rect.bottom)
        const visibleHeight = Math.max(0, visibleBottom - visibleTop)
        if (visibleHeight > bestVisibility) {
          bestVisibility = visibleHeight
          bestIdx = i
        }
      })
      setActiveIndex(bestIdx)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div ref={containerRef}>
      {children}
    </div>
  )
}