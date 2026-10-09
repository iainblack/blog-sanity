import type { Page } from '@playwright/test';
import { test, expect } from './fixtures';
import { installFakeSanityApi, type FakeSanityApi } from './sanityApi';

/**
 * The embedded Sanity Studio (/studio), run for real in the browser but against an offline
 * stand-in for the Sanity API (see sanityApi.ts) serving the mock dataset. Covers what an
 * editor relies on: the Studio loads past login, the custom sidebar, each list showing its
 * documents, the document editor, the singleton rules, the Unsplash image source and the
 * Presentation tool. A real login against the real project is still a manual check.
 */

// The Studio is a large client bundle; the first dev-server compile can take a while.
test.describe.configure({ timeout: 180_000 });

let api: FakeSanityApi;
let pageErrors: string[];

test.beforeEach(async ({ page, context, baseURL }) => {
  api = await installFakeSanityApi(context, baseURL!);
  pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
});

test.afterEach(() => {
  expect(pageErrors, 'uncaught errors in the Studio').toEqual([]);
  expect(api.blockedWebSockets, 'Studio opened a WebSocket to a non-local host').toEqual([]);
});

async function openStudio(page: Page, path = '/studio/structure') {
  await page.goto(path, { timeout: 150_000 });
  // The signed-in user's avatar only appears once the Studio is past login.
  await expect(page.getByText('EE', { exact: true })).toBeVisible({ timeout: 60_000 });
}

/** An item in the Structure tool's pane lists, by its visible title. */
const paneItem = (page: Page, title: string) => page.getByRole('link', { name: title, exact: true });

/**
 * Sanity's lists ignore the pointer until the mouse moves (so hover can't hijack keyboard
 * navigation), which a real editor always does first. Do the same before clicking.
 */
async function open(page: Page, target: ReturnType<Page['locator']>) {
  const box = await target.boundingBox();
  if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 2 });
  await target.click();
}

test.describe('Studio', () => {
  test('loads past login as the fake editor and shows the custom sidebar', async ({ page }) => {
    await openStudio(page);
    for (const title of ['Posts', 'Resources', 'Photo Gallery Images', 'Landing Page Panels', 'Authors', 'Additional Info']) {
      await expect(paneItem(page, title)).toBeVisible();
    }
    await expect(page.getByRole('link', { name: 'Presentation' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Structure' })).toBeVisible();
  });

  test('Posts lists one section per blog page, each showing its posts', async ({ page }) => {
    await openStudio(page);
    await open(page, paneItem(page, 'Posts'));
    for (const section of ["Lou's Healing Journey", 'Additional Topics', 'Messages for Humanity']) {
      await expect(paneItem(page, section)).toBeVisible();
    }
    await open(page, paneItem(page, "Lou's Healing Journey"));
    await expect(page.getByText('Healing Journey Post 01')).toBeVisible();
    await expect(page.getByText('Messages Post 01')).toHaveCount(0);
  });

  test('a post opens in the editor with its fields and values', async ({ page }) => {
    await openStudio(page);
    await open(page, paneItem(page, 'Posts'));
    await open(page, paneItem(page, "Lou's Healing Journey"));
    await open(page, page.getByText('Healing Journey Post 01'));
    for (const label of ['Page', 'Title', 'Subtitle', 'Slug', 'Content']) {
      await expect(page.getByText(label, { exact: true }).first()).toBeVisible();
    }
    await expect(page.locator('input[value="Healing Journey Post 01"]')).toBeVisible();
  });

  test('Resources lists one filtered list per resource type', async ({ page }) => {
    await openStudio(page);
    await open(page, paneItem(page, 'Resources'));
    for (const type of ['Books', 'Websites', 'Other']) await expect(paneItem(page, type)).toBeVisible();
    await open(page, paneItem(page, 'Books'));
    await expect(page.getByText('The Healing Journey Book')).toBeVisible();
    await expect(page.getByText('National Wellness Institute')).toHaveCount(0);
  });

  test('gallery images and landing page panels list their documents', async ({ page }) => {
    await openStudio(page);
    await open(page, paneItem(page, 'Photo Gallery Images'));
    await expect(page.getByText('Mock photo 1').first()).toBeVisible();
    await open(page, paneItem(page, 'Landing Page Panels'));
    // The fixture panels have no title, so their previews read "Untitled".
    await expect(page.getByText('Untitled')).toHaveCount(2);
  });

  test('the Additional Info singleton opens directly and cannot be duplicated', async ({ page }) => {
    await openStudio(page);
    await open(page, paneItem(page, 'Additional Info'));
    await expect(page.locator(`input[value="Lou's Blog (Mock)"]`)).toBeVisible();
    await page.getByRole('button', { name: 'Open document actions' }).click();
    await expect(page.getByRole('menuitem', { name: /delete/i })).toBeVisible();
    await expect(page.getByRole('menuitem', { name: /duplicate/i })).toHaveCount(0);
  });

  test('the global "new document" menu offers posts but not the singleton', async ({ page }) => {
    await openStudio(page);
    await page.getByRole('button', { name: /create new document/i }).click();
    const menu = page.getByRole('listbox', { name: /new-document/ });
    await expect(menu.getByRole('option', { name: 'Post' })).toBeVisible();
    await expect(menu.getByRole('option')).not.toHaveCount(0);
    await expect(menu.getByRole('option', { name: 'Additional Info' })).toHaveCount(0);
  });

  test('image fields offer the Unsplash asset source', async ({ page }) => {
    await openStudio(page);
    await open(page, paneItem(page, 'Additional Info'));
    await page.getByRole('button', { name: 'Select', exact: true }).click();
    await expect(page.getByRole('menuitem', { name: /unsplash/i })).toBeVisible();
  });

  test('the Presentation tool opens without crashing', async ({ page }) => {
    await openStudio(page, '/studio/presentation');
    await expect(page.getByText(/tool crashed/i)).toHaveCount(0);
    await expect(page.locator('iframe')).toBeVisible();
  });
});
