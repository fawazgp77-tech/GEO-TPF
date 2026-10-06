import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeScan } from '../shared/scanMetrics.js';

test('dashboard counts only saved answers and uses the latest scan denominator', () => {
  const result = summarizeScan([
    { category: 'DISCOVERY', status: 'SUCCEEDED', raw_responses: [{ response_text: 'North Academy is one option.', citations: [{ url: 'https://example.com' }] }] },
    { category: 'DISCOVERY', status: 'SUCCEEDED', raw_responses: [{ response_text: 'North Academy may be considered.', citations: [] }] },
    { category: 'SERVICE', status: 'FAILED', raw_responses: [] },
  ], 'North Academy');
  assert.deepEqual({ total: result.total, answered: result.answered, failed: result.failed,
    exactNameMentions: result.exactNameMentions, citedAnswers: result.citedAnswers },
  { total: 3, answered: 2, failed: 1, exactNameMentions: 2, citedAnswers: 1 });
  assert.deepEqual(result.categories, [{ category: 'DISCOVERY', total: 2, answered: 2 },
    { category: 'SERVICE', total: 1, answered: 0 }]);
  assert.equal(summarizeScan([{ category: 'DISCOVERY', status: 'SUCCEEDED',
    raw_responses: [{ response_text: 'North AcademyPlus is unrelated.', citations: [] }] }], 'North Academy').exactNameMentions, 0);
});
