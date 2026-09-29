import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePrompts, validatePrompt } from '../shared/prompts.js';
import { createOpenAIProvider } from './providers/openai.js';
import { createScanService } from './scans/service.js';

test('business-specific prompts cover the intended categories without duplicates', () => {
  const prompts = generatePrompts({ name: 'North Academy', city: 'Nagpur', category: 'Cricket academy' }, {
    officialName: 'North Academy', services: 'Junior cricket coaching', audience: 'Children',
    areasServed: 'Nagpur', competitors: 'Elite Academy',
  });
  assert.equal(prompts.length, 20);
  assert.equal(new Set(prompts.map(prompt => prompt.text.toLowerCase())).size, 20);
  assert.equal(new Set(prompts.map(prompt => prompt.category)).size, 6);
  assert.ok(prompts.some(prompt => prompt.text.toLowerCase().includes('junior cricket coaching')));
  assert.ok(prompts.some(prompt => prompt.text.includes('Elite Academy')));
  assert.throws(() => validatePrompt({ category: 'DISCOVERY', text: '  ' }), /5–500/);
});

test('provider normalizes full answer and citations without supplying Brand Truth', async () => {
  let request;
  const provider = createOpenAIProvider({ apiKey: 'test-only', model: 'test-model', fetchImpl: async (_url, options) => {
    request = JSON.parse(options.body);
    return { ok: true, json: async () => ({ id: 'r1', status: 'completed', model: 'test-model',
      output: [{ content: [{ type: 'output_text', text: 'A complete answer', annotations: [{ url: 'https://example.com', title: 'Source' }] }] }],
      usage: { total_tokens: 10 } }) };
  } });
  const result = await provider.runPrompt('Where should I go?');
  assert.equal(request.input, 'Where should I go?');
  assert.equal(request.store, false);
  assert.equal(result.responseText, 'A complete answer');
  assert.equal(result.citations[0].url, 'https://example.com');
  assert.equal(result.providerPayload.id, 'r1');
});

test('scan worker stores successful raw evidence and continues after a failed prompt', async () => {
  const tables = {
    scans: [{ id: 'scan-1', status: 'RUNNING' }],
    prompt_runs: [
      { id: 'run-1', scan_id: 'scan-1', exact_prompt: 'first question', status: 'PENDING', attempt: 0 },
      { id: 'run-2', scan_id: 'scan-1', exact_prompt: 'second question', status: 'PENDING', attempt: 0 },
    ],
    raw_responses: [],
  };
  const db = { from(table) {
    const filters = [];
    let update;
    const query = {
      select() { return this; }, order() { return this; },
      eq(key, value) { filters.push(row => row[key] === value); return this; },
      update(changes) { update = changes; return this; },
      insert(row) { tables[table].push(row); return Promise.resolve({ data: null, error: null }); },
      maybeSingle() { return Promise.resolve({ data: tables[table].filter(row => filters.every(match => match(row)))[0] || null, error: null }); },
      then(resolve, reject) {
        const rows = tables[table].filter(row => filters.every(match => match(row)));
        if (update) rows.forEach(row => Object.assign(row, update));
        return Promise.resolve({ data: rows, error: null }).then(resolve, reject);
      },
    };
    return query;
  } };
  const calls = [];
  const provider = { name: 'test', model: 'test-model', async runPrompt(prompt) {
    calls.push(prompt);
    if (prompt === 'second question') throw new Error('Provider unavailable');
    return { provider: 'test', model: 'test-model', responseText: 'exact answer', citations: [],
      timestamp: new Date().toISOString(), metadata: {}, providerPayload: { output: 'exact answer' } };
  } };
  await createScanService(db, provider).processScan('scan-1');
  assert.deepEqual(calls, ['first question', 'second question', 'second question']);
  assert.equal(tables.raw_responses.length, 1);
  assert.equal(tables.raw_responses[0].response_text, 'exact answer');
  assert.equal(tables.prompt_runs[0].status, 'SUCCEEDED');
  assert.equal(tables.prompt_runs[1].status, 'FAILED');
  assert.equal(tables.scans[0].status, 'PARTIALLY_FAILED');
});
