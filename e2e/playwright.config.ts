import { defineConfig } from '@playwright/test'

// TS-16: end to end tests gekoppeld aan de acceptatiecriteria.
// Draait tegen een lokale dev omgeving met frontend op 5173 en backend op 5000.
export default defineConfig({
  testDir: './tests',
  use: { baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173' },
  reporter: [['list']]
})
