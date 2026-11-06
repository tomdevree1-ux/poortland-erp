import { supabase } from '../../lib/supabase'
import type { BtwTarief } from '../../lib/types'

/* Gedeelde bouwstenen van de facturatie, opgesplitst uit Facturatie.tsx
   (audit 2026-10-05) zodat het overzicht en het detail ze allebei kunnen
   gebruiken zonder kringverwijzing. */

export const soortTekst = { eind: 'Eindfactuur', voorschot: 'Voorschot' } as const
export const bronTekst = { offerte: 'Offerte', meerwerk: 'Meerwerk', handmatig: 'Handmatig' } as const
export async function downloadExport(id: string) {
  const { data } = await supabase.auth.getSession()
  const antwoord = await fetch(`/api/v1/facturatie/voorstellen/${id}/export`, {
    headers: { Authorization: `Bearer ${data.session?.access_token}` }
  })
  if (!antwoord.ok) return
  const blob = await antwoord.blob()
  const naam = antwoord.headers.get('Content-Disposition')?.match(/filename="?([^";]+)/)?.[1] ?? 'factuurexport.csv'
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = naam; a.click()
  URL.revokeObjectURL(url)
}
export const legeRegel = { omschrijving: '', aantal: '1', eenheid: '', eenheidsprijs: '0', btw: 'p21' as BtwTarief }
