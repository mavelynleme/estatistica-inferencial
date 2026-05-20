import { hypothesisExamples } from '../../data/hypothesisExamples'
import { formatNumber } from '../../utils/hypothesisTests'

const optionOrder = [
  'tarefa-8-microsservico',
  'aula-9-plano-dieta',
  'iris-dataset',
]

function shortTitle(example) {
  if (example.id === 'tarefa-8-microsservico') return 'Tarefa 8 — Microsserviço'
  if (example.id === 'iris-dataset') return 'Dados reais — Iris Dataset'
  return example.title
}

export function ExampleSelector({
  selectedExampleId,
  selectedOption,
  irisDataStatus,
  irisSummary,
  isLoadingIris,
  onLoadIrisData,
  onSelectExample,
  onSelectManual,
  onUseIrisSummary,
}) {
  const selectedExample = hypothesisExamples.find(
    (example) => example.id === selectedExampleId,
  )
  const orderedExamples = optionOrder
    .map((id) => hypothesisExamples.find((example) => example.id === id))
    .filter(Boolean)

  const handleChange = (event) => {
    const value = event.target.value
    if (value === 'manual') {
      onSelectManual()
      return
    }

    const example = hypothesisExamples.find((item) => item.id === value)
    if (example) onSelectExample(example)
  }

  return (
    <section className="flow-section">
      <div className="flow-heading">
        <h2>1. Escolha o teste</h2>
        <span className="soft-badge">
          {selectedExample?.mode === 'given-p-value'
            ? 'P-valor informado'
            : selectedOption === 'manual'
              ? 'Dados próprios'
              : 'P-valor calculado'}
        </span>
      </div>

      <div className="selector-card">
        <div className="field">
          <label htmlFor="exampleSelect">Teste ou exemplo</label>
          <select id="exampleSelect" value={selectedOption} onChange={handleChange}>
            {orderedExamples.map((example) => (
              <option key={example.id} value={example.id}>
                {shortTitle(example)}
              </option>
            ))}
            <option value="manual">Inserir meus próprios dados</option>
          </select>
        </div>

        {selectedExample ? (
          <div className="helper-card">
            <div className="example-meta">
              <span className="badge">{selectedExample.sourceLabel}</span>
              <span className="soft-badge">
                {selectedExample.mode === 'given-p-value'
                  ? 'P-valor informado'
                  : 'P-valor calculado'}
              </span>
              {selectedExample.sourceLabel.toLowerCase().includes('uci') ? (
                <span className="soft-badge">Dados públicos</span>
              ) : null}
            </div>
            <p>{selectedExample.description}</p>
            {selectedExample.id === 'iris-dataset' ? (
              <div className="iris-loader">
                <div className="iris-actions">
                  <button
                    className="secondary-button"
                    type="button"
                    disabled={isLoadingIris}
                    onClick={onLoadIrisData}
                  >
                    Carregar dados da UCI
                  </button>
                  {irisSummary ? (
                    <button
                      className="primary-button"
                      type="button"
                      onClick={onUseIrisSummary}
                    >
                      Usar no teste T
                    </button>
                  ) : null}
                </div>

                {isLoadingIris ? (
                  <p className="status-text">Carregando dados públicos...</p>
                ) : null}

                {irisDataStatus === 'online' ? (
                  <p className="status-text success">
                    Dados carregados da UCI com sucesso.
                  </p>
                ) : null}

                {irisDataStatus === 'fallback' ? (
                  <p className="status-text warning">
                    Não foi possível carregar a fonte externa. Usando dados
                    públicos pré-carregados.
                  </p>
                ) : null}

                {irisSummary ? (
                  <dl className="compact-summary">
                    <div>
                      <dt>Fonte</dt>
                      <dd>{irisSummary.source}</dd>
                    </div>
                    <div>
                      <dt>Espécie</dt>
                      <dd>{irisSummary.species}</dd>
                    </div>
                    <div>
                      <dt>Variável</dt>
                      <dd>comprimento da sépala</dd>
                    </div>
                    <div>
                      <dt>n</dt>
                      <dd>{irisSummary.n}</dd>
                    </div>
                    <div>
                      <dt>Média</dt>
                      <dd>{formatNumber(irisSummary.sampleMean, 6)}</dd>
                    </div>
                    <div>
                      <dt>Desvio padrão</dt>
                      <dd>{formatNumber(irisSummary.sampleStandardDeviation, 6)}</dd>
                    </div>
                  </dl>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="helper-card">
            <span className="soft-badge">Dados próprios</span>
            <p>Cole uma amostra numérica para preencher automaticamente o teste T.</p>
          </div>
        )}
      </div>
    </section>
  )
}
