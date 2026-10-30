import type { Plugin } from 'vite'
import type { Library } from '../src/types.ts'

/**
 * Mock backend
 * ------------
 * A Vite plugin that adds a real HTTP endpoint to the dev server:
 *
 *   GET /api/search?q=<query>  ->  Library[] (see src/types.ts)
 *
 * Because these are real HTTP requests, every call shows up in the
 * browser's DevTools Network tab.
 *
 * This backend is FLAWED on purpose:
 *
 *   FLAW 1: Random latency (300ms to 1500ms).
 *           Responses can come back in a different order than they were sent.
 *           The response for "rea" can arrive AFTER the response for "react"
 *           and overwrite the correct results with stale ones.
 *
 *   FLAW 2: It ignores clients that hang up.
 *           If the browser cancels a request, the server keeps working on it
 *           and still tries to send a response nobody is waiting for.
 */

// Made-up sample data. Versions, downloads and stars are not real figures.
// Columns: name, description, category, version, license, weekly downloads,
// stars, last published.
type Row = [string, string, string, string, string, number, number, string]

const ROWS: Row[] = [
  ['react', 'A JavaScript library for building user interfaces', 'UI', '19.3.1', 'MIT', 41_200_000, 236_000, '2026-09-18'],
  ['react-dom', 'React package for working with the DOM', 'UI', '19.3.1', 'MIT', 38_900_000, 236_000, '2026-09-18'],
  ['react-router', 'Declarative routing for React apps', 'Routing', '7.9.4', 'MIT', 14_600_000, 55_400, '2026-10-02'],
  ['react-query', 'Hooks for fetching, caching and updating async data', 'Data fetching', '5.90.2', 'MIT', 9_800_000, 45_100, '2026-10-21'],
  ['react-hook-form', 'Performant, flexible forms with easy validation', 'Forms', '7.66.0', 'MIT', 11_300_000, 43_800, '2026-08-30'],
  ['redux', 'Predictable state container for JavaScript apps', 'State', '5.0.1', 'MIT', 13_700_000, 61_200, '2025-12-04'],
  ['redux-toolkit', 'The official, opinionated toolset for Redux', 'State', '2.9.1', 'MIT', 6_900_000, 11_000, '2026-09-09'],
  ['recoil', 'Experimental state management for React', 'State', '0.7.7', 'MIT', 520_000, 19_600, '2024-03-15'],
  ['relay', 'GraphQL client framework for React', 'Data fetching', '20.1.0', 'MIT', 610_000, 18_600, '2026-07-11'],
  ['remix', 'Full stack web framework built on web standards', 'Framework', '3.0.2', 'MIT', 480_000, 31_900, '2026-10-14'],
  ['reselect', 'Memoized selector library for Redux', 'State', '5.1.1', 'MIT', 10_100_000, 19_000, '2025-06-20'],
  ['rxjs', 'Reactive extensions library for JavaScript', 'Utilities', '7.8.2', 'Apache-2.0', 44_800_000, 31_200, '2025-11-28'],
  ['rollup', 'Next-generation ES module bundler', 'Build tools', '4.52.4', 'MIT', 39_500_000, 25_800, '2026-10-25'],
  ['radix-ui', 'Unstyled, accessible components for React', 'UI', '1.4.3', 'MIT', 2_700_000, 17_500, '2026-09-27'],
  ['ramda', 'A practical functional library for JavaScript', 'Utilities', '0.31.3', 'MIT', 9_400_000, 24_000, '2025-04-02'],
  ['reason', 'Simple, fast and type safe code that leverages JS', 'Language', '3.15.0', 'MIT', 32_000, 10_100, '2024-11-19'],
  ['vue', 'Progressive framework for building user interfaces', 'UI', '3.6.2', 'MIT', 7_300_000, 50_100, '2026-10-08'],
  ['vite', 'Next generation frontend tooling', 'Build tools', '8.3.5', 'MIT', 33_600_000, 76_400, '2026-10-16'],
  ['vitest', 'Next generation testing framework powered by Vite', 'Testing', '4.1.0', 'MIT', 15_200_000, 15_800, '2026-10-10'],
  ['svelte', 'Cybernetically enhanced web apps', 'UI', '5.41.0', 'MIT', 2_400_000, 84_300, '2026-10-22'],
  ['solid-js', 'Simple and performant reactivity for UIs', 'UI', '1.9.9', 'MIT', 1_300_000, 34_200, '2026-08-05'],
  ['angular', 'Platform for building mobile and desktop web apps', 'Framework', '21.0.1', 'MIT', 3_900_000, 98_700, '2026-10-29'],
  ['astro', 'Web framework for content-driven websites', 'Framework', '6.1.0', 'MIT', 1_100_000, 53_200, '2026-10-20'],
  ['next', 'The React framework for the web', 'Framework', '16.2.0', 'MIT', 12_800_000, 135_000, '2026-10-24'],
  ['nuxt', 'The intuitive Vue framework', 'Framework', '4.2.0', 'MIT', 1_000_000, 57_400, '2026-10-12'],
  ['node-fetch', 'A light-weight module that brings Fetch API to Node', 'Networking', '3.3.2', 'MIT', 72_000_000, 8_900, '2023-08-12'],
  ['typescript', 'A language for application-scale JavaScript', 'Language', '7.0.2', 'Apache-2.0', 88_000_000, 107_000, '2026-10-06'],
  ['tailwindcss', 'A utility-first CSS framework', 'Styling', '4.2.1', 'MIT', 22_500_000, 89_100, '2026-10-17'],
  ['webpack', 'Packs modules and assets for the browser', 'Build tools', '5.102.1', 'MIT', 31_400_000, 65_300, '2026-09-30'],
  ['jest', 'Delightful JavaScript testing', 'Testing', '30.2.0', 'MIT', 30_100_000, 45_000, '2026-09-25'],
  ['zod', 'TypeScript-first schema validation', 'Validation', '4.1.12', 'MIT', 41_800_000, 39_600, '2026-10-19'],
  ['zustand', 'Bear necessities for state management in React', 'State', '5.0.8', 'MIT', 8_600_000, 54_100, '2026-08-22'],
  ['lodash', 'Modern JavaScript utility library', 'Utilities', '4.17.21', 'MIT', 62_000_000, 60_500, '2021-02-20'],
  ['lodash.debounce', 'The lodash method _.debounce as a module', 'Utilities', '4.0.8', 'MIT', 21_000_000, 60_500, '2016-08-13'],
  ['date-fns', 'Modern JavaScript date utility library', 'Dates', '4.1.0', 'MIT', 28_400_000, 35_900, '2025-09-17'],
  ['dayjs', 'Fast 2kB alternative to Moment.js', 'Dates', '1.11.18', 'MIT', 24_700_000, 48_100, '2026-08-19'],
  ['axios', 'Promise based HTTP client for the browser and Node', 'Networking', '1.12.2', 'MIT', 63_500_000, 107_000, '2026-10-01'],
]

