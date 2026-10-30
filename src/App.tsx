import { useEffect, useState } from 'react'
// import { useDebounce } from './hooks/useDebounce'
import { ResultsTable } from './ResultsTable'
import type { Library } from './types'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Library[]>([])

  // FLAWED: this effect runs on EVERY keystroke, so typing "react" sends
  // 5 requests: "r", "re", "rea", "reac", "react".
  // It also trusts whichever response comes back LAST. The mock backend has
  // random latency, so that might be the response for an older query.
  // An empty query returns every package, so the table is filled on load.
  useEffect(() => {
    fetch(`/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((items: Library[]) => setResults(items))
  }, [query])

  /* ============================== SOLUTION ==============================
   * 1. Uncomment the useDebounce import at the top of this file.
   * 2. Uncomment src/hooks/useDebounce.ts.
   * 3. Replace the flawed effect above with the code below.
   *
   * useDebounce only lets `query` through once the user stops typing for
   * 500ms, so typing "react" sends 1 request instead of 5.

  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((items: Library[]) => setResults(items))
  }, [debouncedQuery])

     ===================================================================== */

  return (
    <main className="app">
      <h1>Library search</h1>

      <input
        className="search"
        type="search"
        placeholder='Try typing "react"'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ResultsTable results={results} />
    </main>
  )
}

export default App
