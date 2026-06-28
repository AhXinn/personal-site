import { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import PersonalityShowcase from './components/PersonalityShowcase'
import FlipCardReveal from './components/FlipCardReveal'

function App() {
  const [entered, setEntered] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [showcase, setShowcase] = useState(false)
  const [currentCard, setCurrentCard] = useState(0)

  const handleEnter = () => {
    setEntered(true)
    setTimeout(() => setShowContent(true), 800)
  }

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <Hero onEnter={handleEnter} />

      {showcase && (
        <PersonalityShowcase onBack={() => setShowcase(false)} />
      )}

      <div
        className={`transition-all duration-1000 ease-out ${
          showContent && !showcase
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-12 pointer-events-none'
        }`}
      >
        {showContent && (
          <>
            <Navbar
              onShowcase={() => setShowcase(true)}
              onNavigate={setCurrentCard}
              currentCard={currentCard}
            />
            <FlipCardReveal current={currentCard} onChange={setCurrentCard}>
              <div className="max-w-6xl mx-auto">
                <Works />
              </div>
              <div className="max-w-3xl mx-auto">
                <About />
              </div>
              <div className="max-w-lg mx-auto">
                <Contact />
              </div>
            </FlipCardReveal>
            <Footer />
          </>
        )}
      </div>
    </div>
  )
}

export default App