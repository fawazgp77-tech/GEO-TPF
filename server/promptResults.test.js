import test from 'node:test';
import assert from 'node:assert/strict';
import { filterPrompts, promptsWithResults } from '../shared/promptResults.js';
import { generatePromptSuggestions } from '../shared/prompts.js';

const business = { name: 'Sofa House', website: 'https://sofahouse.example', category: 'Furniture store', city: 'Mumbai' };
const prompts = [
  { id: 'a', text: 'Best furniture stores near me?', category: 'DISCOVERY', active: true },
  { id: 'b', text: 'Affordable sofas in Mumbai?', category: 'COMMERCIAL', active: true },
  { id: 'c', text: 'Does Sofa House deliver?', category: 'SERVICE', active: false },
  { id: 'd', text: 'Where to buy a table?', category: 'LOCAL', active: true },
];
const run = (prompt_id, exact_prompt, response_text, citations = []) => ({ prompt_id, exact_prompt, status: 'SUCCEEDED', raw_responses: { response_text, citations } });

test('saved prompt IDs link edited questions to the correct snapshot answer', () => {
  const rows = promptsWithResults(prompts, { runs: [run('a', 'Old furniture question?', 'Sofa House is one option.'), run('b', prompts[1].text, 'Other shops sell sofas.'), run('c', prompts[2].text, 'Sofa House delivers.') ] }, business);
  assert.equal(rows[0].outcome.kind, 'positive');
  assert.equal(rows[0].outcome.previousWording, 'Old furniture question?');
  assert.equal(rows[1].outcome.kind, 'negative');
  assert.equal(rows[2].outcome.kind, 'branded');
  assert.equal(rows[3].outcome.kind, 'untested');
  assert.deepEqual(filterPrompts(rows, { result: 'positive' }).map(item => item.id), ['a']);
  assert.deepEqual(filterPrompts(rows, { result: 'negative', active: 'active' }).map(item => item.id), ['b']);
});

test('brand citation requires an actual link to the official website', () => {
  const rows = promptsWithResults(prompts, { runs: [
    run('a', prompts[0].text, 'Sofa House.', [{ url: 'https://www.sofahouse.example/page' }]),
    run('b', prompts[1].text, 'Another store.', [{ url: 'https://other.example' }]),
  ] }, business);
  assert.deepEqual(filterPrompts(rows, { result: 'brand-cited' }).map(item => item.id), ['a']);
  assert.deepEqual(filterPrompts(rows, { result: 'other-citation' }).map(item => item.id), ['b']);
});

test('failed and missing answers are never treated as negative visibility', () => {
  const rows = promptsWithResults(prompts, { runs: [{ prompt_id: 'a', status: 'FAILED', exact_prompt: prompts[0].text }, run('b', prompts[1].text, '')] }, business);
  assert.equal(rows[0].outcome.kind, 'failed');
  assert.equal(rows[1].outcome.kind, 'untested');
  assert.equal(filterPrompts(rows, { result: 'negative' }).length, 0);
});

test('suggestions include twenty starter questions plus additions without business identity', () => {
  const suggestions = generatePromptSuggestions(business);
  assert.equal(suggestions.length, 32);
  assert.ok(suggestions.every(item => !item.text.includes('Sofa House')));
  assert.ok(new Set(suggestions.map(item => item.text.toLowerCase())).size === 32);
});

test('industry word at start of business name remains a useful generic prompt topic', () => {
  const suggestions = generatePromptSuggestions({ ...business, name: 'Furniture House', category: 'Furniture store' });
  assert.match(suggestions[0].text, /furniture stores/i);
  assert.ok(suggestions.every(item => !item.text.includes('Furniture House')));
});
