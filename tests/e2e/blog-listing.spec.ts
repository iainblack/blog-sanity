import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';
import { MOCK_LONG_TITLE } from '../../sanity/lib/mockData';

/**
 * Post listing pages: empty/1/10/11/30-post datasets, pagination, sorting, view modes.
 * Data comes from the mock dataset (sanity/lib/mockData.ts); the real GROQ queries
 * run against it, so offsets, ordering and counts are genuinely exercised.
 *
 * Healing Journey and Additional Topics show 10 posts on page 1 then 9 per page.
 * Messages for Humanity shows 10 per page throughout (its own pagination code).
 */
const sections = [
  { name: 'Healing Journey', path: '/healing-journey', heading: "Lou's Healing Journey", label: 'Healing Journey', pageSizes: (n: number) => split(n, 10, 9), emptyText: 'Nothing Yet Available' },
  { name: 'Additional Topics', path: '/additional-topics', heading: 'Metaphysical Spiritual Teachings', label: 'Topics', pageSizes: (n: number) => split(n, 10, 9), emptyText: 'Nothing Yet Available' },
  { name: 'Messages for Humanity', path: '/messages-for-humanity', heading: 'Messages for Humanity', label: 'Messages', pageSizes: (n: number) => split(n, 10, 10), emptyText: "These messages will be made available at a later time when they are in sync with the sharing of Lou's healing story." },
];

/** Page sizes for `n` posts: first page `first`, the rest `rest`. */
function split(n: number, first: number, rest: number): number[] {
  const sizes: number[] = [];
  let remaining = n;
  let size = first;
  while (remaining > 0) {
    sizes.push(Math.min(size, remaining));
    remaining -= size;
    size = rest;
  }
  return sizes;
}

const cards = (page: Page) => page.locator('main a[href*="/posts/"]');
const cardTitles = (page: Page) => cards(page).locator('h2');
const pageIndicator = (page: Page) => page.getByText(/^Page \d+ of \d+$/);
const nextButton = (page: Page) => page.getByRole('button', { name: 'Next page' });
const prevButton = (page: Page) => page.getByRole('button', { name: 'Previous page' });
// Post 03 in every section deliberately has a very long title (see makePost in mockData.ts).
const title = (label: string, n: number) =>
  n === 3 ? `${MOCK_LONG_TITLE} (${label})` : `${label} Post ${String(n).padStart(2, '0')}`;

