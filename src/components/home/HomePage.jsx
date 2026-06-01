export function HomePage({ onOpenDescriptive, onOpenInferential }) {
  return (
    <section className="home-minimal">
      <div className="page-section">
        <div className="home-heading">
          <div className="home-mascot" aria-hidden="true">🦖</div>
          <div className="home-title-row">
            <h1>Calculadora Estatística</h1>
          </div>
        </div>

        <div className="option-grid minimal-options">
          <article className="card option-card">
            <h2>Estatística Descritiva</h2>
            <button className="primary-button" type="button" onClick={onOpenDescriptive}>
              Acessar
            </button>
          </article>

          <article className="card option-card">
            <h2>Estatística Inferencial</h2>
            <button className="primary-button" type="button" onClick={onOpenInferential}>
              Acessar
            </button>
          </article>
        </div>
      </div>
    </section>
  )
}
