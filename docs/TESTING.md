# Testing Guide

## Golden rule: tests never touch production

No test may read from, or write to, production Sanity, Firebase, or Postmark. This is
enforced by the setup, not by discipline:

| Layer | How production is kept out |
|-------|----------------------------|
| E2E app server | Started by Playwright with `MOCK_DATA=force`: **every** Sanity query is answered from the in-memory dataset in `sanity/lib/mockData.ts`. |
| E2E credentials | Every variable defined in any `.env*` file is overridden with a placeholder (`scripts/sandbox-env.cjs`, shared with `dev:local`). Next.js never overrides variables already in `process.env`, so real Sanity/Firebase/Postmark credentials are not loaded. Placeholder project IDs resolve to nothing. |
| E2E server reuse | Own port (3100), `reuseExistingServer: false`. A dev server started with real credentials can never be picked up. |
| E2E browser | The `page` fixture (`tests/e2e/fixtures.ts`) aborts known telemetry (Firebase Analytics, GTM, Vercel Speed Insights) and **fails the test** on any other non-local request. |
| Email / webhooks | `/api/sendEmail` is intercepted in the browser in E2E; handlers are unit-tested with Postmark/Firebase/Sanity clients mocked. |
| Unit tests | `tests/setup.ts` replaces `fetch` with a function that throws; `vitest.config.ts` supplies placeholder env. |

Verify at any time: `E2E_SERVER_LOGS=1 npm run test:e2e` prints the app server's log.
It must contain no `sanity.io` / `apicdn` / `postmarkapp` / `firestore` lines.

## Running

```bash
npm run test        # unit + component tests (Vitest, ~2s)
npm run test:e2e    # E2E (Playwright, starts its own isolated server on :3100)
npm run test:all    # both
```

## Local development without production (`npm run dev:local`)

`npm run dev:local` starts the dev server on :3000 in the same sandbox the E2E server uses
(`scripts/sandbox-env.cjs`): all Sanity data is mock data, every `.env*` credential is replaced by
a placeholder, Firebase Analytics is not loaded, and the contact form and footer subscribe /
unsubscribe / preferences work against in-memory fakes (`utils/sandbox.ts`) that reset when the
server restarts. Pick a dataset with `?scenario=empty` etc. (see below).

`.env.local` itself now contains only sandbox placeholders plus `MOCK_DATA="force"`, so plain
`npm run dev` is sandboxed too. If you restore real credentials (`vercel env pull .env.local`),
plain `npm run dev` talks to **production**: Sanity unless `?mock=true`, and the forms and
subscriber actions always write to production. Use `npm run dev:local` in that case.

## Mock mode for manual development

`next dev` can serve fake data so you can click around without touching Sanity:

- `http://localhost:3000/?mock=true` – enable (stored in a cookie)
- `?mock=true&scenario=empty` – pick a dataset: `default` | `empty` | `single` | `ten` | `eleven` | `many`
- `?mock=false` – disable

Mock mode is ignored in production builds (`NODE_ENV=production`).

The mock layer evaluates the app's **real GROQ queries** (via `groq-js`) against fixture documents, so
filtering, ordering, slicing, `match` and `count()` behave like Sanity. When you change a query in
`app/(blog)/actions.ts`, the mock follows automatically. When you add a document type, add fixtures
to `buildMockDataset` in `sanity/lib/mockData.ts`.

| Scenario | Posts per section | Resources per tab | Panels / photos |
|----------|-------------------|-------------------|-----------------|
| `default` | 11 | fixed set of 8 (2 books, 3 websites, 3 other) | 2 / 3 |
| `empty` | 0 | 0 | 0 / 0 |
| `single` | 1 | 1 | 2 / 3 |
| `ten` | 10 | 10 | 2 / 3 |
| `eleven` | 11 | 11 | 2 / 3 |
| `many` | 30 | 25 | 2 / 3 |

Fixture posts include deliberate edge cases: #3 has a very long title/subtitle/excerpt, #5 has no
author/subtitle/excerpt, #7 has no body.

In E2E, choose a scenario with `test.use({ scenario: 'empty' })` (see `tests/e2e/fixtures.ts`).

## What is covered where

