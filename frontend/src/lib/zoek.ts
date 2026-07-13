import { useEffect, useState } from 'react'

/* Platform zoekregels (README): realtime met een debounce van 250 ms,
   minimaal 2 tekens voor tekst en 1 teken voor pure nummers of codes,
   genormaliseerde spaties en nooit knipperende of verouderde resultaten. */
export function useZoekterm(minimum = 2) {
  const [invoer, zetInvoer] = useState('')
  const [term, zetTerm] = useState('')
  useEffect(() => {
    const timer = setTimeout(() => {
      const genormaliseerd = invoer.trim().replace(/\s+/g, ' ')
      const isCode = /^[0-9./-]+$/.test(genormaliseerd)
      zetTerm(genormaliseerd.length >= (isCode ? 1 : minimum) ? genormaliseerd : '')
    }, 250)
    return () => clearTimeout(timer)
  }, [invoer, minimum])
  return { invoer, zetInvoer, term }
}
