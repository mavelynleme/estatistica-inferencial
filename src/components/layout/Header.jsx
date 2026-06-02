export function Header({
  activeView,
  showNavigation = true,
  onNavigateHome,
  onNavigateInferential,
  onOpenDescriptive,
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand-button" type="button" onClick={onNavigateHome}>
          <span className="brand-title">Calculadora Estatística</span>
        </button>
        {showNavigation ? (
          <nav className="header-nav" aria-label="Navegação principal">
            <button
              className={`nav-button ${activeView === 'home' ? 'active' : ''}`}
              type="button"
              onClick={onNavigateHome}
            >
              Home
            </button>
            <button className="nav-button" type="button" onClick={onOpenDescriptive}>
              Descritiva
            </button>
            <button
              className={`nav-button ${activeView === 'inferential' ? 'active' : ''}`}
              type="button"
              onClick={onNavigateInferential}
            >
              Inferencial
            </button>
          </nav>
        ) : null}
      </div>
    </header>
  )
}
