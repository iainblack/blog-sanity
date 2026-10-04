# Blog-Sanity Architecture

## Overview

This is a Next.js blog application (App Router, installed version 14.2.35) with Sanity CMS as the content backend. The application features multiple blog sections, resource management, and a contact form.

## Tech Stack

- **Framework**: Next.js 14.2.35 (App Router; `package.json` pins `^14.2.35`, the last 14.x release)
- **Runtime**: Node.js 24.x (set in the Vercel project settings)
- **CMS**: Sanity v3
- **Styling**: Tailwind CSS
- **Database**: Firebase (Admin SDK for server-side)
- **Email**: Postmark
- **Deployment**: Vercel

## Directory Structure

```
app/
├── (blog)/              # Public blog pages
│   ├── page.tsx         # Homepage
│   ├── healing-journey/ # Blog section 1
│   ├── messages-for-humanity/ # Blog section 2
│   ├── additional-topics/ # Blog section 3
│   ├── resources/       # Resource library
│   ├── photos/         # Photo gallery
│   └── contact/        # Contact form
├── (sanity)/           # Sanity Studio
│   └── studio/
├── api/                # API routes
│   ├── draft/          # Draft mode toggle
│   ├── sendEmail/      # Contact form email
│   ├── postmarkWebhook/
│   └── sanityWebhook/
│   (app/api/actions.ts: subscribe/unsubscribe/preferences Server Actions)
components/
├── Post/               # Post display components
├── Resource/           # Resource display components
├── CMS-Banner.tsx     # Draft mode indicator
├── Header.tsx          # Navigation header
├── Footer.tsx          # Footer
├── Pagination.tsx      # Pagination controls
├── MessageForm.tsx     # Contact form
sanity/
├── schemas/            # Sanity content schemas
├── lib/                # Sanity utilities (fetch.ts, mockData.ts)
utils/                  # FirebaseUtils, PostmarkUtils, sandbox.ts (in-memory fakes)
scripts/                # sandbox-env.cjs, dev-local.cjs
tests/                  # unit/ (Vitest), e2e/ (Playwright)
middleware.ts           # ?mock=true cookie handling (dev only)
```

## Key Patterns

### Server Components
- Layouts and pages are Server Components by default
- Data fetching happens in Server Components using `sanityFetch`
- Actions are Server Actions for mutations

### Client Components
- Post lists use client-side state for pagination/sorting
- Forms use client-side validation
- Interactive UI elements (filters, modals) are client components

### Data Fetching

```typescript
// Server-side with perspective control
const data = await sanityFetch({
  query: groq`*[_type == "post"]`,
  perspective: "published" | "previewDrafts",
  stega: boolean,
});
```

### Dynamic Routes

The app runs Next.js 14, so `params` is a plain object (`{ params: { slug } }`). Next 15 makes it a
Promise that must be awaited; see CLAUDE.md "Known Issues" before upgrading.

## Content Types

- **Post**: Blog posts with title, content, author, dates, cover image
- **Author**: Post authors
- **ContentPanel**: Homepage expandable content sections
- **Resource**: Books, websites, other recommended resources
- **GalleryImage**: Photo gallery images
- **Settings**: Site-wide settings (singleton)

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version |
| `SANITY_API_READ_TOKEN` | Read token for draft content |
| `POSTMARK_API_KEY` | Email API key |
| `NEXT_PUBLIC_VERIFIED_SENDER` | Contact-form recipient and sender address |
| `FIREBASE_*` / `NEXT_PUBLIC_FIREBASE_*` | Firebase configuration |
| `MOCK_DATA` | `force` = sandbox: mock Sanity data, in-memory Firebase/Postmark, no Firebase Analytics. Set by `dev:local`, Playwright, and the sandbox `.env.local` |

Local `.env.local` contains placeholders only (see `scripts/sandbox-env.cjs`); real values live in Vercel.
