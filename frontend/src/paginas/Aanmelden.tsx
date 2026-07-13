import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { Knop, Invoer, Melding, Eyebrow } from '../ui'

/* Loginmodule (bouwspec hoofdstuk 5): email plus wachtwoord met TOTP MFA.
   Geen open registratie: enkel de beheerder nodigt uit (TS-02). */
export default function Aanmelden() {
  const navigeer = useNavigate()
  const [email, zetEmail] = useState('')
  const [wachtwoord, zetWachtwoord] = useState('')
  const [mfaCode, zetMfaCode] = useState('')
  const [stap, zetStap] = useState<'gegevens' | 'mfa' | 'reset'>('gegevens')
  const [factorId, zetFactorId] = useState<string>()
  const [fout, zetFout] = useState<string>()
  const [bericht, zetBericht] = useState<string>()
  const [bezig, zetBezig] = useState(false)

  async function meldAan(e: React.FormEvent) {
    e.preventDefault()
    zetFout(undefined); zetBezig(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord })
      if (error) throw new Error('Aanmelden lukte niet. Controleer email en wachtwoord.')
      const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aal?.nextLevel === 'aal2' && aal.nextLevel !== aal.currentLevel) {
        const { data: factoren } = await supabase.auth.mfa.listFactors()
        const totp = factoren?.totp?.[0]
        if (totp) { zetFactorId(totp.id); zetStap('mfa'); return }
      }
      navigeer({ to: '/' })
    } catch (f) {
      zetFout(f instanceof Error ? f.message : 'Aanmelden lukte niet.')
    } finally { zetBezig(false) }
  }

  async function verifieerMfa(e: React.FormEvent) {
    e.preventDefault()
    if (!factorId) return
    zetFout(undefined); zetBezig(true)
    try {
      const { data: uitdaging, error: fout1 } = await supabase.auth.mfa.challenge({ factorId })
      if (fout1 || !uitdaging) throw new Error('De verificatie kon niet starten.')
      const { error: fout2 } = await supabase.auth.mfa.verify({ factorId, challengeId: uitdaging.id, code: mfaCode })
      if (fout2) throw new Error('De code klopt niet. Probeer opnieuw.')
      navigeer({ to: '/' })
    } catch (f) {
      zetFout(f instanceof Error ? f.message : 'Verificatie mislukt.')
    } finally { zetBezig(false) }
  }

  async function vraagReset(e: React.FormEvent) {
    e.preventDefault()
    zetFout(undefined); zetBezig(true)
    try {
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${location.origin}/aanmelden` })
      zetBericht('Als dit adres bestaat kreeg het een resetlink.')
    } finally { zetBezig(false) }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-vlak-canvas p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3 text-inkt">
          <span className="flex h-11 w-11 items-center justify-center border-[1.4px] border-inkt/70 font-display text-2xl">P</span>
          <div>
            <div className="text-base font-semibold uppercase tracking-[0.3em]">Poortland</div>
            <div className="text-2xs uppercase tracking-[0.2em] text-inkt-muted">Operations</div>
          </div>
        </div>
        <div className="rounded-card border border-inkt/10 bg-vlak-surface p-6 shadow-lg">
          <Eyebrow>{stap === 'mfa' ? 'Tweede stap' : stap === 'reset' ? 'Wachtwoord vergeten' : 'Aanmelden'}</Eyebrow>
          <h1 className="mb-5 mt-1 font-display text-3xl font-medium text-inkt">
            {stap === 'mfa' ? 'Bevestig met je code.' : stap === 'reset' ? 'Vraag een reset aan.' : 'Welkom terug.'}
          </h1>
          {fout && <div className="mb-4"><Melding soort="fout">{fout}</Melding></div>}
          {bericht && <div className="mb-4"><Melding soort="ok">{bericht}</Melding></div>}
          {stap === 'gegevens' && (
            <form onSubmit={meldAan} className="space-y-4">
              <Invoer label="Email" type="email" value={email} onChange={e => zetEmail(e.target.value)} autoComplete="email" required />
              <Invoer label="Wachtwoord" type="password" value={wachtwoord} onChange={e => zetWachtwoord(e.target.value)} autoComplete="current-password" required />
              <Knop variant="primair" className="w-full" disabled={bezig}>{bezig ? 'Bezig…' : 'Aanmelden'}</Knop>
              <button type="button" onClick={() => zetStap('reset')} className="focusring w-full text-center text-sm text-inkt-muted hover:text-inkt">
                Wachtwoord vergeten
              </button>
            </form>
          )}
          {stap === 'mfa' && (
            <form onSubmit={verifieerMfa} className="space-y-4">
              <Invoer label="Code uit je authenticator" inputMode="numeric" pattern="[0-9]*" maxLength={6}
                value={mfaCode} onChange={e => zetMfaCode(e.target.value)} autoFocus required />
              <Knop variant="primair" className="w-full" disabled={bezig}>{bezig ? 'Bezig…' : 'Bevestigen'}</Knop>
            </form>
          )}
          {stap === 'reset' && (
            <form onSubmit={vraagReset} className="space-y-4">
              <Invoer label="Email" type="email" value={email} onChange={e => zetEmail(e.target.value)} required />
              <Knop variant="primair" className="w-full" disabled={bezig}>Verstuur resetlink</Knop>
              <button type="button" onClick={() => zetStap('gegevens')} className="focusring w-full text-center text-sm text-inkt-muted hover:text-inkt">
                Terug naar aanmelden
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
