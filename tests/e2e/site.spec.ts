import { test, expect } from './fixtures';

/**
 * Site-wide behaviour: every route renders for real (HTTP 200 + its own content),
 * navigation works, the homepage/photos render CMS content and handle empty data,
 * unknown routes 404, and the draft-mode endpoint refuses unauthenticated requests.
 */
const routes = [
  { path: '/', title: /Lou's Blog \(Mock\)/ },
  { path: '/healing-journey', heading: "Lou's Healing Journey", title: /Lou's Blog \(Mock\)/ },
  { path: '/messages-for-humanity', heading: 'Messages for Humanity' },
  { path: '/additional-topics', heading: 'Additional Topics' },
  { path: '/resources', heading: "Lou's Recommended Resources" },
  { path: '/photos' },
  { path: '/contact', heading: 'Contact Lou' },
];

test.describe('Routes', () => {
  for (const route of routes) {
    test(`${route.path} responds 200 and renders layout${route.heading ? ' and its heading' : ''}`, async ({ page }) => {
      const response = await page.goto(route.path);
      expect(response!.status()).toBe(200);
      await expect(page.locator('header')).toBeVisible();
      await expect(page.locator('footer')).toBeVisible();
      await expect(page.locator('body')).not.toContainText(/Application error|Unhandled Runtime Error/i);
      if (route.heading) {
        await expect(page.getByRole('heading', { level: 1, name: route.heading })).toBeVisible();
      }
      if (route.title) await expect(page).toHaveTitle(route.title);
    });
  }

  test('an unknown route returns a 404 page, still inside the site layout', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');
    expect(response!.status()).toBe(404);
    await expect(page.getByText('This page could not be found.')).toBeVisible();
  });
});

test.describe('Header navigation', () => {
  test('top-level links and the Blogs menu lead to the right pages', async ({ page }) => {
    await page.goto('/contact');
    const header = page.locator('header');

    await header.getByRole('link', { name: 'Home' }).click();
    await expect(page).toHaveURL('/');

    await header.getByRole('link', { name: 'Resources' }).click();
    await expect(page).toHaveURL('/resources');

    await header.getByRole('link', { name: 'Photos' }).click();
    await expect(page).toHaveURL('/photos');

    await header.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL('/contact');

    for (const [name, url] of [
      ["Lou's Healing Journey", '/healing-journey'],
      ['Additional Topics', '/additional-topics'],
      ['Messages for Humanity', '/messages-for-humanity'],
    ] as const) {
      await header.getByRole('button', { name: 'Blogs' }).hover();
      await header.getByRole('link', { name }).click();
      await expect(page).toHaveURL(url);
    }
  });

  test('Blogs menu is hidden until hovered', async ({ page }) => {
    await page.goto('/');
    const item = page.locator('header').getByRole('link', { name: 'Additional Topics' });
    await expect(item).toHaveCount(0);
    await page.locator('header').getByRole('button', { name: 'Blogs' }).hover();
    await expect(item).toBeVisible();
  });
});

test.describe('Homepage content panels', () => {
  test('renders every panel from the CMS', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Welcome to the mock website! This is the first content panel.')).toBeVisible();
    await expect(page.getByText('This is the second mock content panel.')).toBeVisible();
  });

  test.describe('no panels', () => {
    test.use({ scenario: 'empty' });
    test('renders nothing in the page body (no message, no crash)', async ({ page }) => {
      const response = await page.goto('/');
      expect(response!.status()).toBe(200);
      await expect(page.locator('main')).toBeEmpty();
    });
  });
});

test.describe('Photos', () => {
  test('renders every gallery image with its alt text', async ({ page }) => {
    await page.goto('/photos');
    for (const n of [1, 2, 3]) {
      await expect(page.locator('main').getByAltText(`Mock photo ${n} alt`)).toBeVisible();
    }
    await expect(page.locator('main img')).toHaveCount(3);
  });

  test('opens a lightbox when an image is clicked', async ({ page }) => {
    await page.goto('/photos');
    await page.locator('main').getByAltText('Mock photo 2 alt').click();
    await expect(page.locator('.yarl__container')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('.yarl__container')).toHaveCount(0);
  });

  test.describe('no images', () => {
    test.use({ scenario: 'empty' });
    test('renders an empty gallery without crashing', async ({ page }) => {
      const response = await page.goto('/photos');
      expect(response!.status()).toBe(200);
      await expect(page.locator('main img')).toHaveCount(0);
    });
  });
});

test.describe('Draft mode endpoint', () => {
  test('GET /api/draft without a valid preview secret is rejected with 401 and does not enable draft mode', async ({ page }) => {
    const response = await page.request.get('/api/draft', { maxRedirects: 0 });
    expect(response.status()).toBe(401);
    expect(await response.text()).toBe('Invalid secret');
    const cookies = await page.context().cookies();
    expect(cookies.find((c) => c.name === '__prerender_bypass')).toBeUndefined();
    await page.goto('/');
    await expect(page.getByText(/draft mode|exit preview/i)).toHaveCount(0);
  });
});
