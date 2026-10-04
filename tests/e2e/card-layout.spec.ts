import { test, expect } from './fixtures';
import type { Locator, Page } from '@playwright/test';
import { MOCK_AUTHOR_NAME, MOCK_LONG_AUTHOR_NAME } from '../../sanity/lib/mockData';

/**
 * Post cards must show the full date/author block and line up consistently.
 * Regression: the author name sat in a `truncate` (overflow hidden + nowrap) box,
 * so long names were cut off on some cards and not others. Mock post 3 in every
 * section has a long author name; post 5 has none.
 */
const sections = [
  { name: 'Healing Journey', path: '/healing-journey' },
  { name: 'Additional Topics', path: '/additional-topics' },
  { name: 'Messages for Humanity', path: '/messages-for-humanity' },
];
const viewports = [
  { name: 'mobile', width: 375, height: 800 },
  { name: 'tablet', width: 768, height: 1000 },
  { name: 'desktop', width: 1280, height: 900 },
];

const cards = (page: Page) => page.locator('main a[href*="/posts/"]');

/** Default dataset: 11 posts, 10 on page 1 (post 3 with the long author is among them). */
async function openListing(page: Page, path: string, view?: 'Grid view' | 'List view') {
  await page.goto(path);
  await expect(cards(page)).toHaveCount(10);
  if (view) {
    await page.getByRole('button', { name: view }).click();
    await expect(page.getByRole('button', { name: view })).toHaveAttribute('aria-pressed', 'true');
    await expect(cards(page)).toHaveCount(10);
  }
}

/** True if `el` is fully visible: no clipping ancestor (up to the card link) hides any of it. */
async function isUnclipped(el: Locator): Promise<boolean> {
  return el.evaluate((node) => {
    const r = node.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    // scrollWidth > clientWidth on the element itself means its own text overflows.
    if (node.scrollWidth > node.clientWidth + 1) return false;
    for (let a = node.parentElement; a && a.tagName !== 'MAIN'; a = a.parentElement) {
      const o = getComputedStyle(a);
      if (o.overflowX === 'visible' && o.overflowY === 'visible') continue;
      const ar = a.getBoundingClientRect();
      if (r.right > ar.right + 1 || r.bottom > ar.bottom + 1 || r.left < ar.left - 1) return false;
    }
    return r.right <= document.documentElement.clientWidth + 1;
  });
}

for (const s of sections) {
  for (const vp of viewports) {
    test.describe(`${s.name} cards @ ${vp.name}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      for (const view of ['Grid view', 'List view']) {
        test(`${view.toLowerCase()}: long and short author names are fully visible`, async ({ page }) => {
          await openListing(page, s.path, view as 'Grid view' | 'List view');

          for (const name of [MOCK_LONG_AUTHOR_NAME, MOCK_AUTHOR_NAME]) {
            const authors = cards(page).getByText(name, { exact: true });
            expect(await authors.count(), `cards showing "${name}"`).toBeGreaterThan(0);
            for (const author of await authors.all()) {
              await author.scrollIntoViewIfNeeded();
              expect(await isUnclipped(author), `"${name}" is clipped on a ${view.toLowerCase()} card`).toBe(true);
            }
          }
        });
      }

      test('every card contains its date and author block within its own bounds', async ({ page }) => {
        await openListing(page, s.path);
        for (const card of await cards(page).all()) {
          const box = (await card.boundingBox())!;
          for (const time of await card.locator('time').all()) {
            const t = (await time.boundingBox())!;
            expect(t.x + t.width).toBeLessThanOrEqual(box.x + box.width + 1);
          }
        }
      });
    });
  }

  test.describe(`${s.name} list rows @ desktop`, () => {
    test.use({ viewport: { width: 1280, height: 900 } });

    test('titles start at the same x position regardless of author length', async ({ page }) => {
      await openListing(page, s.path, 'List view');
      const rows = cards(page);
      expect(await rows.count()).toBeGreaterThan(3);
      const lefts: number[] = [];
      for (const row of await rows.all()) {
        lefts.push(Math.round((await row.locator('h2').boundingBox())!.x));
      }
      expect(new Set(lefts).size, `title x positions: ${lefts}`).toBe(1);
    });
  });
}
