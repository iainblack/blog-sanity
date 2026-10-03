# Testing Guide

## Test Philosophy

Tests should verify **behavior**, not implementation. A failing test may indicate:
1. A bug in the code
2. A change in expected behavior (requirements evolved)
3. An incomplete test (doesn't match actual behavior)

When a test fails, investigate whether the test or the code needs updating.

## Test Infrastructure

### Unit Tests (Vitest)
- **Location**: `tests/unit/`
- **Run**: `npm run test`
- **Config**: `vitest.config.ts`

### E2E Tests (Playwright)
- **Location**: `tests/e2e/`
- **Run**: `npm run test:e2e`
- **Config**: `playwright.config.ts`

### Run All Tests
```bash
npm run test:all
```

## What to Test

### Unit Tests

#### Utility Functions
Test pure functions with predictable outputs:

```typescript
// Example: resolveHref
expect(resolveHref('post', 'my-slug')).toBe('/posts/my-slug');
expect(resolveHref('post')).toBe(undefined); // no slug
expect(resolveHref('unknown', 'slug')).toBe(undefined); // invalid type
```

#### Type Safety
Verify TypeScript interfaces accept valid data structures.

#### Component Logic
Test business logic functions independently of React components.

### E2E Tests

#### Page Loading
Verify pages load without crashes:
```typescript
test('should load without application errors', async ({ page }) => {
  await page.goto('/healing-journey');
  await expect(page.locator('body')).not.toContainText('Application Error');
});
```

#### Empty States
Verify empty states display correctly:
```typescript
test('shows empty state when no posts', async ({ page }) => {
  // When there are no posts, the "Nothing Yet Available" message should appear
  await expect(page.locator('text=Nothing Yet Available')).toBeVisible();
});
```

#### Pagination
Verify pagination works correctly:
```typescript
test('pagination shows correct page info', async ({ page }) => {
  await page.goto('/healing-journey');
  // Should show "Page 1 of X"
  await expect(page.locator('text=/Page \\d+ of \\d+/')).toBeVisible();
});
```

#### Form Validation
Test error messages appear at correct times:
```typescript
test('shows validation errors for empty required fields', async ({ page }) => {
  await page.goto('/contact');
  await page.click('button[type="submit"]');
  await expect(page.locator('text=First name is required')).toBeVisible();
});
```

#### User Interactions
Test sorting, filtering, view modes:
```typescript
test('can toggle between grid and list view', async ({ page }) => {
  await page.goto('/healing-journey');
  await page.click('[aria-label="list view"]');
  // Verify list view is active
});
```

## Testing Edge Cases

### Text Length Handling
- Very long titles should truncate gracefully
- Very long excerpts should truncate to 2-3 lines
- Empty titles/excerpts should not cause crashes

### Data Variations
| Scenario | What to Verify |
|----------|----------------|
| 0 posts | Empty state shown |
| 1 post | Hero view with no grid below |
| 10 posts | First page fills exactly |
| 11 posts | Pagination appears |
| 100+ posts | Multiple pages work correctly |

### Pagination Edge Cases
| Scenario | Expected Behavior |
|----------|-------------------|
| Page 1 of 1 | Both prev/next disabled |
| Page 1 of 5 | Prev disabled, next enabled |
| Page 5 of 5 | Prev enabled, next disabled |
| Page 3 of 5 | Both enabled |

### Form Error Messages
| Invalid Input | Error Message |
|--------------|---------------|
| Empty first name | "First name is required" |
| Empty last name | "Last name is required" |
| Empty email | "Email is required" |
| Email without @ | "Invalid email" |
| Empty subject | "Subject is required" |
| Empty message | "Message is required" |
| Message < 10 chars | "Message must be at least 10 characters" |

## Debugging Failed Tests

### E2E Test Timeout
If `waitForLoadState('networkidle')` times out:
- The page may be waiting for external resources (Sanity, fonts)
- Use `waitForLoadState('domcontentloaded')` instead
- Check for infinite loading states

### Flaky Tests
- Add `await page.waitForTimeout(100)` after actions
- Ensure animations complete before assertions
- Use `waitForSelector` instead of fixed timeouts

### Testing Without Data
Some tests depend on Sanity having content. For CI:
- Use mocked data in unit tests
- E2E tests may need to be conditional based on content existence

## Test Maintenance

When making changes:

1. **Before**: Run existing tests to establish baseline
2. **During**: Add tests for new behavior
3. **After**: Verify all tests pass before committing

If a test fails after your change:
1. Determine if the test was testing correct behavior
2. If behavior changed intentionally, update the test
3. If behavior was broken, fix the code
4. Never modify tests to make them pass without understanding why
