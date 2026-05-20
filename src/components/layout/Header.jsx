export function Header({
  activeView,
  onNavigateHome,
  onNavigateInferential,
  onOpenDescriptive,
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand-button" type="button" onClick={onNavigateHome}>
          <span className="brand-title">Calculadora Estatística</span>
          <span className="brand-subtitle">Descritiva e Inferencial</span>
        </button>
        <nav className="header-nav" aria-label="Navegação principal">
          <button className="nav-button" type="button" onClick={onNavigateHome}>
            Início
          </button>
          <button className="nav-button" type="button" onClick={onOpenDescriptive}>
            Estatística Descritiva
          </button>
          <button
            className={`nav-button ${activeView === 'inferential' ? 'active' : ''}`}
            type="button"
            onClick={onNavigateInferential}
          >
            Estatística Inferencial
          </button>
        </nav>
      </div>
    </header>
  )
}
