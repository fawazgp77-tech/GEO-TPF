import test from 'node:test';
import assert from 'node:assert/strict';
import { aggregateMeasurement, comparableMeasurements, isNeutralPrompt, makeEntities,
  validateExtraction, validateIdentity } from '../shared/measurement.js';
import { createGeminiProvider } from './providers/gemini.js';
import { createScanService } from './scans/service.js';

const snapshot = { identity: { name: 'North House', aliases: ['NH Furniture'] },
  competitors: [{ name: 'South Studio', aliases: ['SS'] }],
  truth: { version: 2, data: { services: 'Solid-wood tables and delivery' } },
  provider: 'gemini', model: 'gemini-3.5-flash-lite', metricVersion: 1, extractionVersion: 1,
  promptFingerprint: 'same-prompts' };

test('tracking names require owner-reviewed, non-colliding identities', () => {
  assert.deepEqual(validateIdentity({ targetAliases: ['North'], competitors: [{ name: 'South', aliases: ['SouthCo'] }] }, 'North House'),
    { targetAliases: ['North'], competitors: [{ name: 'South', aliases: ['SouthCo'] }] });
  assert.throws(() => validateIdentity({ targetAliases: ['South'], competitors: [{ name: 'south', aliases: [] }] }, 'North House'), /appears more than once/);
  assert.equal(isNeutralPrompt('Which store is best?', makeEntities(snapshot)), true);
  assert.equal(isNeutralPrompt('Is South Studio better?', makeEntities(snapshot)), false);
});

test('only exact saved-answer quotes become positive mentions and recommendations', () => {
  const run = { id: 'r1', prompt: 'Where can I buy a good table?', answer: 'North House is a good choice for a table.' };
  const valid = validateExtraction(run, { brands: [{ id: 'target', mentionQuote: 'North House',
    recommendation: 'recommended', recommendationQuote: 'North House is a good choice' }] }, snapshot);
  assert.equal(valid.brands[0].mention, 'yes');
  assert.equal(valid.brands[0].recommendation, 'recommended');
  const fabricated = validateExtraction(run, { brands: [{ id: 'target', mentionQuote: 'North House is perfect',
    recommendation: 'recommended', recommendationQuote: 'Buy from North House immediately' }] }, snapshot);
  assert.equal(fabricated.brands[0].mention, 'unknown');
  assert.equal(fabricated.brands[0].recommendation, 'unknown');
  const overlap = { ...snapshot, competitors: [{ name: 'North House Plus', aliases: [] }] };
  const ambiguous = validateExtraction({ id: 'r2', prompt: 'Best shop?', answer: 'North House Plus is nearby.' },
    { brands: [{ id: 'target', mentionQuote: 'North House Plus', recommendation: 'recommended',
      recommendationQuote: 'North House Plus is nearby.' }] }, overlap);
  assert.equal(ambiguous.brands[0].mention, 'unknown');
});

