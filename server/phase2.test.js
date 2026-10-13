import test from 'node:test';
import assert from 'node:assert/strict';
import { generatePrompts, validatePrompt } from '../shared/prompts.js';
import { createGeminiProvider } from './providers/gemini.js';
import { createScanService } from './scans/service.js';

test('discovery prompts cover customer intents without priming the model with business identity or Brand Truth', () => {
  const prompts = generatePrompts({ name: 'North Academy', city: 'Nagpur', category: 'Cricket academy' }, {
    officialName: 'North Academy', services: 'Junior cricket coaching', competitors: 'Elite Academy',
  });
  assert.equal(prompts.length, 20);
  assert.equal(new Set(prompts.map(prompt => prompt.text.toLowerCase())).size, 20);
  assert.equal(new Set(prompts.map(prompt => prompt.category)).size, 6);
  assert.ok(prompts.every(prompt => !/North Academy|Junior cricket coaching|Elite Academy/i.test(prompt.text)));
  assert.ok(prompts.some(prompt => prompt.text === 'What are the best cricket academies near me in Nagpur?'));
  assert.ok(prompts.some(prompt => prompt.text.includes('in Nagpur')));
  const furniture = generatePrompts({ name: 'IKEA Hyderabad', city: 'Hyderabad', category: 'Furniture store' });
  assert.equal(furniture[0].text, 'What are the best furniture stores near me in Hyderabad?');
  assert.equal(furniture[1].text, 'Where can I find affordable, good-quality furniture in Hyderabad?');
  assert.ok(furniture.every(prompt => !prompt.text.includes('IKEA')));
  const brandedCategory = generatePrompts({ name: 'IKEA Hyderabad', city: 'Hyderabad', category: 'IKEA furniture store' });
  assert.ok(brandedCategory.every(prompt => !prompt.text.includes('IKEA')));
  const brandedSuffix = generatePrompts({ name: 'IKEA Hyderabad', city: 'Hyderabad', category: 'Furniture store by IKEA' });
  assert.ok(brandedSuffix.every(prompt => !prompt.text.includes('IKEA')));
  const sports = generatePrompts({ name: 'Decathlon India', city: 'Bengaluru', category: 'Sports store' });
  assert.equal(sports[1].text, 'Where can I find affordable, good-quality sports gear in Bengaluru?');
  const software = generatePrompts({ name: 'Canva', category: 'Design software', country: 'Australia' });
  assert.ok(software.every(prompt => !prompt.text.includes('Canva')));
  assert.ok(software.every(prompt => !prompt.text.includes('near me')));
  assert.throws(() => validatePrompt({ category: 'DISCOVERY', text: '  ' }), /5–500/);
});

test('provider normalizes full answer and citations without supplying Brand Truth', async () => {
  let url, request, headers;
  const provider = createGeminiProvider({ apiKey: 'test-only', fetchImpl: async (requestUrl, options) => {
    url = requestUrl;
    headers = options.headers;
    request = JSON.parse(options.body);
    return { ok: true, json: async () => ({ responseId: 'r1', modelVersion: 'gemini-3.5-flash-lite',
      candidates: [{ finishReason: 'STOP', content: { parts: [{ text: 'A complete ' }, { text: 'answer' }] },
        groundingMetadata: { groundingChunks: [{ web: { uri: 'https://example.com', title: 'Source' } }] } }],
      usageMetadata: { totalTokenCount: 10 } }) };
  } });
  const result = await provider.runPrompt('Where should I go?');
  assert.match(url, /models\/gemini-3\.5-flash-lite:generateContent$/);
  assert.ok(!url.includes('test-only'));
  assert.equal(headers['x-goog-api-key'], 'test-only');
  assert.deepEqual(request.contents, [{ role: 'user', parts: [{ text: 'Where should I go?' }] }]);
  assert.equal(result.responseText, 'A complete answer');
  assert.equal(result.citations[0].url, 'https://example.com');
  assert.equal(result.providerPayload.responseId, 'r1');
  assert.equal(result.provider, 'gemini');
});

