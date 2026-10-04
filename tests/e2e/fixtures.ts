/**
 * Shared Playwright fixtures.
 *
 * - `scenario`: which mock dataset the app serves (see sanity/lib/mockData.ts).
 *   Select per file/describe with `test.use({ scenario: 'empty' })`.
 * - `page` additionally enforces the "no external traffic" rule: any browser
 *   request that leaves localhost is aborted and fails the test. Server-side
 *   isolation (fake credentials, forced mock mode) lives in playwright.config.ts.
 */
import { test as base, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import path from 'path';
import { MOCK_IMAGE_URL_PREFIX, type MockScenario } from '../../sanity/lib/mockData';

export { expect };

const LOCAL_IMAGE = readFileSync(path.join(__dirname, '../../public/images/loulogo1.png'));
export type { MockScenario };

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/**
 * Third-party analytics the app loads on every page by design (Firebase Analytics,
 * Google Tag Manager, Vercel Speed Insights). They carry no site data, so they are
 * blocked quietly to keep tests offline and deterministic. Every OTHER non-local
 * request - in particular Sanity, Firestore or Postmark - fails the test.
 */
const BLOCKED_TELEMETRY = [
  /(^|\.)googletagmanager\.com$/,
  /(^|\.)google-analytics\.com$/,
  /^firebase\.googleapis\.com$/,
  /^firebaseinstallations\.googleapis\.com$/,
  /(^|\.)vercel-scripts\.com$/,
  /(^|\.)vercel-insights\.com$/,
];

export const test = base.extend<{ scenario: MockScenario }>({
  scenario: ['default', { option: true }],

  page: async ({ page, context, scenario, baseURL }, use) => {
    const external: string[] = [];

    await context.route('**/*', (route) => {
      const url = new URL(route.request().url());
      if (LOCAL_HOSTS.has(url.hostname)) return route.fallback();
      // Mock images use CDN-shaped URLs on a placeholder project; answer them locally.
      // Any other Sanity CDN URL (e.g. a real asset) is external and fails the test.
      if (route.request().url().startsWith(MOCK_IMAGE_URL_PREFIX)) {
        return route.fulfill({ status: 200, contentType: 'image/png', body: LOCAL_IMAGE });
      }
      if (BLOCKED_TELEMETRY.some((re) => re.test(url.hostname))) return route.abort('blockedbyclient');
      external.push(`${route.request().method()} ${url.origin}${url.pathname}`);
      return route.abort('blockedbyclient');
    });

    await context.addCookies([{ name: 'mock_scenario', value: scenario, url: baseURL! }]);

    await use(page);

    expect(external, 'browser attempted to reach a non-local host').toEqual([]);
  },
});
