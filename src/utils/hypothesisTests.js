export function parseNumericInput(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : Number.NaN
  }

  const raw = String(value ?? '').trim()
  if (!raw) return Number.NaN

  const isPercent = raw.endsWith('%')
  const normalized = raw.replace('%', '').replace(',', '.')
  const parsed = Number(normalized)

  if (!Number.isFinite(parsed)) return Number.NaN
  return isPercent ? parsed / 100 : parsed
}

export function normalizeAlpha(value) {
  return parseNumericInput(value)
}

export function formatNumber(value, digits = 4) {
  if (!Number.isFinite(value)) return '—'
  return new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: digits,
    minimumFractionDigits: Math.min(2, digits),
  }).format(value)
}

export function clampProbability(value) {
  if (!Number.isFinite(value)) return Number.NaN
  return Math.min(1, Math.max(0, value))
}

function erf(x) {
  const sign = x >= 0 ? 1 : -1
  const absX = Math.abs(x)
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const p = 0.3275911
  const t = 1 / (1 + p * absX)
  const y =
    1 -
    (((((a5 * t + a4) * t + a3) * t + a2) * t + a1) *
      t *
      Math.exp(-absX * absX))
  return sign * y
}

export function normalCDF(x) {
  return 0.5 * (1 + erf(x / Math.SQRT2))
}

function logGamma(z) {
  const coefficients = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012,
    9.984369578019572e-6, 1.5056327351493116e-7,
  ]

  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z)
  }

  let x = 0.9999999999998099
  const shifted = z - 1
  for (let i = 0; i < coefficients.length; i += 1) {
    x += coefficients[i] / (shifted + i + 1)
  }

  const t = shifted + coefficients.length - 0.5
  return (
    0.5 * Math.log(2 * Math.PI) +
    (shifted + 0.5) * Math.log(t) -
    t +
    Math.log(x)
  )
}

function betaContinuedFraction(x, a, b) {
  const maxIterations = 200
  const epsilon = 3e-12
  const fpMin = 1e-30
  const qab = a + b
  const qap = a + 1
  const qam = a - 1
  let c = 1
  let d = 1 - (qab * x) / qap

  if (Math.abs(d) < fpMin) d = fpMin
  d = 1 / d

  let h = d
  for (let m = 1; m <= maxIterations; m += 1) {
    const m2 = 2 * m
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2))
    d = 1 + aa * d
    if (Math.abs(d) < fpMin) d = fpMin
    c = 1 + aa / c
    if (Math.abs(c) < fpMin) c = fpMin
    d = 1 / d
    h *= d * c

    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2))
    d = 1 + aa * d
    if (Math.abs(d) < fpMin) d = fpMin
    c = 1 + aa / c
    if (Math.abs(c) < fpMin) c = fpMin
    d = 1 / d
    const delta = d * c
    h *= delta

    if (Math.abs(delta - 1) < epsilon) break
  }

  return h
}

function regularizedIncompleteBeta(x, a, b) {
  if (x <= 0) return 0
  if (x >= 1) return 1

  const betaFactor = Math.exp(
    logGamma(a + b) -
      logGamma(a) -
      logGamma(b) +
      a * Math.log(x) +
      b * Math.log(1 - x),
  )

  if (x < (a + 1) / (a + b + 2)) {
    return (betaFactor * betaContinuedFraction(x, a, b)) / a
  }

  return 1 - (betaFactor * betaContinuedFraction(1 - x, b, a)) / b
}

export function studentTCDF(t, df) {
  if (!Number.isFinite(t) || !Number.isFinite(df) || df <= 0) return Number.NaN
  const x = df / (df + t * t)
  const ib = regularizedIncompleteBeta(x, df / 2, 0.5)
  return t >= 0 ? 1 - 0.5 * ib : 0.5 * ib
}

function pValueFromStatistic(statistic, alternative, cdf) {
  if (alternative === 'right') return clampProbability(1 - cdf(statistic))
  if (alternative === 'left') return clampProbability(cdf(statistic))
  return clampProbability(2 * (1 - cdf(Math.abs(statistic))))
}

export function calculateMeanZTest({ hypothesizedValue, sampleMean, populationStandardDeviation, sampleSize, alpha, alternative }) {
  const z =
    (sampleMean - hypothesizedValue) /
    (populationStandardDeviation / Math.sqrt(sampleSize))
  return {
    statisticLabel: 'Z',
    statistic: z,
    pValue: pValueFromStatistic(z, alternative, normalCDF),
    alpha,
  }
}

export function calculateMeanTTest({ hypothesizedValue, sampleMean, sampleStandardDeviation, sampleSize, alpha, alternative }) {
  const df = sampleSize - 1
  const t =
    (sampleMean - hypothesizedValue) /
    (sampleStandardDeviation / Math.sqrt(sampleSize))
  return {
    statisticLabel: 'T',
    statistic: t,
    degreesOfFreedom: df,
    pValue: pValueFromStatistic(t, alternative, (value) => studentTCDF(value, df)),
    alpha,
  }
}

export function calculateProportionZTest({ hypothesizedValue, successes, sampleSize, alpha, alternative }) {
  const sampleProportion = successes / sampleSize
  const z =
    (sampleProportion - hypothesizedValue) /
    Math.sqrt((hypothesizedValue * (1 - hypothesizedValue)) / sampleSize)
  return {
    statisticLabel: 'Z',
    statistic: z,
    sampleProportion,
    pValue: pValueFromStatistic(z, alternative, normalCDF),
    alpha,
  }
}

export function calculateGivenPValueDecision({ pValue, alpha }) {
  return {
    statisticLabel: 'Não se aplica',
    statistic: null,
    pValue: clampProbability(pValue),
    alpha,
  }
}

export function buildHypotheses({ parameter, hypothesizedValue, unit, alternative }) {
  const value = `${formatNumber(hypothesizedValue, 6)}${unit ? ` ${unit}` : ''}`

  if (alternative === 'left') {
    return {
      nullHypothesis: `H₀: ${parameter} ≥ ${value}`,
      alternativeHypothesis: `Hₐ: ${parameter} < ${value}`,
    }
  }

  if (alternative === 'right') {
    return {
      nullHypothesis: `H₀: ${parameter} ≤ ${value}`,
      alternativeHypothesis: `Hₐ: ${parameter} > ${value}`,
    }
  }

  return {
    nullHypothesis: `H₀: ${parameter} = ${value}`,
    alternativeHypothesis: `Hₐ: ${parameter} ≠ ${value}`,
  }
}

export function buildDecision(pValue, alpha) {
  const rejectNull = pValue <= alpha
  return {
    rejectNull,
    label: rejectNull ? 'Rejeitar H₀' : 'Não rejeitar H₀',
    rule:
      'Se p-valor ≤ α, rejeita-se H₀. Se p-valor > α, não se rejeita H₀.',
    explanation: rejectNull
      ? 'Como o p-valor é menor ou igual ao nível de significância, há evidência estatística suficiente para rejeitar H₀.'
      : 'Como o p-valor é maior que o nível de significância, não há evidência estatística suficiente para rejeitar H₀.',
  }
}

export function buildInterpretation({ pValue, alpha, expectedConclusion }) {
  return expectedConclusion || buildDecision(pValue, alpha).explanation
}
