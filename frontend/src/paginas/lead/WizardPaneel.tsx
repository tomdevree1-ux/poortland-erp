import type { WizardGroep } from '../../lib/wizardvelden'
import { wizardLabel, wizardWaarde } from '../../lib/wizardvelden'
import { Paneel, PotloodKnop } from '../../ui'

/* De offerteaanvraag zoals de klant ze op de website samenstelde: de tekening
   van het bovenaanzicht en de velden per groep. Opgesplitst uit LeadDetail.tsx
   (audit 2026-10-05). Puur tonen, geen eigen toestand. */
export default function WizardPaneel({ groepen, situatieTekening, bewerkbaar, onBewerk }: {
  groepen: WizardGroep[]
  situatieTekening?: string | null
  bewerkbaar: boolean
  onBewerk: () => void
}) {
  return (
          <Paneel titel="Offerteaanvraag (wizard van de website)" actie={bewerkbaar && <PotloodKnop onClick={onBewerk} />}>
            {situatieTekening && (
              <figure className="mb-4">
                <div className="rounded-card border border-inkt/[.08] bg-vlak-surface p-2"
                  dangerouslySetInnerHTML={{ __html: situatieTekening }} />
                <figcaption className="mt-1.5 text-xs text-inkt-faint">
                  Bovenaanzicht zoals de klant het samenstelde op de website.
                </figcaption>
              </figure>
            )}
            {groepen.map(groep => (
              <section key={groep.titel} className="mb-4 last:mb-0">
                <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[.14em] text-bronze-600">{groep.titel}</h3>
                <dl className="text-sm">
                  {groep.velden.map((veld, i) => (
                    <div key={i} className="flex justify-between gap-4 border-b border-inkt/[.06] py-1.5 last:border-0">
                      <dt className="text-inkt-muted">{wizardLabel(veld.label)}</dt>
                      <dd className="text-right font-medium">{wizardWaarde(veld)}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </Paneel>
  )
}