for (const s of sections) {
  test.describe(`${s.name} listing`, () => {
    test.describe('with no posts', () => {
      test.use({ scenario: 'empty' });

      test('shows the empty-state message and no cards or pagination', async ({ page }) => {
        await page.goto(s.path);
        await expect(page.getByRole('heading', { level: 1, name: s.heading })).toBeVisible();
        await expect(page.getByText(s.emptyText)).toBeVisible();
        await expect(cards(page)).toHaveCount(0);
        await expect(pageIndicator(page)).toHaveCount(0);
        await expect(nextButton(page)).toHaveCount(0);
      });
    });

    test.describe('with a single post', () => {
      test.use({ scenario: 'single' });

      test('renders only the hero, with pagination "Page 1 of 1" and both buttons disabled', async ({ page }) => {
        await page.goto(s.path);
        await expect(cards(page)).toHaveCount(1);
        await expect(cardTitles(page)).toHaveText([title(s.label, 1)]);
        await expect(page.getByText('Read More')).toHaveCount(1); // hero only
        await expect(pageIndicator(page)).toHaveText('Page 1 of 1');
        await expect(prevButton(page)).toBeDisabled();
        await expect(nextButton(page)).toBeDisabled();
      });
    });

    test.describe('with exactly one full page (10 posts)', () => {
      test.use({ scenario: 'ten' });

      test('fits on one page', async ({ page }) => {
        await page.goto(s.path);
        await expect(cards(page)).toHaveCount(10);
        await expect(pageIndicator(page)).toHaveText('Page 1 of 1');
        await expect(nextButton(page)).toBeDisabled();
      });
    });

    test.describe('with one post more than a page (11 posts)', () => {
      test.use({ scenario: 'eleven' });

      test('paginates: first page full, second page holds the remaining post', async ({ page }) => {
        await page.goto(s.path);
        await expect(cards(page)).toHaveCount(10);
        await expect(pageIndicator(page)).toHaveText('Page 1 of 2');
        await expect(prevButton(page)).toBeDisabled();
        await expect(nextButton(page)).toBeEnabled();

        await nextButton(page).click();
        await expect(pageIndicator(page)).toHaveText('Page 2 of 2');
        await expect(cardTitles(page)).toHaveText([title(s.label, 11)]);
        await expect(nextButton(page)).toBeDisabled();
        await expect(prevButton(page)).toBeEnabled();

        await prevButton(page).click();
        await expect(pageIndicator(page)).toHaveText('Page 1 of 2');
        await expect(cards(page)).toHaveCount(10);
        await expect(cardTitles(page).first()).toHaveText(title(s.label, 1));
      });

      test('sort order toggles between oldest and newest first', async ({ page }) => {
        await page.goto(s.path);
        const sort = page.getByRole('button', { name: 'Oldest First' });
        await expect(sort).toBeVisible();
        await expect(cardTitles(page).first()).toHaveText(title(s.label, 1));

        await sort.click();
        await page.getByText('Newest First', { exact: true }).click();
        await expect(page.getByRole('button', { name: 'Newest First' })).toBeVisible();
        await expect(cardTitles(page).first()).toHaveText(title(s.label, 11));
        await expect(cardTitles(page).last()).toHaveText(title(s.label, 2));

        await nextButton(page).click();
        await expect(cardTitles(page)).toHaveText([title(s.label, 1)]); // oldest lands on page 2

        await page.getByRole('button', { name: 'Newest First' }).click();
        await page.getByText('Oldest First', { exact: true }).click();
        await expect(cardTitles(page)).toHaveText([title(s.label, 11)]); // still page 2: oldest-first leaves the newest post alone here
      });

      test('view mode: grid shows a hero, list view is compact; switching pages keeps the mode', async ({ page }) => {
        await page.goto(s.path);
        const grid = page.getByRole('button', { name: 'Grid view' });
        const list = page.getByRole('button', { name: 'List view' });
        await expect(grid).toHaveAttribute('aria-pressed', 'true');
        await expect(page.getByText('Read More')).toHaveCount(1);

        await list.click();
        await expect(list).toHaveAttribute('aria-pressed', 'true');
        await expect(grid).toHaveAttribute('aria-pressed', 'false');
        await expect(page.getByText('Read More')).toHaveCount(0);
        await expect(cards(page)).toHaveCount(10);

        await nextButton(page).click();
        await expect(pageIndicator(page)).toHaveText('Page 2 of 2');
        await expect(list).toHaveAttribute('aria-pressed', 'true');

        await grid.click();
        await expect(grid).toHaveAttribute('aria-pressed', 'true');
      });

      test('post cards link to the post page of this section', async ({ page }) => {
        await page.goto(s.path);
        await expect(cards(page).first()).toHaveAttribute('href', `${s.path}/posts/post-1`);
        await cards(page).nth(2).click();
        await expect(page).toHaveURL(`${s.path}/posts/post-3`);
      });
    });

    test.describe('with many posts (30)', () => {
      test.use({ scenario: 'many' });

      test('every post appears exactly once, in order, across all pages', async ({ page }) => {
        const sizes = s.pageSizes(30);
        await page.goto(s.path);

        const seen: string[] = [];
        for (let i = 0; i < sizes.length; i++) {
          await expect(pageIndicator(page)).toHaveText(`Page ${i + 1} of ${sizes.length}`);
          await expect(cards(page)).toHaveCount(sizes[i]);
          // Mid-page-turn the previous page's cards can still be present; wait for this page's first title.
          const expectedFirst = seen.length + 1;
          await expect(cardTitles(page).first()).toHaveText(title(s.label, expectedFirst));
          seen.push(...(await cardTitles(page).allTextContents()));

          if (i < sizes.length - 1) {
            await expect(nextButton(page)).toBeEnabled();
            await nextButton(page).click();
          }
        }

        expect(seen).toEqual(Array.from({ length: 30 }, (_, n) => title(s.label, n + 1)));
        await expect(nextButton(page)).toBeDisabled();
        await expect(prevButton(page)).toBeEnabled();
      });
    });

    test.describe('awkward content', () => {
      test.use({ scenario: 'eleven' });

      test('very long titles do not break the layout; missing author/subtitle/excerpt render cleanly', async ({ page }) => {
        await page.goto(s.path);
        await expect(cards(page)).toHaveCount(10);

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, 'page scrolls horizontally').toBeLessThanOrEqual(0);

        const longCard = cards(page).filter({ hasText: MOCK_LONG_TITLE });
        await expect(longCard).toHaveCount(1);
        const box = await longCard.boundingBox();
        expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);

        // Post 05 has no author, subtitle or excerpt: it still renders, with no leaked "undefined"/"null".
        const bare = cards(page).filter({ hasText: title(s.label, 5) });
        await expect(bare).toHaveCount(1);
        await expect(bare.getByText('Lou Fleming')).toHaveCount(0);
        const text = await page.locator('main').innerText();
        expect(text).not.toMatch(/\b(undefined|null|NaN)\b/);
      });
    });

    test.describe('loading state', () => {
      test.use({ scenario: 'eleven' });

      test('shows a skeleton when loading takes over 500ms, then the posts', async ({ page }) => {
        // Hold the Server Action response (a POST to the page URL) for 1.5s.
        await page.route(`**${s.path}`, async (route) => {
          if (route.request().method() === 'POST') await new Promise((r) => setTimeout(r, 1500));
          await route.continue();
        });
        await page.goto(s.path);
        await expect(page.locator('.animate-pulse').first()).toBeVisible();
        await expect(cards(page)).toHaveCount(0);
        await expect(cards(page)).toHaveCount(10, { timeout: 10_000 });
        await expect(page.locator('.animate-pulse')).toHaveCount(0);
      });
    });
  });
}
