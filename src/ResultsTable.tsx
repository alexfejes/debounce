import type { Library } from './types'

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const dateFormat = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric' })

export function ResultsTable({ results }: { results: Library[] }) {
  if (results.length === 0) {
    return <p className="muted empty">No packages match your search.</p>
  }

  return (
    <div className="table-wrap">
      <table className="results">
        <thead>
          <tr>
            <th>Package</th>
            <th>Category</th>
            <th>Version</th>
            <th>License</th>
            <th className="num">Weekly downloads</th>
            <th className="num">Stars</th>
            <th>Last published</th>
          </tr>
        </thead>
        <tbody>
          {results.map((lib) => (
            <tr key={lib.name}>
              <td>
                <div className="pkg-name">{lib.name}</div>
                <div className="pkg-desc">{lib.description}</div>
              </td>
              <td>
                <span className="chip">{lib.category}</span>
              </td>
              <td className="mono">v{lib.version}</td>
              <td>{lib.license}</td>
              <td className="num">{compact.format(lib.weeklyDownloads)}</td>
              <td className="num">★ {compact.format(lib.stars)}</td>
              <td className="nowrap">{dateFormat.format(new Date(lib.lastPublished))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
