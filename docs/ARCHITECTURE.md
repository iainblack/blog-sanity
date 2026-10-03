# Blog-Sanity Architecture

## Overview

This is a Next.js 15 blog application with Sanity CMS as the content backend. The application features multiple blog sections, resource management, and a contact form.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
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
├── lib/                # Sanity utilities
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

In Next.js 15, `params` is a Promise that must be awaited:

```typescript
export default async function PostPage({ params }: Props) {
  const { slug } = await params;
}
```

## Content Types

- **Post**: Blog posts with title, content, author, dates, cover image
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
| `FIREBASE_*` | Firebase configuration |
