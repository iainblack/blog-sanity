import { test, expect } from './fixtures';
import type { Page } from '@playwright/test';

/**
 * Update Preferences page (existing accounts only). The sandbox always contains the
 * dummy subscriber below (utils/sandbox.ts), so this flow works without signing up.
 * Tests run in parallel against one in-memory store: only the "saving a change" test changes the
 * dummy account (and restores it); tests that save or unsubscribe otherwise use their own fresh address.
 */
const DUMMY = 'subscriber@example.com';
const NEW_LABEL = 'Metaphysical Spiritual Teachings';
const LABELS = ["Lou's Healing Journey", NEW_LABEL, 'Messages for Humanity'];

const submitEmail = async (page: Page, email: string) => {
  await page.goto('/manage-email-preferences');
  await page.getByLabel('Enter your email').fill(email);
  await page.getByRole('button', { name: 'Submit' }).click();
};

/** Subscribes a fresh, unique address through the footer sign-up (own account = no cross-test interference). */
const signUpFreshSubscriber = async (page: Page, prefix: string) => {
  const email = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
  await page.goto('/');
  await page.getByPlaceholder('Enter your email').first().fill(email);
  await page.getByRole('button', { name: 'Sign Up' }).first().click();
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page.getByText('Successfully subscribed.')).toBeVisible();
  return email;
};

test.describe('Update Preferences page', () => {
  test('rejects an email that is not subscribed', async ({ page }) => {
    await submitEmail(page, 'nobody@example.com');
    await expect(page.getByText('Email not found.')).toBeVisible();
  });

  test('the dummy account shows every section, using the renamed label', async ({ page }) => {
    await submitEmail(page, DUMMY);
    for (const label of LABELS) {
      await expect(page.getByLabel(label)).toBeVisible();
    }
    await expect(page.getByText('Additional Topics')).toHaveCount(0);
  });

  test('the link from emails (?email=) opens the preferences directly', async ({ page }) => {
    await page.goto(`/manage-email-preferences?email=${DUMMY}`);
    await expect(page.locator('main').getByLabel(NEW_LABEL)).toBeVisible();
  });

  test('saving a change persists it, and the stored key is unchanged by the rename', async ({ page }) => {
    // Scoped to <main>: the footer sign-up modal contains the same checkboxes.
    const box = () => page.locator('main').getByLabel(NEW_LABEL);
    await submitEmail(page, DUMMY);
    await expect(box()).toBeVisible();
    const before = await box().isChecked();
    await expect(box()).toHaveAttribute('name', 'Additional Topics');
    try {
      await box().setChecked(!before);
      await page.getByRole('button', { name: 'Submit' }).click();
      await expect(page.getByText('Preferences updated successfully.')).toBeVisible();

      await submitEmail(page, DUMMY);
      await expect(box()).toBeVisible();
      expect(await box().isChecked()).toBe(!before);
    } finally {
      await submitEmail(page, DUMMY);
      await expect(box()).toBeVisible();
      if ((await box().isChecked()) !== before) {
        await box().setChecked(before);
        await page.getByRole('button', { name: 'Submit' }).click();
        await expect(page.getByText('Preferences updated successfully.')).toBeVisible();
      }
    }
  });

  test('saving works when opened from the emailed ?email= link (email comes from the URL, not the form)', async ({ page }) => {
    const email = await signUpFreshSubscriber(page, 'link');
    await page.goto(`/manage-email-preferences?email=${email}`);
    const box = page.locator('main').getByLabel(NEW_LABEL);
    await expect(box).toBeVisible();
    await box.uncheck();
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Preferences updated successfully.')).toBeVisible();

    await page.goto(`/manage-email-preferences?email=${email}`);
    await expect(box).not.toBeChecked();
  });

  test('a new subscriber can unsubscribe, after which the address is no longer found', async ({ page }) => {
    const email = await signUpFreshSubscriber(page, 'unsub');

    await submitEmail(page, email);
    await page.getByRole('button', { name: 'unsubscribe' }).click();
    await expect(page.getByText('You have been successfully unsubscribed.')).toBeVisible();

    await submitEmail(page, email);
    await expect(page.getByText('Email not found.')).toBeVisible();
  });
});
