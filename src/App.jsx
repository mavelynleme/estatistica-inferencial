import { useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { HomePage } from './components/home/HomePage'
import { HypothesisTestCalculator } from './components/inferential/HypothesisTestCalculator'

export const DESCRIPTIVE_CALCULATOR_URL = 'DESCRIPTIVE_CALCULATOR_URL'

function App() {
  const [view, setView] = useState('home')

  const openDescriptiveCalculator = () => {
    window.location.href = DESCRIPTIVE_CALCULATOR_URL
  }

  return (
    <div className="app-shell">
      <Header
        activeView={view}
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
