import { hypothesisExamples } from '../../data/hypothesisExamples'
import { formatNumber } from '../../utils/hypothesisTests'

const choices = [
  {
    id: 'tarefa-8-teste-ab-conversao',
    title: 'Tarefa 8',
    subtitle: 'Teste A/B',
    helper: 'P-valor informado para testar aumento na taxa de conversão.',
  },
  {
    id: 'tarefa-8-microsservico',
    title: 'Tarefa 8',
    subtitle: 'Microsserviço',
    helper: 'P-valor informado para testar redução no tempo médio de resposta.',
  },
  {
    id: 'aula-9-plano-dieta',
    title: 'Aula 9',
    subtitle: 'Plano de Dieta',
    helper: 'P-valor informado para avaliar a afirmação sobre perda média.',
  },
  {
    id: 'ibge-ipca',
    title: 'IBGE',
    subtitle: 'IPCA',
    helper: 'Carregue dados públicos ou use o fallback local para preencher o teste t.',
  },
  {
    id: 'manual',
    title: 'Manual',
    subtitle: 'Inserir dados',
    helper: 'Cole uma amostra própria ou preencha os campos do teste manualmente.',
  },
]

const publicStatusLabels = {
  idle: 'Aguardando carregamento',
  loading: 'Aguardando carregamento',
  online: 'Dados carregados do IBGE',
  fallback: 'Usando fallback local',
  error: 'Erro ao carregar',
}

export function ExampleSelector({
  selectedExampleId,
  selectedOption,
  publicDataStatus,
  publicDataSummary,
  isLoadingPublicData,
  onLoadPublicData,
  onSelectExample,
  onSelectManual,
  onSelectIbge,
  onUseFallbackData,
}) {
  const selectedExample = hypothesisExamples.find(
    (example) => example.id === selectedExampleId,
  )
  const selectedChoice =
    choices.find((choice) => choice.id === selectedOption) || choices[4]
  const isIbgeSelected = selectedOption === 'ibge-ipca'
  const statusKey = isLoadingPublicData ? 'loading' : publicDataStatus || 'idle'
  const canUsePublicSummary = publicDataSummary?.n >= 2

  const selectChoice = (id) => {
    if (id === 'manual') {
      onSelectManual()
      return
    }

    if (id === 'ibge-ipca') {
      onSelectIbge()
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
            : isIbgeSelected
              ? 'Dados públicos'
              : 'Manual'}
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
          {isIbgeSelected ? (
            <>
              <span className="soft-badge">Dados públicos</span>
              <span className="soft-badge">{publicStatusLabels[statusKey]}</span>
            </>
          ) : null}
        </div>
        <p>{selectedChoice.helper}</p>

        {isIbgeSelected ? (
          <div className="public-data-loader">
            <div>
              <h3>Dados públicos do IBGE</h3>
              <p>
                Carregue a variação mensal do IPCA para preencher automaticamente
                o teste t.
              </p>
            </div>

            <dl className="compact-summary public-source-summary">
              <div>
                <dt>Fonte</dt>
                <dd>IBGE/SIDRA</dd>
              </div>
              <div>
                <dt>Tabela</dt>
                <dd>1737 — IPCA</dd>
              </div>
              <div>
                <dt>Variável</dt>
                <dd>Variação mensal do IPCA</dd>
              </div>
            </dl>

            <div className="public-data-actions">
              <button
                className="primary-button"
                type="button"
                disabled={isLoadingPublicData}
                onClick={onLoadPublicData}
              >
                {isLoadingPublicData ? 'Carregando...' : 'Carregar dados do IBGE'}
              </button>
              <button
                className="secondary-button"
                type="button"
                disabled={isLoadingPublicData}
                onClick={onUseFallbackData}
              >
                Usar dados pré-carregados
              </button>
            </div>

            {publicDataSummary?.statusMessage ? (
              <p
                className={`status-text ${
                  publicDataSummary.dataStatus === 'online'
                    ? 'success'
                    : publicDataSummary.dataStatus === 'error'
                      ? 'error'
                      : 'warning'
                }`}
              >
                {publicDataSummary.statusMessage}
              </p>
            ) : (
              <p className="status-text">Aguardando carregamento.</p>
            )}

            {canUsePublicSummary ? (
              <dl className="compact-summary">
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
                  <dd>{formatNumber(publicDataSummary.sampleMean, 6)}%</dd>
                </div>
                <div>
                  <dt>Desvio padrão</dt>
                  <dd>{formatNumber(publicDataSummary.sampleStandardDeviation, 6)}%</dd>
                </div>
              </dl>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
