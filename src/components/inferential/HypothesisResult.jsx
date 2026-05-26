import { formatNumber } from '../../utils/hypothesisTests'

function DataRows({ rows }) {
  return (
    <dl className="data-list">
      {rows.map((row) => (
        <div className="data-row" key={row.label}>
          <dt>{row.label}</dt>
          <dd>
            <strong>{row.value}</strong>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function ResultDetail({ title, children }) {
  return (
    <details className="detail-panel report-detail">
      <summary>{title}</summary>
      <div className="detail-content">{children}</div>
    </details>
  )
}

function ReportMetric({ label, value, className = '' }) {
  return (
    <div className="report-metric">
      <span>{label}</span>
      <strong className={className}>{value}</strong>
    </div>
  )
}

export function HypothesisResult({ result }) {
  if (!result) {
    return (
      <section className="flow-section result-section empty-result">
        <div className="flow-heading">
          <div className="numbered-title">
            <span className="section-number">4</span>
            <h2>Relatório do Resultado</h2>
          </div>
          <span className="soft-badge">Aguardando cálculo</span>
        </div>
        <div className="empty-state">
          <p>Preencha os dados e clique em Calcular p-valor para gerar o relatório.</p>
        </div>
      </section>
    )
  }

  const decisionClass = result.decision.rejectNull ? 'decision-reject' : 'decision-keep'
  const sourceStatus = result.publicDataSummary?.dataStatus === 'online'
    ? 'IBGE/SIDRA online'
    : result.publicDataSummary?.dataStatus === 'fallback'
      ? 'Fallback local'
      : result.sourceLabel || 'Preenchimento manual'

  return (
    <section className="flow-section result-section">
      <div className="flow-heading">
        <div className="numbered-title">
          <span className="section-number">4</span>
          <h2>Relatório do Resultado</h2>
        </div>
        <span className="soft-badge">Saída estatística</span>
      </div>

      <article className="statistical-report">
        <header className="report-header">
          <div>
            <p className="eyebrow">RELATÓRIO ESTATÍSTICO</p>
            <h3>Relatório Estatístico</h3>
          </div>
          <span className={`decision-pill ${decisionClass}`}>
            {result.decision.label}
          </span>
        </header>

        <section className="report-summary" aria-label="Resumo">
          <h4>Resumo</h4>
          <div className="report-grid">
            <ReportMetric label="p-valor" value={formatNumber(result.pValue, 6)} />
            <ReportMetric label="α" value={formatNumber(result.alpha, 4)} />
            <ReportMetric
              label="decisão"
              value={result.decision.label}
              className={decisionClass}
            />
          </div>
          <div className="conclusion compact">
            <span>Conclusão</span>
            <p>{result.interpretation}</p>
          </div>
        </section>

        <div className="details-stack report-details">
          <ResultDetail title="Hipóteses">
            <div className="hypotheses">
              <span>{result.hypotheses.nullHypothesis}</span>
              <span>{result.hypotheses.alternativeHypothesis}</span>
            </div>
          </ResultDetail>

          <ResultDetail title="Estatística">
            {result.statisticLabel === 'Não se aplica' ? (
              <p>Não se aplica, pois este exercício já informa o p-valor.</p>
            ) : (
              <dl className="data-list">
                <div className="data-row">
                  <dt>Tipo de teste</dt>
                  <dd>
                    <strong>{result.statisticLabel}</strong>
                  </dd>
                </div>
                <div className="data-row">
                  <dt>Estatística</dt>
                  <dd>
                    <strong>{formatNumber(result.statistic, 6)}</strong>
                  </dd>
                </div>
                {result.degreesOfFreedom ? (
                  <div className="data-row">
                    <dt>Graus de liberdade</dt>
                    <dd>
                      <strong>{result.degreesOfFreedom}</strong>
                    </dd>
                  </div>
                ) : null}
              </dl>
            )}
          </ResultDetail>

          <ResultDetail title="Amostra">
            <DataRows rows={result.dataRows} />
          </ResultDetail>

          <ResultDetail title="Fonte dos dados">
            <div className="source-detail-stack">
              <dl className="data-list">
                <div className="data-row">
                  <dt>Status</dt>
                  <dd>
                    <strong>{sourceStatus}</strong>
                  </dd>
                </div>
                {result.exampleTitle ? (
                  <div className="data-row">
                    <dt>Origem</dt>
                    <dd>
                      <strong>{result.exampleTitle}</strong>
                    </dd>
                  </div>
                ) : null}
              </dl>

              {result.publicDataSummary ? (
                <>
                  <dl className="data-list">
                    <div className="data-row">
                      <dt>Indicador</dt>
                      <dd>
                        <strong>{result.publicDataSummary.label}</strong>
                      </dd>
                    </div>
                    <div className="data-row">
                      <dt>Períodos selecionados</dt>
                      <dd>
                        <strong>{result.publicDataSummary.periods.join(', ')}</strong>
                      </dd>
                    </div>
                    <div className="data-row">
                      <dt>Fonte oficial</dt>
                      <dd>
                        <strong>
                          {result.publicDataSummary.sourceUrl ||
                            result.publicDataSummary.officialPageUrl}
                        </strong>
                      </dd>
                    </div>
                    <div className="data-row">
                      <dt>URL da API</dt>
                      <dd>
                        <strong>{result.publicDataSummary.apiUrl}</strong>
                      </dd>
                    </div>
                  </dl>
                  <div className="source-actions">
                    <a
                      className="secondary-button source-link-button"
                      href={
                        result.publicDataSummary.sourceUrl ||
                        result.publicDataSummary.officialPageUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver fonte oficial
                    </a>
                    <a
                      className="secondary-button source-link-button"
                      href={result.publicDataSummary.apiUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver URL da API
                    </a>
                  </div>
                </>
              ) : null}
            </div>
          </ResultDetail>

          <ResultDetail title="Fórmula">
            <p>{result.formula}</p>
          </ResultDetail>

          <ResultDetail title="Erro Tipo I e Tipo II">
            <p>{result.typeIExplanation}</p>
            <p>{result.typeIIExplanation}</p>
          </ResultDetail>
        </div>
      </article>
    </section>
  )
}
