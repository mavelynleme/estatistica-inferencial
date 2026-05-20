import { hypothesisExamples } from '../../data/hypothesisExamples'
import { formatNumber } from '../../utils/hypothesisTests'

const choices = [
  {
    id: 'tarefa-8-microsservico',
    title: 'Tarefa 8',
    subtitle: 'Microsserviço',
    helper: 'Verifica se o tempo médio do microsserviço ficou menor que 150 ms.',
  },
  {
    id: 'aula-9-plano-dieta',
    title: 'Aula 9',
    subtitle: 'Plano de Dieta',
    helper: 'Analisa se a perda média de peso é diferente de 5 kg.',
  },
  {
    id: 'iris-dataset',
    title: 'Iris Dataset',
    subtitle: 'Dados reais',
    helper: 'Usa dados públicos da flor Iris setosa para um teste t.',
  },
  {
    id: 'manual',
    title: 'Manual',
    subtitle: 'Inserir dados',
    helper: 'Informe os dados do teste ou cole uma amostra própria.',
  },
]

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
  const selectedChoice =
    choices.find((choice) => choice.id === selectedOption) || choices[3]

  const selectChoice = (id) => {
    if (id === 'manual') {
      onSelectManual()
      return
    }

    const example = hypothesisExamples.find((item) => item.id === id)
    if (example) onSelectExample(example)
  }

  return (
    <section className="flow-section">
      <div className="flow-heading">
        <h2>1. Escolha o exemplo ou tipo de teste</h2>
        <span className="soft-badge">
          {selectedExample?.mode === 'given-p-value'
            ? 'P-valor informado'
            : selectedOption === 'manual'
              ? 'Manual'
              : 'P-valor calculado'}
        </span>
      </div>

      <div className="choice-grid" role="list">
        {choices.map((choice) => (
          <button
            className={`choice-card ${selectedOption === choice.id ? 'active' : ''}`}
            key={choice.id}
            type="button"
            onClick={() => selectChoice(choice.id)}
          >
            <strong>{choice.title}</strong>
            <span>{choice.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="helper-card compact-helper">
        <div className="example-meta">
          <span className="badge">{selectedChoice.title}</span>
          <span className="soft-badge">{selectedChoice.subtitle}</span>
          {selectedExample?.sourceLabel?.toLowerCase().includes('uci') ? (
            <span className="soft-badge">Dados públicos</span>
          ) : null}
        </div>
        <p>{selectedChoice.helper}</p>

        {selectedExample?.id === 'iris-dataset' ? (
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
                Não foi possível carregar a fonte externa. Usando dados públicos
                pré-carregados.
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
    </section>
  )
}
