export const ibgeIpcaFallback = {
  id: 'ibge-ipca',
  source: 'IBGE/SIDRA',
  dataset: 'IPCA — Tabela 1737',
  variable: 'Variação mensal do IPCA',
  unit: '%',
  generatedAt: '2026-05-20',
  values: [
    { period: '2025-05', value: 0.26 },
    { period: '2025-06', value: 0.24 },
    { period: '2025-07', value: 0.26 },
    { period: '2025-08', value: -0.11 },
    { period: '2025-09', value: 0.48 },
    { period: '2025-10', value: 0.09 },
    { period: '2025-11', value: 0.18 },
    { period: '2025-12', value: 0.33 },
    { period: '2026-01', value: 0.33 },
    { period: '2026-02', value: 0.7 },
    { period: '2026-03', value: 0.88 },
    { period: '2026-04', value: 0.67 },
  ],
}

export const ibgePublicDatasets = [
  {
    id: 'ibge-ipca',
    shortName: 'IPCA',
    title: 'IPCA - inflação oficial',
    source: ibgeIpcaFallback.source,
    dataset: ibgeIpcaFallback.dataset,
    table: '1737',
    variableCode: '63',
    variable: ibgeIpcaFallback.variable,
    unit: ibgeIpcaFallback.unit,
    context: 'variação média mensal do IPCA',
    hypothesizedValue: 0.4,
    alternative: 'right',
    question:
      'Há evidência de que a variação média mensal do IPCA está acima de 0,40%?',
    nullHypothesisText: 'H₀: μ ≤ 0,40%',
    alternativeHypothesisText: 'Hₐ: μ > 0,40%',
    fallback: ibgeIpcaFallback.values,
  },
  {
    id: 'ibge-inpc',
    shortName: 'INPC',
    title: 'INPC - famílias de menor renda',
    source: 'IBGE/SIDRA',
    dataset: 'INPC — Tabela 1736',
    table: '1736',
    variableCode: '44',
    variable: 'Variação mensal do INPC',
    unit: '%',
    context: 'variação média mensal do INPC',
    hypothesizedValue: 0.4,
    alternative: 'right',
    question:
      'Há evidência de que a variação média mensal do INPC está acima de 0,40%?',
    nullHypothesisText: 'H₀: μ ≤ 0,40%',
    alternativeHypothesisText: 'Hₐ: μ > 0,40%',
    fallback: [
      { period: '2025-05', value: 0.35 },
      { period: '2025-06', value: 0.28 },
      { period: '2025-07', value: 0.21 },
      { period: '2025-08', value: -0.21 },
      { period: '2025-09', value: 0.52 },
      { period: '2025-10', value: 0.03 },
      { period: '2025-11', value: 0.16 },
      { period: '2025-12', value: 0.48 },
      { period: '2026-01', value: 0.59 },
      { period: '2026-02', value: 0.61 },
      { period: '2026-03', value: 0.71 },
      { period: '2026-04', value: 0.43 },
    ],
  },
]

export const ibgeIpcaPublicExample = {
  dataset: 'IPCA — Tabela 1737',
  source: 'IBGE/SIDRA',
  variable: 'Variação mensal do IPCA',
  example: {
    id: 'ibge-ipca',
    title: 'Dados públicos reais — IBGE IPCA',
    sourceLabel: 'IBGE/SIDRA — Tabela 1737',
    mode: 'calculated',
    testType: 'mean-t',
    parameter: 'μ',
    context: 'variação média mensal do IPCA',
    description:
      'Usa dados públicos do IBGE sobre a variação mensal do IPCA para realizar um teste t de uma amostra.',
    hypothesizedValue: 0.4,
    unit: '%',
    alternative: 'right',
    alpha: 0.05,
    pValue: null,
    inputs: {},
    publicDataSummary: null,
    dynamicConclusion: 'ibge-ipca',
    question:
      'Há evidência de que a variação média mensal do IPCA está acima de 0,40%?',
    typeIExplanation:
      'Erro Tipo I neste contexto seria concluir que a variação média mensal do IPCA está acima de 0,40%, rejeitando H₀, quando na verdade ela não está acima desse valor.',
    typeIIExplanation:
      'Erro Tipo II neste contexto seria não rejeitar H₀ e concluir que não há evidência de IPCA médio mensal acima de 0,40%, quando na verdade essa média está acima do valor de referência.',
  },
}

export const publicDataSources = [
  {
    id: 'ibge',
    name: 'IBGE/SIDRA',
    description:
      'Fonte oficial brasileira para dados agregados, séries temporais, períodos, variáveis e metadados.',
    status: 'Disponível com fallback local',
  },
  {
    id: 'brasilapi',
    name: 'BrasilAPI',
    description:
      'API pública brasileira que centraliza endpoints modernos de dados nacionais.',
    status: 'Preparado para integração futura',
  },
]
