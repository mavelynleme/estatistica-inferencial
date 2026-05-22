import { hypothesisExamples } from '../../data/hypothesisExamples'
import { formatNumber } from '../../utils/hypothesisTests'

const choices = [
  {
    id: 'tarefa-8-teste-ab-conversao',
    title: 'Tarefa 8',
    subtitle: 'Teste A/B',
    helper: 'Verifica se a nova cor aumenta a taxa de conversão acima de 3%.',
  },
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
    id: 'ibge-ipca',
    title: 'IBGE',
    subtitle: 'IPCA',
    helper: 'Usa dados públicos do IBGE sobre a variação mensal do IPCA para um teste t.',
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
  publicDataStatus,
  publicDataSummary,
  isLoadingPublicData,
  onLoadPublicData,
  onSelectExample,
  onSelectManual,
  onUsePublicDataSummary,
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
        <div className="numbered-title">
          <span className="section-number">1</span>
          <h2>Escolha o teste</h2>
        </div>
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
          {selectedExample?.mode === 'given-p-value' ? (
            <span className="soft-badge">P-valor informado</span>
          ) : null}
          {selectedExample?.alternative ? (
            <span className="soft-badge">
              {selectedExample.alternative === 'two-sided'
                ? 'Teste bilateral'
                : 'Teste unilateral'}
            </span>
          ) : null}
          {selectedExample?.id === 'ibge-ipca' ? (
            <>
              <span className="soft-badge">Dados públicos</span>
              <span className="soft-badge">IBGE</span>
              <span className="soft-badge">Fallback local disponível</span>
            </>
          ) : null}
        </div>
        <p>{selectedChoice.helper}</p>

        {selectedExample?.id === 'ibge-ipca' ? (
          <div className="public-data-loader">
            <div className="public-data-actions">
              <button
                className="secondary-button"
                type="button"
                disabled={isLoadingPublicData}
                onClick={onLoadPublicData}
              >
                Atualizar dados do IBGE
              </button>
              {publicDataSummary ? (
                <button
                  className="primary-button"
                  type="button"
                  onClick={onUsePublicDataSummary}
                >
                  Usar no teste t
                </button>
              ) : null}
            </div>

            {isLoadingPublicData ? (
              <p className="status-text">Carregando dados públicos...</p>
            ) : null}

            {publicDataStatus === 'online' ? (
              <p className="status-text success">
                Dados carregados do IBGE.
              </p>
            ) : null}

            {publicDataStatus === 'fallback' ? (
              <p className="status-text warning">
                Não foi possível acessar o IBGE. Usando dados públicos pré-carregados.
              </p>
            ) : null}

            {publicDataSummary ? (
              <dl className="compact-summary">
                <div>
                  <dt>Fonte</dt>
                  <dd>{publicDataSummary.source}</dd>
                </div>
                <div>
                  <dt>Tabela</dt>
                  <dd>1737 — IPCA</dd>
                </div>
                <div>
                  <dt>Variável</dt>
                  <dd>{publicDataSummary.variable}</dd>
                </div>
                <div>
                  <dt>Períodos</dt>
                  <dd>{publicDataSummary.periods.join(', ')}</dd>
                </div>
                <div>
                  <dt>n</dt>
                  <dd>{publicDataSummary.n}</dd>
                </div>
                <div>
                  <dt>Média</dt>
                  <dd>{formatNumber(publicDataSummary.sampleMean, 6)}</dd>
                </div>
                <div>
                  <dt>Desvio padrão</dt>
                  <dd>{formatNumber(publicDataSummary.sampleStandardDeviation, 6)}</dd>
                </div>
              </dl>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
