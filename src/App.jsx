import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <Navbar />
      <Hero />
      <Works />
      <About />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
