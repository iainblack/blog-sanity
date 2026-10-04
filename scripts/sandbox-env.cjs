/**
 * Environment for running the app against NO production services.
 *
 * Shared by `npm run dev:local` (scripts/dev-local.cjs) and the Playwright web server.
 *
 * 1. MOCK_DATA=force: every Sanity query is answered from sanity/lib/mockData.ts, and the
 *    email / subscriber write paths are served by in-memory fakes (utils/sandbox.ts).
 * 2. Every variable defined in any .env* file is overridden with a placeholder. Next.js never
 *    overrides variables already present in process.env, so real credentials are not loaded
 *    even if mock mode were bypassed. The fake project IDs resolve to nothing.
 */
const { generateKeyPairSync } = require('crypto');
const { readdirSync, readFileSync } = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');

function envFileKeys() {
  const keys = new Set();
  for (const file of readdirSync(root).filter((f) => f.startsWith('.env'))) {
    for (const line of readFileSync(path.join(root, file), 'utf8').split('\n')) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/);
      if (match) keys.add(match[1]);
    }
  }
  return Array.from(keys);
}

function buildSandboxEnv(baseUrl) {
  // Throwaway key so firebase-admin can initialise; it authenticates against nothing.
  const fakePrivateKey = generateKeyPairSync('rsa', { modulusLength: 2048 })
    .privateKey.export({ type: 'pkcs8', format: 'pem' })
    .toString();

  return {
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
    NEXT_PUBLIC_BASE_URL: baseUrl,
    MOCK_DATA: 'force',
    NEXT_TELEMETRY_DISABLED: '1',
  };
}

module.exports = { buildSandboxEnv };
