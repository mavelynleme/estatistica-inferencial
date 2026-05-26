export const ibgeIpcaFallback = {
  id: 'ibge-ipca-monthly',
  source: 'IBGE/SIDRA',
  dataset: 'IPCA - Tabela 1737',
  variable: 'Variacao mensal do IPCA',
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
    id: 'ibge-ipca-monthly',
    label: 'IPCA - Variacao mensal',
    shortLabel: 'IPCA',
    description: 'Indice oficial de inflacao ao consumidor amplo.',
    sourceName: 'IBGE/SIDRA',
    sourceUrl: 'https://sidra.ibge.gov.br/tabela/1737',
    sidraTable: '1737',
    sidraVariable: '63',
    variableLabel: 'Variacao mensal do IPCA',
    apiUrlTemplate:
      'https://apisidra.ibge.gov.br/values/t/{table}/n1/all/v/{variable}/p/last%20{periodCount}/d/v{variable}%202',
    officialPageUrl:
      'https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9256-indice-nacional-de-precos-ao-consumidor-amplo.html',
    unit: '%',
    defaultHypothesizedValue: 0.4,
    defaultAlternative: 'right',
    defaultAlpha: 0.05,
    fallbackGeneratedAt: '2026-05-20',
    fallbackValues: ibgeIpcaFallback.values,
    context: 'variacao media mensal do IPCA',
    question:
      'Ha evidencia de que a variacao media mensal do IPCA esta acima de 0,40%?',
    nullHypothesisText: 'H0: mu <= 0,40%',
    alternativeHypothesisText: 'H1: mu > 0,40%',
    status: 'available',
  },
  {
    id: 'ibge-inpc-monthly',
    label: 'INPC - Variacao mensal',
    shortLabel: 'INPC',
    description: 'Indice de precos voltado a familias de menor renda.',
    sourceName: 'IBGE/SIDRA',
    sourceUrl: 'https://sidra.ibge.gov.br/tabela/1736',
    sidraTable: '1736',
    sidraVariable: '44',
    variableLabel: 'Variacao mensal do INPC',
    apiUrlTemplate:
      'https://apisidra.ibge.gov.br/values/t/{table}/n1/all/v/{variable}/p/last%20{periodCount}/d/v{variable}%202',
    officialPageUrl:
      'https://www.ibge.gov.br/estatisticas/economicas/precos-e-custos/9258-indice-nacional-de-precos-ao-consumidor.html',
    unit: '%',
    defaultHypothesizedValue: 0.4,
    defaultAlternative: 'right',
    defaultAlpha: 0.05,
    fallbackGeneratedAt: '2026-05-20',
    fallbackValues: [
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
    context: 'variacao media mensal do INPC',
    question:
      'Ha evidencia de que a variacao media mensal do INPC esta acima de 0,40%?',
    nullHypothesisText: 'H0: mu <= 0,40%',
    alternativeHypothesisText: 'H1: mu > 0,40%',
    status: 'available',
  },
  {
    id: 'ibge-pnad-unemployment',
    label: 'PNAD Continua - Taxa de desocupacao',
    shortLabel: 'PNAD Continua',
    description: 'Indicador social de mercado de trabalho.',
    sourceName: 'IBGE',
    sourceUrl:
      'https://www.ibge.gov.br/estatisticas/sociais/trabalho/9171-pesquisa-nacional-por-amostra-de-domicilios-continua-mensal.html',
    sidraTable: '',
    sidraVariable: '',
    variableLabel: 'Taxa de desocupacao',
    apiUrlTemplate: '',
    officialPageUrl:
      'https://www.ibge.gov.br/estatisticas/sociais/trabalho/9171-pesquisa-nacional-por-amostra-de-domicilios-continua-mensal.html',
    unit: '%',
    defaultHypothesizedValue: null,
    defaultAlternative: 'right',
    defaultAlpha: 0.05,
    fallbackGeneratedAt: null,
    fallbackValues: [],
    context: 'taxa de desocupacao da PNAD Continua',
    question: '',
    nullHypothesisText: '',
    alternativeHypothesisText: '',
    status: 'coming-soon',
    badge: 'Em breve',
  },
]

export const ibgeIpcaPublicExample = {
  dataset: 'IPCA - Tabela 1737',
  source: 'IBGE/SIDRA',
  variable: 'Variacao mensal do IPCA',
  example: {
    id: 'ibge-ipca',
    title: 'Dados publicos reais - IBGE IPCA',
    sourceLabel: 'IBGE/SIDRA - Tabela 1737',
    mode: 'calculated',
    testType: 'mean-t',
    parameter: 'mu',
    context: 'variacao media mensal do IPCA',
    description:
      'Usa dados publicos do IBGE sobre a variacao mensal do IPCA para realizar um teste t de uma amostra.',
    hypothesizedValue: 0.4,
    unit: '%',
    alternative: 'right',
    alpha: 0.05,
    pValue: null,
    inputs: {},
    publicDataSummary: null,
    dynamicConclusion: 'ibge-ipca',
    question:
      'Ha evidencia de que a variacao media mensal do IPCA esta acima de 0,40%?',
    typeIExplanation:
      'Erro Tipo I neste contexto seria concluir que a variacao media mensal do IPCA esta acima de 0,40%, rejeitando H0, quando na verdade ela nao esta acima desse valor.',
    typeIIExplanation:
      'Erro Tipo II neste contexto seria nao rejeitar H0 e concluir que nao ha evidencia de IPCA medio mensal acima de 0,40%, quando na verdade essa media esta acima do valor de referencia.',
  },
}

export const publicDataSources = [
  {
    id: 'ibge',
    name: 'IBGE/SIDRA',
    description:
      'Fonte oficial brasileira para dados agregados, series temporais, periodos, variaveis e metadados.',
    status: 'Disponivel com fallback local',
  },
  {
    id: 'brasilapi',
    name: 'BrasilAPI',
    description:
      'API publica brasileira que centraliza endpoints modernos de dados nacionais.',
    status: 'Preparado para integracao futura',
  },
]
