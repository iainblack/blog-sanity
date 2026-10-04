/**
 * Mock Sanity dataset for development and automated tests.
 *
 * Rather than hand-routing each query to canned arrays, the app's real GROQ
 * queries are evaluated against an in-memory dataset with groq-js. Filtering,
 * ordering, slicing, `match` and `count()` therefore behave like Sanity, and
 * regressions in the queries themselves are caught.
 *
 * Enabled by `sanityFetch` (see fetch.ts). Never contacts any network.
 */

import { evaluate, parse } from "groq-js";

export const MOCK_SCENARIOS = ["default", "empty", "single", "ten", "eleven", "many"] as const;
export type MockScenario = (typeof MOCK_SCENARIOS)[number];

export function parseMockScenario(value: string | undefined | null): MockScenario {
  return (MOCK_SCENARIOS as readonly string[]).includes(value ?? "") ? (value as MockScenario) : "default";
}

/** Posts per blog section for each scenario. */
export const MOCK_POST_COUNTS: Record<MockScenario, number> = {
  default: 11,
  empty: 0,
  single: 1,
  ten: 10,
  eleven: 11,
  many: 30,
};

/** Resources per resource type for each scenario (`default` is a fixed, mixed set). */
export const MOCK_RESOURCES_PER_TYPE: Record<Exclude<MockScenario, "default">, number> = {
  empty: 0,
  single: 1,
  ten: 10,
  eleven: 11,
  many: 25,
};

export const MOCK_SECTIONS = [
  { pageId: "Lou's Healing Journey", label: "Healing Journey" },
  { pageId: "Messages for Humanity", label: "Messages" },
  { pageId: "Additional Topics", label: "Topics" },
] as const;

type Doc = { _id: string; _type: string; [key: string]: unknown };

/**
 * next-sanity's <Image> only accepts Sanity CDN URLs. These point at a placeholder
 * project that doesn't exist; the E2E guard answers them locally (never the network).
 */
export const MOCK_IMAGE_URL_PREFIX = "https://cdn.sanity.io/images/e2eplaceholder/e2e/";
const mockImageUrl = (n: number) => `${MOCK_IMAGE_URL_PREFIX}${String(n).repeat(40).slice(0, 40)}-400x300.png`;

const pad = (n: number, width = 2) => String(n).padStart(width, "0");

const textBlock = (key: string, text: string) => ({
  _type: "block",
  _key: key,
  style: "normal",
  markDefs: [],
  children: [{ _type: "span", _key: `${key}-s`, text, marks: [] }],
});

export const MOCK_AUTHOR_NAME = "Lou Fleming";
/** Used by post 3 to verify long author names wrap instead of being clipped on cards. */
export const MOCK_LONG_AUTHOR_NAME = "Dr. Louisa Marguerite Fleming-Whitaker-Montgomery III";
export const MOCK_LONG_TITLE =
  "A Post With A Very Long Title That Tests How The UI Handles Very Long Titles In The Post Preview Grid Layout";

/**
 * Post `i` (1-based) in a section. A few indexes are deliberately awkward:
 *   3 -> very long title/subtitle/excerpt and a very long author name
 *   5 -> no author, subtitle or excerpt
 *   7 -> no body content
 */
function makePost(section: (typeof MOCK_SECTIONS)[number], i: number): Doc {
  const day = pad(((i - 1) % 28) + 1);
  const month = pad(Math.floor((i - 1) / 28) + 1);
  const base: Doc = {
    _id: `post-${section.label}-${i}`,
    _type: "post",
    _createdAt: `2024-${month}-${day}T10:00:00Z`,
    _updatedAt: `2024-${month}-${day}T10:00:00Z`,
    pageId: section.pageId,
    orderRank: `0|${pad(i, 6)}:`,
    title: `${section.label} Post ${pad(i)}`,
    subtitle: `Subtitle ${pad(i)}`,
    slug: { _type: "slug", current: `post-${i}` },
    excerpt: `Excerpt for ${section.label} post ${pad(i)}.`,
    date: `2024-${month}-${day}T12:00:00.000Z`,
    author: { _type: "reference", _ref: "author-lou" },
    content: [textBlock(`b${i}`, `Body text of ${section.label} post ${pad(i)}.`)],
  };

  if (i === 3) {
    base.author = { _type: "reference", _ref: "author-long" };
    base.title = `${MOCK_LONG_TITLE} (${section.label})`;
    base.subtitle = "Subtitle also very long to test truncation behavior in the UI, repeated until it is far too long";
    base.excerpt =
      "This excerpt is intentionally very long to test how the UI handles truncation of long text content. It should be cut off gracefully after a certain number of lines and must never break the page layout.";
  }
  if (i === 5) {
    delete base.author;
    delete base.subtitle;
    delete base.excerpt;
  }
  if (i === 7) {
    base.content = [];
  }
  return base;
}

