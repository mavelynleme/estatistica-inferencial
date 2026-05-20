import { hypothesisExamples } from '../../data/hypothesisExamples'

export function ExampleSelector({ selectedExampleId, onSelectExample }) {
  return (
    <section className="page-section">
      <div className="section-header">
        <h2>Exercícios e Exemplos</h2>
        <p className="section-subtitle">
          Use um caso didático com p-valor informado ou um exemplo com dados
          públicos reais em que o aplicativo calcula o p-valor.
        </p>
      </div>
      <div className="examples-grid">
        {hypothesisExamples.map((example) => (
          <article className="example-card" key={example.id}>
            <span className="badge">
              {example.mode === 'given-p-value' ? 'p-valor informado' : 'p-valor calculado'}
            </span>
            <h3>{example.title}</h3>
            <p>{example.description}</p>
            <p>
              <strong>Fonte:</strong> {example.sourceLabel}
            </p>
            <button
              className={selectedExampleId === example.id ? 'primary-button' : 'secondary-button'}
              type="button"
              onClick={() => onSelectExample(example)}
            >
              Usar exemplo
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}
