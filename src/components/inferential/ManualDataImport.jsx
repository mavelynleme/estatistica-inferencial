import { useState } from 'react'
import { formatNumber, parseNumericInput } from '../../utils/hypothesisTests'

function parseValues(rawValues) {
  return rawValues
    .split(/[\s,;]+/)
    .map((value) => parseNumericInput(value))
    .filter((value) => Number.isFinite(value))
}

function sampleStandardDeviation(values, mean) {
  if (values.length <= 1) return Number.NaN
  const sumSquares = values.reduce((total, value) => total + (value - mean) ** 2, 0)
  return Math.sqrt(sumSquares / (values.length - 1))
}

export function ManualDataImport({ onUseSample }) {
  const [rawValues, setRawValues] = useState('')
  const values = parseValues(rawValues)
  const mean =
    values.length > 0
      ? values.reduce((total, value) => total + value, 0) / values.length
      : Number.NaN
  const standardDeviation = sampleStandardDeviation(values, mean)
  const canUseSample = values.length > 1 && Number.isFinite(standardDeviation)

  return (
    <div className="manual-inline-card">
      <div className="field">
        <label htmlFor="manualValues">Meus dados</label>
        <textarea
          id="manualValues"
          value={rawValues}
          onChange={(event) => setRawValues(event.target.value)}
          placeholder="5,1; 4,8; 5,0; 5,3"
        />
      </div>

      <div className="manual-summary">
        <span className="soft-badge">Resumo da amostra</span>
        <dl className="data-list">
          <div className="data-row">
            <dt>n</dt>
            <dd>
              <strong>{values.length}</strong>
            </dd>
          </div>
          <div className="data-row">
            <dt>Média</dt>
            <dd>
              <strong>{formatNumber(mean, 6)}</strong>
            </dd>
          </div>
          <div className="data-row">
            <dt>Desvio padrão</dt>
            <dd>
              <strong>{formatNumber(standardDeviation, 6)}</strong>
            </dd>
          </div>
        </dl>
        <button
          className="secondary-button"
          type="button"
          disabled={!canUseSample}
          onClick={() =>
            onUseSample({
              sampleSize: values.length,
              sampleMean: mean,
              sampleStandardDeviation: standardDeviation,
            })
          }
        >
          Usar no teste T
        </button>
      </div>
    </div>
  )
}
