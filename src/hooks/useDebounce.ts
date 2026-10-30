/* ============================== SOLUTION ==============================
 * useDebounce
 * -----------
 * Returns a copy of `value` that only changes after `value` has stopped
 * changing for `delay` milliseconds.
 *
 * Typing "react" quickly produces the values:
 *   "r" -> "re" -> "rea" -> "reac" -> "react"
 * A debounced value skips the in-between ones and only gives you "react".
 *
 * How it works:
 * 1. Keep the "settled" value in state.
 * 2. Whenever `value` changes, start a timer that updates the state after
 *    `delay` ms.
 * 3. If `value` changes again before the timer fires, React runs the cleanup
 *    function first, which cancels the old timer. Only the last value
 *    survives long enough to be committed.

import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)

    // Runs before the next effect (and on unmount). Cancels the pending update.
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

   ===================================================================== */
