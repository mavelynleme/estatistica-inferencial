import {
  ibgeIpcaPublicExample,
  ibgePublicDatasets,
  publicDataSources,
} from '../data/publicDatasets'

export const IBGE_IPCA_SIDRA_URL =
  'https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/last%2012/d/v63%202'

export const DEFAULT_IBGE_DATASET_ID = 'ibge-ipca'

function getIbgeDataset(datasetId = DEFAULT_IBGE_DATASET_ID) {
  return (
    ibgePublicDatasets.find((dataset) => dataset.id === datasetId) ||
    ibgePublicDatasets[0]
  )
}

function buildSidraUrl(dataset) {
  return `https://apisidra.ibge.gov.br/values/t/${dataset.table}/n1/all/v/${dataset.variableCode}/p/last%2012/d/v${dataset.variableCode}%202`
}

function parsePeriod(rawPeriod) {
  const value = String(rawPeriod ?? '').trim()
  if (/^\d{6}$/.test(value)) return `${value.slice(0, 4)}-${value.slice(4)}`
  return value
}

function parseValue(rawValue) {
  const value = String(rawValue ?? '').trim()
  if (!value || value === '...' || value === '-' || value.toLowerCase() === 'null') {
    return Number.NaN
  }

  return Number(value.replace(',', '.'))
}

export async function fetchIbgeDatasetData(datasetId = DEFAULT_IBGE_DATASET_ID) {
  const dataset = getIbgeDataset(datasetId)

  try {
    const response = await fetch(buildSidraUrl(dataset))
    if (!response.ok) {
      throw new Error(`IBGE retornou status ${response.status}.`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(
      error?.message || 'Não foi possível carregar os dados públicos do IBGE.',
      { cause: error },
    )
  }
}

export async function fetchIbgeIpcaData() {
  return fetchIbgeDatasetData(DEFAULT_IBGE_DATASET_ID)
}

export function parseIbgeDatasetData(rawData) {
  const rows = Array.isArray(rawData) ? rawData : rawData?.value
  if (!Array.isArray(rows)) return []

  return rows
    .map((row) => {
      const period = parsePeriod(row?.D2C || row?.D3C || row?.periodo || row?.period)
      const value = parseValue(row?.V || row?.valor || row?.value)
      return { period, value }
    })
    .filter((item) => item.period && Number.isFinite(item.value))
}

export function parseIbgeIpcaData(rawData) {
  return parseIbgeDatasetData(rawData)
}

export function calculateSampleSummary(values) {
  const validValues = values.filter((value) => Number.isFinite(value))
  const n = validValues.length

  if (n === 0) {
    return {
      n: 0,
      sampleMean: Number.NaN,
      sampleStandardDeviation: Number.NaN,
      min: Number.NaN,
      max: Number.NaN,
    }
  }

  const sampleMean = validValues.reduce((total, value) => total + value, 0) / n
  const sumSquares = validValues.reduce(
    (total, value) => total + (value - sampleMean) ** 2,
    0,
  )

  return {
    n,
    sampleMean,
    sampleStandardDeviation: n > 1 ? Math.sqrt(sumSquares / (n - 1)) : Number.NaN,
    min: Math.min(...validValues),
    max: Math.max(...validValues),
  }
}

function buildSummary(rows, dataset, dataStatus, statusMessage) {
  const summary = calculateSampleSummary(rows.map((row) => row.value))

  return {
    id: dataset.id,
    source: dataset.source,
    dataset: dataset.dataset,
    variable: dataset.variable,
    unit: dataset.unit,
    question: dataset.question,
    hypothesizedValue: dataset.hypothesizedValue,
    context: dataset.context,
    alternative: dataset.alternative,
    nullHypothesisText: dataset.nullHypothesisText,
    alternativeHypothesisText: dataset.alternativeHypothesisText,
    periods: rows.map((row) => row.period),
    values: rows,
    dataStatus,
    statusMessage,
    ...summary,
  }
}

export function getIbgeDatasetFallbackSummary(datasetId = DEFAULT_IBGE_DATASET_ID) {
  const dataset = getIbgeDataset(datasetId)
  const rows = parseIbgeDatasetData({ value: dataset.fallback })
  const hasEnoughData = rows.length >= 2

  return buildSummary(
    rows,
    dataset,
    hasEnoughData ? 'fallback' : 'error',
    hasEnoughData
      ? 'Dados públicos pré-carregados.'
      : 'Fallback local sem valores suficientes para calcular o teste t.',
  )
}

export function getIbgeIpcaFallbackSummary() {
  return getIbgeDatasetFallbackSummary(DEFAULT_IBGE_DATASET_ID)
}

export async function getIbgeDatasetSummaryWithFallback(
  datasetId = DEFAULT_IBGE_DATASET_ID,
) {
  const dataset = getIbgeDataset(datasetId)

  try {
    const rawData = await fetchIbgeDatasetData(dataset.id)
    const rows = parseIbgeDatasetData(rawData)
    if (rows.length < 2) {
      throw new Error('IBGE retornou menos de 2 valores válidos.')
    }

    return buildSummary(rows, dataset, 'online', 'IBGE/SIDRA online.')
  } catch {
    const fallbackSummary = getIbgeDatasetFallbackSummary(dataset.id)
    if (fallbackSummary.n < 2) return fallbackSummary

    return {
      ...fallbackSummary,
      dataStatus: 'fallback',
      statusMessage: 'Dados públicos pré-carregados.',
    }
  }
}

export async function getIbgeIpcaExampleWithFallback() {
  return getIbgeDatasetSummaryWithFallback(DEFAULT_IBGE_DATASET_ID)
}

export function getIbgeIpcaExample() {
  return ibgeIpcaPublicExample.example
}

export function getIbgePublicDatasetOptions() {
  return ibgePublicDatasets.map(
    ({
      id,
      shortName,
      title,
      source,
      dataset,
      table,
      variable,
      unit,
      question,
    }) => ({
      id,
      shortName,
      title,
      source,
      dataset,
      table,
      variable,
      unit,
      question,
    }),
  )
}

export function getAvailablePublicDataSources() {
  return publicDataSources
}