test('rates use common unbranded answers and exclude unknown classifications', () => {
  const runs = [
    { id: 'positive', prompt: 'Where can I buy furniture?', status: 'SUCCEEDED', answer: 'North House is recommended. South Studio is another store.' },
    { id: 'negative', prompt: 'Best tables nearby?', status: 'SUCCEEDED', answer: 'Avoid North House. South Studio is recommended.' },
    { id: 'absent', prompt: 'Affordable furniture?', status: 'SUCCEEDED', answer: 'A local shop may help.' },
    { id: 'ambiguous', prompt: 'Where are the stores?', status: 'SUCCEEDED', answer: 'North House may exist.' },
    { id: 'branded', prompt: 'Is North House good?', status: 'SUCCEEDED', answer: 'North House may be good.' },
    { id: 'failed', prompt: 'Any chairs?', status: 'FAILED', answer: '' },
  ];
  const extracted = [
    { id: 'positive', brands: [{ id: 'target', mentionQuote: 'North House', recommendation: 'recommended', recommendationQuote: 'North House is recommended.' },
      { id: 'competitor-1', mentionQuote: 'South Studio', recommendation: 'neutral', recommendationQuote: 'South Studio is another store.' }],
    claims: [{ quote: 'North House is recommended.', truthKey: 'services', verdict: 'supported' }] },
    { id: 'negative', brands: [{ id: 'target', mentionQuote: 'North House', recommendation: 'not_recommended', recommendationQuote: 'Avoid North House.' },
      { id: 'competitor-1', mentionQuote: 'South Studio', recommendation: 'recommended', recommendationQuote: 'South Studio is recommended.' }], claims: [] },
    { id: 'absent', brands: [], claims: [] },
    { id: 'ambiguous', brands: [{ id: 'target', mentionQuote: 'North House is the best', recommendation: 'recommended', recommendationQuote: 'North House is the best' }], claims: [] },
    { id: 'branded', brands: [{ id: 'target', mentionQuote: 'North House', recommendation: 'neutral', recommendationQuote: 'North House may be good.' }], claims: [] },
  ];
  const evidence = extracted.map(item => validateExtraction(runs.find(run => run.id === item.id), item, snapshot));
  const result = aggregateMeasurement(snapshot, runs, evidence);
  assert.equal(result.eligibleAnswers, 4);
  assert.equal(result.extractedAnswers, 4);
  assert.equal(result.brands[0].mentions, 2);
  assert.equal(result.brands[0].mentionKnown, 3);
  assert.equal(result.brands[0].mentionScore, 67);
  assert.equal(result.brands[0].recommendationScore, 33);
  assert.equal(result.brands[1].mentionScore, 50);
  assert.deepEqual(result.brands[0].mentionRunIds, ['positive', 'negative']);
  assert.equal(result.factualAgreement.supported, 1);
  assert.equal(result.factualAgreement.score, 100);
  assert.equal(comparableMeasurements({ status: 'SUCCEEDED', snapshot },
    { status: 'SUCCEEDED', snapshot: { ...snapshot, truth: { version: 3, data: snapshot.truth.data } } }), false);
});

test('Gemini extraction receives saved answers and returns structured items', async () => {
  let request;
  const provider = createGeminiProvider({ apiKey: 'test-only', fetchImpl: async (_url, options) => {
    request = JSON.parse(options.body);
    return { ok: true, json: async () => ({ candidates: [{ finishReason: 'STOP', content: { parts: [{ text: JSON.stringify({ items: [{ id: 'r1', brands: [], claims: [] }] }) }] } }] }) };
  } });
  const result = await provider.extractEvidence([{ id: 'r1', prompt: 'Where?', answer: 'Saved answer' }], snapshot);
  assert.equal(result.items[0].id, 'r1');
  assert.match(JSON.stringify(request.contents), /Saved answer/);
  assert.match(JSON.stringify(request.contents), /Solid-wood tables/);
});

