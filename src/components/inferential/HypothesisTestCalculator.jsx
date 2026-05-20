import { useMemo, useState } from 'react'
import { ExampleSelector } from './ExampleSelector'
import { HypothesisResult } from './HypothesisResult'
import { ManualDataImport } from './ManualDataImport'
import { PublicDataSources } from './PublicDataSources'
import {
  buildDecision,
  buildHypotheses,
  buildInterpretation,
  calculateGivenPValueDecision,
  calculateMeanTTest,
  calculateMeanZTest,
  calculateProportionZTest,
  clampProbability,
  formatNumber,
  normalizeAlpha,
  parseNumericInput,
} from '../../utils/hypothesisTests'

const initialForm = {
  mode: 'calculated',
  testType: 'mean-z',
  alternative: 'two-sided',
  parameter: 'μ',
  context: '',
  hypothesizedValue: '',
  unit: '',
  alpha: '0,05',
  sampleMean: '',
  populationStandardDeviation: '',
  sampleStandardDeviation: '',
  sampleSize: '',
  successes: '',
  pValue: '',
}

const testTypeLabels = {
  'mean-z': 'Teste Z para média — σ conhecido',
  'mean-t': 'Teste T para média — σ desconhecido',
  'proportion-z': 'Teste Z para proporção',
}

const alternativeLabels = {
  'two-sided': 'Bilateral',
  left: 'Unilateral à esquerda',
  right: 'Unilateral à direita',
}

function toInputValue(value) {
  return value === null || value === undefined ? '' : String(value).replace('.', ',')
}

function buildRows(form, result) {
  const rows = [
    ['Modo', form.mode === 'given-p-value' ? 'P-valor informado' : 'Calcular p-valor'],
    ['Tipo de teste', form.mode === 'given-p-value' ? 'Comparação direta p-valor × α' : testTypeLabels[form.testType]],
    ['Tipo de hipótese', alternativeLabels[form.alternative]],
    ['Parâmetro', form.parameter],
    ['Valor hipotético', `${formatNumber(result.hypothesizedValue, 6)}${form.unit ? ` ${form.unit}` : ''}`],
    ['α', formatNumber(result.alpha, 4)],
    ['p-valor', formatNumber(result.pValue, 6)],
  ]

  if (form.context) rows.splice(3, 0, ['Contexto', form.context])

  if (form.mode === 'calculated') {
    if (form.testType === 'mean-z') {
      rows.push(['x̄', formatNumber(result.inputs.sampleMean, 6)])
      rows.push(['σ', formatNumber(result.inputs.populationStandardDeviation, 6)])
      rows.push(['n', formatNumber(result.inputs.sampleSize, 0)])
    }

    if (form.testType === 'mean-t') {
      rows.push(['x̄', formatNumber(result.inputs.sampleMean, 6)])
      rows.push(['s', formatNumber(result.inputs.sampleStandardDeviation, 6)])
      rows.push(['n', formatNumber(result.inputs.sampleSize, 0)])
    }

    if (form.testType === 'proportion-z') {
      rows.push(['x', formatNumber(result.inputs.successes, 0)])
      rows.push(['n', formatNumber(result.inputs.sampleSize, 0)])
      rows.push(['p̂', formatNumber(result.sampleProportion, 6)])
    }
  }

  return rows.map(([label, value]) => ({ label, value }))
}

function getDefaultTypeI(form) {
  return `Erro Tipo I: rejeitar H₀ quando H₀ é verdadeira. Neste contexto, seria concluir incorretamente que há evidência contra a hipótese sobre ${form.context || 'o parâmetro analisado'}.`
}

function getDefaultTypeII(form) {
  return `Erro Tipo II: não rejeitar H₀ quando H₀ é falsa. Neste contexto, seria deixar de identificar uma diferença real em ${form.context || 'o parâmetro analisado'}.`
}

