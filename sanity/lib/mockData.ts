/**
 * Mock Sanity Data for Development Testing
 * Use ?mock=true query param to enable mock data
 */

import type { Post, Resource, ContentPanel, SettingsQueryResponse } from '@/sanity/lib/queries';

export const mockSettings: SettingsQueryResponse = {
  title: "Lou's Blog (Mock)",
  description: [] as any,
  footer: [] as any,
  ogImage: null,
};

export const mockContentPanels: ContentPanel[] = [
  {
    _id: 'mock-panel-1',
    _createdAt: '2024-01-01T00:00:00Z',
    pageId: 'Home',
    content: 'Welcome to the mock website! This content panel demonstrates how content appears on the homepage.',
    size: 'Large' as const,
    backgroundColor: 'default' as const,
    order: 1,
  },
  {
    _id: 'mock-panel-2',
    _createdAt: '2024-01-02T00:00:00Z',
    pageId: 'Home',
    content: 'This is another mock content panel with different styling.',
    size: 'Medium' as const,
    backgroundColor: 'contrast' as const,
    order: 2,
  },
];

export const mockPosts: Post[] = [
  {
    _id: 'mock-post-1',
    _createdAt: '2024-01-15T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'My First Step on the Healing Journey',
    subtitle: 'Starting something new',
    slug: 'first-step-healing',
    excerpt: 'This is the beginning of my healing journey. Join me as I explore new ways to heal and grow.',
    coverImage: null,
    content: [],
    date: '2024-01-15',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-2',
    _createdAt: '2024-01-20T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'Understanding Natural Healing Methods',
    subtitle: 'Exploring alternatives',
    slug: 'natural-healing-methods',
    excerpt: 'An exploration of natural healing methods that have helped me on this journey.',
    coverImage: null,
    content: [],
    date: '2024-01-20',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-3',
    _createdAt: '2024-01-25T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'A Post With A Very Long Title That Tests How The UI Handles Very Long Titles In The Post Preview Grid Layout',
    subtitle: 'Subtitle also very long to test truncation behavior in the UI',
    slug: 'very-long-title-test',
    excerpt: 'This excerpt is intentionally very long to test how the UI handles truncation of long text content. It should be cut off gracefully after a certain number of lines.',
    coverImage: null,
    content: [],
    date: '2024-01-25',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-4',
    _createdAt: '2024-02-01T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'Finding Peace in Daily Practice',
    subtitle: 'Building habits',
    slug: 'finding-peace',
    excerpt: 'Daily practices that help maintain peace and balance.',
    coverImage: null,
    content: [],
    date: '2024-02-01',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-5',
    _createdAt: '2024-02-05T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'Community and Connection',
    subtitle: 'Healing together',
    slug: 'community-connection',
    excerpt: 'The importance of community in the healing process.',
    coverImage: null,
    content: [],
    date: '2024-02-05',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-6',
    _createdAt: '2024-02-10T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'Reflections on Progress',
    subtitle: 'Looking back',
    slug: 'reflections-progress',
    excerpt: 'Taking time to reflect on how far we have come.',
    coverImage: null,
    content: [],
    date: '2024-02-10',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-7',
    _createdAt: '2024-02-15T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'Nutrition and Healing',
    subtitle: 'Food as medicine',
    slug: 'nutrition-healing',
    excerpt: 'How nutrition plays a crucial role in the healing journey.',
    coverImage: null,
    content: [],
    date: '2024-02-15',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-8',
    _createdAt: '2024-02-20T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'Mindfulness Practices',
    subtitle: 'Being present',
    slug: 'mindfulness-practices',
    excerpt: 'Simple mindfulness practices for everyday life.',
    coverImage: null,
    content: [],
    date: '2024-02-20',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-9',
    _createdAt: '2024-02-25T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'Overcoming Setbacks',
    subtitle: 'Resilience',
    slug: 'overcoming-setbacks',
    excerpt: 'How to handle setbacks and keep moving forward.',
    coverImage: null,
    content: [],
    date: '2024-02-25',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-10',
    _createdAt: '2024-03-01T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'Celebrating Small Wins',
    subtitle: 'Acknowledging progress',
    slug: 'celebrating-small-wins',
    excerpt: 'The importance of celebrating small victories along the way.',
    coverImage: null,
    content: [],
    date: '2024-03-01',
    author: { name: 'Lou Fleming' },
  },
  {
    _id: 'mock-post-11',
    _createdAt: '2024-03-05T10:00:00Z',
    pageId: "Lou's Healing Journey",
    status: 'published',
    title: 'The Road Ahead',
    subtitle: 'Looking forward',
    slug: 'road-ahead',
    excerpt: 'What the future holds on this healing journey.',
    coverImage: null,
    content: [],
    date: '2024-03-05',
    author: { name: 'Lou Fleming' },
  },
];