test('measurement retry reuses saved answers and rejects another owner', async () => {
  const rows = {
    scans: [{ id: 'scan-1', business_id: 'business-1', status: 'COMPLETED' }],
    businesses: [{ id: 'business-1', user_id: 'owner-1' }],
    scan_measurements: [{ scan_id: 'scan-1', status: 'FAILED', attempt: 2,
      snapshot, evidence: [], provider_payloads: [] }],
    prompt_runs: [{ id: 'run-1', scan_id: 'scan-1', exact_prompt: 'Best tables?', status: 'SUCCEEDED',
      raw_responses: [{ response_text: 'North House is a good choice.' }] }],
  };
  const db = { from(table) {
    const filters = []; let mutation;
    const query = {
      select() { return this; }, eq(key, expected) { filters.push(row => row[key] === expected); return this; },
      in(key, values) { filters.push(row => values.includes(row[key])); return this; },
      order() { return this; }, limit() { return this; }, lt(key, expected) { filters.push(row => row[key] < expected); return this; },
      update(value) { mutation = value; return this; },
      async maybeSingle() { const data = rows[table].find(row => filters.every(filter => filter(row))) || null;
        if (data && mutation) Object.assign(data, mutation); return { data }; },
      async single() { return this.maybeSingle(); },
      then(resolve) { const data = rows[table].filter(row => filters.every(filter => filter(row)));
        if (mutation) data.forEach(row => Object.assign(row, mutation)); return Promise.resolve({ data }).then(resolve); },
    };
    return query;
  } };
  let extractions = 0;
  const provider = { name: 'gemini', model: 'gemini-3.5-flash-lite',
    async runPrompt() { throw new Error('Paid answer call must not be rerun.'); },
    async extractEvidence(batch) { extractions++;
      return { items: batch.map(run => ({ id: run.id, brands: [{ id: 'target', mentionQuote: 'North House',
        recommendation: 'recommended', recommendationQuote: 'North House is a good choice.' }], claims: [] })), providerPayload: {} }; },
  };
  const service = createScanService(db, provider);
  await assert.rejects(service.retryMeasurement('another-owner', 'scan-1'), /Scan not found/);
  await service.retryMeasurement('owner-1', 'scan-1');
  assert.equal(rows.scan_measurements[0].status, 'PENDING');
  const claimed = await service.claimMeasurement();
  assert.equal(claimed.scan_id, 'scan-1');
  await service.processMeasurement('scan-1');
  assert.equal(extractions, 1);
  assert.equal(rows.scan_measurements[0].status, 'SUCCEEDED');
  assert.equal(rows.scan_measurements[0].metrics.brands[0].mentionScore, 100);
  await assert.rejects(service.retryMeasurement('owner-1', 'scan-1'), /No failed measurement/);
});

test('new scans persist a fixed identity and truth snapshot before answer calls', async () => {
  const rows = {
    businesses: [{ id: 'business-1', user_id: 'owner-1', name: 'North House', website: 'https://north.example', category: 'Furniture', city: 'North City', country: 'India' }],
    business_truth: [{ business_id: 'business-1', version: 3, data: { officialName: 'North House Furniture', services: 'Tables' } }],
    prompts: [{ id: 'prompt-1', business_id: 'business-1', active: true, category: 'DISCOVERY', text: 'Best furniture stores?' }],
    scans: [], prompt_runs: [], scan_measurements: [],
    business_measurement_config: [{ business_id: 'business-1', target_aliases: ['NH Furniture'],
      competitors: [{ name: 'South Studio', aliases: [] }] }],
  };
  const db = { from(table) {
    const filters = []; let inserted;
    const query = {
      select() { return this; }, eq(key, expected) { filters.push(row => row[key] === expected); return this; },
      in(key, values) { filters.push(row => values.includes(row[key])); return this; },
      order() { return this; }, limit() { return this; },
      insert(item) { inserted = Array.isArray(item) ? item : { ...item, id: table === 'scans' ? 'scan-1' : item.id };
        rows[table].push(...(Array.isArray(inserted) ? inserted : [inserted])); return this; },
      async maybeSingle() { return { data: inserted && !Array.isArray(inserted)
        ? inserted : rows[table].find(row => filters.every(filter => filter(row))) || null }; },
      async single() { return this.maybeSingle(); },
      then(resolve) { return Promise.resolve({ data: inserted || rows[table].filter(row => filters.every(filter => filter(row))) }).then(resolve); },
    }; return query;
  } };
  const provider = { name: 'gemini', model: 'gemini-3.5-flash-lite' };
  const scan = await createScanService(db, provider).createScan('owner-1', 'business-1');
  assert.equal(scan.id, 'scan-1');
  assert.equal(rows.prompt_runs[0].exact_prompt, 'Best furniture stores?');
  const saved = rows.scan_measurements[0].snapshot;
  assert.deepEqual(saved.identity.aliases.sort(), ['NH Furniture', 'North House Furniture'].sort());
  assert.equal(saved.competitors[0].name, 'South Studio');
  assert.equal(saved.truth.version, 3);
  assert.equal(saved.truth.data.services, 'Tables');
  assert.match(saved.promptFingerprint, /^[a-f0-9]{64}$/);
});
