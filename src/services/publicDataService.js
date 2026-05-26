import {
  ibgeIpcaFallback,
  ibgeIpcaPublicExample,
  publicDataSources,
} from '../data/publicDatasets'

export const IBGE_IPCA_SIDRA_URL =
  'https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/last%2012/d/v63%202'

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

export async function fetchIbgeIpcaData() {
  try {
    const response = await fetch(IBGE_IPCA_SIDRA_URL)
    if (!response.ok) {
      throw new Error(`IBGE retornou status ${response.status}.`)
    }
    return await response.json()
  } catch (error) {
    throw new Error(
      error?.message || 'Não foi possível carregar os dados públicos do IBGE.',
    )
  }
}

export function parseIbgeIpcaData(rawData) {
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

function buildSummary(rows, dataStatus, statusMessage) {
  const summary = calculateSampleSummary(rows.map((row) => row.value))

  return {
    source: ibgeIpcaFallback.source,
    dataset: ibgeIpcaFallback.dataset,
    variable: ibgeIpcaFallback.variable,
    unit: ibgeIpcaFallback.unit,
    periods: rows.map((row) => row.period),
    values: rows,
    dataStatus,
    statusMessage,
    ...summary,
  }
}

export function getIbgeIpcaFallbackSummary() {
  const rows = parseIbgeIpcaData({ value: ibgeIpcaFallback.values })
  const hasEnoughData = rows.length >= 2

  return buildSummary(
    rows,
    hasEnoughData ? 'fallback' : 'error',
    hasEnoughData
      ? 'Usando dados públicos pré-carregados.'
      : 'Fallback local sem valores suficientes para calcular o teste t.',
  )
}

export async function getIbgeIpcaExampleWithFallback() {
  try {
    const rawData = await fetchIbgeIpcaData()
    const rows = parseIbgeIpcaData(rawData)
    if (rows.length < 2) {
      throw new Error('IBGE retornou menos de 2 valores válidos.')
    }

    return buildSummary(rows, 'online', 'Dados carregados do IBGE com sucesso.')
  } catch {
    const fallbackSummary = getIbgeIpcaFallbackSummary()
    if (fallbackSummary.n < 2) return fallbackSummary

    return {
      ...fallbackSummary,
      dataStatus: 'fallback',
      statusMessage:
        'Não foi possível acessar o IBGE. Usando dados públicos pré-carregados.',
    }
  }
}

export function getIbgeIpcaExample() {
  return ibgeIpcaPublicExample.example
}

export function getAvailablePublicDataSources() {
  return publicDataSources
}
