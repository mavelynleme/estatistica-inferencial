import {
  ibgeIpcaFallback,
  ibgeIpcaPublicExample,
  publicDataSources,
} from '../data/publicDatasets'

export const IBGE_IPCA_AGREGADOS_URL =
  'https://servicodados.ibge.gov.br/api/v3/agregados/1737/periodos/-12/variaveis/63?localidades=N1[all]'

export const IBGE_IPCA_SIDRA_URL =
  'https://apisidra.ibge.gov.br/values/t/1737/n1/all/v/63/p/last%2012/d/v63%202'

export async function fetchIbgeIpcaData() {
  try {
    const response = await fetch(IBGE_IPCA_AGREGADOS_URL)
    if (!response.ok) throw new Error(`IBGE request failed with ${response.status}`)
    return await response.json()
  } catch {
    const response = await fetch(IBGE_IPCA_SIDRA_URL)
    if (!response.ok) throw new Error(`SIDRA request failed with ${response.status}`)
    return await response.json()
  }
}

function parsePeriod(rawPeriod) {
  const value = String(rawPeriod ?? '').trim()
  if (/^\d{6}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4)}`
  }
  return value
}

function parseValue(rawValue) {
  const value = String(rawValue ?? '').trim().replace(',', '.')
  if (!value || value === '...' || value.toLowerCase() === 'null') return Number.NaN
  return Number(value)
}

function parseSidraRows(rows) {
  return rows
    .slice(1)
    .map((row) => ({
      period: parsePeriod(row.D3C || row.periodo || row.period),
      value: parseValue(row.V || row.valor || row.value),
    }))
    .filter((item) => item.period && Number.isFinite(item.value))
}

function parseAgregadosRows(rawData) {
  const results = rawData?.[0]?.resultados || []
  return results
    .flatMap((result) =>
      (result.series || []).flatMap((serie) =>
        Object.entries(serie.serie || {}).map(([period, value]) => ({
          period: parsePeriod(period),
          value: parseValue(value),
        })),
      ),
    )
    .filter((item) => item.period && Number.isFinite(item.value))
}

export function parseIbgeIpcaData(rawData) {
  if (Array.isArray(rawData)) return parseSidraRows(rawData)
  if (Array.isArray(rawData?.value)) return parseSidraRows(rawData.value)
  return parseAgregadosRows(rawData)
}

function sampleMean(values) {
  return values.reduce((total, value) => total + value, 0) / values.length
}

function sampleStandardDeviation(values, mean) {
  const sumSquares = values.reduce((total, value) => total + (value - mean) ** 2, 0)
  return Math.sqrt(sumSquares / (values.length - 1))
}

function summarizeIpcaRows(rows, dataStatus) {
  const values = rows.map((row) => row.value)
  if (values.length <= 1) throw new Error('Not enough IPCA values to summarize')

  const mean = sampleMean(values)

  return {
    source: 'IBGE/SIDRA',
    dataset: 'IPCA — Tabela 1737',
    variable: 'Variação mensal do IPCA',
    unit: '%',
    periods: rows.map((row) => row.period),
    values: rows,
    n: values.length,
    sampleMean: mean,
    sampleStandardDeviation: sampleStandardDeviation(values, mean),
    min: Math.min(...values),
    max: Math.max(...values),
    dataStatus,
  }
}

export async function getIbgeIpcaMonthlyVariationSummary() {
  const rawData = await fetchIbgeIpcaData()
  return summarizeIpcaRows(parseIbgeIpcaData(rawData), 'online')
}

export async function getIbgeIpcaExampleWithFallback() {
  try {
    return await getIbgeIpcaMonthlyVariationSummary()
  } catch {
    return summarizeIpcaRows(ibgeIpcaFallback.values, 'fallback')
  }
}

export function getIbgeIpcaExample() {
  return ibgeIpcaPublicExample.example
}

export function getAvailablePublicDataSources() {
  return publicDataSources
}
