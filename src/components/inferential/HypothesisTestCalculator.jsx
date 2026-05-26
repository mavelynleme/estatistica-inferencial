import { useState } from 'react'
import { hypothesisExamples } from '../../data/hypothesisExamples'
import { ExampleSelector } from './ExampleSelector'
import { HypothesisResult } from './HypothesisResult'
import { ManualDataImport } from './ManualDataImport'
import { P2Compliance } from './P2Compliance'
import {
  DEFAULT_IBGE_DATASET_ID,
  DEFAULT_PUBLIC_PERIOD_COUNT,
  calculateSampleSummary,
  getIbgeDatasetApiUrl,
  getIbgeDatasetFallbackSummary,
  getIbgeDatasetSummaryWithFallback,
  getIbgePublicDatasetOptions,
} from '../../services/publicDataService'
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
  testType: 'mean-t',
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
  'mean-z': 'Teste Z para média',
  'mean-t': 'Teste T para média',
  'proportion-z': 'Teste Z para proporção',
}

const alternativeLabels = {
  'two-sided': 'Teste bilateral',
  left: 'Teste unilateral à esquerda',
  right: 'Teste unilateral à direita',
}

function toInputValue(value) {
  return value === null || value === undefined ? '' : String(value).replace('.', ',')
}

function getFormula(form) {
  if (form.mode === 'given-p-value') {
    return 'Não há fórmula de estatística de teste nesta modalidade. O exercício já informa o p-valor.'
  }

  if (form.testType === 'mean-z') return 'z = (x̄ - μ₀) / (σ / √n)'
  if (form.testType === 'mean-t') return 't = (x̄ - μ₀) / (s / √n), com gl = n - 1'

  return 'z = (p̂ - p₀) / √((p₀(1 - p₀)) / n), com p̂ = x / n'
}

function buildRows(form, result) {
  const rows = [
    ['Modo', form.mode === 'given-p-value' ? 'P-valor informado' : 'P-valor calculado'],
    ['Teste', form.mode === 'given-p-value' ? 'Comparação p-valor × α' : testTypeLabels[form.testType]],
    ['Hipótese alternativa', alternativeLabels[form.alternative]],
    ['Valor hipotético', `${formatNumber(result.hypothesizedValue, 6)}${form.unit ? ` ${form.unit}` : ''}`],
    ['α', formatNumber(result.alpha, 4)],
    ['p-valor', formatNumber(result.pValue, 6)],
  ]

  if (form.context) rows.unshift(['Contexto', form.context])

  if (form.mode === 'calculated' && form.testType === 'mean-z') {
    rows.push(['Média amostral', formatNumber(result.inputs.sampleMean, 6)])
    rows.push(['Desvio padrão populacional', formatNumber(result.inputs.populationStandardDeviation, 6)])
    rows.push(['n', formatNumber(result.inputs.sampleSize, 0)])
  }

  if (form.mode === 'calculated' && form.testType === 'mean-t') {
    rows.push(['Média amostral', formatNumber(result.inputs.sampleMean, 6)])
    rows.push(['Desvio padrão amostral', formatNumber(result.inputs.sampleStandardDeviation, 6)])
    rows.push(['n', formatNumber(result.inputs.sampleSize, 0)])
  }

  if (form.mode === 'calculated' && form.testType === 'proportion-z') {
    rows.push(['Sucessos', formatNumber(result.inputs.successes, 0)])
    rows.push(['n', formatNumber(result.inputs.sampleSize, 0)])
    rows.push(['Proporção amostral', formatNumber(result.sampleProportion, 6)])
  }

  if (result.publicDataSummary) {
    const unit = result.publicDataSummary.unit || ''
    rows.push(['Fonte', result.publicDataSummary.source])
    rows.push(['Períodos', result.publicDataSummary.periods.join(', ')])
    rows.push(['Mínimo', `${formatNumber(result.publicDataSummary.min, 6)}${unit}`])
    rows.push(['Máximo', `${formatNumber(result.publicDataSummary.max, 6)}${unit}`])
  }

  return rows.map(([label, value]) => ({ label, value }))
}

