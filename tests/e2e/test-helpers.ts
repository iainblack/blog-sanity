/**
 * Test utilities and mocks for E2E tests
 */

import { Page } from '@playwright/test';
import {
  mockPosts,
  mockPostSlugs,
  mockResources,
  mockContentPanels,
  mockSettings,
} from '../fixtures/sanityMocks';

/**
 * Set up mock Sanity responses for a page
 */
export function mockSanityApi(page: Page) {
  // Mock the Sanity query endpoint
  // URL format: https://{projectId}.api.sanity.io/v{apiVersion}/data/query/{dataset}
  page.route(/\.sanity\.io\/.*\/query\/.*/, async (route) => {
    const url = route.request().url();
    const request = route.request();

    // Extract the dataset from the URL
    const datasetMatch = url.match(/datasets\/([^/]+)/);
    const dataset = datasetMatch ? datasetMatch[1] : 'production';

    // Build mock response based on query
    let mockResponse: unknown = [];

    if (request.method() === 'POST') {
      try {
        const body = await request.postDataJSON();
        const query: string = body.query || '';

        // Determine response based on query
        if (query.includes('"slug": slug.current') || query.includes('{slug')) {
          mockResponse = mockPostSlugs;
        } else if (query.includes('count(')) {
          if (query.includes('post')) {
            mockResponse = mockPosts.length;
          } else if (query.includes('resource')) {
            mockResponse = mockResources.length;
          }
        } else if (query.includes('_type == "post"')) {
          // Handle GROQ array slicing for pagination: [...][0...10] or [...][10...19]
          const sliceMatch = query.match(/\[(\d+)\.\.\.(\d+)\]/);
          if (sliceMatch) {
            const start = parseInt(sliceMatch[1], 10);
            const end = parseInt(sliceMatch[2], 10);
            mockResponse = mockPosts.slice(start, end);
          } else {
            mockResponse = mockPosts;
          }
        } else if (query.includes('_type == "resource"')) {
          mockResponse = mockResources;
        } else if (query.includes('_type == "contentPanel"')) {
          mockResponse = mockContentPanels;
        } else if (query.includes('_type == "settings"')) {
          mockResponse = mockSettings;
        }
      } catch (e) {
        // If parsing fails, return empty
      }
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        result: mockResponse,
        dataset,
      }),
    });
  });

  // Mock any other sanity.io requests
  page.route(/sanity\.io/, async (route) => {
    if (route.request().url().includes('query')) {
      await route.continue();
    } else {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      });
    }
  });
}

/**
 * Navigate to a URL with mock data set up
 */
export async function navigateWithMocks(page: Page, url: string) {
  mockSanityApi(page);
  await page.goto(url);
  await page.waitForLoadState('domcontentloaded');
}