const LIBRARIES: Library[] = ROWS.map(
  ([name, description, category, version, license, weeklyDownloads, stars, lastPublished]) => ({
    name, description, category, version, license, weeklyDownloads, stars, lastPublished,
  }),
)

// Lower is better: exact name, then name prefix, then name contains, then description.
function rank(lib: Library, q: string) {
  if (lib.name === q) return 0
  if (lib.name.startsWith(q)) return 1
  if (lib.name.includes(q)) return 2
  return 3
}

function search(query: string) {
  const q = query.trim().toLowerCase()
  return LIBRARIES
    .filter((lib) => lib.name.includes(q) || lib.description.toLowerCase().includes(q))
    .sort((a, b) => rank(a, q) - rank(b, q) || b.weeklyDownloads - a.weeklyDownloads)
}

export function mockBackend(): Plugin {
  return {
    name: 'mock-backend',
    configureServer(server) {
      server.middlewares.use('/api/search', (req, res) => {
        const query = new URL(req.url ?? '', 'http://localhost').searchParams.get('q') ?? ''

        // FLAW 1: latency is random, so responses can arrive out of order.
        const latency = 300 + Math.random() * 1200

        // FLAW 2: no check for the client disconnecting. This always runs.
        setTimeout(() => {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(search(query)))
          console.log(`[mock-backend] q="${query}" responded after ${Math.round(latency)}ms`)
        }, latency)

        /* ============================ SOLUTION ============================
         * Replace the setTimeout above with this.
         *
         * We can't fix FLAW 1. Real servers always have unpredictable
         * latency, so the client must handle out-of-order responses itself
         * (see the SOLUTION in src/App.tsx). What we CAN fix is FLAW 2: when
         * the client aborts, the connection closes, so stop the work.

        const timer = setTimeout(() => {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Cache-Control', 'no-store')
          res.end(JSON.stringify(search(query)))
          console.log(`[mock-backend] q="${query}" responded after ${Math.round(latency)}ms`)
        }, latency)

        res.on('close', () => {
          if (res.writableEnded) return // closed normally after responding
          clearTimeout(timer)
          console.log(`[mock-backend] q="${query}" cancelled by client`)
        })

           ================================================================= */
      })
    },
  }
}