function getDefaultTypeI(form) {
  return `rejeitar H₀ quando H₀ é verdadeira no contexto de ${form.context || 'o parâmetro analisado'}.`
}

function getDefaultTypeII(form) {
  return `não rejeitar H₀ quando H₀ é falsa no contexto de ${form.context || 'o parâmetro analisado'}.`
}

function getDataBadge({ form, selectedOption, publicDataStatus }) {
  if (selectedOption === 'manual') {
    return form.sampleSize && form.sampleMean && form.sampleStandardDeviation
      ? 'P-valor calculado'
      : 'Aguardando dados'
  }
  if (selectedOption === 'ibge-ipca') {
    if (publicDataStatus === 'fallback') return 'Fallback local'
    return 'Dados públicos'
  }
  return form.mode === 'given-p-value' ? 'P-valor informado' : 'P-valor calculado'
}

function getHelperText({ form, selectedOption }) {
  if (selectedOption === 'ibge-ipca') {
    return 'Revise o teste T preenchido pelos dados públicos ou pelo fallback local.'
  }
  if (selectedOption === 'manual') {
    return ''
  }
  if (form.mode === 'given-p-value') {
    return 'O exercício já informa o p-valor. A calculadora compara com α.'
  }
  return 'Preencha os dados do teste para calcular o p-valor.'
}

function TestConfigurationFields({ form, updateField }) {
  return (
    <div className="form-grid compact-form">
      {form.mode === 'given-p-value' ? (
        <div className="field span-2">
          <label htmlFor="context">Contexto</label>
          <textarea
            id="context"
            value={form.context}
            onChange={(event) => updateField('context', event.target.value)}
          />
        </div>
      ) : (
        <div className="field">
          <label htmlFor="testType">Tipo de teste</label>
          <select
            id="testType"
            value={form.testType}
            onChange={(event) => updateField('testType', event.target.value)}
          >
            <option value="mean-z">Teste Z para média</option>
            <option value="mean-t">Teste T para média</option>
            <option value="proportion-z">Teste Z para proporção</option>
          </select>
        </div>
      )}

      <div className="field">
        <label htmlFor="hypothesizedValue">Valor de referência</label>
        <input
          id="hypothesizedValue"
          value={form.hypothesizedValue}
          onChange={(event) => updateField('hypothesizedValue', event.target.value)}
          placeholder={form.parameter === 'p' ? 'Ex.: 0,50' : 'Ex.: 5'}
        />
      </div>

      <div className="field">
        <label htmlFor="alternative">
          {form.mode === 'given-p-value' ? 'Tipo de teste' : 'Hipótese alternativa'}
        </label>
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

      <div className="field">
        <label htmlFor="alpha">α (nível de significância)</label>
        <input
          id="alpha"
          value={form.alpha}
          onChange={(event) => updateField('alpha', event.target.value)}
          placeholder="0,05 ou 5%"
        />
      </div>

      {form.mode === 'given-p-value' ? (
        <div className="field">
          <label htmlFor="pValue">p-valor</label>
          <input
            id="pValue"
            value={form.pValue}
            onChange={(event) => updateField('pValue', event.target.value)}
            placeholder="Ex.: 0,125"
          />
        </div>
      ) : null}

      {form.mode === 'calculated' && form.testType !== 'proportion-z' ? (
        <>
          <div className="field">
            <label htmlFor="sampleMean">Média amostral (x̄)</label>
            <input
              id="sampleMean"
              value={form.sampleMean}
              onChange={(event) => updateField('sampleMean', event.target.value)}
              placeholder="Ex.: 4,85"
            />
          </div>
          <div className="field">
            <label htmlFor="sampleSize">n (tamanho da amostra)</label>
            <input
              id="sampleSize"
              value={form.sampleSize}
              onChange={(event) => updateField('sampleSize', event.target.value)}
              placeholder="Ex.: 30"
            />
          </div>
        </>
      ) : null}

      {form.mode === 'calculated' && form.testType === 'mean-z' ? (
        <div className="field">
          <label htmlFor="populationStandardDeviation">Desvio padrão populacional (σ)</label>
          <input
            id="populationStandardDeviation"
            value={form.populationStandardDeviation}
            onChange={(event) =>
              updateField('populationStandardDeviation', event.target.value)
            }
            placeholder="Ex.: 2,4"
          />
        </div>
      ) : null}

      {form.mode === 'calculated' && form.testType === 'mean-t' ? (
        <div className="field">
          <label htmlFor="sampleStandardDeviation">Desvio padrão (s)</label>
          <input
            id="sampleStandardDeviation"
            value={form.sampleStandardDeviation}
            onChange={(event) =>
              updateField('sampleStandardDeviation', event.target.value)
            }
            placeholder="Ex.: 1,20"
          />
        </div>
      ) : null}

      {form.mode === 'calculated' && form.testType === 'proportion-z' ? (
        <>
          <div className="field">
            <label htmlFor="successes">Sucessos</label>
            <input
              id="successes"
              value={form.successes}
              onChange={(event) => updateField('successes', event.target.value)}
              placeholder="Ex.: 42"
            />
          </div>
          <div className="field">
            <label htmlFor="sampleSizeProportion">n (tamanho da amostra)</label>
            <input
              id="sampleSizeProportion"
              value={form.sampleSize}
              onChange={(event) => updateField('sampleSize', event.target.value)}
              placeholder="Ex.: 100"
            />
          </div>
        </>
      ) : null}
    </div>
  )
}

