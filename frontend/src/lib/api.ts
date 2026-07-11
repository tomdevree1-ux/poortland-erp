import { supabase } from './supabase'

// Dunne API client: de backend rekent en beslist, de frontend toont (TS-05).
export class ApiFout extends Error {
  status: number
  constructor(status: number, boodschap: string) {
    super(boodschap)
    this.status = status
  }
}

async function verzoek<T>(pad: string, init?: RequestInit): Promise<T> {
  const { data } = await supabase.auth.getSession()
  const token = data.session?.access_token
  const antwoord = await fetch(`/api/v1${pad}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers
    }
  })
  if (!antwoord.ok) {
    let boodschap = `Er ging iets mis (${antwoord.status}).`
    try {
      const json = await antwoord.json()
      if (json.fout) boodschap = json.fout
    } catch { /* geen json */ }
    throw new ApiFout(antwoord.status, boodschap)
  }
  if (antwoord.status === 204) return undefined as T
  return antwoord.json() as Promise<T>
}

export const api = {
  get: <T>(pad: string) => verzoek<T>(pad),
  post: <T>(pad: string, body?: unknown) =>
    verzoek<T>(pad, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: <T>(pad: string, body: unknown) =>
    verzoek<T>(pad, { method: 'PATCH', body: JSON.stringify(body) }),
  put: <T>(pad: string, body: unknown) =>
    verzoek<T>(pad, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(pad: string) => verzoek<T>(pad, { method: 'DELETE' }),
  formulier: <T>(pad: string, form: FormData) => verzoek<T>(pad, { method: 'POST', body: form })
}
