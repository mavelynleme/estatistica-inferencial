export function HomePage({ onOpenDescriptive, onOpenInferential }) {
  return (
    <>
      <section className="hero-band">
        <div className="page-section hero-content">
          <div>
            <p className="eyebrow">Plataforma acadêmica integrada</p>
            <h1>Calculadora Estatística</h1>
            <p className="hero-text">
              Plataforma integrada para Estatística Descritiva e Inferencial
            </p>
          </div>
          <div className="stat-visual" aria-hidden="true">
            <div className="curve">
              <span className="curve-marker" />
            </div>
            <div className="visual-grid">
              <span className="mini-stat">
                <strong>x̄</strong>
                média
              </span>
              <span className="mini-stat">
                <strong>p</strong>
                p-valor
              </span>
              <span className="mini-stat">
                <strong>α</strong>
                decisão
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <h2>Escolha a área de estudo</h2>
          <p className="section-subtitle">
            Uma entrada única para consultar a calculadora descritiva já publicada
            e resolver testes de hipóteses nesta nova etapa.
          </p>
        </div>
        <div className="option-grid">
          <article className="card">
            <span className="badge">Parte 1</span>
            <h3>Estatística Descritiva</h3>
            <p>
              Acesse a calculadora da Parte 1 com média, mediana, moda,
              amplitude, desvio padrão e tabelas de frequência.
            </p>
            <div className="card-actions">
              <button className="primary-button" type="button" onClick={onOpenDescriptive}>
                Abrir Calculadora Descritiva
              </button>
            </div>
          </article>
          <article className="card">
            <span className="badge">Parte 2</span>
            <h3>Estatística Inferencial</h3>
            <p>
              Resolva testes de hipóteses com cálculo automático do p-valor e
              interpretação estatística.
            </p>
            <div className="card-actions">
              <button className="primary-button" type="button" onClick={onOpenInferential}>
                Abrir Calculadora Inferencial
              </button>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
