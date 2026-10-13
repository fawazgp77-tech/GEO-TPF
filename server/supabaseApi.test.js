import test from 'node:test';
import assert from 'node:assert/strict';
import { createSupabaseApi } from '../src/lib/supabaseApi.js';

test('temporary auth failure denies requests without expiring the session or erasing drafts', async () => {
  const previous = globalThis.window;
  const events = [];
  globalThis.window = { dispatchEvent: event => events.push(event.type) };
  try {
    for (const error of [{ name: 'AuthRetryableFetchError', status: 0 }, { status: 503 }, { status: 429 }]) {
      const api = createSupabaseApi({ auth: { getUser: async () => ({ data: { user: null }, error }) }, from() { throw new Error('Data access must not happen'); } });
      await assert.rejects(api('/businesses'), /temporarily unavailable/);
    }
    assert.deepEqual(events, []);
    const invalid = createSupabaseApi({ auth: { getUser: async () => ({ data: { user: null }, error: { status: 401 } }) } });
    await assert.rejects(invalid('/businesses'), /Please sign in/);
    assert.deepEqual(events, ['presence:session-expired']);
  } finally { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; }
});

test('an account change denies a stale wizard request before accessing business data', async () => {
  const previous = globalThis.window;
  const events = [];
  globalThis.window = { dispatchEvent: event => events.push(event.type) };
  try {
    const api = createSupabaseApi({ auth: { getUser: async () => ({ data: { user: { id: 'owner-b' } }, error: null }) }, from() { throw new Error('Data access must not happen'); } });
    await assert.rejects(api('/businesses', { method: 'POST', expectedUserId: 'owner-a', body: {} }), /account changed/);
    assert.deepEqual(events, ['presence:session-expired']);
  } finally { if (previous === undefined) delete globalThis.window; else globalThis.window = previous; }
});

test('paged scan history reads only owned scan metadata with server-side filters', async () => {
  const calls = [];
  const query = {
    select(columns, options) { calls.push(['select', columns, options]); return this; },
    eq(column, value) { calls.push(['eq', column, value]); return this; },
    in(column, values) { calls.push(['in', column, values]); return this; },
    gte(column, value) { calls.push(['gte', column, value]); return this; },
    lt(column, value) { calls.push(['lt', column, value]); return this; },
    order(column, options) { calls.push(['order', column, options]); return this; },
    async range(from, to) { calls.push(['range', from, to]); return { data: [{ id: 'scan-a', prompt_runs: [{ status: 'SUCCEEDED' }] }], count: 13, error: null }; },
  };
  const client = { auth: { getUser: async () => ({ data: { user: { id: 'owner-a' } }, error: null }) },
    from(table) { calls.push(['from', table]); return table === 'businesses'
      ? { select() { return this; }, eq() { return this; }, async maybeSingle() { return { data: { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa' }, error: null }; } }
      : query; } };
  const api = createSupabaseApi(client);
  const result = await api('/businesses/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/scan-history?status=active&sort=oldest&offset=12&limit=12&from=2026-10-01&to=2026-10-13', { expectedUserId: 'owner-a' });
  assert.equal(result.total, 13);
  assert.deepEqual(calls.find(call => call[0] === 'in'), ['in', 'status', ['PENDING', 'RUNNING']]);
  assert.deepEqual(calls.find(call => call[0] === 'range'), ['range', 12, 23]);
  assert.ok(calls.some(call => call[0] === 'select' && !call[1].includes('raw_responses') && call[2]?.count === 'exact'));
  await assert.rejects(api('/businesses/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/scan-history?status=all&sort=newest&offset=-1&limit=12'), /Invalid history page/);
});
