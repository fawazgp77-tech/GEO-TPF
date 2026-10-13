import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeScan } from '../shared/scanMetrics.js';

test('dashboard counts only saved answers and uses the latest scan denominator', () => {
  const result = summarizeScan([
    { category: 'DISCOVERY', exact_prompt: 'What are the best cricket academies near me?', status: 'SUCCEEDED', raw_responses: [{ response_text: 'North Academy is one option.', citations: [{ url: 'https://example.com' }] }] },
    { category: 'DISCOVERY', exact_prompt: 'Where can I find cricket coaching?', status: 'SUCCEEDED', raw_responses: [{ response_text: 'North Academy may be considered.', citations: [] }] },
    { category: 'DISCOVERY', exact_prompt: 'Is North Academy a good choice?', status: 'SUCCEEDED', raw_responses: [{ response_text: 'North Academy may be a good choice.', citations: [] }] },
    { category: 'SERVICE', status: 'FAILED', raw_responses: [] },
  ], 'North Academy');
  assert.deepEqual({ total: result.total, answered: result.answered, failed: result.failed,
    exactNameMentions: result.exactNameMentions, unbrandedAnswered: result.unbrandedAnswered,
    unpromptedNameMentions: result.unpromptedNameMentions, citedAnswers: result.citedAnswers },
  { total: 4, answered: 3, failed: 1, exactNameMentions: 3,
    unbrandedAnswered: 2, unpromptedNameMentions: 2, citedAnswers: 1 });
  assert.deepEqual(result.categories, [{ category: 'DISCOVERY', total: 3, answered: 3 },
    { category: 'SERVICE', total: 1, answered: 0 }]);
  assert.equal(summarizeScan([{ category: 'DISCOVERY', status: 'SUCCEEDED',
    raw_responses: [{ response_text: 'North AcademyPlus is unrelated.', citations: [] }] }], 'North Academy').exactNameMentions, 0);
});

test('location suffix aliases count unprompted brand mentions without counting branded questions', () => {
  const result = summarizeScan([
    { category: 'DISCOVERY', exact_prompt: 'Best furniture stores in Hyderabad?', status: 'SUCCEEDED',
      raw_responses: [{ response_text: 'IKEA is one option.', citations: [] }] },
    { category: 'SERVICE', exact_prompt: 'Does IKEA offer delivery?', status: 'SUCCEEDED',
      raw_responses: [{ response_text: 'IKEA offers delivery.', citations: [] }] },
  ], { name: 'IKEA Hyderabad', city: 'Hyderabad', country: 'India', category: 'Furniture store' });
  assert.deepEqual(result.matchedNames, ['IKEA Hyderabad', 'IKEA']);
  assert.equal(result.exactNameMentions, 0);
  assert.equal(result.unbrandedAnswered, 1);
  assert.equal(result.unpromptedNameMentions, 1);
});