const DEFAULT_RESOURCES: Array<Record<string, unknown>> = [
  { title: "The Healing Journey Book", type: "Books", description: "A comprehensive guide to natural healing methods and practices.", author: "Dr. Jane Smith", publisher: "Wellness Press", datePublished: "2023-06-15", url: "https://example.com/healing-journey", urlDisplayName: "Buy on Amazon" },
  { title: "Mindfulness Meditation App", type: "Other", description: "A mobile app for daily mindfulness and meditation practices.", url: "https://example.com/mindfulness-app", urlDisplayName: "Download App" },
  { title: "National Wellness Institute", type: "Websites", description: "Resources and certification for wellness professionals.", url: "https://example.com/wellness-institute", urlDisplayName: "Visit Website" },
  { title: "Healthy Living Magazine", type: "Books", description: "Monthly publication covering all aspects of healthy living.", publisher: "Health Media Inc", datePublished: "2024-01-01", url: "https://example.com/healthy-living", urlDisplayName: "Subscribe" },
  { title: "Yoga for Beginners Guide", type: "Other", description: "A comprehensive guide to starting your yoga practice.", author: "Sarah Johnson", url: "https://example.com/yoga-guide", urlDisplayName: "Read Online" },
  { title: "Mental Health America", type: "Websites", description: "Advocacy and resources for mental health awareness.", url: "https://example.com/mha", urlDisplayName: "Visit Website" },
  { title: "The Nutrition Source", type: "Websites", description: "Trusted nutrition information from Tufts University.", publisher: "Tufts University", url: "https://example.com/nutrition-source", urlDisplayName: "Visit Website" },
  { title: "Meditation Cushions Guide", type: "Other", description: "How to choose the right meditation cushion for your practice.", author: "Michael Chen", url: "https://example.com/cushions", urlDisplayName: "Learn More" },
];

function makeResources(scenario: MockScenario): Doc[] {
  if (scenario === "default") {
    return DEFAULT_RESOURCES.map((r, i) => ({ _id: `resource-${i + 1}`, _type: "resource", ...r }));
  }
  const perType = MOCK_RESOURCES_PER_TYPE[scenario];
  const docs: Doc[] = [];
  for (const type of ["Books", "Websites", "Other"]) {
    for (let n = 1; n <= perType; n++) {
      docs.push({
        _id: `resource-${type}-${n}`,
        _type: "resource",
        type,
        title: `${type} Resource ${pad(n)}`,
        description: `Description of ${type} resource ${pad(n)}.`,
        url: `https://example.com/${type.toLowerCase()}/${n}`,
        urlDisplayName: "Visit",
      });
    }
  }
  return docs;
}

export function buildMockDataset(scenario: MockScenario): Doc[] {
  const docs: Doc[] = [
    {
      _id: "settings",
      _type: "settings",
      title: "Lou's Blog (Mock)",
      description: [textBlock("d", "Mock site description")],
      footer: [],
    },
    { _id: "author-lou", _type: "author", name: MOCK_AUTHOR_NAME },
    { _id: "author-long", _type: "author", name: MOCK_LONG_AUTHOR_NAME },
  ];

  for (const section of MOCK_SECTIONS) {
    for (let i = 1; i <= MOCK_POST_COUNTS[scenario]; i++) {
      docs.push(makePost(section, i));
    }
  }

  docs.push(...makeResources(scenario));

  if (scenario !== "empty") {
    docs.push(
      { _id: "panel-1", _type: "contentPanel", _createdAt: "2024-01-01T00:00:00Z", pageId: "Home", orderRank: "0|000001:", order: 1, size: "Large", backgroundColor: "default", content: "Welcome to the mock website! This is the first content panel." },
      { _id: "panel-2", _type: "contentPanel", _createdAt: "2024-01-02T00:00:00Z", pageId: "Home", orderRank: "0|000002:", order: 2, size: "Medium", backgroundColor: "contrast", content: "This is the second mock content panel." },
    );
    for (let n = 1; n <= 3; n++) {
      docs.push(
        {
          _id: `gallery-${n}`,
          _type: "galleryImage",
          pageId: "Photos",
          orderRank: `0|${pad(n, 6)}:`,
          order: n,
          title: `Mock photo ${n}`,
          picture: { _type: "image", asset: { _type: "reference", _ref: `asset-${n}` }, alt: `Mock photo ${n} alt` },
        },
        {
          _id: `asset-${n}`,
          _type: "sanity.imageAsset",
          url: mockImageUrl(n),
          metadata: { dimensions: { width: 400, height: 300 } },
        },
      );
    }
  }

  return docs;
}

/** Evaluate a GROQ query against the mock dataset for a scenario. */
export async function runMockQuery<T>(
  query: string,
  params: Record<string, unknown> = {},
  scenario: MockScenario = "default",
): Promise<T> {
  const tree = parse(query, { params });
  const result = await evaluate(tree, { dataset: buildMockDataset(scenario), params });
  return (await result.get()) as T;
}
