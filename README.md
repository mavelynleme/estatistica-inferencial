# Calculadora Estatística Inferencial

Calculadora acadêmica de **Estatística Inferencial** focada em **Teste de Hipóteses com cálculo e interpretação do p-valor**.

O projeto foi desenvolvido para complementar a Calculadora de Estatística Descritiva e atender à proposta da P2, oferecendo uma interface simples para:

- inserir amostras manualmente;
- carregar dados públicos do IBGE/SIDRA;
- usar exercícios já cadastrados da Tarefa 8 e Aula 9;
- calcular estatística de teste, p-valor, decisão e conclusão;
- visualizar detalhes técnicos quando necessário.

---

## Visão geral

A calculadora trabalha com três formas principais de entrada de dados:

1. **Manual**  
   Para inserir uma amostra própria.

2. **IBGE**  
   Para carregar dados públicos reais do IBGE/SIDRA, selecionar períodos e aplicar os dados em um teste t.

3. **Dados alocados**  
   Para usar exercícios já cadastrados, como Tarefa 8 e Aula 9, principalmente quando o exercício já informa o p-valor.

---

## Regra principal do teste de hipóteses

A decisão da calculadora é baseada na comparação entre o **p-valor** e o nível de significância **α**.

```text
Se p-valor ≤ α:
rejeita-se H₀.

Se p-valor > α:
não se rejeita H₀.
```

Exemplo:

```text
p-valor = 0,018
α = 0,05

Como 0,018 ≤ 0,05, rejeita-se H₀.
```

---

## Como executar localmente

Na pasta do projeto, execute:

```bash
npm install
npm run dev
```

Depois acesse o endereço exibido no terminal, normalmente:

```text
http://localhost:5173/
```

Para validar a versão de produção:

```bash
npm run build
```

Para testar a versão gerada em produção:

```bash
npm run preview
```

---

## Como usar a calculadora

Ao acessar a página de Estatística Inferencial, a calculadora apresenta o fluxo principal:

```text
1. Entrada de Dados
2. Dados do teste
3. Resultado
4. Detalhes técnicos / Conformidade com a P2
```

---

# 1. Modo Manual

Use o modo **Manual** quando quiser inserir sua própria amostra.

Uma amostra é uma lista de valores numéricos coletados.

Exemplo de amostra fictícia:

```text
145; 147; 149; 146; 148; 144; 150; 147
```

Esse exemplo pode representar tempos de resposta de um microsserviço em milissegundos.

## Passo a passo

1. Selecione **Manual**.
2. Cole os valores no campo de amostra.
3. Clique em **Calcular resumo**.
4. Confira:
   - `n`;
   - média;
   - desvio padrão.
5. Clique em **Usar no teste T**.
6. Configure o teste.
7. Clique em **Calcular p-valor**.

## Exemplo para testar

Use a amostra:

```text
145; 147; 149; 146; 148; 144; 150; 147
```

Configure:

```text
Tipo de teste: Teste T para média
Valor de referência: 150
Hipótese alternativa: unilateral à esquerda
α: 0,05
```

Resultado esperado aproximado:

```text
n = 8
média = 147
desvio padrão ≈ 2
t ≈ -4,2426
p-valor ≈ 0,0019
decisão: Rejeitar H₀
```

Interpretação:

```text
Há evidência estatística suficiente para afirmar que o tempo médio de resposta é menor que 150 ms.
```

---

# 2. Modo IBGE

Use o modo **IBGE** para trabalhar com dados públicos reais do IBGE/SIDRA.

A calculadora permite selecionar uma série pública, carregar os dados, escolher os períodos desejados e aplicar esses valores em um teste t.

## Fluxo do IBGE

```text
Selecionar IBGE
↓
Escolher indicador
↓
Escolher período
↓
Carregar dados do IBGE
↓
Selecionar períodos na tabela
↓
Aplicar ao teste
↓
Calcular p-valor
```

## Indicadores disponíveis

Dependendo da versão atual do projeto, a calculadora pode apresentar indicadores como:

- **IPCA — Variação mensal**
- **INPC — Variação mensal**

Esses dados são usados como amostra para calcular:

- `n`;
- média amostral;
- desvio padrão amostral;
- estatística t;
- p-valor;
- decisão estatística.

## Como usar

1. Selecione **IBGE**.
2. Escolha o indicador, por exemplo:
   ```text
   IPCA — Variação mensal
   ```
3. Escolha o período:
   ```text
   Últimos 12 períodos
   ```
4. Clique em:
   ```text
   Carregar dados do IBGE
   ```
5. A calculadora mostrará uma tabela com os períodos carregados.
6. Marque ou desmarque os períodos que deseja usar.
7. Clique em:
   ```text
   Aplicar ao teste
   ```
8. A seção **Dados do teste** será preenchida automaticamente.
9. Clique em:
   ```text
   Calcular p-valor
   ```

## Exemplo de pergunta estatística

Para IPCA, a calculadora pode testar:

```text
Há evidência de que a variação média mensal do IPCA está acima de 0,40%?
```

Hipóteses:

```text
H₀: μ ≤ 0,40%
Hₐ: μ > 0,40%
```

Se o p-valor for maior que `0,05`, a decisão será:

```text
Não rejeitar H₀.
```

Se o p-valor for menor ou igual a `0,05`, a decisão será:

```text
Rejeitar H₀.
```

---

## Como comprovar que os dados do IBGE são online

Para demonstrar que a calculadora está buscando dados online:

1. Abra o navegador.
2. Pressione:
   ```text
   F12
   ```
