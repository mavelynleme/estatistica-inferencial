import { hypothesisExamples } from '../../data/hypothesisExamples'

export function ExampleSelector({ selectedExampleId, onSelectExample }) {
  return (
    <section className="step-card">
      <div className="step-heading">
        <span className="step-number">2</span>
        <div>
          <h2>Escolha o teste ou exemplo</h2>
          <p>
            Carregue um exercício pronto ou siga com preenchimento manual dos
            campos.
          </p>
        </div>
      </div>
      <div className="examples-grid">
        {hypothesisExamples.map((example) => (
          <article
            className={`example-card ${selectedExampleId === example.id ? 'selected' : ''}`}
            key={example.id}
          >
            <div className="example-meta">
              <span className="badge">{example.sourceLabel}</span>
              <span className="soft-badge">
                {example.mode === 'given-p-value'
                  ? 'P-valor informado'
                  : 'P-valor calculado'}
              </span>
            </div>
            <h3>{example.title}</h3>
            <p>{example.description}</p>
            <button
              className={selectedExampleId === example.id ? 'primary-button' : 'secondary-button'}
              type="button"
              onClick={() => onSelectExample(example)}
            >
              Carregar exemplo
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
