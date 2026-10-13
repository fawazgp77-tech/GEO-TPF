import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsMetrics, safeCitation } from '../shared/analyticsMetrics.js';
import { buildAnalysisEvidence } from './scans/service.js';

const business = { name: 'Sofa House', category: 'Furniture store', city: 'Mumbai' };
const run = (status, exact_prompt, response_text, category = 'DISCOVERY', citations = []) =>
  ({ id: String(Math.random()), status, exact_prompt, category, raw_responses: response_text === null ? null : { response_text, citations } });

test('analytics denominators exclude branded prompts and keep partial failures distinct', () => {
  const rows = [
    run('SUCCEEDED', 'Best furniture shops?', 'Sofa House is an option.', 'DISCOVERY', [{ url: 'https://example.com' }]),
    run('SUCCEEDED', 'Affordable sofas?', 'Try other shops.', 'DISCOVERY'),
    run('SUCCEEDED', 'Does Sofa House sell sofas?', 'Sofa House sells sofas.', 'SERVICE'),
    run('FAILED', 'Who delivers furniture?', null, 'SERVICE'),
    run('PENDING', 'Best chairs?', null, 'COMMERCIAL'),
  ];
  const metrics = analyticsMetrics(rows, business);
  assert.deepEqual([metrics.total, metrics.answered, metrics.failed, metrics.unanswered], [5, 3, 1, 1]);
  assert.deepEqual([metrics.unbrandedAnswered, metrics.mentions, metrics.mentionRate], [2, 1, 0.5]);
  assert.deepEqual([metrics.cited, metrics.citationRate], [1, 1 / 3]);
  assert.deepEqual(metrics.categories.map(item => [item.category, item.total, item.answered, item.eligible, item.mentions]),
    [['DISCOVERY', 2, 2, 2, 1], ['SERVICE', 2, 1, 0, 0], ['COMMERCIAL', 1, 0, 0, 0]]);
  assert.equal(metrics.answers[2].nameMatch, true);
  assert.equal(metrics.answers[2].mentioned, false);
});

test('empty evidence has unavailable rates rather than zero scores', () => {
  const metrics = analyticsMetrics([], business);
  assert.equal(metrics.mentionRate, null);
  assert.equal(metrics.citationRate, null);
  assert.equal(metrics.total, 0);
});

test('citation links only allow http or https', () => {
  assert.equal(safeCitation({ url: 'javascript:alert(1)' }), null);
  assert.equal(safeCitation({ url: 'data:text/html,evil' }), null);
  assert.deepEqual(safeCitation({ url: 'https://example.com/a', title: 'Source' }), { url: 'https://example.com/a', title: 'Source' });
});

test('report prompt numbers retain positions of failed saved runs', () => {
  const ordered = [
    { exact_prompt: 'First?', status: 'FAILED', raw_responses: null },
    { exact_prompt: 'Second?', status: 'SUCCEEDED', raw_responses: { response_text: 'Second answer.' } },
  ];
  assert.deepEqual(buildAnalysisEvidence(ordered), [{ number: 2, prompt: 'Second?', status: 'SUCCEEDED', answer: 'Second answer.' }]);
  assert.equal(analyticsMetrics(ordered, business).answers[1].number, 2);
});
