import { useState } from 'react'
import { formatNumber } from '../../utils/hypothesisTests'

function parseValues(rawValues) {
  const matches = rawValues.match(/[-+]?\d+(?:[,.]\d+)?/g) || []
  return matches
    .map((value) => Number(value.replace(',', '.')))
    .filter((value) => Number.isFinite(value))
}

function summarize(values) {
  if (values.length === 0) return null

  const mean = values.reduce((total, value) => total + value, 0) / values.length
  const sumSquares = values.reduce((total, value) => total + (value - mean) ** 2, 0)

  return {
    sampleSize: values.length,
    sampleMean: mean,
    sampleStandardDeviation:
      values.length > 1 ? Math.sqrt(sumSquares / (values.length - 1)) : Number.NaN,
  }
}

export function ManualDataImport({ onUseSample }) {
  const [rawValues, setRawValues] = useState('')
  const [summary, setSummary] = useState(null)
  const [message, setMessage] = useState('')
  const canUseSample = summary?.sampleSize > 1 && Number.isFinite(summary.sampleStandardDeviation)

  const calculateSummary = () => {
    const values = parseValues(rawValues)
    const nextSummary = summarize(values)

    if (!nextSummary) {
      setSummary(null)
      setMessage('Não foi possível identificar números válidos.')
      return
    }

    if (nextSummary.sampleSize < 2) {
      setSummary(nextSummary)
      setMessage('Informe pelo menos 2 valores para calcular o desvio padrão.')
      return
    }

    setSummary(nextSummary)
    setMessage('')
  }

  return (
    <div className="manual-inline-card">
      <div className="field">
        <h3>Insira sua amostra</h3>
        <p>
          Cole números separados por vírgula, ponto e vírgula, espaço ou quebra
          de linha.
        </p>
        <textarea
          id="manualValues"
          value={rawValues}
          onChange={(event) => {
            setRawValues(event.target.value)
            setSummary(null)
            setMessage('')
          }}
          placeholder="Ex.: 5,1; 4,8; 5,0; 5,3"
        />
        <button className="secondary-button" type="button" onClick={calculateSummary}>
          Calcular resumo
        </button>
      </div>

      <div className="manual-summary">
        {summary ? <span className="soft-badge">Resumo da amostra</span> : null}
        {message ? <p className="status-text">{message}</p> : null}

        <dl className="data-list">
          <div className="data-row">
            <dt>n</dt>
            <dd>
              <strong>{summary ? summary.sampleSize : '—'}</strong>
            </dd>
          </div>
          <div className="data-row">
            <dt>Média</dt>
            <dd>
              <strong>{summary ? formatNumber(summary.sampleMean, 6) : '—'}</strong>
            </dd>
          </div>
          <div className="data-row">
            <dt>Desvio padrão</dt>
            <dd>
              <strong>
                {summary ? formatNumber(summary.sampleStandardDeviation, 6) : '—'}
              </strong>
            </dd>
          </div>
        </dl>

        <button
          className="secondary-button"
          type="button"
          disabled={!canUseSample}
          onClick={() => onUseSample(summary)}
        >
          Aplicar teste T
        </button>
      </div>
    </div>
  )
}
