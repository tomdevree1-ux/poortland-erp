import { useState, useEffect, useRef } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { Knop, Invoer, Melding, Eyebrow } from '../ui'

// Cloudflare Turnstile sitesleutel. Staat die ingesteld, dan toont de login een
// captcha en gaat het token mee naar Supabase. Zet dit samen met de knop
// "Enable Captcha protection" in het Supabase dashboard aan, anders weigert
// Supabase het aanmelden. Zonder sleutel verandert er niets.
const TURNSTILE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined

declare global {
  interface Window { turnstile?: { render: (el: HTMLElement, opties: Record<string, unknown>) => string; reset: (id?: string) => void; remove: (id?: string) => void } }
}

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
  const [captcha, zetCaptcha] = useState<string>()
  const captchaVak = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string>()

  // Laadt en toont de Turnstile widget zolang we op de stap staan die een token vraagt.
  useEffect(() => {
    if (!TURNSTILE_KEY || stap === 'mfa') return
    let gestopt = false
    function toon() {
      if (gestopt || !captchaVak.current || !window.turnstile) return
      captchaVak.current.innerHTML = ''
      widgetId.current = window.turnstile.render(captchaVak.current, {
        sitekey: TURNSTILE_KEY,
        callback: (t: string) => zetCaptcha(t),
        'expired-callback': () => zetCaptcha(undefined),
        'error-callback': () => zetCaptcha(undefined)
      })
    }
    if (window.turnstile) { toon() }
    else {
      const bestaat = document.querySelector('script[data-turnstile]')
      if (!bestaat) {
        const s = document.createElement('script')
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
        s.async = true; s.defer = true; s.dataset.turnstile = '1'
        s.onload = toon
        document.head.appendChild(s)
      } else { bestaat.addEventListener('load', toon) }
    }
    return () => { gestopt = true; try { if (widgetId.current) window.turnstile?.remove(widgetId.current) } catch { /* widget al weg */ } }
  }, [stap])

  function herstelCaptcha() {
    zetCaptcha(undefined)
    try { if (widgetId.current) window.turnstile?.reset(widgetId.current) } catch { /* widget al weg */ }
  }

  async function meldAan(e: React.FormEvent) {
    e.preventDefault()
    if (TURNSTILE_KEY && !captcha) { zetFout('Bevestig even dat je geen robot bent.'); return }
    zetFout(undefined); zetBezig(true)
    try {
      const opties = captcha ? { captchaToken: captcha } : undefined
      const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord, options: opties })
      if (error) { herstelCaptcha(); throw new Error('Aanmelden lukte niet. Controleer email en wachtwoord.') }
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
    if (TURNSTILE_KEY && !captcha) { zetFout('Bevestig even dat je geen robot bent.'); return }
    zetFout(undefined); zetBezig(true)
    try {
      const opties = captcha ? { redirectTo: `${location.origin}/aanmelden`, captchaToken: captcha } : { redirectTo: `${location.origin}/aanmelden` }
      await supabase.auth.resetPasswordForEmail(email, opties)
      zetBericht('Als dit adres bestaat kreeg het een resetlink.')
    } finally { herstelCaptcha(); zetBezig(false) }
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
              {TURNSTILE_KEY && <div ref={captchaVak} className="flex justify-center" />}
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
              {TURNSTILE_KEY && <div ref={captchaVak} className="flex justify-center" />}
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
