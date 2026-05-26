import { hypothesisExamples } from '../../data/hypothesisExamples'
import { formatNumber } from '../../utils/hypothesisTests'

const allocatedExampleIds = [
  'tarefa-8-teste-ab-conversao',
  'tarefa-8-microsservico',
  'aula-9-plano-dieta',
]

const choices = [
  {
    id: 'manual',
    title: 'Manual',
    subtitle: 'Inserir amostra',
    helper: 'Insira sua amostra para calcular o resumo estatístico.',
  },
  {
    id: 'ibge-ipca',
    title: 'IBGE',
    subtitle: 'Dados públicos',
    helper: 'Carregue dados públicos do IBGE/SIDRA, selecione os períodos e use a amostra no teste t.',
  },
  {
    id: 'allocated',
    title: 'Dados alocados',
    subtitle: 'Exercícios prontos',
    helper: 'Use exercícios já cadastrados, como Tarefa 8 e Aula 9, com p-valor informado.',
  },
]

const publicStatusLabels = {
  idle: 'Aguardando carregamento',
  loading: 'Consultando IBGE...',
  online: 'Dados carregados online',
  fallback: 'Fallback local',
  error: 'Erro ao carregar',
}

const publicStatusDescriptions = {
  idle: 'Aguardando carregamento',
  loading: 'Consultando IBGE...',
  online: 'online',
  fallback: 'fallback',
  error: 'erro',
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
  selectedPublicApiUrl,
  onLoadPublicData,
  onSelectExample,
  onSelectManual,
  onSelectIbge,
  onSelectAllocated,
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
  const allocatedExamples = hypothesisExamples.filter((example) =>
    allocatedExampleIds.includes(example.id),
  )
  const isAllocatedSelected =
    selectedOption === 'allocated' || allocatedExampleIds.includes(selectedOption)
  const selectedChoice =
    choices.find((choice) =>
      choice.id === (isAllocatedSelected ? 'allocated' : selectedOption),
    ) || choices[0]
  const isIbgeSelected = selectedOption === 'ibge-ipca'
  const statusKey = isLoadingPublicData ? 'loading' : publicDataStatus || 'idle'
  const canUsePublicSummary = publicDataSummary?.n >= 2
  const selectedPeriodCount = selectedPublicPeriods.length
  const selectedPublicDataset = publicDatasetOptions.find(
    (dataset) => dataset.id === selectedPublicDatasetId,
  )
  const officialSourceUrl =
    selectedPublicDataset?.sourceUrl || selectedPublicDataset?.officialPageUrl
  const apiUrl = publicDataSummary?.apiUrl || selectedPublicApiUrl

  const selectChoice = (id) => {
    if (id === 'manual') {
      onSelectManual()
      return
    }

    if (id === 'ibge-ipca') {
      onSelectIbge()
      return
    }

    if (id === 'allocated') onSelectAllocated()
  }

  const selectAllocatedExample = (exampleId) => {
    const example = allocatedExamples.find((item) => item.id === exampleId)
    if (example) onSelectExample(example)
  }

  const allocatedBadge = selectedExample?.title?.startsWith('Aula 9')
    ? 'Aula 9'
    : selectedExample
      ? 'Tarefa 8'
      : null

  return (
    <section className="flow-section">
      <div className="flow-heading">
        <div>
          <div className="numbered-title">
            <span className="section-number">1</span>
            <h2>Entrada de Dados</h2>
          </div>
          <p className="section-helper">Escolha como deseja iniciar</p>
        </div>
      </div>

      <div className="choice-grid" role="list">
        {choices.map((choice) => (
          <button
            className={`choice-card ${
              (isAllocatedSelected ? 'allocated' : selectedOption) === choice.id
                ? 'active'
                : ''
            }`}
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
          {isIbgeSelected ? (
            <>
              <span className="soft-badge">Dados públicos</span>
              <span className="soft-badge">{publicStatusLabels[statusKey]}</span>
            </>
          ) : null}
          {isAllocatedSelected ? (
            <>
              <span className="soft-badge">Dados alocados</span>
              <span className="soft-badge">P-valor informado</span>
              {allocatedBadge ? (
                <span className="soft-badge">{allocatedBadge}</span>
              ) : null}
            </>
          ) : null}
        </div>
        <p>{selectedChoice.helper}</p>

        {isAllocatedSelected ? (
          <div className="allocated-example-panel">
            <div className="field">
              <label htmlFor="allocatedExample">Escolha um exercício</label>
              <select
                id="allocatedExample"
                value={selectedExample?.id || ''}
                onChange={(event) => selectAllocatedExample(event.target.value)}
              >
                {allocatedExamples.map((example) => (
                  <option value={example.id} key={example.id}>
                    {example.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ) : null}

        {isIbgeSelected ? (
          <div className="public-data-loader">
            <div>
              <h3>Dados Públicos — IBGE/SIDRA</h3>
              <p>
                Escolha indicador, período e localidade para preencher automaticamente o teste t.
              </p>
            </div>

            <div className="field public-dataset-field">
              <label htmlFor="publicDataset">Indicador</label>
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
              <label htmlFor="publicPeriodCount">Período</label>
              <select
                id="publicPeriodCount"
                value={publicPeriodCount}
                onChange={(event) => onSelectPublicPeriodCount(event.target.value)}
              >
                <option value={12}>Últimos 12 períodos</option>
                <option value={24}>Últimos 24 períodos</option>
              </select>
            </div>

            <div className="field public-locality-field">
              <label htmlFor="publicLocality">Localidade</label>
              <input id="publicLocality" value="Brasil" readOnly />
            </div>

            <div className="source-verification">
              <div className="source-verification-heading">
                <h4>Fonte dos dados</h4>
                <span className="soft-badge">{publicStatusLabels[statusKey]}</span>
              </div>
              <dl className="compact-summary public-source-summary">
                <div>
                  <dt>Indicador</dt>
                  <dd>{selectedPublicDataset?.label}</dd>
                </div>
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
                <div>
                  <dt>Período consultado</dt>
                  <dd>Últimos {publicPeriodCount} períodos</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{publicStatusDescriptions[statusKey]}</dd>
                </div>
                {publicDataSummary?.dataStatus === 'fallback' ? (
                  <div>
                    <dt>Última atualização do fallback</dt>
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
                <a
                  className="secondary-button source-link-button"
                  href={apiUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ver URL da API
                </a>
              </div>
              <details className="source-url-details">
                <summary>URL consultada</summary>
                <p className="muted source-url-text">URL consultada: {apiUrl}</p>
              </details>
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
            <p className="network-proof-helper">
              Para comprovar a consulta online, abra F12 &gt; Network &gt;
              Fetch/XHR e clique em Carregar dados do IBGE.
            </p>

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
                    <h4>Tabela selecionável</h4>
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
                  Aplicar ao teste
                </button>
              </>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}
