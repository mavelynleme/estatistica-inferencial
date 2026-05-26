export const ibgeIpcaFallback = {
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
