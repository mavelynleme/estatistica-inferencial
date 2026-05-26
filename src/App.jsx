import { useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { HomePage } from './components/home/HomePage'
import { HypothesisTestCalculator } from './components/inferential/HypothesisTestCalculator'

export const DESCRIPTIVE_CALCULATOR_URL = 'https://calculadora-estatistica.vercel.app/'

function App() {
  const [view, setView] = useState('home')

  const openDescriptiveCalculator = () => {
    window.location.href = DESCRIPTIVE_CALCULATOR_URL
  }

  return (
    <div className="app-shell">
      <Header
        activeView={view}
        showNavigation={view !== 'home'}
        onNavigateHome={() => setView('home')}
        onNavigateInferential={() => setView('inferential')}
        onOpenDescriptive={openDescriptiveCalculator}
      />
      <main>
        {view === 'home' ? (
          <HomePage
            onOpenDescriptive={openDescriptiveCalculator}
            onOpenInferential={() => setView('inferential')}
          />
        ) : (
          <HypothesisTestCalculator />
        )}
      </main>
      <Footer />
    </div>
  )
}

export default App