3. Vá até a aba:
   ```text
   Network
   ```
4. Clique no filtro:
   ```text
   Fetch/XHR
   ```
5. Na calculadora, clique em:
   ```text
   Carregar dados do IBGE
   ```
6. Deve aparecer uma requisição para:
   ```text
   apisidra.ibge.gov.br
   ```

Se essa requisição aparecer no Network, significa que os dados foram buscados online.

Quando a busca online falhar, a calculadora pode usar dados pré-carregados como fallback. Nesse caso, a interface deve indicar algo como:

```text
Fallback local
```

ou:

```text
Usando dados públicos pré-carregados
```

---

# 3. Dados alocados

Use **Dados alocados** para resolver exercícios já cadastrados no sistema.

Essa opção agrupa exemplos prontos, como:

- **Tarefa 8 — Teste A/B de Conversão**
- **Tarefa 8 — Performance de Microsserviço**
- **Aula 9 — Plano de Dieta**

Esses exercícios normalmente já informam o p-valor, então a calculadora apenas aplica a regra de decisão.

---

## Tarefa 8 — Teste A/B de Conversão

Contexto:

```text
Uma equipe de UX/UI propôs uma nova cor para o botão “Finalizar Compra”.
A taxa de conversão atual é 3%.
A equipe quer testar se a nova cor aumenta a taxa de conversão.
```

Hipóteses:

```text
H₀: p ≤ 0,03
Hₐ: p > 0,03
```

Dados:

```text
p-valor = 0,018
α = 0,05
```

Decisão:

```text
Como 0,018 ≤ 0,05, rejeita-se H₀.
```

Conclusão:

```text
Há evidência estatística suficiente para afirmar que a nova cor aumenta a taxa de conversão.
```

---

## Tarefa 8 — Performance de Microsserviço

Contexto:

```text
O tempo médio de resposta do microsserviço de autenticação é de 150 ms.
Após uma otimização, a equipe quer verificar se o novo tempo médio é menor que 150 ms.
```

Hipóteses:

```text
H₀: μ ≥ 150 ms
Hₐ: μ < 150 ms
```

Dados:

```text
p-valor = 0,125
α = 0,05
```

Decisão:

```text
Como 0,125 > 0,05, não se rejeita H₀.
```

Conclusão:

```text
Não há evidência estatística suficiente para afirmar que o novo código é mais rápido.
```

---

## Aula 9 — Plano de Dieta

Contexto:

```text
Uma nutricionista afirma que uma dieta resulta em perda média de 5 kg.
O teste resultou em p-valor de 0,03, com α = 0,05.
```

Hipóteses:

```text
H₀: μ = 5 kg
Hₐ: μ ≠ 5 kg
```

Dados:

```text
p-valor = 0,03
α = 0,05
```

Decisão:

```text
Como 0,03 ≤ 0,05, rejeita-se H₀.
```

Conclusão:

```text
A afirmação de perda média exatamente igual a 5 kg deve ser rejeitada com base nos dados.
```

---

# Entendendo o Resultado

Após calcular, a calculadora mostra:

## p-valor

O p-valor indica a força da evidência contra a hipótese nula.

## α

É o nível de significância escolhido. Normalmente usa-se:

```text
α = 0,05
```

Isso significa aceitar até 5% de risco de erro tipo I.

## Decisão

A decisão pode ser:

```text
Rejeitar H₀
```

ou:

```text
Não rejeitar H₀
```

## Conclusão

A conclusão traduz a decisão estatística para uma linguagem mais simples.

---

# Detalhes técnicos

A área de detalhes técnicos pode mostrar:

- hipóteses;
- dados utilizados;
- estatística t ou z;
- graus de liberdade;
- fórmula;
- regra de decisão;
- erro tipo I e tipo II;
- fonte dos dados.

Essa área pode ser mantida fechada durante a apresentação e aberta apenas se o professor solicitar mais detalhes.

---

# Erro Tipo I e Erro Tipo II

## Erro Tipo I

Ocorre quando rejeitamos H₀, mas H₀ era verdadeira.

Exemplo:

```text
Concluir que a nova cor aumenta a conversão quando, na verdade, ela não aumenta.
```

## Erro Tipo II

Ocorre quando não rejeitamos H₀, mas H₀ era falsa.

Exemplo:

```text
Concluir que não há evidência de melhora quando, na verdade, a nova cor realmente aumentava a conversão.
```

---

# Sugestão de apresentação

Uma boa ordem para demonstrar a calculadora é:

1. **Dados alocados**
   - mostrar Tarefa 8 — Teste A/B;
   - mostrar Tarefa 8 — Microsserviço.

2. **IBGE**
   - carregar dados públicos;
   - selecionar períodos;
   - aplicar no teste;
   - calcular p-valor.

3. **Manual**
   - colar uma amostra fictícia;
   - calcular resumo;
   - usar no teste T;
   - calcular p-valor.

---

# Deploy

Para publicar o projeto, o comando de build é:

```bash
npm run build
```

A pasta gerada será:

```text
dist
```

## Vercel

Configuração recomendada:

```text
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

## Render

Configuração recomendada:

```text
Static Site
Build Command: npm install && npm run build
Publish Directory: dist
```

---

# Tecnologias utilizadas

- React
- Vite
- JavaScript
- CSS
- IBGE/SIDRA API
- Teste de Hipóteses
- Teste t
- p-valor

---

# Créditos

```text
© 2026 Calculadora Estatística Grupo Crises. Todos os direitos reservados.
```
