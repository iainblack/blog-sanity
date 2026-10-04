import { test, expect } from './fixtures';
import { MOCK_LONG_TITLE } from '../../sanity/lib/mockData';

/**
 * Individual post pages (/<section>/posts/<slug>): content, previous/next navigation,
 * missing content/author handling and 404s. Run against all three sections.
 */
const sections = [
  { name: 'Healing Journey', base: '/healing-journey', label: 'Healing Journey' },
  { name: 'Additional Topics', base: '/additional-topics', label: 'Topics' },
  { name: 'Messages for Humanity', base: '/messages-for-humanity', label: 'Messages' },
];

const title = (label: string, n: number) =>
  n === 3 ? `${MOCK_LONG_TITLE} (${label})` : `${label} Post ${String(n).padStart(2, '0')}`;

for (const s of sections) {
  test.describe(`${s.name} post page`, () => {
    test('renders title, subtitle, author, date, body and a back link', async ({ page }) => {
      const response = await page.goto(`${s.base}/posts/post-2`);
      expect(response!.status()).toBe(200);

      await expect(page.getByRole('heading', { name: title(s.label, 2) })).toBeVisible();
      await expect(page.getByText('Subtitle 02')).toBeVisible();
      await expect(page.locator('article').getByText('Lou Fleming').first()).toBeVisible();
      await expect(page.locator('article time').first()).toHaveAttribute('datetime', '2024-01-02T12:00:00.000Z');
      await expect(page.locator('article time').first()).toHaveText(/January\s+2, 2024/);
      await expect(page.getByText(`Body text of ${s.label} post 02.`)).toBeVisible();
      await expect(page).toHaveTitle(new RegExp(`^${title(s.label, 2).replace(/[()]/g, '\\$&')} \\| Lou's Blog \\(Mock\\)$`));

      await page.getByRole('button', { name: /All Posts/ }).click();
      await expect(page).toHaveURL(s.base);
    });

    test('Prev/Next walk the section in order and are disabled at either end', async ({ page }) => {
      const prev = page.getByRole('button', { name: /Prev/ });
      const next = page.getByRole('button', { name: /Next/ });

      await page.goto(`${s.base}/posts/post-1`);
      await expect(page.getByRole('heading', { name: title(s.label, 1) })).toBeVisible();
      await expect(prev).toBeDisabled();
      await expect(next).toBeEnabled();

      await next.click();
      await expect(page).toHaveURL(`${s.base}/posts/post-2`);
      await expect(page.getByRole('heading', { name: title(s.label, 2) })).toBeVisible();
      await expect(prev).toBeEnabled();
      await expect(next).toBeEnabled();

      await prev.click();
      await expect(page).toHaveURL(`${s.base}/posts/post-1`);

      await page.goto(`${s.base}/posts/post-11`);
      await expect(page.getByRole('heading', { name: title(s.label, 11) })).toBeVisible();
      await expect(next).toBeDisabled();
      await expect(prev).toBeEnabled();
    });

    test('a post with no body shows "No content found."', async ({ page }) => {
      await page.goto(`${s.base}/posts/post-7`);
      await expect(page.getByRole('heading', { name: title(s.label, 7) })).toBeVisible();
      await expect(page.getByText('No content found.')).toBeVisible();
    });

    test('a post with no author/subtitle renders without leaking undefined/null', async ({ page }) => {
      await page.goto(`${s.base}/posts/post-5`);
      await expect(page.getByRole('heading', { name: title(s.label, 5) })).toBeVisible();
      await expect(page.locator('article').getByText('Lou Fleming')).toHaveCount(0);
      await expect(page.locator('article').getByText(/Subtitle/)).toHaveCount(0);
      expect(await page.locator('main').innerText()).not.toMatch(/\b(undefined|null|NaN)\b/);
    });

    test('a very long title stays inside the viewport', async ({ page }) => {
      await page.goto(`${s.base}/posts/post-3`);
      await expect(page.getByRole('heading', { name: title(s.label, 3) })).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('an unknown slug returns a real 404 page', async ({ page }) => {
      const response = await page.goto(`${s.base}/posts/this-post-does-not-exist`);
      expect(response!.status()).toBe(404);
      await expect(page.getByText('This page could not be found.')).toBeVisible();
      await expect(page.getByText('Body text of')).toHaveCount(0);
    });

    test.describe('single-post dataset', () => {
      test.use({ scenario: 'single' });

      test('the only post has neither Prev nor Next; any other slug is a 404', async ({ page }) => {
        await page.goto(`${s.base}/posts/post-1`);
        await expect(page.getByRole('button', { name: /Prev/ })).toBeDisabled();
        await expect(page.getByRole('button', { name: /Next/ })).toBeDisabled();

        const response = await page.goto(`${s.base}/posts/post-2`);
        expect(response!.status()).toBe(404);
      });
    });

    test.describe('empty dataset', () => {
      test.use({ scenario: 'empty' });

      test('every slug is a 404', async ({ page }) => {
        const response = await page.goto(`${s.base}/posts/post-1`);
        expect(response!.status()).toBe(404);
      });
    });
  });
}
