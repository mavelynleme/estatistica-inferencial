const complianceItems = [
  'Opção 6: Teste de Hipóteses com cálculo do P-Valor',
  'Itens da Tarefa 8 incluídos',
  'Exemplo com dados públicos reais do IBGE',
  'Interface integrada com Estatística Descritiva',
  'Modo p-valor informado e modo p-valor calculado',
]

export function P2Compliance() {
  return (
    <section className="flow-section compliance-section">
      <details>
        <summary>Conformidade com a P2</summary>
        <ul className="compliance-list">
          {complianceItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </section>
  )
}
