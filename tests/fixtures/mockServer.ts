/**
 * Mock Server Setup for E2E Tests
 * Intercepts Sanity API requests and returns mock data.
 */

import { test as base, Page, Request } from '@playwright/test';
import {
  mockPosts,
  mockPostSlugs,
  mockResources,
  mockContentPanels,
  mockSettings,
} from './sanityMocks';

interface MockServerOptions {
  /** Number of posts to return (default: all) */
  postCount?: number;
  /** Number of resources to return (default: all) */
  resourceCount?: number;
  /** Whether homepage should show content panels */
  hasContentPanels?: boolean;
}

/**
 * Creates route handlers that mock Sanity API responses
 */
export function setupSanityMocks(page: Page, options: MockServerOptions = {}) {
  const {
    postCount = mockPosts.length,
    resourceCount = mockResources.length,
    hasContentPanels = true,
  } = options;

  // Intercept Sanity CDN API requests
  page.route(/\.sanity\.io\/.*\/query\/.*/, async (route) => {
    const url = route.request().url();
    const request = route.request();

    // Handle POST requests (GROQ queries)
    if (request.method() === 'POST') {
      const postData = await request.postData();
      const body = JSON.parse(postData || '{}');
      const query: string = body.query || '';

      let response: unknown;

      // Route based on query content
      if (query.includes('count(') && query.includes('post')) {
        response = postCount;
      } else if (query.includes('slug.current') && query.includes('post')) {
        response = mockPostSlugs;
      } else if (query.includes('_type == "post"')) {
        response = mockPosts.slice(0, postCount);
      } else if (query.includes('count(') && query.includes('resource')) {
        response = resourceCount;
      } else if (query.includes('_type == "resource"')) {
        response = mockResources.slice(0, resourceCount);
      } else if (query.includes('_type == "contentPanel"')) {
        response = hasContentPanels ? mockContentPanels : [];
      } else if (query.includes('_type == "settings"')) {
        response = mockSettings;
      } else {
        response = [];
      }

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: response }),
      });
      return;
    }

    // For GET requests or unmatched patterns, continue
    await route.continue();
  });

  // Also intercept any other Sanity API calls
  page.route(/\.sanity\.io\//, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: [] }),
    });
  });
}

/**
 * Test fixture with mock server support
 */
export const mockTest = base.extend<{ mockServer: MockServerOptions }>({
  mockServer: undefined,
});

/**
 * Helper to create a test with mock data
 */
export async function withMockData(
  page: Page,
  options: MockServerOptions,
  testFn: () => Promise<void>
) {
  setupSanityMocks(page, options);
  await testFn();
}

// =============================================================================
// Pre-configured Mock Scenarios
// =============================================================================

export const mockScenarios = {
  /** No posts at all */
  empty: {
    postCount: 0,
    hasContentPanels: false,
  } as MockServerOptions,

  /** Single post */
  singlePost: {
    postCount: 1,
  } as MockServerOptions,

  /** Exactly 10 posts (full first page) */
  fullFirstPage: {
    postCount: 10,
  } as MockServerOptions,

  /** 11 posts (triggers pagination) */
  multiplePages: {
    postCount: 11,
  } as MockServerOptions,

  /** No resources */
  noResources: {
    resourceCount: 0,
  } as MockServerOptions,

  /** Default scenario with realistic data */
  realistic: {} as MockServerOptions,
};
