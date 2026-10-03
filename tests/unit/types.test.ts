import { describe, it, expect } from 'vitest';
import type {
  Post,
  Resource,
  Author,
  GalleryImage,
  ContentPanel,
  SettingsQueryResponse,
} from '@/sanity/lib/queries';

describe('Post interface', () => {
  it('accepts valid post object', () => {
    const post: Post = {
      _id: 'post-1',
      _createdAt: '2024-01-01T00:00:00Z',
      pageId: 'main',
      status: 'published',
      title: 'Test Post',
      slug: 'test-post',
      content: [],
      date: '2024-01-01',
    };
    expect(post._id).toBe('post-1');
    expect(post.status).toBe('published');
  });

  it('allows optional fields', () => {
    const post: Post = {
      _id: 'post-1',
      _createdAt: '2024-01-01T00:00:00Z',
      pageId: 'main',
      status: 'draft',
      title: 'Draft Post',
      slug: 'draft-post',
      content: [],
      date: '2024-01-01',
    };
    expect(post.excerpt).toBeUndefined();
    expect(post.coverImage).toBeUndefined();
    expect(post.author).toBeUndefined();
  });
});

describe('Resource interface', () => {
  it('accepts valid resource object', () => {
    const resource: Resource = {
      _id: 'resource-1',
      title: 'Test Resource',
      type: 'Books',
      description: 'A test resource',
      author: 'Test Author',
    };
    expect(resource.type).toBe('Books');
  });

  it('accepts all resource types', () => {
    const book: Resource = { _id: '1', title: 'Book', type: 'Books', description: '' };
    const website: Resource = { _id: '2', title: 'Website', type: 'Websites', description: '' };
    const other: Resource = { _id: '3', title: 'Other', type: 'Other', description: '' };
    expect([book.type, website.type, other.type]).toEqual(['Books', 'Websites', 'Other']);
  });
});

describe('Author interface', () => {
  it('accepts valid author', () => {
    const author: Author = { name: 'John Doe' };
    expect(author.name).toBe('John Doe');
  });
});

describe('GalleryImage interface', () => {
  it('accepts valid gallery image', () => {
    const image: GalleryImage = {
      _id: 'gallery-1',
      pageId: 'photos',
      title: 'Gallery Image',
      order: 1,
      picture: {
        asset: {
          _id: 'asset-1',
          url: 'https://example.com/image.jpg',
          metadata: {
            dimensions: { width: 800, height: 600 },
          },
        },
        alt: 'Test alt text',
      },
    };
    expect(image.order).toBe(1);
    expect(image.picture.asset.metadata.dimensions.width).toBe(800);
  });
});

describe('ContentPanel interface', () => {
  it('accepts valid content panel', () => {
    const panel: ContentPanel = {
      _id: 'panel-1',
      _createdAt: '2024-01-01T00:00:00Z',
      pageId: 'home',
      content: 'Panel content',
      size: 'Medium',
      backgroundColor: 'default',
      order: 1,
    };
    expect(panel.size).toBe('Medium');
    expect(panel.backgroundColor).toBe('default');
  });

  it('accepts all size variants', () => {
    const small: ContentPanel = createPanel('Small');
    const medium: ContentPanel = createPanel('Medium');
    const large: ContentPanel = createPanel('Large');
    expect([small.size, medium.size, large.size]).toEqual(['Small', 'Medium', 'Large']);
  });

  it('accepts all background color variants', () => {
    const colors: ContentPanel['backgroundColor'][] = ['default', 'contrast', 'primary', 'dark'];
    colors.forEach((color) => {
      const panel = createPanel('Small', color);
      expect(panel.backgroundColor).toBe(color);
    });
  });
});

function createPanel(size: ContentPanel['size'], backgroundColor: ContentPanel['backgroundColor'] = 'default'): ContentPanel {
  return {
    _id: 'panel-1',
    _createdAt: '2024-01-01T00:00:00Z',
    pageId: 'home',
    content: 'Test content',
    size,
    backgroundColor,
    order: 1,
  };
}
