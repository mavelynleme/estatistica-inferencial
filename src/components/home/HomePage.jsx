export function HomePage({ onOpenDescriptive, onOpenInferential }) {
  return (
    <section className="home-minimal">
      <div className="page-section">
        <div className="home-heading">
          <div className="home-title-row">
            <h1>Calculadora Estatística</h1>
            <span className="home-mascot" aria-hidden="true">🦖</span>
          </div>
          <p>Escolha uma das áreas abaixo para iniciar.</p>
        </div>

        <div className="option-grid minimal-options">
          <article className="card option-card">
            <span className="badge">Parte 1</span>
            <h2>Estatística Descritiva</h2>
            <p>Média, mediana, moda, desvio padrão e tabelas de frequência.</p>
            <button className="primary-button" type="button" onClick={onOpenDescriptive}>
              Acessar
            </button>
          </article>

          <article className="card option-card">
            <span className="badge">Parte 2</span>
            <h2>Estatística Inferencial</h2>
            <p>Teste de hipóteses com cálculo e interpretação do p-valor.</p>
            <button className="primary-button" type="button" onClick={onOpenInferential}>
              Acessar
            </button>
          </article>
        </div>
      </div>
    </section>
  )
}
