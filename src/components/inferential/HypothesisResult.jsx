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
  if (!result) return null

  const decisionClass = result.decision.rejectNull ? 'decision-reject' : 'decision-keep'

  return (
    <section className="flow-section result-section">
      <div className="flow-heading">
        <h2>3. Resultado</h2>
        <span className="soft-badge">Interpretação final</span>
      </div>

      <article className="compact-result-card">
        <div className="result-metrics">
          <div>
            <span>p-valor</span>
            <strong>{formatNumber(result.pValue, 6)}</strong>
          </div>
          <div>
            <span>α</span>
            <strong>{formatNumber(result.alpha, 4)}</strong>
          </div>
        </div>

        <div className="decision-block">
          <span>Decisão</span>
          <strong className={decisionClass}>{result.decision.label}</strong>
        </div>

        <div className="conclusion compact">
          <span>Conclusão</span>
          <p>{result.interpretation}</p>
        </div>
      </article>

      <div className="details-stack">
        <ResultDetail title="Ver hipóteses">
          <div className="hypotheses">
            <span>{result.hypotheses.nullHypothesis}</span>
            <span>{result.hypotheses.alternativeHypothesis}</span>
          </div>
        </ResultDetail>

        <ResultDetail title="Ver dados utilizados">
          <DataRows rows={result.dataRows} />
        </ResultDetail>

        <ResultDetail title="Ver estatística de teste">
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

        <ResultDetail title="Ver fórmula">
          <p>{result.formula}</p>
        </ResultDetail>

        <ResultDetail title="Ver regra de decisão">
          <p>Se p-valor ≤ α, rejeita-se H₀.</p>
          <p>Se p-valor &gt; α, não se rejeita H₀.</p>
        </ResultDetail>

        <ResultDetail title="Ver erro Tipo I e Tipo II">
          <p>{result.typeIExplanation}</p>
          <p>{result.typeIIExplanation}</p>
        </ResultDetail>
      </div>
    </section>
  )
}
