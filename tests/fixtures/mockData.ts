import { test, expect, Page } from '@playwright/test';

// =============================================================================
// MOCK DATA - These simulate real Sanity responses
// =============================================================================

export const mockPosts = {
  empty: [],
  single: [
    createPost({ title: 'Single Post', slug: 'single-post' })
  ],
  tenPosts: Array.from({ length: 10 }, (_, i) =>
    createPost({ title: `Post ${i + 1}`, slug: `post-${i + 1}`, date: `2024-01-${String(i + 1).padStart(2, '0')}` })
  ),
  elevenPosts: Array.from({ length: 11 }, (_, i) =>
    createPost({ title: `Post ${i + 1}`, slug: `post-${i + 1}`, date: `2024-01-${String(i + 1).padStart(2, '0')}` })
  ),
  manyPosts: Array.from({ length: 25 }, (_, i) =>
    createPost({ title: `Post ${i + 1} With A Very Long Title That Should Be Truncated`, slug: `post-${i + 1}`, date: `2024-01-${String((i % 28) + 1).padStart(2, '0')}` })
  ),
  longText: [
    createPost({
      title: 'A Very Long Post Title That Tests Truncation Behavior With Many Many Many Words',
      subtitle: 'An Extremely Long Subtitle That Also Tests How The UI Handles Excessive Text Content Here',
      excerpt: 'This is a very long excerpt that should be truncated when displayed in the post preview grid. It contains multiple sentences and should be cut off gracefully after a certain number of lines or characters.',
      slug: 'long-text-post'
    })
  ]
};

export const mockResources = {
  empty: [],
  single: [createResource({ title: 'Single Resource' })],
  many: Array.from({ length: 15 }, (_, i) =>
    createResource({ title: `Resource ${i + 1}`, type: i % 3 === 0 ? 'Books' : i % 3 === 1 ? 'Websites' : 'Other' })
  )
};

function createPost(overrides: Partial<Post> = {}): Post {
  return {
    _id: overrides._id || `post-${Math.random().toString(36).substr(2, 9)}`,
    _createdAt: '2024-01-01T00:00:00Z',
    pageId: overrides.pageId || 'Test Page',
    status: 'published',
    title: overrides.title || 'Test Post',
    subtitle: overrides.subtitle || null,
    slug: overrides.slug || 'test-post',
    excerpt: overrides.excerpt || 'This is a test excerpt for the post.',
    coverImage: overrides.coverImage || null,
    content: [],
    date: overrides.date || '2024-01-01',
    author: overrides.author || { name: 'Test Author' }
  };
}

function createResource(overrides: Partial<Resource> = {}): Resource {
  return {
    _id: overrides._id || `resource-${Math.random().toString(36).substr(2, 9)}`,
    title: overrides.title || 'Test Resource',
    type: overrides.type || 'Books',
    description: overrides.description || 'This is a test resource description.',
    author: overrides.author || null,
    publisher: overrides.publisher || null,
    datePublished: overrides.datePublished || null,
    url: overrides.url || 'https://example.com',
    urlDisplayName: overrides.urlDisplayName || null
  };
}

interface Post {
  _id: string;
  _createdAt: string;
  pageId: string;
  status: string;
  title: string;
  subtitle: string | null;
  slug: string;
  excerpt: string | null;
  coverImage: any;
  content: any[];
  date: string;
  author: { name: string } | null;
}

interface Resource {
  _id: string;
  title: string;
  type: 'Books' | 'Websites' | 'Other';
  description: string;
  author: string | null;
  publisher: string | null;
  datePublished: string | null;
  url: string;
  urlDisplayName: string | null;
}

// =============================================================================
// HELPER: Mock sanity fetch for a specific page
// =============================================================================

export async function mockPostListPage(page: Page, posts: Post[]) {
  await page.route('**/api/draft**', route => {
    route.fulfill({ status: 401, body: 'Unauthorized' });
  });

  // The page fetches posts via getPostsByPage which calls sanityFetch
  // We intercept at the API level
  await page.route('**/sanity/api/**', route => {
    const url = route.request().url();
    if (url.includes('post')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(posts)
      });
    } else {
      route.continue();
    }
  });
}

// =============================================================================
// CONTACT FORM TEST DATA
// =============================================================================

export const contactFormTestCases = {
  emptyFields: {
    fields: {},
    expectedErrors: ['First name is required', 'Last name is required', 'Email is required', 'Subject is required', 'Message is required']
  },
  missingFirstName: {
    fields: { lastName: 'Doe', email: 'test@test.com', subject: 'Test', message: 'This is a test message.' },
    expectedErrors: ['First name is required']
  },
  missingLastName: {
    fields: { firstName: 'John', email: 'test@test.com', subject: 'Test', message: 'This is a test message.' },
    expectedErrors: ['Last name is required']
  },
  invalidEmail: {
    fields: { firstName: 'John', lastName: 'Doe', email: 'notanemail', subject: 'Test', message: 'This is a test message.' },
    expectedErrors: ['Invalid email']
  },
  shortMessage: {
    fields: { firstName: 'John', lastName: 'Doe', email: 'test@test.com', subject: 'Test', message: 'Short' },
    expectedErrors: ['Message must be at least 10 characters']
  },
  validForm: {
    fields: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      subject: 'Test Subject',
      message: 'This is a valid test message that is long enough.'
    },
    expectedErrors: []
  }
};
