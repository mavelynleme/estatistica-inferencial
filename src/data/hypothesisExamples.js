import { getIbgeIpcaExample } from '../services/publicDataService'

export const hypothesisExamples = [
  {
    id: 'tarefa-8-teste-ab-conversao',
    title: 'Tarefa 8 — Teste A/B de Conversão',
    description:
      'Uma equipe de UX/UI propôs uma nova cor para o botão “Finalizar Compra” em um e-commerce. A taxa de conversão atual é de 3%. A equipe quer testar se a nova cor aumenta a taxa de conversão. O teste obteve p-valor de 0,018, com α = 0,05.',
    sourceLabel: 'Tarefa 8 — Teste de Hipóteses',
    mode: 'given-p-value',
    testType: '',
    category: 'proportion',
    parameter: 'p',
    context: 'taxa de conversão do botão Finalizar Compra',
    hypothesizedValue: 0.03,
    unit: '',
    alternative: 'right',
    alpha: 0.05,
    pValue: 0.018,
    inputs: {},
    expectedConclusion:
      'Como o p-valor é menor ou igual ao nível de significância, há evidência estatística suficiente para rejeitar H₀. Portanto, a nova cor pode ser considerada associada a um aumento estatisticamente significativo na taxa de conversão.',
    resultSummaryConclusion:
      'Há evidência estatística suficiente para afirmar que a nova cor aumenta a taxa de conversão.',
    typeIExplanation:
      'Erro Tipo I neste contexto seria concluir que a nova cor aumenta a taxa de conversão, rejeitando H₀, quando na verdade ela não aumenta. A consequência prática seria a empresa adotar uma alteração visual sem ganho real de conversão, tomando uma decisão de negócio equivocada.',
    typeIIExplanation:
      'Erro Tipo II neste contexto seria não rejeitar H₀, concluindo que não há evidência de aumento, quando na verdade a nova cor realmente aumenta a taxa de conversão. A consequência prática seria a empresa deixar de adotar uma melhoria que poderia gerar mais vendas.',
  },
  {
    id: 'aula-9-plano-dieta',
    title: 'Aula 9 — Plano de Dieta',
    description:
      'Uma nutricionista afirma que seu novo plano de dieta, quando seguido por 30 dias, resulta em uma perda de peso média de 5 kg. Um grupo de 50 voluntários seguiu a dieta, e a perda de peso média observada foi de 4,2 kg. Após análise, o teste resultou em p-valor de 0,03, com α = 0,05.',
    sourceLabel: 'Aula 9 — Teste de Hipóteses',
    mode: 'given-p-value',
    testType: '',
    parameter: 'μ',
    context: 'perda média de peso causada pela dieta',
    hypothesizedValue: 5,
    unit: 'kg',
    alternative: 'two-sided',
    alpha: 0.05,
    pValue: 0.03,
    inputs: {},
    expectedConclusion:
      'Há evidência estatística para rejeitar a afirmação de perda média exatamente igual a 5 kg.',
    typeIExplanation:
      'Erro Tipo I neste contexto seria concluir que a dieta não tem efeito médio de 5 kg, rejeitando H₀, quando na verdade ela realmente tem esse efeito.',
    typeIIExplanation:
      'Erro Tipo II neste contexto seria não rejeitar H₀ e manter a afirmação de perda média de 5 kg, quando na verdade a dieta não produz esse resultado.',
  },
  {
    id: 'tarefa-8-microsservico',
    title: 'Tarefa 8 — Performance de Microsserviço',
    description:
      'O tempo médio de resposta do microsserviço de autenticação é de 150 ms. Após uma otimização de código, a equipe de DevOps quer verificar se o novo tempo médio de resposta é menor que 150 ms. A equipe coletou dados do novo microsserviço e, após a análise, obteve um p-valor de 0,125. O nível de significância alpha definido para o teste é de 0,05.',
    sourceLabel: 'Tarefa 8 — Teste de Hipóteses',
    mode: 'given-p-value',
    testType: '',
    parameter: 'μ',
    context: 'tempo médio de resposta do microsserviço de autenticação',
    hypothesizedValue: 150,
    unit: 'ms',
    alternative: 'left',
    alpha: 0.05,
    pValue: 0.125,
    inputs: {},
    expectedConclusion:
      'Não há evidência estatística suficiente para afirmar que o novo código é mais rápido.',
    typeIExplanation:
      'Erro Tipo I neste contexto seria concluir que o novo código é mais rápido, rejeitando H₀, quando na verdade o tempo médio real não é menor que 150 ms. A consequência prática seria aprovar uma otimização que não trouxe ganho real de performance.',
    typeIIExplanation:
      'Erro Tipo II neste contexto seria não rejeitar H₀, concluindo que não há evidência de melhora, quando na verdade o novo código realmente reduziu o tempo médio para menos de 150 ms. A consequência prática seria deixar de reconhecer ou aproveitar uma melhoria real de performance.',
  },
  getIbgeIpcaExample(),
]
