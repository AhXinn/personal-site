import { useEffect, useRef } from 'react'

/**
 * useScrollReveal - 当元素滚动进入视口时触发 fade-in-up 动画
 *
 * 用法：
 *   const ref = useScrollReveal()
 *   <div ref={ref} className="opacity-0"> 内容 </div>
 *
 * 原理：
 *   用 IntersectionObserver（浏览器内置 API）监听元素是否出现在屏幕上，
 *   一旦出现就给它加上 animate-fade-in-up 动画类。
 *
 * Python 类比：类似一个「on_visible」回调，当元素可见时自动执行。
 */
export default function useScrollReveal(options = {}) {
  const ref = useRef(null)
  const { threshold = 0.15, rootMargin = '0px 0px -50px 0px' } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // IntersectionObserver = 浏览器内置的「观察者」，
    // 能告诉你某个元素是否进入了可视区域（视口）
    const observer = new IntersectionObserver(
      ([entry]) => {
        // entry.isIntersecting = true 表示元素已经出现在屏幕上
        if (entry.isIntersecting) {
          // 给元素加上动画类，触发淡入上移
          el.classList.add('animate-fade-in-up')
          // 动画只播一次，触发后就不再观察
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return ref
}
