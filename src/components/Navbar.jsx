import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { id: 'hero', label: '首页' },
  { id: 'works', label: '作品' },
  { id: 'about', label: '关于' },
  { id: 'contact', label: '联系' },
]

export default function Navbar() {
  const [active, setActive] = useState('hero')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // 监听滚动，判断当前在哪个区块 + 是否滚动过
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)

      // 找到当前视口中最靠近顶部的区块
      const sections = NAV_ITEMS.map(item =>
        document.getElementById(item.id)
      ).filter(Boolean)

      for (let i = sections.length - 1; i >= 0; i--) {
        const rect = sections[i].getBoundingClientRect()
        if (rect.top <= 120) {
          setActive(NAV_ITEMS[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 平滑滚动
  const scrollTo = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/70 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => scrollTo('hero')}
          className="text-text-primary font-semibold text-lg tracking-tight hover:text-accent transition-colors"
        >
          Portfolio
        </button>

        {/* 桌面端导航 */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                active === item.id
                  ? 'text-accent bg-accent-muted'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* 移动端汉堡按钮 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="菜单"
        >
          <span className={`block w-5 h-px bg-text-primary transition-all duration-300 ${
            menuOpen ? 'rotate-45 translate-y-[3px]' : ''
          }`} />
          <span className={`block w-5 h-px bg-text-primary transition-all duration-300 ${
            menuOpen ? 'opacity-0' : ''
          }`} />
          <span className={`block w-5 h-px bg-text-primary transition-all duration-300 ${
            menuOpen ? '-rotate-45 -translate-y-[3px]' : ''
          }`} />
        </button>
      </div>

      {/* 移动端菜单 */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-4 flex flex-col gap-1 bg-surface/95 backdrop-blur-xl">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`px-4 py-3 rounded-lg text-left transition-all ${
                active === item.id
                  ? 'text-accent bg-accent-muted'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
