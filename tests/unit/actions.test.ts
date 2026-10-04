// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { runMockQuery, MOCK_POST_COUNTS, type MockScenario } from '@/sanity/lib/mockData';

/**
 * The server actions' REAL GROQ queries are evaluated (groq-js) against the mock dataset.
 * Only the transport (`sanityFetch`) is replaced, so offsets, ordering, filtering and counts
 * come from the actual query strings in app/(blog)/actions.ts.
 */
let scenario: MockScenario = 'default';
vi.mock('@/sanity/lib/fetch', () => ({
  sanityFetch: ({ query, params }: { query: string; params?: Record<string, unknown> }) => runMockQuery(query, params ?? {}, scenario),
}));
vi.mock('next/headers', () => ({ draftMode: () => ({ disable: vi.fn() }) }));

import {
  getContentPanelsByPage,
  getGalleryImagesByPage,
  getPostAndNeighbors,
  getPostsByPage,
  getResources,
} from '@/app/(blog)/actions';

const HJ = "Lou's Healing Journey";
const titles = (posts?: { title: string }[]) => posts?.map((p) => p.title);

beforeEach(() => {
  scenario = 'default';
});

describe('getPostsByPage', () => {
  it('returns the requested slice and the full count, oldest first', async () => {
    scenario = 'many';
    const { posts, totalPosts } = await getPostsByPage(HJ, 'asc', 0, 10);
    expect(totalPosts).toBe(MOCK_POST_COUNTS.many);
    expect(posts).toHaveLength(10);
    expect(posts![0].slug).toBe('post-1');
    expect(posts![9].slug).toBe('post-10');
  });

  it('offset/limit give contiguous, non-overlapping pages', async () => {
    scenario = 'many';
    const first = await getPostsByPage(HJ, 'asc', 0, 10);
    const second = await getPostsByPage(HJ, 'asc', 10, 9);
    const third = await getPostsByPage(HJ, 'asc', 19, 9);
    const slugs = [...first.posts!, ...second.posts!, ...third.posts!].map((p) => p.slug);
    expect(slugs).toEqual(Array.from({ length: 28 }, (_, i) => `post-${i + 1}`));
  });

  it('desc order reverses it', async () => {
    scenario = 'eleven';
    const { posts } = await getPostsByPage(HJ, 'desc', 0, 10);
    expect(posts![0].slug).toBe('post-11');
    expect(posts![9].slug).toBe('post-2');
  });

  it('an offset past the end returns no posts but the right total', async () => {
    scenario = 'eleven';
    const { posts, totalPosts } = await getPostsByPage(HJ, 'asc', 50, 10);
    expect(posts).toEqual([]);
    expect(totalPosts).toBe(11);
  });

  it('only returns posts for the requested page/section', async () => {
    const { posts } = await getPostsByPage('Messages for Humanity', 'asc', 0, 20);
    expect(posts!.every((p) => p.title.includes('Messages'))).toBe(true); // postFields doesn't project pageId
    expect(posts).toHaveLength(11);
  });

  it('an unknown section is empty with a zero total', async () => {
    const { posts, totalPosts } = await getPostsByPage('Nope', 'asc', 0, 10);
    expect(posts).toEqual([]);
    expect(totalPosts).toBe(0);
  });

  it('empty dataset: no posts, total 0', async () => {
    scenario = 'empty';
    const { posts, totalPosts } = await getPostsByPage(HJ, 'asc', 0, 10);
    expect(posts).toEqual([]);
    expect(totalPosts).toBe(0);
  });

  it('applies the field fallbacks from postFields (missing author -> null, status published)', async () => {
    const { posts } = await getPostsByPage(HJ, 'asc', 0, 10);
    const noAuthor = posts!.find((p) => p.slug === 'post-5')!;
    expect(noAuthor.author).toBeNull();
    const normal = posts!.find((p) => p.slug === 'post-1')!;
    expect(normal.author).toMatchObject({ name: 'Lou Fleming' });
    expect(normal.status).toBe('published');
  });
});

