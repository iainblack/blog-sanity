import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

/**
 * Resources page: tabs, search, pagination, empty states.
 * Default dataset (8 fixed resources):
 *   Books:    Healthy Living Magazine, The Healing Journey Book
 *   Websites: Mental Health America, National Wellness Institute, The Nutrition Source
 *   Other:    Meditation Cushions Guide, Mindfulness Meditation App, Yoga for Beginners Guide
 * (results are sorted case-insensitively by title). "many" has 25 per tab.
 */
const items = (page: Page) => page.locator('main .grid > div h2');
const tab = (page: Page, name: string) => page.getByRole('button', { name });
const search = (page: Page) => page.getByPlaceholder(/^Search /);
const pageIndicator = (page: Page) => page.getByText(/^Page \d+ of \d+$/);
const nextButton = (page: Page) => page.getByRole('button', { name: 'Next page' });
const prevButton = (page: Page) => page.getByRole('button', { name: 'Previous page' });
const emptyMessage = (page: Page) => page.getByText('Nothing Yet Available');
const isActive = async (page: Page, name: string) => /border-blue-600/.test((await tab(page, name).getAttribute('class')) ?? '');

const BOOKS = ['Healthy Living Magazine', 'The Healing Journey Book'];
const WEBSITES = ['Mental Health America', 'National Wellness Institute', 'The Nutrition Source'];
const OTHER = ['Meditation Cushions Guide', 'Mindfulness Meditation App', 'Yoga for Beginners Guide'];

test.describe('Resources - default data', () => {
  test('opens on Books, listing only books sorted by title, with one page', async ({ page }) => {
    await page.goto('/resources');
    await expect(page.getByRole('heading', { level: 1, name: "Lou's Recommended Resources" })).toBeVisible();
    await expect(items(page)).toHaveText(BOOKS);
    expect(await isActive(page, 'Books')).toBe(true);
    expect(await isActive(page, 'Websites')).toBe(false);
    await expect(search(page)).toHaveAttribute('placeholder', 'Search books...');
    await expect(pageIndicator(page)).toHaveText('Page 1 of 1');
    await expect(emptyMessage(page)).toHaveCount(0);
  });

  test('each tab shows only its own resource type and highlights as active', async ({ page }) => {
    await page.goto('/resources');
    await expect(items(page)).toHaveText(BOOKS);

    await tab(page, 'Websites').click();
    await expect(items(page)).toHaveText(WEBSITES);
    expect(await isActive(page, 'Websites')).toBe(true);
    expect(await isActive(page, 'Books')).toBe(false);
    await expect(search(page)).toHaveAttribute('placeholder', 'Search websites...');

    await tab(page, 'Other Resources').click();
    await expect(items(page)).toHaveText(OTHER);
    expect(await isActive(page, 'Other Resources')).toBe(true);
    expect(await isActive(page, 'Websites')).toBe(false);
    await expect(search(page)).toHaveAttribute('placeholder', 'Search other resources...');

    await tab(page, 'Books').click();
    await expect(items(page)).toHaveText(BOOKS);
  });

  test('renders author, publisher, publication date and the link for a resource', async ({ page }) => {
    await page.goto('/resources');
    const book = page.locator('main .grid > div', { hasText: 'The Healing Journey Book' });
    await expect(book.getByText('Published in')).toBeVisible();
    await expect(book.getByText('2023-06-15')).toBeVisible();
    await expect(book.getByText('by Wellness Press.')).toBeVisible();
    await expect(book.getByText('Written by Dr. Jane Smith.')).toBeVisible();
    await expect(book.getByText('A comprehensive guide to natural healing methods and practices.')).toBeVisible();
    const link = book.getByRole('link', { name: 'Buy on Amazon' });
    await expect(link).toHaveAttribute('href', 'https://example.com/healing-journey');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);

    // A resource without author/publisher/date does not render those lines.
    const magazine = page.locator('main .grid > div', { hasText: 'Healthy Living Magazine' });
    await expect(magazine.getByText('Written by')).toHaveCount(0);
    await expect(magazine.getByText('by Health Media Inc.')).toBeVisible();
  });

  test('search filters within the active tab, ignoring case and partial words', async ({ page }) => {
    await page.goto('/resources');
    await tab(page, 'Other Resources').click();
    await expect(items(page)).toHaveText(OTHER);

    await search(page).fill('MEDITATION');
    await expect(items(page)).toHaveText(['Meditation Cushions Guide', 'Mindfulness Meditation App']);

    await search(page).fill('yoga');
    await expect(items(page)).toHaveText(['Yoga for Beginners Guide']);

    // "Healing" exists, but only in Books: searching it in Other must find nothing.
    await search(page).fill('healing');
    await expect(emptyMessage(page)).toBeVisible();
    await expect(items(page)).toHaveCount(0);
    await expect(pageIndicator(page)).toHaveCount(0);

    await search(page).clear();
    await expect(items(page)).toHaveText(OTHER);
    await expect(emptyMessage(page)).toHaveCount(0);
  });

  test('a search with no matches shows the empty state; switching tab with the term applies it there', async ({ page }) => {
    await page.goto('/resources');
    await search(page).fill('nutrition');
    await expect(emptyMessage(page)).toBeVisible(); // Books has no "nutrition"

    await tab(page, 'Websites').click();
    await expect(items(page)).toHaveText(['The Nutrition Source']);
    await expect(search(page)).toHaveValue('nutrition');
  });
});

