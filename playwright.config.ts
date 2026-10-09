import { defineConfig, devices } from '@playwright/test';
import { buildSandboxEnv } from './scripts/sandbox-env.cjs';

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

const testEnv: Record<string, string> = buildSandboxEnv(BASE_URL);

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
      testIgnore: /studio\.spec\.ts/,
    },
    {
      // The Studio's large bundle compiles slowly in the dev server; running it after the site
      // tests keeps that compile from starving their page loads.
      name: 'studio',
      use: { ...devices['Desktop Chrome'] },
      testMatch: /studio\.spec\.ts/,
      dependencies: ['chromium'],
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
