import {
  brazilPublicPreparedExample,
  irisSetosaPublicExample,
  publicDataSources,
} from '../data/publicDatasets'

export const IRIS_UCI_URL =
  'https://archive.ics.uci.edu/ml/machine-learning-databases/iris/iris.data'

export async function fetchIrisDatasetFromUCI() {
  const response = await fetch(IRIS_UCI_URL)

  if (!response.ok) {
    throw new Error(`UCI request failed with status ${response.status}`)
  }

  const rawText = await response.text()
  return parseIrisData(rawText)
}

export function parseIrisData(rawText) {
  return String(rawText)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const columns = line.split(',').map((column) => column.trim())

      if (columns.length !== 5) {
        throw new Error('Invalid Iris row format')
      }

      const [sepalLength, sepalWidth, petalLength, petalWidth] = columns
        .slice(0, 4)
        .map(Number)

      if (
        !Number.isFinite(sepalLength) ||
        !Number.isFinite(sepalWidth) ||
        !Number.isFinite(petalLength) ||
        !Number.isFinite(petalWidth)
      ) {
        throw new Error('Invalid numeric value in Iris dataset')
      }

      return {
        sepalLength,
        sepalWidth,
        petalLength,
        petalWidth,
        species: columns[4],
      }
    })
}

function sampleMean(values) {
  return values.reduce((total, value) => total + value, 0) / values.length
}

function sampleStandardDeviation(values, mean) {
  const sumSquares = values.reduce((total, value) => total + (value - mean) ** 2, 0)
  return Math.sqrt(sumSquares / (values.length - 1))
}

function summarizeIrisSetosa(rows) {
  const sepalLengths = rows
    .filter((row) => row.species === 'Iris-setosa')
    .map((row) => row.sepalLength)

  if (sepalLengths.length <= 1) {
    throw new Error('Not enough Iris-setosa rows to summarize')
  }

  const mean = sampleMean(sepalLengths)

  return {
    source: 'UCI Machine Learning Repository',
    dataset: 'Iris Dataset',
    species: 'Iris-setosa',
    variable: 'sepal length',
    unit: 'cm',
    n: sepalLengths.length,
    sampleMean: mean,
    sampleStandardDeviation: sampleStandardDeviation(sepalLengths, mean),
  }
}

export async function getIrisSetosaSepalLengthSummary() {
  const rows = await fetchIrisDatasetFromUCI()
  return summarizeIrisSetosa(rows)
}

export async function getIrisExampleWithFallback() {
  try {
    const summary = await getIrisSetosaSepalLengthSummary()
    return {
      ...summary,
      dataStatus: 'online',
    }
  } catch {
    return {
      source: 'UCI Machine Learning Repository',
      dataset: 'Iris Dataset',
      species: 'Iris-setosa',
      variable: 'sepal length',
      unit: 'cm',
      n: irisSetosaPublicExample.example.inputs.sampleSize,
      sampleMean: irisSetosaPublicExample.example.inputs.sampleMean,
      sampleStandardDeviation:
        irisSetosaPublicExample.example.inputs.sampleStandardDeviation,
      dataStatus: 'fallback',
    }
  }
}

export function getIrisSetosaExample() {
  return irisSetosaPublicExample.example
}

export function getBrazilPublicDataExample() {
  return brazilPublicPreparedExample.example
}

export function getAvailablePublicDataSources() {
  return publicDataSources
}
