import { test, expect } from './fixtures';
import type { Page, Route } from '@playwright/test';

/**
 * Contact form (/contact). `/api/sendEmail` is ALWAYS intercepted in the browser so no
 * email can ever be sent; tests assert on the exact request the form makes.
 */
const VALID = {
  firstName: 'Ada',
  lastName: 'Lovelace',
  subject: 'Hello',
  email: 'ada@example.com',
  message: 'This message is long enough.',
};

const field = {
  firstName: (p: Page) => p.locator('#contact-first-name'),
  lastName: (p: Page) => p.locator('#contact-last-name'),
  subject: (p: Page) => p.locator('#contact-subject'),
  email: (p: Page) => p.locator('#contact-email'),
  message: (p: Page) => p.locator('#contact-message'),
};
const submit = (p: Page) => p.getByRole('button', { name: 'Submit' });
// Excludes Next's route announcer, which also has role="alert".
const alertBox = (p: Page) => p.locator('[role="alert"]:not(#__next-route-announcer__)');
const fieldErrors = (p: Page) => p.locator('form p.text-red-500');

const ERRORS = {
  firstName: 'First name is required',
  lastName: 'Last name is required',
  subject: 'Subject is required',
  email: 'Email is required',
  message: 'Message is required',
};

async function fill(page: Page, values: Partial<typeof VALID>) {
  for (const [key, value] of Object.entries(values)) {
    await field[key as keyof typeof field](page).fill(value);
  }
}

/** Intercept the API, record request bodies, and respond with `status`. */
async function mockSendEmail(page: Page, status = 200, handler?: (route: Route) => Promise<void>) {
  const requests: unknown[] = [];
  await page.route('**/api/sendEmail', async (route) => {
    requests.push(route.request().postDataJSON());
    if (handler) return handler(route);
    await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify({}) });
  });
  return requests;
}

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { level: 1, name: 'Contact Lou' })).toBeVisible();
  });

  // Field-by-field validation rules, boundaries and error clearing are covered in tests/unit/message-form.test.tsx.
  test.describe('validation', () => {
    test('empty submit shows every required-field error, each field flagged, and sends nothing', async ({ page }) => {
      const requests = await mockSendEmail(page);
      await submit(page).click();

      await expect(fieldErrors(page)).toHaveText(Object.values(ERRORS));
      for (const key of Object.keys(field) as (keyof typeof field)[]) {
        await expect(field[key](page)).toHaveClass(/border-red-500/);
      }
      expect(requests).toHaveLength(0);
    });

  });

  test.describe('submission', () => {
    test('valid form posts exactly the entered values, shows success and clears the form', async ({ page }) => {
      const requests = await mockSendEmail(page);
      await fill(page, VALID);
      await submit(page).click();

      await expect(alertBox(page)).toHaveText(/Message sent successfully/);
      expect(requests).toEqual([
        { senderEmail: VALID.email, firstName: VALID.firstName, lastName: VALID.lastName, subject: VALID.subject, message: VALID.message },
      ]);
      for (const key of Object.keys(field) as (keyof typeof field)[]) {
        await expect(field[key](page)).toHaveValue('');
      }
      await expect(fieldErrors(page)).toHaveCount(0);
    });

    test('after a failed validation, a corrected submit succeeds and leaves a clean, error-free form', async ({ page }) => {
      test.fail(true, 'BUG: validation mutates the shared initial form state, so the cleared form re-shows old errors (components/MessageForm.tsx). Remove this line when fixed.');
      await mockSendEmail(page);
      await submit(page).click(); // trigger all five errors
      await expect(fieldErrors(page)).toHaveCount(5);

      await fill(page, VALID);
      await submit(page).click();
      await expect(alertBox(page)).toHaveText(/Message sent successfully/);
      await expect(field.firstName(page)).toHaveValue('');
      await expect(fieldErrors(page)).toHaveCount(0); // the cleared form must not show stale errors
    });

    test('server error shows a failure alert and keeps what the user typed', async ({ page }) => {
      await mockSendEmail(page, 500);
      await fill(page, VALID);
      await submit(page).click();

      await expect(alertBox(page)).toHaveText(/Message failed to send/);
      await expect(field.message(page)).toHaveValue(VALID.message);
      await expect(field.email(page)).toHaveValue(VALID.email);
    });

    test('shows a spinner (and no "Submit" label) while the request is in flight', async ({ page }) => {
      let release!: () => void;
      const gate = new Promise<void>((resolve) => (release = resolve));
      await mockSendEmail(page, 200, async (route) => {
        await gate;
        await route.fulfill({ status: 200, contentType: 'application/json', body: '{}' });
      });
      await fill(page, VALID);
      await submit(page).click();

      await expect(page.getByRole('button', { name: 'Submit' })).toHaveCount(0);
      await expect(page.locator('form button svg, form button .animate-spin').first()).toBeVisible();
      release();
      await expect(alertBox(page)).toHaveText(/Message sent successfully/);
      await expect(submit(page)).toBeVisible();
    });

    test('a network failure surfaces an error and re-enables the form', async ({ page }) => {
      test.fail(true, 'BUG: fetch() rejection is unhandled, so the spinner never stops and no alert shows (components/MessageForm.tsx). Remove this line when fixed.');
      await page.route('**/api/sendEmail', (route) => route.abort('connectionrefused'));
      await fill(page, VALID);
      await submit(page).click();

      await expect(alertBox(page)).toHaveText(/failed to send/i);
      await expect(submit(page)).toBeVisible();
    });
  });
});
