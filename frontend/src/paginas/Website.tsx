import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { clsx } from 'clsx'
import { api } from '../lib/api'
import { datum } from '../lib/formaat'
import type { Media, Popup } from '../lib/types'
import { Badge, Invoer, Knop, Melding, Modaal, PaginaKop, Paneel, PlusKnop, PotloodKnop, Selecteer, Selectievak, TekstVak, VuilbakKnop } from '../ui'
import PopupTab from './website/PopupTab'
import FotoTab from './website/FotoTab'
import KoopjesTab from './website/KoopjesTab'
import VacaturesTab from './website/VacaturesTab'

/* TS-17 Websitebeheer volgens de platform UX regels: leesmodus eerst,
   bewerken via het potlood met Opslaan en Annuleren. */
export default function Website() {
  const [tab, zetTab] = useState<'fotos' | 'popup' | 'koopjes' | 'vacatures'>('fotos')
  return (
    <>
      <PaginaKop eyebrow="Websitebeheer · CR-01" titel="Website" />
      <div className="mb-5 flex gap-1 border-b border-inkt/10">
        {([['fotos', 'Foto’s'], ['popup', 'Popup'], ['koopjes', 'Koopjes'], ['vacatures', 'Vacatures']] as const).map(([sleutel, tekst]) => (
          <button key={sleutel} onClick={() => zetTab(sleutel)}
            className={clsx('focusring px-4 py-2 text-sm font-semibold',
              tab === sleutel ? 'border-b-2 border-bronze-500 text-inkt' : 'text-inkt-muted hover:text-inkt')}>
            {tekst}
          </button>
        ))}
      </div>
      {tab === 'fotos' && <FotoTab />}
      {tab === 'popup' && <PopupTab />}
      {tab === 'koopjes' && <KoopjesTab />}
      {tab === 'vacatures' && <VacaturesTab />}
    </>
  )
}
