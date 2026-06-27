import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [entered, setEntered] = useState(false)

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      {/* 封面入口 */}
      {!entered && <Hero onEnter={() => setEntered(true)} />}

      {/* 主内容 —— 进入后显示 */}
      <div className={`transition-all duration-700 ${entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
        {entered && (
          <>
            <Navbar />
            <Works />
            <About />
            <Contact />
            <Footer />
          </>
        )}
      </div>
    </div>
  )
}

export default App