export function HypothesisTestCalculator() {
  const [form, setForm] = useState(initialForm)
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState([])
  const [warnings, setWarnings] = useState([])
  const [selectedExample, setSelectedExample] = useState(null)
  const [selectedOption, setSelectedOption] = useState('manual')
  const [publicDataSummary, setPublicDataSummary] = useState(null)
  const [publicDataStatus, setPublicDataStatus] = useState(null)
  const [selectedPublicPeriods, setSelectedPublicPeriods] = useState([])
  const [selectedPublicDatasetId, setSelectedPublicDatasetId] = useState(
    DEFAULT_IBGE_DATASET_ID,
  )
  const [publicPeriodCount, setPublicPeriodCount] = useState(
    DEFAULT_PUBLIC_PERIOD_COUNT,
  )
  const [isLoadingPublicData, setIsLoadingPublicData] = useState(false)
  const publicDatasetOptions = getIbgePublicDatasetOptions()
  const selectedPublicApiUrl = getIbgeDatasetApiUrl(
    selectedPublicDatasetId,
    publicPeriodCount,
  )
  const testHelperText = getHelperText({ form, selectedOption })

  const updateField = (field, value) => {
    setForm((current) => {
      const next = { ...current, [field]: value }
      if (field === 'testType' && value === 'proportion-z') next.parameter = 'p'
      if (field === 'testType' && value !== 'proportion-z') next.parameter = 'μ'
      return next
    })
    setResult(null)
    setErrors([])
  }

  const resetMessages = () => {
    setErrors([])
    setWarnings([])
  }

  const selectManual = () => {
    setSelectedOption('manual')
    setSelectedExample(null)
    setPublicDataSummary(null)
    setPublicDataStatus(null)
    setSelectedPublicPeriods([])
    setResult(null)
    setForm(initialForm)
    resetMessages()
  }

  const selectIbge = () => {
    const baseExample = hypothesisExamples.find((example) => example.id === 'ibge-ipca')
    setSelectedOption('ibge-ipca')
    setSelectedExample(baseExample)
    setPublicDataSummary(null)
    setPublicDataStatus('idle')
    setSelectedPublicPeriods([])
    setResult(null)
    setForm({
      ...initialForm,
      testType: 'mean-t',
      parameter: 'μ',
      alternative: 'right',
    })
    resetMessages()
  }

  const selectPublicDataset = (datasetId) => {
    const baseExample = hypothesisExamples.find((example) => example.id === 'ibge-ipca')
    setSelectedPublicDatasetId(datasetId)
    setSelectedOption('ibge-ipca')
    setSelectedExample(baseExample)
    setPublicDataSummary(null)
    setPublicDataStatus('idle')
    setSelectedPublicPeriods([])
    setResult(null)
    setForm({
      ...initialForm,
      testType: 'mean-t',
      parameter: 'μ',
      alternative: 'right',
    })
    resetMessages()
  }

  const selectPublicPeriodCount = (periodCount) => {
    setPublicPeriodCount(Number(periodCount))
    setPublicDataSummary(null)
    setPublicDataStatus('idle')
    setSelectedPublicPeriods([])
    setResult(null)
    resetMessages()
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

    setSelectedOption(example.id)
    setSelectedExample(example)
    setPublicDataSummary(null)
    setPublicDataStatus(null)
    setSelectedPublicPeriods([])
    setForm(nextForm)
    resetMessages()
    setResult(buildResult(nextForm, example))
  }

  const selectAllocated = () => {
    const defaultExample =
      hypothesisExamples.find(
        (example) => example.id === 'tarefa-8-teste-ab-conversao',
      ) || hypothesisExamples[0]

    if (defaultExample) applyExample(defaultExample)
  }

  const buildPublicDataExampleFromSummary = (summary) => {
    const baseExample = hypothesisExamples.find((example) => example.id === 'ibge-ipca')

    return {
      ...baseExample,
      id: summary.id || baseExample.id,
      title: `Dados públicos reais - IBGE ${summary.dataset}`,
      sourceLabel: `${summary.source} - ${summary.dataset}`,
      context: summary.context || baseExample.context,
      hypothesizedValue:
        summary.hypothesizedValue ?? baseExample.hypothesizedValue,
      alternative: summary.alternative || baseExample.alternative,
      typeIExplanation: `Erro Tipo I neste contexto seria concluir que ${summary.context} está acima de ${formatNumber(summary.hypothesizedValue, 2)}${summary.unit}, rejeitando H₀, quando na verdade ela não está acima desse valor.`,
      typeIIExplanation: `Erro Tipo II neste contexto seria não rejeitar H₀ quando, na verdade, ${summary.context} está acima de ${formatNumber(summary.hypothesizedValue, 2)}${summary.unit}.`,
      inputs: {
        sampleSize: summary.n,
        sampleMean: summary.sampleMean,
        sampleStandardDeviation: summary.sampleStandardDeviation,
      },
      publicDataSummary: summary,
    }
  }

  const applyPublicDataSummary = (summary) => {
    setPublicDataStatus(summary.dataStatus)
    setResult(null)

    if (summary.n < 2 || !Number.isFinite(summary.sampleStandardDeviation)) {
      setErrors([summary.statusMessage || 'Dados insuficientes para preencher o teste t.'])
      return
    }

    const example = buildPublicDataExampleFromSummary(summary)
    const nextForm = {
      ...initialForm,
      mode: 'calculated',
      testType: 'mean-t',
      alternative: summary.alternative || 'right',
      parameter: 'μ',
      context: summary.context || 'variação média mensal',
      hypothesizedValue: toInputValue(summary.hypothesizedValue ?? 0.4),
      unit: summary.unit || '%',
      alpha: toInputValue(summary.alpha ?? 0.05),
      sampleMean: toInputValue(Number(summary.sampleMean.toFixed(6))),
      sampleStandardDeviation: toInputValue(Number(summary.sampleStandardDeviation.toFixed(6))),
      sampleSize: toInputValue(summary.n),
    }

    setSelectedOption('ibge-ipca')
    setSelectedExample(example)
    setForm(nextForm)
    resetMessages()
  }

  const storeLoadedPublicData = (summary) => {
    setPublicDataSummary(summary)
    setPublicDataStatus(summary.dataStatus)
    setSelectedPublicPeriods(summary.periods)
    setResult(null)
    resetMessages()
  }

  const loadPublicData = async () => {
    setIsLoadingPublicData(true)
    setPublicDataStatus('loading')
    const summary = await getIbgeDatasetSummaryWithFallback(
      selectedPublicDatasetId,
      publicPeriodCount,
    )
    storeLoadedPublicData(summary)
    setIsLoadingPublicData(false)
  }

  const useFallbackData = () => {
    storeLoadedPublicData(
      getIbgeDatasetFallbackSummary(selectedPublicDatasetId, publicPeriodCount),
    )
  }

  const togglePublicPeriod = (period) => {
    setSelectedPublicPeriods((current) =>
      current.includes(period)
        ? current.filter((item) => item !== period)
        : [...current, period],
    )
    setResult(null)
  }

  const useSelectedPublicData = () => {
    const selectedRows =
      publicDataSummary?.values.filter((row) =>
        selectedPublicPeriods.includes(row.period),
      ) || []
    const selectedSummary = {
      ...publicDataSummary,
      periods: selectedRows.map((row) => row.period),
      values: selectedRows,
      ...calculateSampleSummary(selectedRows.map((row) => row.value)),
    }

    applyPublicDataSummary(selectedSummary)
  }

  const selectAllPublicPeriods = () => {
    setSelectedPublicPeriods(publicDataSummary?.periods || [])
    setResult(null)
  }

  const clearPublicPeriodSelection = () => {
    setSelectedPublicPeriods([])
    setResult(null)
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

  const validateCalculated = (targetForm, parsed) => {
    const nextErrors = []
    const nextWarnings = []

    if (!Number.isFinite(parsed.sampleSize) || parsed.sampleSize <= 1) {
      nextErrors.push('n deve ser maior que 1.')
    }

    if (targetForm.testType === 'mean-z') {
      if (!Number.isFinite(parsed.sampleMean)) nextErrors.push('Informe uma média amostral válida.')
      if (!Number.isFinite(parsed.populationStandardDeviation) || parsed.populationStandardDeviation <= 0) {
        nextErrors.push('o desvio padrão deve ser maior que 0.')
      }
    }

    if (targetForm.testType === 'mean-t') {
      if (!Number.isFinite(parsed.sampleMean)) nextErrors.push('Informe uma média amostral válida.')
      if (!Number.isFinite(parsed.sampleStandardDeviation) || parsed.sampleStandardDeviation <= 0) {
        nextErrors.push('o desvio padrão deve ser maior que 0.')
      }
    }

    if (targetForm.testType === 'proportion-z') {
      if (parsed.hypothesizedValue <= 0 || parsed.hypothesizedValue >= 1) {
        nextErrors.push('p₀ deve estar entre 0 e 1.')
      }
      if (!Number.isFinite(parsed.successes) || parsed.successes < 0 || parsed.successes > parsed.sampleSize) {
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

    const common = {
      hypothesizedValue: parsed.hypothesizedValue,
      alpha: parsed.alpha,
      alternative: targetForm.alternative,
    }

    let testResult
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
      formula: getFormula(targetForm),
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
        expectedConclusion:
          example?.resultSummaryConclusion || example?.expectedConclusion,
      }),
      typeIExplanation: example?.typeIExplanation || getDefaultTypeI(targetForm),
      typeIIExplanation: example?.typeIIExplanation || getDefaultTypeII(targetForm),
      sourceLabel: example?.sourceLabel,
      exampleTitle: example?.title,
      publicDataSummary: example?.publicDataSummary,
    }

    if (example?.dynamicConclusion === 'ibge-ipca') {
      const context = targetForm.context || 'série pública do IBGE'
      const reference = `${formatNumber(parsed.hypothesizedValue, 2)}${targetForm.unit || ''}`
      resultObject.interpretation = decision.rejectNull
        ? `Há evidência estatística suficiente para afirmar que ${context} está acima de ${reference}.`
        : `Não há evidência estatística suficiente para afirmar que ${context} está acima de ${reference}.`
    }

    resultObject.dataRows = buildRows(targetForm, resultObject)
    setErrors([])
    setWarnings(nextWarnings)
    return resultObject
  }

  const calculate = (event) => {
    event.preventDefault()
    setResult(buildResult(form, selectedExample))
  }

  const useManualSample = ({ sampleSize, sampleMean, sampleStandardDeviation }) => {
    setSelectedOption('manual')
    setSelectedExample(null)
    setPublicDataSummary(null)
    setPublicDataStatus(null)
    setSelectedPublicPeriods([])
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
    <section className="inferential-minimal">
      <div className="page-section inferential-page">
        <div className="analysis-page-heading">
          <div>
            <h1>Estatística Inferencial</h1>
            <p>Ambiente de análise para entrada de dados, configuração do teste e relatório do resultado.</p>
          </div>
        </div>

        <div className="analysis-content">
            <ExampleSelector
              selectedExampleId={selectedExample?.id}
              selectedOption={selectedOption}
              publicDataStatus={publicDataStatus}
              publicDataSummary={publicDataSummary}
              isLoadingPublicData={isLoadingPublicData}
              publicDatasetOptions={publicDatasetOptions}
              selectedPublicDatasetId={selectedPublicDatasetId}
              selectedPublicPeriods={selectedPublicPeriods}
              publicPeriodCount={publicPeriodCount}
              selectedPublicApiUrl={selectedPublicApiUrl}
              onLoadPublicData={loadPublicData}
              onSelectExample={applyExample}
              onSelectManual={selectManual}
              onSelectIbge={selectIbge}
              onSelectAllocated={selectAllocated}
              onSelectPublicDataset={selectPublicDataset}
              onSelectPublicPeriodCount={selectPublicPeriodCount}
              onTogglePublicPeriod={togglePublicPeriod}
              onSelectAllPublicPeriods={selectAllPublicPeriods}
              onClearPublicPeriodSelection={clearPublicPeriodSelection}
              onUseSelectedPublicData={useSelectedPublicData}
              onUseFallbackData={useFallbackData}
            />

            <form onSubmit={calculate}>
              <section className="flow-section">
                <div className="flow-heading">
                  <div>
                    <div className="numbered-title">
                      <span className="section-number">2</span>
                      <h2>Dados do teste</h2>
                    </div>
                    {testHelperText ? (
                      <p className="section-helper">{testHelperText}</p>
                    ) : null}
                  </div>
                  <span className="soft-badge">
                    {getDataBadge({ form, selectedOption, publicDataStatus })}
                  </span>
                </div>

                {selectedOption === 'manual' ? (
                  <ManualDataImport onUseSample={useManualSample} />
                ) : null}

                <div className="soft-form-card">
                  <TestConfigurationFields form={form} updateField={updateField} />

                  {selectedOption === 'ibge-ipca' && publicDataSummary?.n >= 2 ? (
                    <div className="question-card">
                      <span className="soft-badge">Pergunta</span>
                      <p>{publicDataSummary.question}</p>
                      <div className="hypotheses">
                        <span>{publicDataSummary.nullHypothesisText}</span>
                        <span>{publicDataSummary.alternativeHypothesisText}</span>
                      </div>
                    </div>
                  ) : null}

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
                      Calcular p-valor
                    </button>
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={selectManual}
                    >
                      Limpar
                    </button>
                  </div>
                </div>
              </section>
            </form>

            <HypothesisResult result={result} />
            <P2Compliance />
        </div>
      </div>
    </section>
  )
}
