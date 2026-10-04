# Blog-Sanity

Personal blog application with Sanity CMS backend. Built with Next.js App Router (currently 14.2.5).

## Key Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Project structure, tech stack, patterns
- [BEHAVIOR.md](docs/BEHAVIOR.md) - Expected behavior for all features
- [TESTING.md](docs/TESTING.md) - How to test effectively

## Quick Facts

- **Framework**: Next.js App Router. **Installed/locked version is 14.2.5** (package.json says `"next": "latest"`, so a fresh `npm install` without the lockfile jumps major versions; the code uses Next 14 APIs: sync `params`, sync `draftMode()`)
- **CMS**: Sanity v3
- **Styling**: Tailwind CSS
- **Deployment**: Vercel. **Node.js 24.x** is set in the Vercel project settings (Node 20 was discontinued and failed builds); develop on Node 24 too (`nvm use 24`)
- **Production isolation**: `.env.local` holds sandbox placeholders, not real credentials (see Running Locally)

## Common Tasks

### Running Tests
```bash
npm run test        # Unit/component tests (Vitest)
npm run test:e2e    # E2E tests (Playwright) - starts an isolated mock-data server on :3100
npm run test:all    # Both
```
Tests never touch production Sanity/Firebase/Postmark - see [TESTING.md](docs/TESTING.md).

### Running Locally (never touches production)
```bash
npm run dev:local   # dev server on :3000 in the sandbox: mock Sanity data, in-memory contact/subscribe, placeholder credentials
npm run dev         # also sandboxed while .env.local contains the sandbox values (MOCK_DATA="force")
```
`.env.local` was replaced with placeholders (generated from `scripts/sandbox-env.cjs`). Running
`vercel env pull .env.local` restores real credentials and turns the sandbox off: don't run a dev
server or tests after that without `npm run dev:local`. Never use real credentials for verification.

### Building
```bash
npm run build   # Production build (a local build with the sandbox .env.local bakes in mock data)
npm run dev     # Development server
```

### Known Issues

1. **Next.js 14→15 Breaking Changes** (only relevant when upgrading; the app currently runs 14.2.5): Several patterns change:
   - `params` in dynamic routes is now a `Promise<{slug}>` - must await
   - `draftMode()` returns a Promise - must await before calling methods
   - `experimental.taint` option removed (use `server-only` instead)
   - Server Actions must be explicitly async functions

2. **Environment Variables**: `SANITY_API_READ_TOKEN` is required - throws at import if missing

## Project Structure

```
app/
├── (blog)/           # Public pages
│   ├── page.tsx     # Homepage
│   ├── healing-journey/
│   ├── messages-for-humanity/
│   ├── additional-topics/
│   ├── resources/
│   ├── photos/
│   └── contact/
├── (sanity)/        # Sanity Studio
├── api/             # API routes (draft, sendEmail, webhooks, subscriber actions)
components/          # React components
sanity/             # Sanity schemas and lib (incl. mockData.ts)
utils/              # Firebase/Postmark helpers + sandbox.ts in-memory fakes
scripts/            # sandbox-env.cjs (shared sandbox env), dev-local.cjs
tests/              # unit/ (Vitest), e2e/ (Playwright)
middleware.ts       # ?mock=true cookie handling (dev only)
docs/               # Detailed documentation
```

## Critical Files

| File | Purpose |
|------|---------|
| `sanity/lib/fetch.ts` | Data fetching with draft mode support; serves mock data when `MOCK_DATA=force` or via the dev-only `mock_data` cookie |
| `sanity/lib/mockData.ts` | Fixture dataset + GROQ evaluator used by mock mode and tests |
| `scripts/sandbox-env.cjs` | Placeholder env shared by `dev:local` and Playwright; keeps production credentials out |
| `utils/sandbox.ts` | `isSandbox` flag and in-memory fakes for Firebase/Postmark writes |
| `sanity/lib/token.ts` | Sanity API token (server-only) |
| `app/(blog)/actions.ts` | Server Actions for data mutations |
| `app/(blog)/layout.tsx` | Root layout with draft mode check |
