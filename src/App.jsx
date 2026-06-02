import { useEffect, useState } from 'react'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { HomePage } from './components/home/HomePage'
import { HypothesisTestCalculator } from './components/inferential/HypothesisTestCalculator'

export const DESCRIPTIVE_CALCULATOR_URL = 'https://calculadora-estatistica.vercel.app/'

function getInitialViewFromHash() {
  const hash = window.location.hash.replace('#', '').toLowerCase()

  if (hash === 'inferencial' || hash === 'inferential') {
    return 'inferential'
  }

  return 'home'
}

function App() {
  const [view, setView] = useState(getInitialViewFromHash)

  const openDescriptiveCalculator = () => {
    window.location.href = DESCRIPTIVE_CALCULATOR_URL
  }

  const navigateHome = () => {
    setView('home')
    window.history.pushState(null, '', window.location.pathname)
  }

  const navigateInferential = () => {
    setView('inferential')
    window.history.pushState(null, '', '#inferencial')
  }

  useEffect(() => {
    const handleHashChange = () => {
      setView(getInitialViewFromHash())
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])

  return (
    <div className="app-shell">
      <Header
        activeView={view}
        showNavigation={true}
        onNavigateHome={navigateHome}
        onNavigateInferential={navigateInferential}
        onOpenDescriptive={openDescriptiveCalculator}
      />
      <main>
        {view === 'home' ? (
          <HomePage
            onOpenDescriptive={openDescriptiveCalculator}
            onOpenInferential={navigateInferential}
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
