import { defineConfig, devices } from '@playwright/test';
import { generateKeyPairSync } from 'crypto';
import { readdirSync, readFileSync } from 'fs';
import path from 'path';

/**
 * The E2E suite must NEVER touch production data or services.
 *
 * Isolation (defence in depth):
 *  1. The app server runs in MOCK_DATA=force mode: every Sanity query is answered
 *     from the in-memory fixture dataset (sanity/lib/mockData.ts).
 *  2. Every variable defined in the repo's .env* files is overridden below with a
 *     placeholder. Next.js never overrides variables already present in
 *     process.env, so real Sanity / Firebase / Postmark credentials are not loaded
 *     even if mock mode were bypassed. The fake project IDs resolve to nothing.
 *  3. The server uses its own port and is never reused, so a dev server started
 *     with real credentials can't be picked up by accident.
 *  4. tests/e2e/fixtures.ts aborts and fails any browser request that leaves localhost.
 */
const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

function envFileKeys(): string[] {
  const keys = new Set<string>();
  for (const file of readdirSync(__dirname).filter((f) => f.startsWith('.env'))) {
    for (const line of readFileSync(path.join(__dirname, file), 'utf8').split('\n')) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
      if (match) keys.add(match[1]);
    }
  }
  return Array.from(keys);
}

// Throwaway key so firebase-admin can initialise; it authenticates against nothing.
const fakePrivateKey = generateKeyPairSync('rsa', { modulusLength: 2048 })
  .privateKey.export({ type: 'pkcs8', format: 'pem' })
  .toString();

const testEnv: Record<string, string> = {
  ...Object.fromEntries(envFileKeys().map((key) => [key, 'e2e-placeholder'])),
  NEXT_PUBLIC_SANITY_PROJECT_ID: 'e2eplaceholder',
  NEXT_PUBLIC_SANITY_DATASET: 'e2e',
  SANITY_API_PROJECT_ID: 'e2eplaceholder',
  SANITY_API_DATASET: 'e2e',
  SANITY_API_READ_TOKEN: 'e2e-placeholder-token',
  FIREBASE_PRIVATE_KEY: fakePrivateKey,
  FIREBASE_CLIENT_EMAIL: 'e2e@e2e-placeholder.iam.gserviceaccount.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'e2e-placeholder',
  NEXT_PUBLIC_VERIFIED_SENDER: 'e2e@example.invalid',
  NEXT_PUBLIC_BASE_URL: BASE_URL,
  MOCK_DATA: 'force',
  NEXT_TELEMETRY_DISABLED: '1',
};

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npx next dev -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: false,
    timeout: 120000,
    env: testEnv,
    // E2E_SERVER_LOGS=1 shows the app server's log (incl. any outbound fetch Next logs) for debugging.
    stdout: process.env.E2E_SERVER_LOGS ? 'pipe' : 'ignore',
    stderr: 'pipe',
  },
});