export const mockResources: Resource[] = [
  {
    _id: 'mock-resource-1',
    title: 'The Healing Journey Book',
    type: 'Books',
    description: 'A comprehensive guide to natural healing methods and practices.',
    author: 'Dr. Jane Smith',
    publisher: 'Wellness Press',
    datePublished: '2023-06-15',
    url: 'https://example.com/healing-journey',
    urlDisplayName: 'Buy on Amazon',
  },
  {
    _id: 'mock-resource-2',
    title: 'Mindfulness Meditation App',
    type: 'Other',
    description: 'A mobile app for daily mindfulness and meditation practices.',
    author: undefined,
    publisher: undefined,
    datePublished: undefined,
    url: 'https://example.com/mindfulness-app',
    urlDisplayName: 'Download App',
  },
  {
    _id: 'mock-resource-3',
    title: 'National Wellness Institute',
    type: 'Websites',
    description: 'Resources and certification for wellness professionals.',
    author: undefined,
    publisher: undefined,
    datePublished: undefined,
    url: 'https://example.com/wellness-institute',
    urlDisplayName: 'Visit Website',
  },
  {
    _id: 'mock-resource-4',
    title: 'Healthy Living Magazine',
    type: 'Books',
    description: 'Monthly publication covering all aspects of healthy living.',
    author: undefined,
    publisher: 'Health Media Inc',
    datePublished: '2024-01-01',
    url: 'https://example.com/healthy-living',
    urlDisplayName: 'Subscribe',
  },
  {
    _id: 'mock-resource-5',
    title: 'Yoga for Beginners Guide',
    type: 'Other',
    description: 'A comprehensive guide to starting your yoga practice.',
    author: 'Sarah Johnson',
    publisher: undefined,
    datePublished: undefined,
    url: 'https://example.com/yoga-guide',
    urlDisplayName: 'Read Online',
  },
  {
    _id: 'mock-resource-6',
    title: 'Mental Health America',
    type: 'Websites',
    description: 'Advocacy and resources for mental health awareness.',
    author: undefined,
    publisher: undefined,
    datePublished: undefined,
    url: 'https://example.com/mha',
    urlDisplayName: 'Visit Website',
  },
  {
    _id: 'mock-resource-7',
    title: 'The Nutrition Source',
    type: 'Websites',
    description: 'Trusted nutrition information from Tufts University.',
    author: undefined,
    publisher: 'Tufts University',
    datePublished: undefined,
    url: 'https://example.com/nutrition-source',
    urlDisplayName: 'Visit Website',
  },
  {
    _id: 'mock-resource-8',
    title: 'Meditation Cushions Guide',
    type: 'Other',
    description: 'How to choose the right meditation cushion for your practice.',
    author: 'Michael Chen',
    publisher: undefined,
    datePublished: undefined,
    url: 'https://example.com/cushions',
    urlDisplayName: 'Learn More',
  },
];

/**
 * Get mock data based on query type
 */
export function getMockData(query: string, pageId?: string): unknown[] | number {
  // Settings
  if (query.includes('_type == "settings"')) {
    return mockSettings as any;
  }

  // Content panels
  if (query.includes('_type == "contentPanel"')) {
    if (pageId === 'Home') {
      return mockContentPanels;
    }
    return [];
  }

  // Post slugs (for generateStaticParams)
  if (query.includes('slug.current') && query.includes('_type == "post"')) {
    return mockPosts.map(p => ({ slug: p.slug }));
  }

  // Post count
  if (query.includes('count(') && query.includes('post')) {
    return mockPosts.length;
  }

  // Posts
  if (query.includes('_type == "post"')) {
    // Filter by pageId if present
    if (pageId) {
      return mockPosts.filter(p => p.pageId === pageId);
    }
    return mockPosts;
  }

  // Resource count
  if (query.includes('count(') && query.includes('resource')) {
    return mockResources.length;
  }

  // Resources
  if (query.includes('_type == "resource"')) {
    return mockResources;
  }

  return [];
}
