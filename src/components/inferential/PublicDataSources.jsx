import { getAvailablePublicDataSources } from '../../services/publicDataService'

export function PublicDataSources() {
  const sources = getAvailablePublicDataSources()

  return (
    <section className="page-section">
      <div className="section-header">
        <p className="eyebrow">Arquitetura de dados</p>
        <h2>Fontes de dados públicos</h2>
        <p className="section-subtitle">
          A calculadora já usa exemplos públicos curados com fallback local e
          está preparada para futuras integrações seguras.
        </p>
      </div>
      <div className="source-grid">
        {sources.map((source) => (
          <article className="source-card" key={source.id}>
            <span className="soft-badge">{source.status}</span>
            <h3>{source.name}</h3>
            <p>{source.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
