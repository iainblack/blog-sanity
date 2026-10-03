/**
 * Mock Sanity API Responses
 * These functions return mock data that mirrors what Sanity would return.
 */

import type { Post, Resource, ContentPanel, GalleryImage, SettingsQueryResponse } from '@/sanity/lib/queries';

// =============================================================================
// Post Mock Data
// =============================================================================

export const createMockPost = (overrides: Partial<Post> = {}): Post => ({
  _id: 'mock-post-1',
  _createdAt: '2024-01-15T10:00:00Z',
  pageId: overrides.pageId || 'Healing Journey',
  status: 'published',
  title: 'Test Blog Post',
  subtitle: 'A subtitle for testing',
  slug: 'test-blog-post',
  excerpt: 'This is a test excerpt for the blog post that describes the content.',
  coverImage: null,
  content: [],
  date: '2024-01-15',
  author: { name: 'Test Author' },
  ...overrides,
});

export const mockPosts: Post[] = [
  createMockPost({ title: 'First Post', slug: 'first-post', date: '2024-01-01' }),
  createMockPost({ title: 'Second Post', slug: 'second-post', date: '2024-01-02' }),
  createMockPost({ title: 'Third Post', slug: 'third-post', date: '2024-01-03' }),
  createMockPost({ title: 'Fourth Post', slug: 'fourth-post', date: '2024-01-04' }),
  createMockPost({ title: 'Fifth Post', slug: 'fifth-post', date: '2024-01-05' }),
  createMockPost({ title: 'Sixth Post', slug: 'sixth-post', date: '2024-01-06' }),
  createMockPost({ title: 'Seventh Post', slug: 'seventh-post', date: '2024-01-07' }),
  createMockPost({ title: 'Eighth Post', slug: 'eighth-post', date: '2024-01-08' }),
  createMockPost({ title: 'Ninth Post', slug: 'ninth-post', date: '2024-01-09' }),
  createMockPost({ title: 'Tenth Post', slug: 'tenth-post', date: '2024-01-10' }),
  createMockPost({ title: 'Eleventh Post', slug: 'eleventh-post', date: '2024-01-11' }),
];

export const mockPostSlugs = mockPosts.map(p => ({ slug: p.slug }));

// =============================================================================
// Resource Mock Data
// =============================================================================

export const createMockResource = (overrides: Partial<Resource> = {}): Resource => ({
  _id: 'mock-resource-1',
  title: 'Test Resource',
  type: 'Books',
  description: 'This is a test resource description.',
  author: 'Test Author',
  publisher: 'Test Publisher',
  datePublished: '2024-01-01',
  url: 'https://example.com',
  urlDisplayName: 'Visit Resource',
  ...overrides,
});

export const mockResources: Resource[] = [
  createMockResource({ title: 'Book One', type: 'Books', _id: 'book-1' }),
  createMockResource({ title: 'Book Two', type: 'Books', _id: 'book-2' }),
  createMockResource({ title: 'Book Three', type: 'Books', _id: 'book-3' }),
  createMockResource({ title: 'Website One', type: 'Websites', _id: 'website-1', url: 'https://example.com' }),
  createMockResource({ title: 'Website Two', type: 'Websites', _id: 'website-2', url: 'https://example.org' }),
  createMockResource({ title: 'Other One', type: 'Other', _id: 'other-1' }),
  createMockResource({ title: 'Other Two', type: 'Other', _id: 'other-2' }),
];

// =============================================================================
// Content Panel Mock Data
// =============================================================================

export const mockContentPanels: ContentPanel[] = [
  {
    _id: 'panel-1',
    _createdAt: '2024-01-01T00:00:00Z',
    pageId: 'Home',
    content: 'Welcome to the website!',
    size: 'Large',
    backgroundColor: 'default',
    order: 1,
  },
  {
    _id: 'panel-2',
    _createdAt: '2024-01-01T00:00:00Z',
    pageId: 'Home',
    content: 'This is another content panel.',
    size: 'Medium',
    backgroundColor: 'contrast',
    order: 2,
  },
];

// =============================================================================
// Settings Mock Data
// =============================================================================

export const mockSettings: SettingsQueryResponse = {
  title: "Lou's Blog",
  description: [] as any,
  footer: [] as any,
  ogImage: null,
};

// =============================================================================
// Mock GROQ Query Responses
// =============================================================================

/**
 * Parse a GROQ query and return appropriate mock data
 */
export function getMockGroqResponse(query: string): unknown {
  // Posts queries
  if (query.includes('post') && query.includes('slug')) {
    return mockPostSlugs;
  }
  if (query.includes('_type == "post"')) {
    if (query.includes('count(')) {
      return mockPosts.length;
    }
    return mockPosts.slice(0, 10);
  }

  // Resource queries
  if (query.includes('_type == "resource"')) {
    if (query.includes('count(')) {
      return mockResources.length;
    }
    return mockResources;
  }

  // Content panel queries
  if (query.includes('_type == "contentPanel"')) {
    return mockContentPanels;
  }

  // Settings query
  if (query.includes('_type == "settings"')) {
    return mockSettings;
  }

  // Default: return empty
  return [];
}

/**
 * Check if a query expects a count
 */
export function isCountQuery(query: string): boolean {
  return query.includes('count(');
}

/**
 * Check if a query expects post slugs
 */
export function isSlugQuery(query: string): boolean {
  return query.includes('slug.current');
}
