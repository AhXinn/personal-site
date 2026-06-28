import { useState, useEffect } from 'react'

const NAV_ITEMS = [
  { id: 'home', label: '首页', card: 0 },
  { id: 'works', label: '作品', card: 0 },
  { id: 'about', label: '关于', card: 1 },
  { id: 'contact', label: '联系', card: 2 },
]

export default function Navbar({ onShowcase, onNavigate, currentCard }) {
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // currentCard 变化时同步高亮
  useEffect(() => {
    const highlight = { 0: 'works', 1: 'about', 2: 'contact' }
    setActive(highlight[currentCard] || 'home')
  }, [currentCard])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (item) => {
    setMenuOpen(false)
    setActive(item.id)
    if (onNavigate) {
      onNavigate(item.card)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-surface/70 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={onShowcase}
          className="text-white text-xl transition-all duration-300 hover:text-yellow-400 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
          title="个性展示"
        >
          ★
        </button>

        <div className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
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

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="菜单"
        >
          <span className={`block w-5 h-px bg-text-primary transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
          <span className={`block w-5 h-px bg-text-primary transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-px bg-text-primary transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-4 flex flex-col gap-1 bg-surface/95 backdrop-blur-xl">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
              className={`px-4 py-3 rounded-lg text-left transition-all ${
                active === item.id ? 'text-accent bg-accent-muted' : 'text-text-secondary hover:text-text-primary'
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