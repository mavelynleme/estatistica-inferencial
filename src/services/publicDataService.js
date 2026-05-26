import {
  ibgeIpcaPublicExample,
  ibgePublicDatasets,
  publicDataSources,
} from '../data/publicDatasets'

export const IBGE_IPCA_SIDRA_URL =
  'https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/last%2012/d/v63%202'

export const DEFAULT_IBGE_DATASET_ID = 'ibge-ipca-monthly'
export const DEFAULT_PUBLIC_PERIOD_COUNT = 12

function getIbgeDataset(datasetId = DEFAULT_IBGE_DATASET_ID) {
  return (
    ibgePublicDatasets.find((dataset) => dataset.id === datasetId) ||
    ibgePublicDatasets[0]
  )
}

export function buildSidraUrl(dataset, periodCount = DEFAULT_PUBLIC_PERIOD_COUNT) {
  if (!dataset?.apiUrlTemplate) return ''

  return dataset.apiUrlTemplate
    .replace('{table}', dataset.sidraTable)
    .replaceAll('{variable}', dataset.sidraVariable)
    .replace('{periodCount}', periodCount)
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

export async function fetchIbgeDatasetData(
  datasetId = DEFAULT_IBGE_DATASET_ID,
  periodCount = DEFAULT_PUBLIC_PERIOD_COUNT,
) {
  const dataset = getIbgeDataset(datasetId)
  const apiUrl = buildSidraUrl(dataset, periodCount)

  if (!apiUrl || dataset.status !== 'available') {
    throw new Error('Indicador sem consulta online configurada.')
  }

  try {
    const response = await fetch(apiUrl)
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

function buildSummary(
  rows,
  dataset,
  dataStatus,
  statusMessage,
  periodCount = DEFAULT_PUBLIC_PERIOD_COUNT,
) {
  const summary = calculateSampleSummary(rows.map((row) => row.value))
  const apiUrl = buildSidraUrl(dataset, periodCount)

  return {
    id: dataset.id,
    label: dataset.label,
    shortLabel: dataset.shortLabel,
    description: dataset.description,
    source: dataset.sourceName,
    sourceName: dataset.sourceName,
    sourceUrl: dataset.sourceUrl,
    officialPageUrl: dataset.officialPageUrl,
    dataset: `${dataset.label} - Tabela ${dataset.sidraTable}`,
    sidraTable: dataset.sidraTable,
    sidraVariable: dataset.sidraVariable,
    variable: dataset.variableLabel,
    variableLabel: dataset.variableLabel,
    unit: dataset.unit,
    question: dataset.question,
    hypothesizedValue: dataset.defaultHypothesizedValue,
    context: dataset.context,
    alternative: dataset.defaultAlternative,
    alpha: dataset.defaultAlpha,
    nullHypothesisText: dataset.nullHypothesisText,
    alternativeHypothesisText: dataset.alternativeHypothesisText,
    fallbackGeneratedAt: dataset.fallbackGeneratedAt,
    apiUrl,
    periodCount,
    periods: rows.map((row) => row.period),
    values: rows,
    dataStatus,
    statusMessage,
    ...summary,
  }
}

export function getIbgeDatasetFallbackSummary(
  datasetId = DEFAULT_IBGE_DATASET_ID,
  periodCount = DEFAULT_PUBLIC_PERIOD_COUNT,
) {
  const dataset = getIbgeDataset(datasetId)
  const rows = parseIbgeDatasetData({ value: dataset.fallbackValues })
  const hasEnoughData = rows.length >= 2

  return buildSummary(
    rows,
    dataset,
    hasEnoughData ? 'fallback' : 'error',
    hasEnoughData
      ? 'Dados públicos pré-carregados.'
      : 'Fallback local sem valores suficientes para calcular o teste t.',
    periodCount,
  )
}

export function getIbgeIpcaFallbackSummary() {
  return getIbgeDatasetFallbackSummary(DEFAULT_IBGE_DATASET_ID)
}

export async function getIbgeDatasetSummaryWithFallback(
  datasetId = DEFAULT_IBGE_DATASET_ID,
  periodCount = DEFAULT_PUBLIC_PERIOD_COUNT,
) {
  const dataset = getIbgeDataset(datasetId)

  try {
    const rawData = await fetchIbgeDatasetData(dataset.id, periodCount)
    const rows = parseIbgeDatasetData(rawData)
    if (rows.length < 2) {
      throw new Error('IBGE retornou menos de 2 valores válidos.')
    }

    return buildSummary(rows, dataset, 'online', 'IBGE/SIDRA online.', periodCount)
  } catch {
    const fallbackSummary = getIbgeDatasetFallbackSummary(dataset.id, periodCount)
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
      label,
      shortLabel,
      description,
      sourceName,
      sourceUrl,
      sidraTable,
      sidraVariable,
      variableLabel,
      unit,
      officialPageUrl,
      status,
      badge,
    }) => ({
      id,
      label,
      shortLabel,
      description,
      sourceName,
      sourceUrl,
      sidraTable,
      sidraVariable,
      variableLabel,
      unit,
      officialPageUrl,
      status,
      badge,
    }),
  )
}

export function getAvailablePublicDataSources() {
  return publicDataSources
}
