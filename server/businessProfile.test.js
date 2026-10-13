import test from 'node:test';
import assert from 'node:assert/strict';
import { latestFinishedScan, loadBusinessProfile, scanReadiness } from '../shared/businessProfile.js';
import { saveTruthRevision } from '../shared/truthRevision.js';

const business = { id: 'business-a', name: 'Furniture House', city: 'Hyderabad' };
const scan = (id, status, created_at) => ({ id, business_id: business.id, status, created_at });
const complete = scan('complete', 'COMPLETED', '2026-10-10');
const running = scan('running', 'RUNNING', '2026-10-12');
const facts = { officialName: business.name, description: 'Furniture shop', website: 'https://example.com', address: 'Hyderabad', services: 'Furniture', audience: 'Homeowners', areasServed: 'Hyderabad' };

test('profile retains the newest finished snapshot while newer scans are running or failed', () => {
  assert.equal(latestFinishedScan([running, scan('failure', 'FAILED', '2026-10-11'), complete]).id, 'complete');
  const partial = scan('partial', 'PARTIALLY_FAILED', '2026-10-11');
  assert.equal(latestFinishedScan([complete, running, partial]).id, 'partial');
  assert.equal(latestFinishedScan([running]), null);
});

test('profile loads saved evidence from the finished scan and excludes branded prompts from its denominator', async () => {
  const paths = [];
  const data = await loadBusinessProfile(async path => {
    paths.push(path);
    if (path.endsWith('/truth')) return { truth: { version: 1, data: facts } };
    if (path.endsWith('/prompts')) return { prompts: [{ active: true }] };
    if (path.endsWith('/scans')) return { scans: [running, complete] };
    return { scan: complete, runs: [
      { status: 'SUCCEEDED', exact_prompt: 'Best furniture stores near me?', raw_responses: { response_text: 'Try Furniture House', citations: [] } },
      { status: 'SUCCEEDED', exact_prompt: 'What does Furniture House sell?', raw_responses: { response_text: 'Furniture House sells tables', citations: [] } },
    ] };
  }, business);
  assert.equal(data.summary.scan.id, complete.id);
  assert.equal(data.metrics.answered, 2); assert.equal(data.metrics.unbrandedAnswered, 1); assert.equal(data.metrics.unpromptedNameMentions, 1);
  assert.ok(!paths.includes('/scans/running'));
  assert.equal(scanReadiness(data).ready, false);
});

test('profile rejects mismatched scan scope without hiding owner-supplied facts', async () => {
  const data = await loadBusinessProfile(async path => {
    if (path.endsWith('/truth')) return { truth: { version: 1, data: facts } };
    if (path.endsWith('/prompts')) throw new Error('Prompt service offline');
    if (path.endsWith('/scans')) return { scans: [complete] };
    return { scan: { ...complete, business_id: 'business-b' }, runs: [] };
  }, business);
  assert.equal(data.truth.data, facts);
  assert.equal(data.summary, null); assert.equal(data.metrics, null);
  assert.match(data.errors.summary, /selected business/);
  assert.match(data.errors.prompts, /offline/);
  assert.equal(scanReadiness(data).ready, false);
});

test('scan launch requires verified facts, known status, active saved prompts, and no active scan', () => {
  const data = { truth: { version: 1 }, prompts: [{ active: true }, { active: false }], scans: [], errors: {} };
  assert.deepEqual(scanReadiness(data), { ready: true, count: 1, reason: '1 active saved prompt · Gemini' });
  for (const changed of [{ truth: null }, { prompts: [{ active: false }] }, { prompts: Array.from({ length: 41 }, () => ({ active: true })) }, { scans: [running] }, { errors: { scans: 'offline' } }, { errors: { truth: 'offline' } }])
    assert.equal(scanReadiness({ ...data, ...changed }).ready, false);
});

test('editing truth requires explicit verification and sends the expected revision', async () => {
  let writes = 0;
  const request = async (path, options) => { writes++; assert.equal(options.body.version, 2); assert.equal(options.body.verified, true); return { version: 3 }; };
  await assert.rejects(saveTruthRevision(request, business.id, facts, 2, false), /owner-verified/);
  assert.equal(writes, 0);
  assert.equal(await saveTruthRevision(request, business.id, facts, 2, true), 3);
  assert.equal(writes, 1);
});

test('lost truth-edit response recovers exactly one matching next revision', async () => {
  let writes = 0;
  const request = async (path, options) => {
    if (options?.method === 'POST') { writes++; throw new Error('Reply lost'); }
    return { truth: { version: 3, data: facts } };
  };
  assert.equal(await saveTruthRevision(request, business.id, facts, 2, true), 3);
  assert.equal(writes, 1);
  await assert.rejects(saveTruthRevision(async (path, options) => {
    if (options?.method === 'POST') throw new Error('Revision conflict');
    return { truth: { version: 3, data: { ...facts, services: 'Different facts' } } };
  }, business.id, facts, 2, true), /Revision conflict/);
});
