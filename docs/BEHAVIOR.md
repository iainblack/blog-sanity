# Application Behavior

## Homepage

### Content Panels
- Panels are fetched by `pageId: "Home"`
- Sorted by `order` field ascending
- Rendered as `ExpandablePanel` components
- **Empty state**: When no panels exist, renders nothing (no message shown)

### Draft Mode
- Layout checks `draftMode().isEnabled` to show Visual Editing
- Shows `AlertBanner` component when draft mode is active

## Blog Post Pages

### Post Listing (e.g., `/healing-journey`)

**Pagination Behavior**:
- First page shows 10 posts (hero + 9 grid)
- Subsequent pages show 9 posts per page
- Total pages calculated: `(totalPosts > 10) ? ceil((totalPosts - 10) / 9) + 1 : (totalPosts > 0 ? 1 : 0)`
- Pagination component hidden when `totalPages === 0`

**View Modes**:
- `grid`: Hero image + grid of post thumbnails
- `list`: Compact list view with chevron indicators

**Sorting**:
- Toggle between "Oldest First" and "Newest First"
- Default: oldest first (`order: 'asc'`)

**Loading States**:
- Skeleton shown after 500ms delay
- Skeleton type changes based on view mode and page number

**Empty State**:
- Message: "Nothing Yet Available"
- Shown when `posts === undefined || posts.length === 0`

### Individual Post Page (e.g., `/healing-journey/posts/[slug]`)

**Params Handling**:
- `params.slug` is a Promise in Next.js 15 (must await)
- `generateStaticParams` fetches all post slugs at build time

**404 Handling**:
- When `currentPost._id` is undefined, calls `notFound()`

## Resources Page

### Resource Types
- Books
- Websites
- Other Resources

### Tabs
- Clicking tab resets to page 0
- Active tab highlighted

### Search
- Debounced search by title
- Search resets to page 0

### Pagination
- 10 resources per page
- Total pages: `ceil(totalResources / 10)`

### Empty States
- Tab with no resources: "Nothing Yet Available"
- Search with no results: Same message

## Contact Form

### Validation Rules
| Field | Required | Validation |
|-------|----------|------------|
| First Name | Yes | Non-empty |
| Last Name | Yes | Non-empty |
| Email | Yes | Must contain @ |
| Subject | Yes | Non-empty |
| Message | Yes | Min 10 characters |

### Error Display
- Errors shown below each field
- Red border on invalid fields
- Error message: field-specific

### Submission
- Shows loading spinner during submission
- Success: "Message sent successfully" alert, form cleared
- Failure: "Message failed to send" error alert

### Alert Component
- Auto-dismissible with onClose callback
- Types: `success` (green), `error` (red)

## Pagination Component

### Button States
- Previous disabled when `active === 0`
- Next disabled when `active + 1 === totalPages`
- Disabled buttons have `opacity-50 cursor-not-allowed`

### Display
- Shows "Page {active + 1} of {totalPages}"
- Hidden when `totalPages === 0`

## Post Preview Components

### HeroImagePreview
- Full-width hero layout
- Shows cover image, title, subtitle, content excerpt
- Truncation: `truncate-lines-smaller` for titles, `truncate-lines` for content

### PostImagePreview
- Thumbnail with title and excerpt
- Fixed 224px height image container
- Truncation: `truncate-lines-smaller` for titles

### PostPreview (List View)
- Horizontal layout with date, author, title, excerpt
- Chevron indicator on right
- Compact for list view

### Text Handling
- Long titles: truncated with ellipsis
- Long excerpts: truncated to 2-3 lines
- Long content: truncated in hero view

## API Routes

### `/api/draft`
- GET: Enables draft mode and redirects
- Validates preview URL with Sanity
- Returns 401 if secret invalid

### `/api/sendEmail`
- POST: Sends email via Postmark
- Requires: senderEmail, firstName, lastName, subject, message
- Returns 200 on success

### `/api/postmarkWebhook`
- POST: Handles Postmark bounce/complaint webhooks
- Requires valid POSTMARK_WEBHOOK_SECRET

### `/api/sanityWebhook`
- POST: Handles Sanity content webhooks
- Sends Slack notification on publish events

## Error States

### Network Errors
- API calls fail silently with console errors
- No user-facing error messages for data fetching failures
- Contact form shows error alert on failed submission

### Build Errors
- Missing `SANITY_API_READ_TOKEN`: throws at import time
- Missing env vars: `assertValue` throws during initialization

### Type Errors
- Missing Post fields: undefined values handled gracefully
- Invalid slug: `notFound()` called, shows 404 page
