export const irisSetosaPublicExample = {
  dataset: 'Iris Dataset',
  source: 'UCI Machine Learning Repository',
  variable: 'sepal length of Iris setosa',
  example: {
    id: 'iris-dataset',
    title: 'Dados reais — Iris Dataset',
    sourceLabel: 'UCI Machine Learning Repository — Iris Dataset',
    mode: 'calculated',
    testType: 'mean-t',
    parameter: 'μ',
    context: 'comprimento médio da sépala da espécie Iris setosa',
    description:
      'Exemplo com dados públicos reais usando a espécie Iris setosa. O teste verifica se a média do comprimento da sépala é igual a 5,0 cm.',
    hypothesizedValue: 5.0,
    unit: 'cm',
    alternative: 'two-sided',
    alpha: 0.05,
    pValue: null,
    inputs: {
      sampleMean: 5.006,
      sampleStandardDeviation: 0.3525,
      sampleSize: 50,
    },
    expectedConclusion:
      'Não há evidência estatística suficiente para afirmar que a média difere de 5,0 cm.',
    typeIExplanation:
      'Erro Tipo I neste contexto seria concluir que a média do comprimento da sépala difere de 5,0 cm, quando na verdade ela é igual a 5,0 cm.',
    typeIIExplanation:
      'Erro Tipo II neste contexto seria não rejeitar H₀ e concluir que não há diferença significativa, quando na verdade a média real difere de 5,0 cm.',
  },
}

export const brazilPublicPreparedExample = {
  dataset: 'Exemplo preparado com contexto público brasileiro',
  source: 'IBGE — arquitetura preparada com fallback local',
  variable: 'indicador médio agregado em estudo didático',
  example: {
    id: 'brasil-dados-publicos-preparado',
    title: 'Dados públicos brasileiros — exemplo preparado',
    sourceLabel: 'IBGE — exemplo local preparado',
    mode: 'calculated',
    testType: 'mean-z',
    parameter: 'μ',
    context:
      'indicador médio agregado de um conjunto público brasileiro preparado para demonstração',
    description:
      'Exemplo local e offline inspirado em dados públicos agregados brasileiros. Ele demonstra a arquitetura futura para fontes como IBGE sem depender de API ao vivo.',
    hypothesizedValue: 50,
    unit: 'pontos',
    alternative: 'right',
    alpha: 0.05,
    pValue: null,
    inputs: {
      sampleMean: 52.4,
      populationStandardDeviation: 8.6,
      sampleSize: 64,
    },
    expectedConclusion:
      'Como o p-valor é menor ou igual ao nível de significância, há evidência estatística suficiente para rejeitar H₀. Portanto, neste exemplo preparado, a média observada é estatisticamente maior que 50 pontos.',
    typeIExplanation:
      'Erro Tipo I neste contexto seria concluir que o indicador médio brasileiro é maior que 50 pontos, quando na verdade ele não é maior que esse valor.',
    typeIIExplanation:
      'Erro Tipo II neste contexto seria não rejeitar H₀ e deixar de reconhecer que o indicador médio é maior que 50 pontos quando essa diferença realmente existe.',
  },
}

export const publicDataSources = [
  {
    id: 'uci',
    name: 'UCI Machine Learning Repository',
    description:
      'Base pública clássica usada para exemplos estatísticos e machine learning.',
    status: 'Disponível com fallback local',
  },
  {
    id: 'ibge',
    name: 'IBGE',
    description:
      'Fonte oficial brasileira para dados agregados, censos, localidades, períodos, variáveis e metadados.',
    status: 'Preparado para integração futura',
  },
  {
    id: 'brasilapi',
    name: 'BrasilAPI',
    description:
      'API pública brasileira que centraliza endpoints modernos de dados nacionais.',
    status: 'Preparado para integração futura',
  },
]
