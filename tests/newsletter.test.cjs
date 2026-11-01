const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const Module = require('node:module');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, file);
const delivery = require('../lib/delivery.ts');
const { deliverySlot, editionBroadcasts } = delivery;
const { validateEdition, validateStoryLinks } = require('../lib/validation.ts');
const fixture = () => ({ editionTitle: 'Weekly AI research', items: Array.from({ length: 5 }, (_, i) => ({
  title: `Research finding ${i}`, publisher: 'METR', url: `https://metr.org/research/finding-${i}`,
  publishedAt: '2026-10-25', category: 'Research', summary: 'Researchers measured a change in reliability.',
  teachingMoment: 'Measure reliability across tasks.', caveat: 'Results cover a limited sample.', score: 8,
})) });
const citations = edition => edition.items.map(item => item.url);
test('UK delivery slot covers GMT, BST and both clock changes', () => {
  for (const date of ['2026-01-05T08:00Z', '2026-07-06T07:00Z', '2026-03-30T07:00Z', '2026-10-26T08:00Z'])
    assert.equal(deliverySlot(new Date(date)).due, true);
  for (const date of ['2026-07-06T08:00Z', '2026-10-26T07:00Z', '2026-10-27T08:00Z'])
    assert.equal(deliverySlot(new Date(date)).due, false);
});
test('validation rejects missing, duplicate, uncited, placeholder and malformed stories', () => {
  const valid = fixture(); validateEdition(valid, citations(valid));
  for (const mutate of [e => e.items.pop(), e => e.items.push(e.items[0]),
    e => e.items[1].url = e.items[0].url, e => e.items[1].title = e.items[0].title,
    e => e.items[0].summary = 'Placeholder', e => e.items[0].url = 'javascript:alert(1)',
    e => e.items[0].url = 'https://metr.org.evil.com/story', e => e.items[0].publishedAt = 'unknown',
    e => e.items[0].teachingMoment = '', e => e.items[0].url = 'https://metr.org/uncited']) {
    const changed = fixture(); mutate(changed); assert.throws(() => validateEdition(changed, citations(valid)));
  }
});
test('URL verification fails closed on broken links and redirects outside source pool', async () => {
  const original = global.fetch;
  try {
    global.fetch = async () => new Response('Article', { headers: { 'content-type': 'text/html' } });
    await validateStoryLinks(fixture());
    global.fetch = async () => new Response('', { status: 404 });
    await assert.rejects(validateStoryLinks(fixture()));
    global.fetch = async () => new Response('', { status: 302, headers: { location: 'http://127.0.0.1/private' } });
    await assert.rejects(validateStoryLinks(fixture()));
  } finally { global.fetch = original; }
});
test('edition lookup reads every page and orders earliest first', async () => {
  const pages = {
    start: { has_more: true, data: [{ id: 'c', name: 'week', created_at: '2026-01-03' }, { id: 'x', name: 'other', created_at: '2026-01-01' }] },
    x: { has_more: false, data: [{ id: 'a', name: 'week', created_at: '2026-01-01' }] },
  };
  const resend = { broadcasts: { list: async ({ after }) => ({ data: pages[after || 'start'] }) } };
  assert.deepEqual((await editionBroadcasts(resend, 'week')).map(b => b.id), ['a', 'c']);
  await assert.rejects(editionBroadcasts({ broadcasts: { list: async () => ({ error: { message: 'offline' } }) } }, 'week'));
});
test('delivery sends one broadcast per edition, preserves unsubscribe, and fails closed', async () => {
  const originalLoad = Module._load;
  const broadcasts = []; let generated = 0, sends = 0, created = 0, failGeneration = false, failSend = false;
  let failList = () => false, hideFromList = false, lists = 0;
  const actualNewsletter = require('../lib/newsletter.ts');
  assert.match(actualNewsletter.renderHtml(fixture()), /\{\{\{RESEND_UNSUBSCRIBE_URL\}\}\}/);
  const unsafe = fixture(); unsafe.items[0].title = '<script>bad</script>';
  assert.doesNotMatch(actualNewsletter.renderHtml(unsafe), /<script>/);
  Module._load = function(name, parent, main) {
    if (name === 'next/server') return { NextResponse: class extends Response { static json(body, options) { return Response.json(body, options); } } };
    if (name.endsWith('/lib/newsletter')) return { buildEdition: async () => { generated++; if (failGeneration) throw Error('invalid'); return fixture(); }, renderHtml: actualNewsletter.renderHtml };
    if (name.endsWith('/lib/delivery')) return { ...delivery, deliverySlot: () => ({ due: true, editionKey: 'test-week' }) };
    if (name === 'resend') return { Resend: class { broadcasts = {
      list: async () => {
        if (failList(++lists)) return { error: { message: 'offline' } };
        return { data: { has_more: false, data: hideFromList ? [] : [...broadcasts] } };
      },
      create: async payload => {
        assert.equal(payload.segmentId, 'test-segment'); assert.match(payload.html, /RESEND_UNSUBSCRIBE_URL/);
        const id = `broadcast-${++created}`;
        broadcasts.push({ id, name: payload.name, created_at: String(created).padStart(4, '0') });
        return { data: { id } };
      },
      send: async () => { sends++; return failSend ? { error: { message: 'timeout' } } : { data: { id: 'broadcast' } }; },
      remove: async id => { broadcasts.splice(broadcasts.findIndex(b => b.id === id), 1); return { data: { id } }; },
    }; } };
    return originalLoad.call(this, name, parent, main);
  };
  const env = { ...process.env };
  try {
    Object.assign(process.env, { CRON_SECRET: 'test-secret', ENABLE_PAID_AUTOMATION: 'true', PORTFOLIO_MODE: 'false',
      OPENROUTER_API_KEY: 'test', RESEND_API_KEY: 'test', RESEND_SEGMENT_ID: 'test-segment', RESEND_FROM: 'test@example.org' });
    const { GET } = require('../app/api/cron/newsletter/route.ts');
    const run = () => GET(new Request('https://test.invalid', { headers: { authorization: 'Bearer test-secret' } }));
    // Concurrent runs all pass the first check; only the earliest broadcast sends.
    await Promise.all([run(), run(), run()]); assert.equal(sends, 1); assert.equal(broadcasts.length, 1);
    assert.equal(broadcasts[0].id, 'broadcast-1');
    // A later run stops before generating.
    const before = generated; await run(); assert.equal(sends, 1); assert.equal(generated, before);
    // Generation failure sends nothing and leaves the week retryable.
    broadcasts.length = 0; failGeneration = true;
    assert.equal((await run()).status, 500); assert.equal(sends, 1); assert.equal(broadcasts.length, 0);
    // A failed send keeps the broadcast, blocking automatic retries.
    failGeneration = false; failSend = true;
    assert.equal((await run()).status, 500); await run(); assert.equal(sends, 2); assert.equal(broadcasts.length, 1);
    failSend = false;
    // An unavailable list prevents generation and sending.
    broadcasts.length = 0; const beforeOutage = generated; failList = () => true;
    assert.equal((await run()).status, 500); assert.equal(sends, 2); assert.equal(generated, beforeOutage);
    // A failed recheck discards the draft rather than risk a duplicate.
    lists = 0; failList = count => count === 2;
    assert.equal((await run()).status, 500); assert.equal(sends, 2); assert.equal(broadcasts.length, 0);
    // A broadcast missing from its own list means the check can't be trusted.
    failList = () => false; hideFromList = true;
    assert.equal((await run()).status, 500); assert.equal(sends, 2); assert.equal(broadcasts.length, 0);
    delete process.env.CRON_SECRET;
    assert.equal((await GET(new Request('https://test.invalid', { headers: { authorization: 'Bearer undefined' } }))).status, 401);
  } finally { Module._load = originalLoad; process.env = env; }
});