| Area | Unit/component (`tests/unit`) | E2E (`tests/e2e`) |
|------|-------------------------------|-------------------|
| Post listing: empty/1/10/11/30 posts, pagination, sort, view modes, long/missing fields, skeleton | `actions.test.ts` (queries), `components.test.tsx` (grid, filters), `pagination.test.tsx` | `blog-listing.spec.ts` (all 3 sections) |
| Post page: content, Prev/Next, no body/author, 404 | `actions.test.ts` (neighbours) | `post-detail.spec.ts` |
| Resources: tabs, search, pagination, empty | `actions.test.ts`, `components.test.tsx` (Tabs, SearchBar) | `resources.spec.ts` |
| Contact form | `message-form.test.tsx` | `contact-form.spec.ts` |
| Footer sign-up | `components.test.tsx`, `sandbox.test.ts` (in-memory fakes) | – (server actions can't be mocked in the browser) |
| Routes, nav, homepage, photos, 404, draft API | `middleware.test.ts`, `api-draft.test.ts` | `site.spec.ts` |
| API routes | `api-send-email`, `api-postmark-webhook`, `api-sanity-webhook` | – |
| Mock/production safety | `fetch.test.ts`, `middleware.test.ts`, `sandbox.test.ts` | `fixtures.ts` guard |

## Writing effective tests

A test is only worth having if it can fail when the behaviour breaks. Before committing one, flip
the behaviour it covers (change a constant, invert a condition) and confirm it goes red.

- **Assert exact outcomes**: `toHaveText('Page 2 of 3')`, `toHaveText([...titles])`, not `toBeVisible()` on `body` or `expect(true).toBe(true)`.
- **No conditional assertions.** `if (await x.isVisible()) { expect(...) }` silently passes when the feature is missing. Control the data with a scenario instead, so the element must exist.
- **No `waitForTimeout`.** Use web-first assertions (`expect(locator)...`), which retry. The only fixed waits are where time itself is the behaviour (use `page.clock`).
- **Don't re-implement the code under test inside the test.** Import the real function/component.
- **Select by role / label / text**, not Tailwind classes. If something has no accessible name, add one to the component (that is also an accessibility fix).
- **Unknown status codes are not assertions.** `expect([200, 404, 500]).toContain(status)` can't fail. Assert the one correct status.
- Use scenarios to hit boundaries: 0, 1, a full page (10), a full page + 1 (11), many (30).

## Known bugs are tracked in the suite

When a test documents behaviour the code doesn't yet have, it is marked so the suite stays green
but cannot be forgotten:

- E2E: `test.fail(true, 'BUG: …')` – the test is *expected* to fail; when someone fixes the bug it
  starts "unexpectedly passing" and fails, prompting removal of the marker.
- Unit: `it.fails(...)`, same semantics.

Search for `BUG:` / `it.fails` to list them. Current list:

| Where | Bug |
|-------|-----|
| `api-postmark-webhook.test.ts` | BEHAVIOR.md says a webhook secret is required; none is checked. |
| `api-sanity-webhook.test.ts` | Unauthenticated: anyone can trigger an email blast to subscribers. |

## Debugging

- **E2E failing at navigation**: run `E2E_SERVER_LOGS=1 npx playwright test <file>` to see server errors.
- **"browser attempted to reach a non-local host"**: the page requested an external URL. Either the app
  gained a new third-party call (add it to `BLOCKED_TELEMETRY` only if it carries no site data) or a mock
  fixture contains a real URL (use `MOCK_IMAGE_URL_PREFIX` for images).
- **`getByRole('alert')` matches two elements**: Next's dev route announcer also has `role="alert"`; the
  contact spec excludes `#__next-route-announcer__`.
- **Server Action traffic can't be mocked with `page.route`** – it runs inside the Next server. Use scenarios.

## Test maintenance

1. **Before**: run `npm run test:all` for a baseline.
2. **During**: add tests for new behaviour; add fixtures/scenarios if new data shapes are needed.
3. **After**: everything green, and `git status` shows no `playwright-report/` or `test-results/` (they are git-ignored).

If a test fails after your change: decide whether the test described correct behaviour. If behaviour
changed intentionally, update the test; if it broke, fix the code. Never edit a test just to turn it green.
