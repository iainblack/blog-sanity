/**
 * An in-browser stand-in for the Sanity API, so the embedded Studio (/studio) can be
 * tested with NO network access and NO Sanity login.
 *
 * Every request the Studio makes to the sandbox's placeholder project is answered here:
 * GROQ queries and document fetches are served from the same fixture dataset the site uses
 * (sanity/lib/mockData.ts), the signed-in user is a fake administrator, and mutations are
 * recorded instead of applied. Unknown endpoints on the placeholder project get a local 404
 * (and are listed in `unhandled`), so a Sanity upgrade that adds a new call can't reach the
 * network. Requests to any other host fall through to the fixture in fixtures.ts, which
 * aborts them and fails the test. That fixture can't see WebSockets, so they are guarded here:
 * the placeholder project's socket is kept open and silent, and any other non-local socket is
 * closed and listed in `blockedWebSockets` (studio.spec.ts fails the test if it isn't empty).
 * The guard lives here rather than in the shared fixture because routing WebSockets also
 * intercepts the dev server's hot-reload socket, which made the site tests flaky.
 */
import type { BrowserContext, Route } from '@playwright/test';
import { buildMockDataset, runMockQuery } from '../../sanity/lib/mockData';

const PROJECT_HOST = 'e2eplaceholder.api.sanity.io';
const SANITY_CDN_HOSTS = new Set(['core.sanity-cdn.com', 'sanity-cdn.com']);

export const FAKE_USER = {
  id: 'pE2eEditor',
  name: 'E2E Editor',
  email: 'editor@example.invalid',
  role: 'administrator',
  roles: [{ name: 'administrator', title: 'Administrator' }],
  provider: 'sanity',
};

export type FakeSanityApi = {
  /** Bodies of every mutation the Studio sent (nothing is actually written). */
  mutations: unknown[];
  /** Placeholder-project endpoints the Studio called that this stand-in doesn't model. */
  unhandled: string[];
  /** Non-local WebSockets the Studio tried to open (each one was refused). */
  blockedWebSockets: string[];
};

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/** Query params are sent as `$name=<JSON>`. */
function queryParams(search: URLSearchParams): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  search.forEach((value, key) => {
    if (key.startsWith('$')) params[key.slice(1)] = JSON.parse(value);
  });
  return params;
}

export async function installFakeSanityApi(context: BrowserContext, origin: string): Promise<FakeSanityApi> {
  const api: FakeSanityApi = { mutations: [], unhandled: [], blockedWebSockets: [] };
  // The Studio's document store needs the system fields the fixture (built for the site) omits.
  const dataset = buildMockDataset('default').map((doc) => ({
    _createdAt: '2024-01-01T00:00:00Z',
    _updatedAt: '2024-01-01T00:00:00Z',
    _rev: `e2e-rev-${doc._id}`,
    ...doc,
  }));
  const corsHeaders = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true' };

  const json = (route: Route, body: unknown, status = 200) =>
    route.fulfill({ status, contentType: 'application/json', headers: corsHeaders, body: JSON.stringify(body) });

  await context.route(
    (url) => url.hostname === PROJECT_HOST || SANITY_CDN_HOSTS.has(url.hostname),
    async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const path = url.pathname;

      if (request.method() === 'OPTIONS') {
        return route.fulfill({
          status: 204,
          headers: { ...corsHeaders, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' },
        });
      }

      // Studio auto-update module checks and the Dashboard bridge script.
      if (SANITY_CDN_HOSTS.has(url.hostname)) {
        if (path.endsWith('.js')) return route.fulfill({ status: 200, contentType: 'text/javascript', body: '' });
        return json(route, { error: 'Not modelled by the e2e fake Sanity API' }, 404);
      }

      if (/\/users\/me$/.test(path)) return json(route, FAKE_USER);
      if (/\/(ping|check\/cors)$/.test(path)) return json(route, { ok: true });
      if (/\/datasets\/[^/]+\/acl$/.test(path)) {
        return json(route, [{ filter: '_id in path("**")', permissions: ['read', 'update', 'create', 'history'] }]);
      }

      const query = path.match(/\/data\/query\/[^/]+$/);
      if (query) {
        const body = request.method() === 'POST' ? request.postDataJSON() : null;
        const groq = body?.query ?? url.searchParams.get('query') ?? '';
        const params = body?.params ?? queryParams(url.searchParams);
        return json(route, { ms: 1, query: groq, result: await runMockQuery(groq, params) });
      }

      const doc = path.match(/\/data\/doc\/[^/]+\/(.+)$/);
      if (doc) {
        const ids = decodeURIComponent(doc[1]).split(',');
        const documents = ids.map((id) => dataset.find((d) => d._id === id)).filter(Boolean);
        const omitted = ids.filter((id) => !dataset.some((d) => d._id === id)).map((id) => ({ id, reason: 'existence' }));
        return json(route, { documents, omitted });
      }

      if (/\/data\/mutate\/[^/]+$/.test(path)) {
        api.mutations.push(request.postDataJSON());
        return json(route, { transactionId: `e2e-tx-${api.mutations.length}`, results: [] });
      }

      // Real-time listeners: say hello once, then stay quiet (no live changes in a fixture).
      if (/\/data\/(listen|live\/events)\//.test(path)) {
        return route.fulfill({
          status: 200,
          headers: { ...corsHeaders, 'content-type': 'text/event-stream' },
          body: 'event: welcome\ndata: {"listenerName":"e2e"}\n\n',
        });
      }

      api.unhandled.push(`${request.method()} ${path}`);
      return json(route, { error: 'Not modelled by the e2e fake Sanity API' }, 404);
    },
  );

  // Real-time listeners must stay open, or the Studio treats the connection as lost and makes
  // every document read-only. A fulfilled route always ends, so answer them inside the page
  // with a stream that says hello once and then stays quiet (nothing changes in a fixture).
  await context.addInitScript((host) => {
    const realFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = new URL(input instanceof Request ? input.url : String(input), location.href);
      if (url.hostname !== host || !/\/data\/(listen|live\/events)\//.test(url.pathname)) return realFetch(input, init);
      const body = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode('event: welcome\ndata: {"listenerName":"e2e"}\n\n'));
          init?.signal?.addEventListener('abort', () => {
            try {
              controller.close();
            } catch {
              // Already closed or cancelled by the reader.
            }
          });
        },
      });
      return Promise.resolve(new Response(body, { status: 200, headers: { 'content-type': 'text/event-stream' } }));
    };
  }, PROJECT_HOST);

  // Presence and other real-time features use a WebSocket on the placeholder project: keep it
  // open locally and silent. Refuse every other non-local socket.
  await context.routeWebSocket(
    (url) => !LOCAL_HOSTS.has(url.hostname),
    (ws) => {
      if (new URL(ws.url()).hostname === PROJECT_HOST) return;
      api.blockedWebSockets.push(ws.url());
      return ws.close();
    },
  );

  return api;
}