test.describe('Resources - empty dataset', () => {
  test.use({ scenario: 'empty' });

  test('every tab shows the empty state and no pagination', async ({ page }) => {
    await page.goto('/resources');
    for (const name of ['Books', 'Websites', 'Other Resources']) {
      await tab(page, name).click();
      await expect(emptyMessage(page)).toBeVisible();
      await expect(items(page)).toHaveCount(0);
      await expect(pageIndicator(page)).toHaveCount(0);
    }
  });
});

test.describe('Resources - pagination boundaries', () => {
  test.describe('single resource per tab', () => {
    test.use({ scenario: 'single' });
    test('one item, Page 1 of 1, both buttons disabled', async ({ page }) => {
      await page.goto('/resources');
      await expect(items(page)).toHaveCount(1);
      await expect(pageIndicator(page)).toHaveText('Page 1 of 1');
      await expect(prevButton(page)).toBeDisabled();
      await expect(nextButton(page)).toBeDisabled();
    });
  });

  test.describe('exactly one full page (10 per tab)', () => {
    test.use({ scenario: 'ten' });
    test('Page 1 of 1', async ({ page }) => {
      await page.goto('/resources');
      await expect(items(page)).toHaveCount(10);
      await expect(pageIndicator(page)).toHaveText('Page 1 of 1');
      await expect(nextButton(page)).toBeDisabled();
    });
  });

  test.describe('one more than a page (11 per tab)', () => {
    test.use({ scenario: 'eleven' });
    test('second page holds the single remaining resource', async ({ page }) => {
      await page.goto('/resources');
      await expect(items(page)).toHaveCount(10);
      await expect(pageIndicator(page)).toHaveText('Page 1 of 2');
      await nextButton(page).click();
      await expect(pageIndicator(page)).toHaveText('Page 2 of 2');
      await expect(items(page)).toHaveText(['Books Resource 11']);
      await expect(nextButton(page)).toBeDisabled();
    });
  });

  test.describe('many (25 per tab)', () => {
    test.use({ scenario: 'many' });

    test('pages of 10/10/5 cover every resource once, in order; prev/next enable correctly', async ({ page }) => {
      await page.goto('/resources');
      const expected = Array.from({ length: 25 }, (_, n) => `Books Resource ${String(n + 1).padStart(2, '0')}`);
      const seen: string[] = [];
      const sizes = [10, 10, 5];

      for (let i = 0; i < sizes.length; i++) {
        await expect(pageIndicator(page)).toHaveText(`Page ${i + 1} of 3`);
        await expect(items(page)).toHaveCount(sizes[i]);
        await expect(items(page).first()).toHaveText(expected[seen.length]);
        seen.push(...(await items(page).allTextContents()));
        await expect(prevButton(page)).toBeEnabled({ enabled: i > 0 });
        await expect(nextButton(page)).toBeEnabled({ enabled: i < sizes.length - 1 });
        if (i < sizes.length - 1) await nextButton(page).click();
      }
      expect(seen).toEqual(expected);

      await prevButton(page).click();
      await expect(pageIndicator(page)).toHaveText('Page 2 of 3');
    });

    test('switching tab returns to page 1', async ({ page }) => {
      await page.goto('/resources');
      await nextButton(page).click();
      await nextButton(page).click();
      await expect(pageIndicator(page)).toHaveText('Page 3 of 3');

      await tab(page, 'Websites').click();
      await expect(pageIndicator(page)).toHaveText('Page 1 of 3');
      await expect(items(page).first()).toHaveText('Websites Resource 01');
    });

    test('typing a search while on a later page returns to page 1', async ({ page }) => {
      await page.goto('/resources');
      await nextButton(page).click();
      await expect(pageIndicator(page)).toHaveText('Page 2 of 3');

      await search(page).fill('Resource 0'); // matches Books Resource 01-09
      await expect(items(page).first()).toHaveText('Books Resource 01');
      await expect(emptyMessage(page)).toHaveCount(0);
    });
  });
});
