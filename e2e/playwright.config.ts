import { defineConfig } from '@playwright/test'
import { readFileSync } from 'fs'
import { join } from 'path'

// Inloggegevens uit e2e/.env laden (eenmalig instellen, daarna volstaat
// npx playwright test). Omgevingsvariabelen op de commandolijn winnen altijd.
try {
  for (const regel of readFileSync(join(__dirname, '.env'), 'utf8').split('\n')) {
    const scheiding = regel.indexOf('=')
    if (scheiding < 1 || regel.trimStart().startsWith('#')) continue
    const sleutel = regel.slice(0, scheiding).trim()
    if (!process.env[sleutel]) process.env[sleutel] = regel.slice(scheiding + 1)
  }
} catch { /* geen .env aanwezig: variabelen komen dan van de commandolijn */ }

// TS-16: end to end tests gekoppeld aan de acceptatiecriteria.
// Draait tegen een lokale dev omgeving met frontend op 5173 en backend op 5000.
export default defineConfig({
  testDir: './tests',
  // Eén automatische herkansing: de staging-dev-server heeft af en toe latentie,
  // waardoor een enkele stap traag rendert. Een tweede poging vangt dat op.
  retries: 1,
  use: { baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173' },
  reporter: [['list']]
})
