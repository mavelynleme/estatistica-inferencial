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
    <details className="detail-panel">
      <summary>{title}</summary>
      <div className="detail-content">{children}</div>
    </details>
  )
}

export function HypothesisResult({ result }) {
  if (!result) {
    return (
      <section className="flow-section result-section empty-result">
        <div className="flow-heading">
          <div className="numbered-title">
            <span className="section-number">3</span>
            <h2>Resultado</h2>
          </div>
          <span className="soft-badge">Aguardando cálculo</span>
        </div>
        <div className="empty-state">
          <span aria-hidden="true">🦖</span>
          <p>Preencha os dados e clique em calcular para ver a decisão.</p>
        </div>
      </section>
    )
  }

  const decisionClass = result.decision.rejectNull ? 'decision-reject' : 'decision-keep'

  return (
    <>
      <section className="flow-section result-section">
        <div className="flow-heading">
          <div className="numbered-title">
            <span className="section-number">3</span>
            <h2>Resultado</h2>
          </div>
          <span className="soft-badge">Interpretação final</span>
        </div>

        <article className="compact-result-card prominent-result">
          <div className="result-top-grid">
            <div>
              <span>P-VALOR</span>
              <strong>{formatNumber(result.pValue, 6)}</strong>
            </div>
            <div>
              <span>α</span>
              <strong>{formatNumber(result.alpha, 4)}</strong>
            </div>
            <div>
              <span>DECISÃO</span>
              <strong className={`decision-pill ${decisionClass}`}>
                {result.decision.label}
              </strong>
            </div>
          </div>

          <div className="result-divider" />
          <div className="conclusion compact">
            <span>CONCLUSÃO</span>
            <p>{result.interpretation}</p>
          </div>
        </article>
      </section>

      <section className="flow-section technical-section">
        <div className="flow-heading">
          <h2>Detalhes técnicos</h2>
          <span className="soft-badge">Colapsados</span>
        </div>

        <div className="details-stack">
          <ResultDetail title="Hipóteses">
            <div className="hypotheses">
              <span>{result.hypotheses.nullHypothesis}</span>
              <span>{result.hypotheses.alternativeHypothesis}</span>
            </div>
          </ResultDetail>

          <ResultDetail title="Dados utilizados">
            <DataRows rows={result.dataRows} />
          </ResultDetail>

          <ResultDetail title="Estatística de teste">
            {result.statisticLabel === 'Não se aplica' ? (
              <p>Não se aplica, pois este exercício já informa o p-valor.</p>
            ) : (
              <>
                <p>
                  <strong>{result.statisticLabel}</strong> ={' '}
                  {formatNumber(result.statistic, 6)}
                </p>
                {result.degreesOfFreedom ? (
                  <p>Graus de liberdade: {result.degreesOfFreedom}</p>
                ) : null}
              </>
            )}
          </ResultDetail>

          <ResultDetail title="Fórmula">
            <p>{result.formula}</p>
          </ResultDetail>

          <ResultDetail title="Regra de decisão">
            <p>Se p-valor ≤ α, rejeita-se H₀.</p>
            <p>Se p-valor &gt; α, não se rejeita H₀.</p>
          </ResultDetail>

          <ResultDetail title="Erro Tipo I e Tipo II">
            <p>{result.typeIExplanation}</p>
            <p>{result.typeIIExplanation}</p>
          </ResultDetail>

          <ResultDetail title="Origem da amostra">
            <p>{result.sourceLabel || 'Preenchimento manual'}</p>
            {result.publicDataSummary ? (
              <div className="source-detail-stack">
                <dl className="data-list">
                  <div className="data-row">
                    <dt>Status</dt>
                    <dd>
                      <strong>
                        {result.publicDataSummary.dataStatus === 'online'
                          ? 'Dados carregados online'
                          : 'Fallback local'}
                      </strong>
                    </dd>
                  </div>
                  <div className="data-row">
                    <dt>Indicador</dt>
                    <dd>
                      <strong>{result.publicDataSummary.label}</strong>
                    </dd>
                  </div>
                  <div className="data-row">
                    <dt>Origem</dt>
                    <dd>
                      <strong>{result.publicDataSummary.sourceName}</strong>
                    </dd>
                  </div>
                  <div className="data-row">
                    <dt>Tabela SIDRA</dt>
                    <dd>
                      <strong>{result.publicDataSummary.sidraTable}</strong>
                    </dd>
                  </div>
                  <div className="data-row">
                    <dt>Variável</dt>
                    <dd>
                      <strong>
                        {result.publicDataSummary.variableLabel} (
                        {result.publicDataSummary.sidraVariable})
                      </strong>
                    </dd>
                  </div>
                  <div className="data-row">
                    <dt>Períodos selecionados</dt>
                    <dd>
                      <strong>{result.publicDataSummary.periods.join(', ')}</strong>
                    </dd>
                  </div>
                  <div className="data-row">
                    <dt>Valores selecionados</dt>
                    <dd>
                      <strong>
                        {result.publicDataSummary.values
                          .map(
                            (row) =>
                              `${row.period}: ${formatNumber(row.value, 6)}${result.publicDataSummary.unit}`,
                          )
                          .join(', ')}
                      </strong>
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
                  {result.publicDataSummary.dataStatus === 'fallback' ? (
                    <div className="data-row">
                      <dt>Atualização do fallback</dt>
                      <dd>
                        <strong>{result.publicDataSummary.fallbackGeneratedAt}</strong>
                      </dd>
                    </div>
                  ) : null}
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
                <p className="muted source-url-text">
                  URL consultada: {result.publicDataSummary.apiUrl}
                </p>
              </div>
            ) : null}
            {result.exampleTitle ? <p>{result.exampleTitle}</p> : null}
          </ResultDetail>
        </div>
      </section>
    </>
  )
}