test('Gemini provider rejects blocked or empty responses', async () => {
  const provider = createGeminiProvider({ apiKey: 'test-only', fetchImpl: async () => ({
    ok: true, json: async () => ({ candidates: [{ finishReason: 'SAFETY' }] }),
  }) });
  await assert.rejects(provider.runPrompt('Blocked question'), /Gemini response stopped: SAFETY/);
  const emptyProvider = createGeminiProvider({ apiKey: 'test-only', fetchImpl: async () => ({
    ok: true, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [] } }] }),
  }) });
  await assert.rejects(emptyProvider.runPrompt('Empty answer'), /Gemini returned no answer text/);
});

test('Gemini combined analysis keeps evidence references and raw payload', async () => {
  const provider = createGeminiProvider({ apiKey: 'test-only', fetchImpl: async (_url, options) => {
    const request = JSON.parse(options.body);
    assert.equal(request.generationConfig.responseMimeType, 'application/json');
    assert.equal(JSON.parse(request.contents[0].parts[0].text)[0].number, 1);
    return { ok: true, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text:
      JSON.stringify({ summary: 'The model mentioned the business.', themes: [{ title: 'Mention', finding: 'Named in answer 1.', promptNumbers: [1, 99] }], limitations: 'Claims are unverified.' }) }] } }] }) };
  } });
  const analysis = await provider.analyzeResponses([{ prompt: 'Question?', answer: 'Answer.' }]);
  assert.deepEqual(analysis.report.themes[0].promptNumbers, [1]);
  assert.equal(analysis.report.limitations, 'Claims are unverified.');
  assert.ok(analysis.providerPayload.candidates);
});

test('scan worker stores successful raw evidence and continues after a failed prompt', async () => {
  const tables = {
    scans: [{ id: 'scan-1', status: 'RUNNING' }],
    prompt_runs: [
      { id: 'run-1', scan_id: 'scan-1', exact_prompt: 'first question', status: 'PENDING', attempt: 0 },
      { id: 'run-2', scan_id: 'scan-1', exact_prompt: 'second question', status: 'PENDING', attempt: 0 },
    ],
    raw_responses: [],
    scan_analyses: [],
  };
  const db = { from(table) {
    const filters = [];
    let update;
    let selection = '';
    const query = {
      select(columns = '') { selection = columns; return this; }, order() { return this; },
      eq(key, value) { filters.push(row => row[key] === value); return this; },
      update(changes) { update = changes; return this; },
      insert(row) { tables[table].push(row); return Promise.resolve({ data: null, error: null }); },
      maybeSingle() { return Promise.resolve({ data: tables[table].filter(row => filters.every(match => match(row)))[0] || null, error: null }); },
      then(resolve, reject) {
        let rows = tables[table].filter(row => filters.every(match => match(row)));
        if (update) rows.forEach(row => Object.assign(row, update));
        if (table === 'prompt_runs' && selection.includes('raw_responses(')) rows = rows.map(row => ({ ...row,
          raw_responses: tables.raw_responses.filter(raw => raw.prompt_run_id === row.id) }));
        return Promise.resolve({ data: rows, error: null }).then(resolve, reject);
      },
    };
    return query;
  } };
  const calls = [];
  const provider = { name: 'test', model: 'test-model', async analyzeResponses(items) {
    assert.deepEqual(items, [{ number: 1, prompt: 'first question', status: 'SUCCEEDED', answer: 'exact answer' }]);
    return { report: { summary: 'One answer saved', themes: [], limitations: 'Limited sample.' }, providerPayload: { output: 'analysis' } };
  }, async runPrompt(prompt) {
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
  assert.equal(tables.scan_analyses[0].report.summary, 'One answer saved');
});
