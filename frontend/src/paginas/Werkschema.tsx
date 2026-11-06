import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { datum, weergaveNaam } from '../lib/formaat'
import type { Opvolgtaak, PlanningsItemRij } from '../lib/types'
import { Badge, Knop, LegeStaat, PaginaKop, Paneel, Th, Td } from '../ui'
import { faseTekst } from './Planning'

/* FR-005: de Excel terugbellijst verdwijnt, dit is het persoonlijke werkschema.
   FR-010: de eigen planningsitems (zelf of via de ploeg) staan er ook. */
export default function Werkschema() {
  const qc = useQueryClient()
  const { data: taken } = useQuery({ queryKey: ['opvolgtaken'], queryFn: () => api.get<Opvolgtaak[]>('/opvolgtaken') })
  const { data: mijnPlanning } = useQuery({ queryKey: ['planning-mijn'], queryFn: () => api.get<PlanningsItemRij[]>('/planning/mijn') })
  const zetStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/opvolgtaken/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['opvolgtaken'] })
  })
  return (
    <>
      <PaginaKop eyebrow="Persoonlijk · opvolging" titel="Werkschema" />
      {(mijnPlanning ?? []).length > 0 && (
        <div className="mb-6">
          <Paneel titel="Mijn planning">
            <ul className="space-y-2 text-sm">
              {mijnPlanning!.map(item => (
                <li key={item.id} className="flex items-center justify-between gap-4">
                  <span className="font-medium">
                    {item.project.nummer ? `${item.project.nummer} · ` : ''}{weergaveNaam(item.project.klant)}
                    <span className="ml-2 text-inkt-muted">{faseTekst[item.fase]} · {item.project.werfadres}</span>
                  </span>
                  <span className="flex items-center gap-3">
                    <Badge status={item.status} />
                    <span className="whitespace-nowrap text-inkt-muted">{datum(item.geplandeDatum)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </Paneel>
        </div>
      )}
      {taken && taken.length === 0 ? (
        <LegeStaat titel="Alles opgevolgd" tekst="Het systeem maakt hier automatisch taken aan bij offertes zonder reactie en leads met een verstreken opvolgdatum." />
      ) : (
        <table className="w-full border-separate border-spacing-0">
          <thead><tr><Th>Taak</Th><Th>Tegen</Th><Th /></tr></thead>
          <tbody>
            {taken?.map(t => (
              <tr key={t.id} className="hover:bg-bronze-500/[.06]">
                <Td className="font-medium">{t.omschrijving}</Td>
                <Td className="whitespace-nowrap">{datum(t.dueDatum)}</Td>
                <Td rechts>
                  <div className="flex justify-end gap-2">
                    <Knop variant="secundair" className="h-8 px-3 text-xs"
                      onClick={() => zetStatus.mutate({ id: t.id, status: 'uitgevoerd' })}>Uitgevoerd</Knop>
                    <Knop variant="ghost" className="h-8 px-3 text-xs"
                      onClick={() => zetStatus.mutate({ id: t.id, status: 'vervallen' })}>Vervallen</Knop>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
