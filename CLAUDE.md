# Blog-Sanity

Personal blog application with Sanity CMS backend. Built with Next.js 15 App Router.

## Key Documentation

- [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Project structure, tech stack, patterns
- [BEHAVIOR.md](docs/BEHAVIOR.md) - Expected behavior for all features
- [TESTING.md](docs/TESTING.md) - How to test effectively

## Quick Facts

- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity v3
- **Styling**: Tailwind CSS
- **Deployment**: Vercel

## Common Tasks

### Running Tests
```bash
npm run test        # Unit tests (Vitest)
npm run test:e2e    # E2E tests (Playwright)
npm run test:all    # Both
```

### Building
```bash
npm run build   # Production build
npm run dev     # Development server
```

### Known Issues

1. **Next.js 14→15 Breaking Changes**: Several patterns changed:
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
├── api/             # API routes (draft, sendEmail, webhooks)
components/          # React components
sanity/             # Sanity schemas and lib
docs/               # Detailed documentation
```

## Critical Files

| File | Purpose |
|------|---------|
| `sanity/lib/fetch.ts` | Data fetching with draft mode support |
| `sanity/lib/token.ts` | Sanity API token (server-only) |
| `app/(blog)/actions.ts` | Server Actions for data mutations |
| `app/(blog)/layout.tsx` | Root layout with draft mode check |