export function HypothesisTestCalculator() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState([])
  const [warnings, setWarnings] = useState([])
  const [selectedExample, setSelectedExample] = useState(null)

  const selectedModeLabel = useMemo(
    () => (form.mode === 'given-p-value' ? 'P-valor informado' : 'Calcular p-valor'),
    [form.mode],
  )

  const updateField = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value }
      if (field === 'mode' && value === 'given-p-value') {
        next.parameter = current.parameter || 'μ'
      }
      if (field === 'testType' && value === 'proportion-z') {
        next.parameter = 'p'
      }
      if (field === 'testType' && value !== 'proportion-z') {
        next.parameter = 'μ'
      }
      return next
    })
    setErrors([])
  }

  const applyExample = (example) => {
    const nextForm = {
      ...initialForm,
      mode: example.mode,
      testType: example.testType || 'mean-z',
      alternative: example.alternative,
      parameter: example.parameter,
      context: example.context,
      hypothesizedValue: toInputValue(example.hypothesizedValue),
      unit: example.unit,
      alpha: toInputValue(example.alpha),
      pValue: toInputValue(example.pValue),
      sampleMean: toInputValue(example.inputs?.sampleMean),
      populationStandardDeviation: toInputValue(example.inputs?.populationStandardDeviation),
      sampleStandardDeviation: toInputValue(example.inputs?.sampleStandardDeviation),
      sampleSize: toInputValue(example.inputs?.sampleSize),
      successes: toInputValue(example.inputs?.successes),
    }

    setSelectedExample(example)
    setForm(nextForm)
    setErrors([])
    setWarnings([])
    setResult(buildResult(nextForm, example))
  }

  const validateBase = (parsed) => {
    const nextErrors = []

    if (!Number.isFinite(parsed.hypothesizedValue)) {
      nextErrors.push('Informe um valor hipotético válido.')
    }
    if (!Number.isFinite(parsed.alpha) || parsed.alpha <= 0 || parsed.alpha >= 1) {
      nextErrors.push('α deve estar entre 0 e 1.')
    }

    return nextErrors
  }

  const parseForm = (targetForm) => ({
    hypothesizedValue: parseNumericInput(targetForm.hypothesizedValue),
    alpha: normalizeAlpha(targetForm.alpha),
    sampleMean: parseNumericInput(targetForm.sampleMean),
    populationStandardDeviation: parseNumericInput(targetForm.populationStandardDeviation),
    sampleStandardDeviation: parseNumericInput(targetForm.sampleStandardDeviation),
    sampleSize: parseNumericInput(targetForm.sampleSize),
    successes: parseNumericInput(targetForm.successes),
    pValue: parseNumericInput(targetForm.pValue),
  })

  const validateCalculated = (targetForm, parsed) => {
    const nextErrors = []
    const nextWarnings = []

    if (!Number.isFinite(parsed.sampleSize) || parsed.sampleSize <= 1) {
      nextErrors.push('n deve ser maior que 1.')
    }

    if (targetForm.testType === 'mean-z') {
      if (!Number.isFinite(parsed.sampleMean)) nextErrors.push('Informe uma média amostral válida.')
      if (
        !Number.isFinite(parsed.populationStandardDeviation) ||
        parsed.populationStandardDeviation <= 0
      ) {
        nextErrors.push('o desvio padrão deve ser maior que 0.')
      }
    }

    if (targetForm.testType === 'mean-t') {
      if (!Number.isFinite(parsed.sampleMean)) nextErrors.push('Informe uma média amostral válida.')
      if (
        !Number.isFinite(parsed.sampleStandardDeviation) ||
        parsed.sampleStandardDeviation <= 0
      ) {
        nextErrors.push('o desvio padrão deve ser maior que 0.')
      }
    }

    if (targetForm.testType === 'proportion-z') {
      if (parsed.hypothesizedValue <= 0 || parsed.hypothesizedValue >= 1) {
        nextErrors.push('p₀ deve estar entre 0 e 1.')
      }
      if (
        !Number.isFinite(parsed.successes) ||
        parsed.successes < 0 ||
        parsed.successes > parsed.sampleSize
      ) {
        nextErrors.push('x deve estar entre 0 e n.')
      }
      if (
        Number.isFinite(parsed.sampleSize) &&
        Number.isFinite(parsed.hypothesizedValue) &&
        (parsed.sampleSize * parsed.hypothesizedValue < 5 ||
          parsed.sampleSize * (1 - parsed.hypothesizedValue) < 5)
      ) {
        nextWarnings.push('A aproximação normal pode ser fraca, pois n*p₀ < 5 ou n*(1-p₀) < 5.')
      }
    }

    return { nextErrors, nextWarnings }
  }

  const buildResult = (targetForm, example = selectedExample) => {
    const parsed = parseForm(targetForm)
    const baseErrors = validateBase(parsed)
    const nextWarnings = []

    if (targetForm.mode === 'given-p-value') {
      if (!Number.isFinite(parsed.pValue) || parsed.pValue < 0 || parsed.pValue > 1) {
        baseErrors.push('p-valor deve estar entre 0 e 1.')
      }
    } else {
      const validation = validateCalculated(targetForm, parsed)
      baseErrors.push(...validation.nextErrors)
      nextWarnings.push(...validation.nextWarnings)
    }

    if (baseErrors.length > 0) {
      setErrors(baseErrors)
      setWarnings(nextWarnings)
      return null
    }

    let testResult
    const common = {
      hypothesizedValue: parsed.hypothesizedValue,
      alpha: parsed.alpha,
      alternative: targetForm.alternative,
    }

    if (targetForm.mode === 'given-p-value') {
      testResult = calculateGivenPValueDecision({
        pValue: parsed.pValue,
        alpha: parsed.alpha,
      })
    } else if (targetForm.testType === 'mean-z') {
      testResult = calculateMeanZTest({
        ...common,
        sampleMean: parsed.sampleMean,
        populationStandardDeviation: parsed.populationStandardDeviation,
        sampleSize: parsed.sampleSize,
      })
    } else if (targetForm.testType === 'mean-t') {
      testResult = calculateMeanTTest({
        ...common,
        sampleMean: parsed.sampleMean,
        sampleStandardDeviation: parsed.sampleStandardDeviation,
        sampleSize: parsed.sampleSize,
      })
    } else {
      testResult = calculateProportionZTest({
        ...common,
        successes: parsed.successes,
        sampleSize: parsed.sampleSize,
      })
    }

    const safePValue = clampProbability(testResult.pValue)
    const decision = buildDecision(safePValue, parsed.alpha)
    const resultObject = {
      ...testResult,
      pValue: safePValue,
      alpha: parsed.alpha,
      hypothesizedValue: parsed.hypothesizedValue,
      inputs: parsed,
      parameter: targetForm.parameter,
      sampleProportion: testResult.sampleProportion,
      hypotheses: buildHypotheses({
        parameter: targetForm.parameter,
        hypothesizedValue: parsed.hypothesizedValue,
        unit: targetForm.unit,
        alternative: targetForm.alternative,
      }),
      decision,
      interpretation: buildInterpretation({
        pValue: safePValue,
        alpha: parsed.alpha,
        expectedConclusion: example?.expectedConclusion,
      }),
      typeIExplanation: example?.typeIExplanation || getDefaultTypeI(targetForm),
      typeIIExplanation: example?.typeIIExplanation || getDefaultTypeII(targetForm),
    }

    resultObject.dataRows = buildRows(targetForm, resultObject)

    setErrors([])
    setWarnings(nextWarnings)
    return resultObject
  }

  const calculate = (event) => {
    event.preventDefault()
    setSelectedExample((current) => current)
    const nextResult = buildResult(form)
    setResult(nextResult)
  }

  const useManualSample = ({ sampleSize, sampleMean, sampleStandardDeviation }) => {
    setSelectedExample(null)
    setResult(null)
    setForm((current) => ({
      ...current,
      mode: 'calculated',
      testType: 'mean-t',
      parameter: 'μ',
      sampleSize: toInputValue(sampleSize),
      sampleMean: toInputValue(Number(sampleMean.toFixed(6))),
      sampleStandardDeviation: toInputValue(Number(sampleStandardDeviation.toFixed(6))),
    }))
  }

  return (
    <>
      <section className="hero-band">
        <div className="page-section hero-content">
          <div>
            <p className="eyebrow">Estatística Inferencial</p>
            <h1>Teste de Hipóteses com P-Valor</h1>
            <p className="hero-text">
              Calcule a estatística de teste, o p-valor e a decisão sobre H₀ com
              base no nível de significância.
            </p>
          </div>
          <div className="stat-visual" aria-hidden="true">
            <div className="curve">
              <span className="curve-marker" />
            </div>
            <div className="visual-grid">
              <span className="mini-stat">
                <strong>{selectedModeLabel}</strong>
                modo
              </span>
              <span className="mini-stat">
                <strong>H₀</strong>
                hipótese
              </span>
              <span className="mini-stat">
                <strong>p ≤ α</strong>
                regra
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-section">
        <div className="section-header">
          <p className="eyebrow">Fluxo guiado</p>
          <h2>Calculadora Inferencial</h2>
          <p className="section-subtitle">
            Siga as etapas para selecionar o modo, carregar um exemplo ou
            preencher os dados manualmente.
          </p>
        </div>

        <div className="calculator-flow">
          <section className="step-card">
            <div className="step-heading">
              <span className="step-number">1</span>
              <div>
                <h2>Escolha o modo</h2>
                <p>
                  Calcule o p-valor a partir dos dados ou resolva exercícios em
                  que o p-valor já foi informado.
                </p>
              </div>
            </div>
            <div className="mode-tabs" role="group" aria-label="Modo da calculadora">
              <button
                className={`mode-tab ${form.mode === 'calculated' ? 'active' : ''}`}
                type="button"
                onClick={() => updateField('mode', 'calculated')}
              >
                Calcular p-valor
              </button>
              <button
                className={`mode-tab ${form.mode === 'given-p-value' ? 'active' : ''}`}
                type="button"
                onClick={() => updateField('mode', 'given-p-value')}
              >
                P-valor informado
              </button>
            </div>
          </section>

          <ExampleSelector
            selectedExampleId={selectedExample?.id}
            onSelectExample={applyExample}
          />

          <ManualDataImport onUseSample={useManualSample} />

          <form className="step-card calculator-panel" onSubmit={calculate}>
            <div className="step-heading">
              <span className="step-number">4</span>
              <div>
                <h2>Preencha os dados e calcule</h2>
                <p>
                  O formulário mostra apenas os campos relevantes para o modo e
                  o teste selecionados.
                </p>
              </div>
            </div>

            {selectedExample ? (
              <div className="loaded-example">
                <span className="badge">{selectedExample.sourceLabel}</span>
                <span>{selectedExample.title} carregado</span>
              </div>
            ) : null}

            <div className="form-grid">
              {form.mode === 'calculated' ? (
                <div className="field">
                  <label htmlFor="testType">Tipo de teste</label>
                  <select
                    id="testType"
                    value={form.testType}
                    onChange={(event) => updateField('testType', event.target.value)}
                  >
                    <option value="mean-z">Teste Z para média — σ conhecido</option>
                    <option value="mean-t">Teste T para média — σ desconhecido</option>
                    <option value="proportion-z">Teste Z para proporção</option>
                  </select>
                  <small>
                    Use Z quando σ populacional é conhecido; use T quando σ é
                    estimado pela amostra.
                  </small>
                </div>
              ) : (
                <div className="field span-2">
                  <label htmlFor="context">Contexto do problema</label>
                  <textarea
                    id="context"
                    value={form.context}
                    onChange={(event) => updateField('context', event.target.value)}
                  />
                </div>
              )}

            <div className="field">
              <label htmlFor="alternative">Tipo de teste</label>
              <select
                id="alternative"
                value={form.alternative}
                onChange={(event) => updateField('alternative', event.target.value)}
              >
                <option value="two-sided">bilateral</option>
                <option value="left">unilateral à esquerda</option>
                <option value="right">unilateral à direita</option>
              </select>
            </div>

            {form.mode === 'given-p-value' ? (
              <div className="field">
                <label htmlFor="parameter">Parâmetro</label>
                <select
                  id="parameter"
                  value={form.parameter}
                  onChange={(event) => updateField('parameter', event.target.value)}
                >
                  <option value="μ">μ</option>
                  <option value="p">p</option>
                </select>
              </div>
            ) : null}

            <div className="field">
              <label htmlFor="hypothesizedValue">
                {form.parameter === 'p' ? 'p₀: proporção hipotética' : 'μ₀: média hipotética'}
              </label>
              <input
                id="hypothesizedValue"
                value={form.hypothesizedValue}
                onChange={(event) => updateField('hypothesizedValue', event.target.value)}
                placeholder={form.parameter === 'p' ? '0,50' : '5'}
              />
            </div>

            <div className="field">
              <label htmlFor="unit">Unidade</label>
              <input
                id="unit"
                value={form.unit}
                onChange={(event) => updateField('unit', event.target.value)}
                placeholder="kg, ms, cm..."
              />
            </div>

            <div className="field">
              <label htmlFor="alpha">α: nível de significância</label>
              <input
                id="alpha"
                value={form.alpha}
                onChange={(event) => updateField('alpha', event.target.value)}
                placeholder="0,05 ou 5%"
              />
            </div>

            {form.mode === 'given-p-value' ? (
              <div className="field">
                <label htmlFor="pValue">p-valor informado</label>
                <input
                  id="pValue"
                  value={form.pValue}
                  onChange={(event) => updateField('pValue', event.target.value)}
                  placeholder="0,125"
                />
              </div>
            ) : null}

            {form.mode === 'calculated' && form.testType !== 'proportion-z' ? (
              <>
                <div className="field">
                  <label htmlFor="sampleMean">x̄: média amostral</label>
                  <input
                    id="sampleMean"
                    value={form.sampleMean}
                    onChange={(event) => updateField('sampleMean', event.target.value)}
                    placeholder="5,006"
                  />
                </div>
                <div className="field">
                  <label htmlFor="sampleSize">n: tamanho da amostra</label>
                  <input
                    id="sampleSize"
                    value={form.sampleSize}
                    onChange={(event) => updateField('sampleSize', event.target.value)}
                    placeholder="50"
                  />
                </div>
              </>
            ) : null}

            {form.mode === 'calculated' && form.testType === 'mean-z' ? (
              <div className="field">
                <label htmlFor="populationStandardDeviation">
                  σ: desvio padrão populacional
                </label>
                <input
                  id="populationStandardDeviation"
                  value={form.populationStandardDeviation}
                  onChange={(event) =>
                    updateField('populationStandardDeviation', event.target.value)
                  }
                  placeholder="2,4"
                />
              </div>
            ) : null}

            {form.mode === 'calculated' && form.testType === 'mean-t' ? (
              <div className="field">
                <label htmlFor="sampleStandardDeviation">s: desvio padrão amostral</label>
                <input
                  id="sampleStandardDeviation"
                  value={form.sampleStandardDeviation}
                  onChange={(event) =>
                    updateField('sampleStandardDeviation', event.target.value)
                  }
                  placeholder="0,3525"
                />
              </div>
            ) : null}

            {form.mode === 'calculated' && form.testType === 'proportion-z' ? (
              <>
                <div className="field">
                  <label htmlFor="successes">x: número de sucessos</label>
                  <input
                    id="successes"
                    value={form.successes}
                    onChange={(event) => updateField('successes', event.target.value)}
                    placeholder="42"
                  />
                </div>
                <div className="field">
                  <label htmlFor="sampleSizeProportion">n: tamanho da amostra</label>
                  <input
                    id="sampleSizeProportion"
                    value={form.sampleSize}
                    onChange={(event) => updateField('sampleSize', event.target.value)}
                    placeholder="100"
                  />
                </div>
              </>
            ) : null}
            </div>

            {errors.length > 0 ? (
              <ul className="error-list">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            ) : null}

            {warnings.length > 0 ? (
              <ul className="warning-list">
                {warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            ) : null}

            <div className="form-actions">
              <button className="primary-button" type="submit">
                Calcular
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => {
                  setForm(initialForm)
                  setSelectedExample(null)
                  setResult(null)
                  setErrors([])
                  setWarnings([])
                }}
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      </section>

      <HypothesisResult result={result} />
      <PublicDataSources />
    </>
  )
}
