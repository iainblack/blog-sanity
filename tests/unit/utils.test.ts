import { describe, expect, it } from 'vitest';
import { emailPreferenceOptions, normalizeText } from '@/components/utils';
import { resolveOpenGraphImage, urlForImage } from '@/sanity/lib/utils';

describe('normalizeText', () => {
  const block = (text: string) => ({ _type: 'block', children: [{ _type: 'span', text }] });
  const textOf = (blocks: any[]) => blocks.map((b) => b.children.map((c: any) => c.text));

  it('returns [] for missing input', () => {
    expect(normalizeText(undefined as any)).toEqual([]);
    expect(normalizeText(null as any)).toEqual([]);
  });

  it('inserts a space after a period that is directly followed by a capital letter', () => {
    expect(textOf(normalizeText([block('End.Start here. lowercase.next 3.5')]))).toEqual([['End. Start here. lowercase.next 3.5']]);
  });

  it('inserts a space after : ? ! when missing, and leaves existing spaces alone', () => {
    expect(textOf(normalizeText([block('Why?Because!Yes:no and ok: fine')]))).toEqual([['Why? Because! Yes: no and ok: fine']]);
  });

  it('leaves non-block nodes and non-span children untouched', () => {
    const image = { _type: 'image', asset: { _ref: 'x' } };
    const custom = { _type: 'block', children: [{ _type: 'inlineThing', text: 'a.B' }] };
    expect(normalizeText([image, custom])).toEqual([image, custom]);
  });
});

describe('email preference options', () => {
  it('are exactly the three blog sections (they are the Firestore preference keys)', () => {
    expect(emailPreferenceOptions).toEqual(["Lou's Healing Journey", 'Additional Topics', 'Messages for Humanity']);
  });
});

describe('urlForImage / resolveOpenGraphImage (real implementations)', () => {
  const image = { asset: { _ref: 'image-abc123def456abc123def456abc123def456abc1-800x600-jpg' }, alt: 'Alt text' };

  it('undefined without an asset reference', () => {
    expect(urlForImage(null)).toBeUndefined();
    expect(urlForImage({})).toBeUndefined();
    expect(urlForImage({ asset: {} })).toBeUndefined();
    expect(urlForImage({ asset: { _ref: '' } })).toBeUndefined();
  });

  it('builds a CDN url for the configured project/dataset', () => {
    const url = urlForImage(image)!.url();
    expect(url).toMatch(/^https:\/\/cdn\.sanity\.io\/images\/unitplaceholder\/unit\/abc123def456abc123def456abc123def456abc1-800x600\.jpg/);
  });

  it('resolveOpenGraphImage: undefined for no/invalid image', () => {
    expect(resolveOpenGraphImage(null)).toBeUndefined();
    expect(resolveOpenGraphImage({})).toBeUndefined();
  });

  it('resolveOpenGraphImage: 1200x627 cropped url with alt', () => {
    const og = resolveOpenGraphImage(image)!;
    expect(og).toMatchObject({ alt: 'Alt text', width: 1200, height: 627 });
    expect(og.url).toContain('w=1200');
    expect(og.url).toContain('h=627');
    expect(og.url).toContain('fit=crop');
  });
});