describe('getResources', () => {
  it('filters by type and sorts case-insensitively by title; counts the type only', async () => {
    const { resources, totalResources } = await getResources('Books', '', 10, 0);
    expect(titles(resources)).toEqual(['Healthy Living Magazine', 'The Healing Journey Book']);
    expect(totalResources).toBe(2);
  });

  it('search is case-insensitive, partial, scoped to the type, and reflected in the count', async () => {
    const hit = await getResources('Other', 'MEDITATION', 10, 0);
    expect(titles(hit.resources)).toEqual(['Meditation Cushions Guide', 'Mindfulness Meditation App']);
    expect(hit.totalResources).toBe(2);

    const miss = await getResources('Other', 'healing', 10, 0);
    expect(miss.resources).toEqual([]);
    expect(miss.totalResources).toBe(0);
  });

  it('paginates with offset/limit', async () => {
    scenario = 'many';
    const p1 = await getResources('Books', '', 10, 0);
    const p3 = await getResources('Books', '', 10, 20);
    expect(p1.totalResources).toBe(25);
    expect(p1.resources).toHaveLength(10);
    expect(titles(p3.resources)).toEqual(['Books Resource 21', 'Books Resource 22', 'Books Resource 23', 'Books Resource 24', 'Books Resource 25']);
  });

  it('empty dataset', async () => {
    scenario = 'empty';
    expect(await getResources('Books', '', 10, 0)).toEqual({ resources: [], totalResources: 0 });
  });
});

describe('getPostAndNeighbors', () => {
  it('middle post has both neighbours', async () => {
    const { currentPost, previousPost, nextPost } = await getPostAndNeighbors('post-5', HJ);
    expect(currentPost?.slug).toBe('post-5');
    expect(previousPost?.slug).toBe('post-4');
    expect(nextPost?.slug).toBe('post-6');
  });

  it('first post has no previous; last post has no next', async () => {
    const first = await getPostAndNeighbors('post-1', HJ);
    expect(first.previousPost).toBeNull();
    expect(first.nextPost?.slug).toBe('post-2');
    const last = await getPostAndNeighbors('post-11', HJ);
    expect(last.nextPost).toBeNull();
    expect(last.previousPost?.slug).toBe('post-10');
  });

  it('is scoped to the section: same slug, different section, different post', async () => {
    const { currentPost, previousPost } = await getPostAndNeighbors('post-2', 'Messages for Humanity');
    expect(currentPost?.title).toBe('Messages Post 02');
    expect(previousPost?.title).toBe('Messages Post 01');
  });

  it('unknown slug yields nulls', async () => {
    expect(await getPostAndNeighbors('nope', HJ)).toEqual({ currentPost: null, previousPost: null, nextPost: null });
  });

  it('a single post has no neighbours', async () => {
    scenario = 'single';
    const { currentPost, previousPost, nextPost } = await getPostAndNeighbors('post-1', HJ);
    expect(currentPost?.slug).toBe('post-1');
    expect(previousPost).toBeNull();
    expect(nextPost).toBeNull();
  });
});

describe('getContentPanelsByPage / getGalleryImagesByPage', () => {
  it('returns panels for the page only', async () => {
    expect((await getContentPanelsByPage('Home'))?.map((p) => p._id)).toEqual(['panel-1', 'panel-2']);
    expect(await getContentPanelsByPage('Elsewhere')).toEqual([]);
  });

  it('resolves gallery image assets (url + dimensions) through the reference', async () => {
    const images = await getGalleryImagesByPage('Photos');
    expect(images).toHaveLength(3);
    expect(images[0].picture.asset).toMatchObject({ metadata: { dimensions: { width: 400, height: 300 } } });
    expect(images[0].picture.asset.url).toMatch(/^https:\/\/cdn\.sanity\.io\/images\//);
    expect(images.map((i) => i.order)).toEqual([1, 2, 3]);
  });

  it('empty dataset has none', async () => {
    scenario = 'empty';
    expect(await getContentPanelsByPage('Home')).toEqual([]);
    expect(await getGalleryImagesByPage('Photos')).toEqual([]);
  });
});
