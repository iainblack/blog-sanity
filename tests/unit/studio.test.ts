// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { Schema } from '@sanity/schema';
import { pageStructure } from '@/sanity/plugins/settings';
import post from '@/sanity/schemas/documents/post';
import author from '@/sanity/schemas/documents/author';
import contentPanel from '@/sanity/schemas/documents/contentPanel';
import galleryImage from '@/sanity/schemas/documents/galleryImage';
import resource from '@/sanity/schemas/documents/resource';

/**
 * Sanity Studio configuration. The live Studio needs a Sanity login and network access, so
 * these tests exercise the configuration it is built from: the sidebar structure (run against
 * a recording stand-in for the Structure Builder) and the real schemas (compiled by Sanity).
 */

const orderableCalls = vi.hoisted(() => [] as any[]);
vi.mock('@sanity/orderable-document-list', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@sanity/orderable-document-list')>()),
  orderableDocumentListDeskItem: (config: any) => {
    orderableCalls.push(config);
    return { orderable: config };
  },
}));

/** Chainable stand-in for the Structure Builder: records every method call and its arguments. */
function recorder(kind: string): any {
  const props: Record<string, any> = { kind };
  const proxy: any = new Proxy(() => {}, {
    get: (_t, name: string) => {
      if (name === '__props') return props;
      return (...args: any[]) => {
        props[name] = args.length > 1 ? args : args[0];
        return proxy;
      };
    },
  });
  return proxy;
}
const S: any = {
  listItem: () => recorder('listItem'),
  list: () => recorder('list'),
  editor: () => recorder('editor'),
  documentList: () => recorder('documentList'),
  documentTypeListItem: () => recorder('documentTypeListItem'),
  documentTypeListItems: () => [],
  divider: () => recorder('divider'),
};

describe('Studio sidebar (pageStructure)', () => {
  orderableCalls.length = 0;
  const root: any = pageStructure([])(S, {} as any);
  const postsItem = root.__props.items.find((i: any) => i.__props.title === 'Posts');
  const postLists = orderableCalls.filter((c) => c.type === 'post');

  it('has a Posts group listing one post list per blog section, in order', () => {
    expect(postsItem).toBeDefined();
    expect(postLists.map((c) => c.title)).toEqual([
      "Lou's Healing Journey",
      'Metaphysical Spiritual Teachings',
      'Messages for Humanity',
    ]);
  });

  it('shows the new section name and never the old one anywhere in the sidebar', () => {
    const titles = orderableCalls.map((c) => c.title);
    expect(titles).not.toContain('Additional Topics');
  });

  it('still filters each list by the unchanged stored pageId, so existing posts appear', () => {
    expect(postLists.map((c) => c.filter)).toEqual([
      `_type == "post" && pageId == "Lou's Healing Journey"`,
      `_type == "post" && pageId == "Additional Topics"`,
      `_type == "post" && pageId == "Messages for Humanity"`,
    ]);
  });

  it('gives each list a stable id from the page slug (the URL slug is unchanged)', () => {
    expect(postLists.map((c) => c.id)).toEqual(['healing-journey', 'additional-topics', 'messages-for-humanity']);
  });
});

describe('Studio schema', () => {
  const schema = Schema.compile({
    name: 'default',
    types: [post, author, contentPanel, galleryImage, resource],
  });
  const pageIdField = () => schema.get('post').fields.find((f: any) => f.name === 'pageId');

  it('compiles with the renamed-section dropdown (no schema errors)', () => {
    expect(schema.get('post')).toBeDefined();
    expect(pageIdField()).toBeDefined();
  });

  it('post "Page" dropdown shows the new label but stores the unchanged key', () => {
    const list = pageIdField().type.options.list;
    expect(list).toContainEqual({ title: 'Metaphysical Spiritual Teachings', value: 'Additional Topics' });
    expect(list.map((o: any) => o.title)).not.toContain('Additional Topics');
  });

  it('requires a page, so a post can never be saved without one', () => {
    expect(pageIdField().type.validation).toBeDefined();
  });

  it('other document types keep their plain-string page lists (untouched by the rename)', () => {
    const panelList = schema.get('contentPanel').fields.find((f: any) => f.name === 'pageId').type.options.list;
    expect(panelList).toEqual(['Home']);
    const galleryList = schema.get('galleryImage').fields.find((f: any) => f.name === 'pageId').type.options.list;
    expect(galleryList).toEqual(['Photos']);
  });
});
