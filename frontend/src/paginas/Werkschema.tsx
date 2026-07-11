import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/api'
import { datum } from '../lib/formaat'
import type { Opvolgtaak } from '../lib/types'
import { Knop, LegeStaat, PaginaKop, Th, Td } from '../ui'

/* FR-005: de Excel terugbellijst verdwijnt, dit is het persoonlijke werkschema. */
export default function Werkschema() {
  const qc = useQueryClient()
  const { data: taken } = useQuery({ queryKey: ['opvolgtaken'], queryFn: () => api.get<Opvolgtaak[]>('/opvolgtaken') })
  const zetStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.patch(`/opvolgtaken/${id}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['opvolgtaken'] })
  })
  return (
    <>
      <PaginaKop eyebrow="Persoonlijk · opvolging" titel="Werkschema" />
      {taken && taken.length === 0 ? (
        <LegeStaat titel="Alles opgevolgd" tekst="Het systeem maakt hier automatisch taken aan bij offertes zonder reactie en leads met een verstreken opvolgdatum." />
      ) : (
        <table className="w-full border-separate border-spacing-0">
          <thead><tr><Th>Taak</Th><Th>Tegen</Th><Th /></tr></thead>
          <tbody>
            {taken?.map(t => (
              <tr key={t.id} className="hover:bg-bronze-500/[.06]">
                <Td className="font-medium">{t.omschrijving}</Td>
                <Td>{datum(t.dueDatum)}</Td>
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
