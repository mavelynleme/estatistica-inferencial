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

export function HypothesisResult({ result }) {
  if (!result) return null

  const decisionClass = result.decision.rejectNull ? 'decision-reject' : 'decision-keep'

  return (
    <section className="page-section">
      <div className="section-header">
        <h2>Resultado do Teste</h2>
        <p className="section-subtitle">
          Leitura estatística organizada para apresentação acadêmica.
        </p>
      </div>
      <div className="result-grid">
        <article className="result-card">
          <h3>Hipóteses</h3>
          <div className="hypotheses">
            <span>{result.hypotheses.nullHypothesis}</span>
            <span>{result.hypotheses.alternativeHypothesis}</span>
          </div>
        </article>

        <article className="result-card">
          <h3>Dados utilizados</h3>
          <DataRows rows={result.dataRows} />
        </article>

        <article className="result-card">
          <h3>Estatística de teste</h3>
          {result.statisticLabel === 'Não se aplica' ? (
            <p>Não se aplica — exercício com p-valor informado.</p>
          ) : (
            <>
              <p className="result-value">
                {result.statisticLabel} = {formatNumber(result.statistic, 6)}
              </p>
              {result.degreesOfFreedom ? (
                <p>Graus de liberdade: {result.degreesOfFreedom}</p>
              ) : null}
            </>
          )}
        </article>

        <article className="result-card highlight">
          <h3>P-Valor</h3>
          <p className="result-value">{formatNumber(result.pValue, 6)}</p>
          <p>α = {formatNumber(result.alpha, 4)}</p>
        </article>

        <article className="result-card">
          <h3>Regra de decisão</h3>
          <p>Se p-valor ≤ α, rejeita-se H₀.</p>
          <p>Se p-valor &gt; α, não se rejeita H₀.</p>
          <p className={decisionClass}>
            <strong>{result.decision.label}</strong>
          </p>
        </article>

        <article className="result-card highlight">
          <h3>Conclusão</h3>
          <p className="conclusion">{result.interpretation}</p>
        </article>

        <article className="result-card">
          <h3>Erro Tipo I</h3>
          <p>{result.typeIExplanation}</p>
        </article>

        <article className="result-card">
          <h3>Erro Tipo II</h3>
          <p>{result.typeIIExplanation}</p>
        </article>
      </div>
    </section>
  )
}
