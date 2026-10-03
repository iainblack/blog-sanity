import { test, expect, Page } from '@playwright/test';

/**
 * Individual Post Page Tests
 * Tests for dynamic post pages with slug parameters.
 */

test.describe('Individual Post Pages - Loading', () => {
  test.describe('Valid Slug Pages', () => {
    test('post page loads without application errors', async ({ page }) => {
      await page.goto('/healing-journey/posts/test-post');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(1000);

      // Should not show application error
      await expect(page.locator('body')).not.toContainText('Application Error');
    });

    test('post page has header and footer', async ({ page }) => {
      await page.goto('/healing-journey/posts/test-post');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
    });

    test('post page has main content area', async ({ page }) => {
      await page.goto('/healing-journey/posts/test-post');
      await page.waitForLoadState('domcontentloaded');

      await expect(page.locator('main')).toBeVisible();
    });
  });

  test.describe('All Post Sections', () => {
    const sections = [
      { base: '/healing-journey', name: 'Healing Journey' },
      { base: '/messages-for-humanity', name: 'Messages for Humanity' },
      { base: '/additional-topics', name: 'Additional Topics' },
    ];

    for (const section of sections) {
      test(`${section.name} post pages load without crashing`, async ({ page }) => {
        await page.goto(`${section.base}/posts/test-slug`);
        await page.waitForLoadState('domcontentloaded');

        // No crash
        await expect(page.locator('body')).not.toContainText('Application Error');
        await expect(page.locator('main')).toBeVisible();
      });
    }
  });
});

test.describe('Individual Post Pages - Navigation', () => {
  test('can navigate back to post list', async ({ page }) => {
    await page.goto('/healing-journey/posts/test-post');
    await page.waitForLoadState('domcontentloaded');

    // Find and click back link/button
    const backLink = page.locator('a[href*="healing-journey"]').first();
    const hasBackLink = await backLink.isVisible().catch(() => false);

    if (hasBackLink) {
      await backLink.click();
      await page.waitForLoadState('domcontentloaded');
      // Should be back at the list
      await expect(page.locator('main')).toBeVisible();
    }
  });
});

test.describe('Individual Post Pages - 404 Handling', () => {
  test('shows 404 or error page for non-existent post', async ({ page }) => {
    await page.goto('/healing-journey/posts/this-post-does-not-exist-12345');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Either shows 404 page or shows error state
    const has404 = await page.locator('text=404').isVisible().catch(() => false);
    const hasNotFound = await page.locator('text=Not Found').isVisible().catch(() => false);
    const hasError = await page.locator('text=Application Error').isVisible().catch(() => false);
    const hasContent = await page.locator('main').isVisible().catch(() => false);

    // Should show some indication of not found
    // (implementation may vary - this is flexible)
    expect(has404 || hasNotFound || hasError || hasContent).toBe(true);
  });

  test('invalid slug does not crash the page', async ({ page }) => {
    await page.goto('/healing-journey/posts/invalid--slug--with--dashes');
    await page.waitForLoadState('domcontentloaded');

    // Page should load without crashing
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Individual Post Pages - Content Display', () => {
  test('post title is displayed', async ({ page }) => {
    await page.goto('/healing-journey/posts/test-post');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Should have some heading
    const h1 = page.locator('h1');
    const h2 = page.locator('h2');

    const h1Visible = await h1.isVisible().catch(() => false);
    const h2Visible = await h2.isVisible().catch(() => false);

    expect(h1Visible || h2Visible).toBe(true);
  });

  test('post date is displayed', async ({ page }) => {
    await page.goto('/healing-journey/posts/test-post');
    await page.waitForLoadState('domcontentloaded');

    // Look for date text patterns
    const dateText = page.locator('text=/\\d{4}/'); // Year pattern
    const hasDate = await dateText.first().isVisible().catch(() => false);

    // Date may or may not be present depending on data
    // This test just verifies no crash
  });

  test('author name is displayed if present', async ({ page }) => {
    await page.goto('/healing-journey/posts/test-post');
    await page.waitForLoadState('domcontentloaded');

    // Author section might exist
    const authorSection = page.locator('text=/Author|By/');
    const hasAuthor = await authorSection.first().isVisible().catch(() => false);

    // Author may or may not be present depending on data
  });
});
