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

**Pagination Behavior** (Healing Journey and Additional Topics):
- First page shows 10 posts (hero + 9 grid)
- Subsequent pages show 9 posts per page
- **Messages for Humanity paginates differently**: a flat 10 per page, `totalPages = ceil(totalPosts / 10)`
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
- Messages for Humanity shows its own message: "These messages will be made available at a later time when they are in sync with the sharing of Lou's healing story."
- Pagination is hidden (`totalPages === 0`)

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
- Clicking tab resets to page 0 (**not implemented**: the page index is kept - tracked by a `test.fail` in `resources.spec.ts`)
- Active tab highlighted
- Labels: "Books", "Websites", "Other Resources"

### Search
- Case-insensitive partial match on title, scoped to the active tab
- Fires on every keystroke (**not debounced**, despite earlier docs)
- Search resets to page 0 (**only when Enter is pressed**; typing alone keeps the page index - tracked by a `test.fail`)

### Pagination
- 10 resources per page
- Total pages: `ceil(totalResources / 10)`

### Empty States
- Tab with no resources: "Nothing Yet Available"
- Search with no results: Same message

## Contact Form

### Validation Rules (client-side only)
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
- Nothing is sent while any field is invalid
- Shows loading spinner during submission (replaces the "Submit" label)
- Success: "Message sent successfully" alert, form cleared
- Failure: "Message failed to send" error alert; typed values are kept
- A network error (rejected fetch) is not handled: spinner stays on (tracked bug)

### Alert Component
- Auto-dismisses after 5 seconds, or via its close icon
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
- POST: Sends email via Postmark to the site owner (`NEXT_PUBLIC_VERIFIED_SENDER`), Reply-To = visitor
- Intended to require: senderEmail, firstName, lastName, subject, message (**not validated server-side today**)
- Returns 200 on success, 500 on any failure (including a malformed body)

### `/api/postmarkWebhook`
- POST: Handles Postmark `SubscriptionChange` events; an unsubscribe removes the address from Firestore
- Other record types are acknowledged and ignored
- **No secret is checked today** (earlier docs claimed `POSTMARK_WEBHOOK_SECRET` was required)

### `/api/sanityWebhook`
- POST: Looks up the post by `_id`, finds Firestore subscribers whose `preferences.<pageId>` is true, and sends one Postmark broadcast email each
- 400 without `_id`, 404 if the post isn't found, 200 when there are no subscribers
- **Unauthenticated today** - anyone who knows a post `_id` can trigger the blast
- (No Slack notification exists in the code.)

## Footer Sign-up (every page)

- Email required / must contain `@`
- Already subscribed -> "Email is already subscribed."
- New email -> preferences modal (all three blog sections pre-selected); Save subscribes and shows
  "Successfully subscribed." or "Failed to subscribe. Please try again."

## Mock Data Mode (development only)

See [TESTING.md](TESTING.md). `?mock=true[&scenario=...]` serves fixture data; ignored in production builds.

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
