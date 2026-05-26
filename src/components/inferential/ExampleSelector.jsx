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
    subtitle: 'Dados públicos',
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
  online: 'IBGE/SIDRA online',
  fallback: 'Dados públicos pré-carregados',
  error: 'Erro ao carregar',
}

export function ExampleSelector({
  selectedExampleId,
  selectedOption,
  publicDataStatus,
  publicDataSummary,
  isLoadingPublicData,
  publicDatasetOptions,
  selectedPublicDatasetId,
  selectedPublicPeriods,
  publicPeriodCount,
  onLoadPublicData,
  onSelectExample,
  onSelectManual,
  onSelectIbge,
  onSelectPublicDataset,
  onSelectPublicPeriodCount,
  onTogglePublicPeriod,
  onSelectAllPublicPeriods,
  onClearPublicPeriodSelection,
  onUseSelectedPublicData,
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
  const selectedPeriodCount = selectedPublicPeriods.length
  const selectedPublicDataset = publicDatasetOptions.find(
    (dataset) => dataset.id === selectedPublicDatasetId,
  )
  const officialSourceUrl =
    selectedPublicDataset?.sourceUrl || selectedPublicDataset?.officialPageUrl
  const apiUrl = publicDataSummary?.apiUrl

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
                Escolha uma série pública do SIDRA e carregue os últimos
                períodos para preencher automaticamente o teste t.
              </p>
            </div>

            <div className="field public-dataset-field">
              <label htmlFor="publicDataset">Série IBGE</label>
              <select
                id="publicDataset"
                value={selectedPublicDatasetId}
                onChange={(event) => onSelectPublicDataset(event.target.value)}
              >
                {publicDatasetOptions.map((dataset) => (
                  <option
                    disabled={dataset.status !== 'available'}
                    value={dataset.id}
                    key={dataset.id}
                  >
                    {dataset.label}
                    {dataset.badge ? ` (${dataset.badge})` : ''}
                  </option>
                ))}
              </select>
              {selectedPublicDataset?.description ? (
                <small>{selectedPublicDataset.description}</small>
              ) : null}
            </div>

            <div className="field public-period-count-field">
              <label htmlFor="publicPeriodCount">Períodos da consulta</label>
              <select
                id="publicPeriodCount"
                value={publicPeriodCount}
                onChange={(event) => onSelectPublicPeriodCount(event.target.value)}
              >
                <option value={12}>Últimos 12 períodos</option>
                <option value={24}>Últimos 24 períodos</option>
              </select>
            </div>

            <div className="source-verification">
              <div className="source-verification-heading">
                <h4>Fonte dos dados</h4>
                <span className="soft-badge">{publicStatusLabels[statusKey]}</span>
              </div>
              <dl className="compact-summary public-source-summary">
                <div>
                  <dt>Origem</dt>
                  <dd>{selectedPublicDataset?.sourceName || 'IBGE/SIDRA'}</dd>
                </div>
                <div>
                  <dt>Tabela SIDRA</dt>
                  <dd>{selectedPublicDataset?.sidraTable || 'Em breve'}</dd>
                </div>
                <div>
                  <dt>Variável</dt>
                  <dd>
                    {selectedPublicDataset?.variableLabel}
                    {selectedPublicDataset?.sidraVariable
                      ? ` (${selectedPublicDataset.sidraVariable})`
                      : ''}
                  </dd>
                </div>
                {publicDataSummary?.dataStatus === 'fallback' ? (
                  <div>
                    <dt>Fallback</dt>
                    <dd>{publicDataSummary.fallbackGeneratedAt}</dd>
                  </div>
                ) : null}
              </dl>
              <div className="source-actions">
                <a
                  className="secondary-button source-link-button"
                  href={officialSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver fonte oficial
                </a>
                {apiUrl ? (
                  <a
                    className="secondary-button source-link-button"
                    href={apiUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver URL da API
                  </a>
                ) : (
                  <button className="secondary-button" type="button" disabled>
                    Ver URL da API
                  </button>
                )}
              </div>
              {apiUrl ? (
                <details className="source-url-details">
                  <summary>URL consultada</summary>
                  <p className="muted source-url-text">{apiUrl}</p>
                </details>
              ) : null}
            </div>

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
              <>
                <div className="public-period-panel">
                  <div className="public-period-heading">
                    <h4>Períodos disponíveis</h4>
                    <span className="soft-badge">
                      {selectedPeriodCount} selecionados
                    </span>
                  </div>
                  <div className="period-selection-actions">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={onSelectAllPublicPeriods}
                    >
                      Selecionar todos
                    </button>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={onClearPublicPeriodSelection}
                    >
                      Limpar seleção
                    </button>
                  </div>
                  <div className="public-period-list">
                    {publicDataSummary.values.map((row) => (
                      <label className="period-row" key={row.period}>
                        <input
                          checked={selectedPublicPeriods.includes(row.period)}
                          type="checkbox"
                          onChange={() => onTogglePublicPeriod(row.period)}
                        />
                        <span>{row.period}</span>
                        <strong>
                          {formatNumber(row.value, 6)}
                          {publicDataSummary.unit}
                        </strong>
                      </label>
                    ))}
                  </div>
                </div>

                <dl className="compact-summary">
                  <div>
                    <dt>Períodos</dt>
                    <dd>{publicDataSummary.periods.join(', ')}</dd>
                  </div>
                  <div>
                    <dt>n carregado</dt>
                    <dd>{publicDataSummary.n}</dd>
                  </div>
                  <div>
                    <dt>Média carregada</dt>
                    <dd>
                      {formatNumber(publicDataSummary.sampleMean, 6)}
                      {publicDataSummary.unit}
                    </dd>
                  </div>
                  <div>
                    <dt>Desvio padrão carregado</dt>
                    <dd>
                      {formatNumber(publicDataSummary.sampleStandardDeviation, 6)}
                      {publicDataSummary.unit}
                    </dd>
                  </div>
                </dl>

                <button
                  className="primary-button use-selected-button"
                  type="button"
                  disabled={selectedPeriodCount < 2}
                  onClick={onUseSelectedPublicData}
                >
                  Usar selecionados no teste T
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
