// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';
import { Schema } from '@sanity/schema';
import { groupProblems, validateSchema } from '@sanity/schema/_internal';
import { pageStructure, singletonPlugin } from '@/sanity/plugins/settings';
import post from '@/sanity/schemas/documents/post';
import author from '@/sanity/schemas/documents/author';
import contentPanel from '@/sanity/schemas/documents/contentPanel';
import galleryImage from '@/sanity/schemas/documents/galleryImage';
import resource from '@/sanity/schemas/documents/resource';
import settings from '@/sanity/schemas/singletons/settings';

/**
 * Sanity Studio configuration. The live Studio needs a Sanity login and network access, so
 * these tests exercise the configuration it is built from: the sidebar structure (run against
 * a recording stand-in for the Structure Builder), the singleton plugin, and the real schemas
 * (compiled by Sanity). The Studio itself is covered offline by tests/e2e/studio.spec.ts.
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
  documentTypeListItem: (type: string) => recorder('documentTypeListItem').id(type),
  documentTypeListItems: () => [],
  divider: () => recorder('divider'),
};

describe('Studio sidebar (pageStructure)', () => {
  orderableCalls.length = 0;
  const root: any = pageStructure([settings as any])(S, {} as any);
  const items: any[] = root.__props.items;
  const byTitle = (title: string) => items.find((i: any) => i.__props?.title === title);
  const postLists = orderableCalls.filter((c) => c.type === 'post');

  it('has a "Content" root with every section in order', () => {
    expect(root.__props.title).toBe('Content');
    expect(items.map((i: any) => i.__props?.title ?? i.orderable?.title ?? i.__props?.kind)).toEqual([
      'Posts',
      'Resources',
      'Photo Gallery Images',
      'Landing Page Panels',
      'Authors',
      'divider',
      settings.title,
    ]);
  });

  it('has a Posts group listing one orderable post list per blog section, in order', () => {
    expect(byTitle('Posts')).toBeDefined();
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

  it('gives each post list a stable id from the page slug (the URL slug is unchanged)', () => {
    expect(postLists.map((c) => c.id)).toEqual(['healing-journey', 'additional-topics', 'messages-for-humanity']);
  });

  it('makes gallery images and landing page panels orderable', () => {
    expect(orderableCalls.map((c) => c.type)).toEqual(expect.arrayContaining(['galleryImage', 'contentPanel']));
  });

  it('has a Resources group with one filtered list per resource type', () => {
    const lists = byTitle('Resources').__props.child.__props.items;
    expect(lists.map((i: any) => i.__props.title)).toEqual(['Books', 'Websites', 'Other']);
    const books = lists[0].__props.child.__props;
    expect(books.filter).toBe('_type == "resource" && type == $type');
    expect(books.params).toEqual({ type: 'Books' });
  });

  it('opens the settings singleton as a single fixed document', () => {
    const editor = byTitle('Additional Info').__props.child.__props;
    expect(editor).toMatchObject({ kind: 'editor', id: 'settings', schemaType: 'settings', documentId: 'settings' });
  });
});

describe('Studio singleton plugin', () => {
  const plugin: any = singletonPlugin(['settings']);
  const templates = [{ templateId: 'settings' }, { templateId: 'post' }];
  const actions = [{ action: 'publish' }, { action: 'duplicate' }, { action: 'delete' }];

  it('hides singletons from the global "new document" menu only', () => {
    expect(plugin.document.newDocumentOptions(templates, { creationContext: { type: 'global' } })).toEqual([
      { templateId: 'post' },
    ]);
    expect(plugin.document.newDocumentOptions(templates, { creationContext: { type: 'structure' } })).toEqual(templates);
  });

  it('removes "duplicate" from singletons but not from other documents', () => {
    expect(plugin.document.actions(actions, { schemaType: 'settings' }).map((a: any) => a.action)).toEqual([
      'publish',
      'delete',
    ]);
    expect(plugin.document.actions(actions, { schemaType: 'post' })).toEqual(actions);
  });
});

describe('Studio schema', () => {
  const types = [settings, post, author, contentPanel, galleryImage, resource];
  const schema = Schema.compile({ name: 'default', types });
  const field = (type: string, name: string) => schema.get(type).fields.find((f: any) => f.name === name);

  it('has no schema errors (the check the Studio runs before it will load)', () => {
    const problems = groupProblems(validateSchema(types).getTypes()).flatMap((group: any) => group.problems);
    expect(problems.filter((p: any) => p.severity === 'error')).toEqual([]);
  });

  it('compiles every document type registered in sanity.config.ts', () => {
    for (const type of ['settings', 'post', 'author', 'contentPanel', 'galleryImage', 'resource']) {
      expect(schema.get(type), type).toBeDefined();
    }
  });

  it('post "Page" dropdown shows the new label but stores the unchanged key', () => {
    const list = field('post', 'pageId').type.options.list;
    expect(list).toContainEqual({ title: 'Metaphysical Spiritual Teachings', value: 'Additional Topics' });
    expect(list.map((o: any) => o.title)).not.toContain('Additional Topics');
  });

  it('requires a page, so a post can never be saved without one', () => {
    expect(field('post', 'pageId').type.validation).toBeDefined();
  });

  it('other document types keep their fixed page lists', () => {
    expect(field('contentPanel', 'pageId').type.options.list).toEqual(['Home']);
    expect(field('galleryImage', 'pageId').type.options.list).toEqual(['Photos']);
  });
});
