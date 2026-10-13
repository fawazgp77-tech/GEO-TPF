import test from 'node:test';
import assert from 'node:assert/strict';
import { historyCounts, historyRequest, historyTitle, localDayBoundary, parseHistoryFilters, scanStatusLabel } from '../shared/scanHistory.js';

test('history filters sanitize navigation and produce a bounded page request', () => {
  const filters = parseHistoryFilters(new URLSearchParams('historyStatus=partial&historyFrom=2026-10-01&historyTo=2026-10-13&historySort=oldest&historyPage=3'));
  assert.deepEqual(filters, { status: 'partial', from: '2026-10-01', to: '2026-10-13', sort: 'oldest', page: 3 });
  assert.equal(historyRequest('business-id', filters), '/businesses/business-id/scan-history?status=partial&sort=oldest&offset=24&limit=12&from=2026-10-01&to=2026-10-13');
  assert.equal(parseHistoryFilters(new URLSearchParams('historyStatus=nope&historyPage=99999&historyFrom=bad')).page, 1);
  assert.equal(parseHistoryFilters(new URLSearchParams('historyFrom=2026-02-30')).from, '');
  assert.equal(localDayBoundary('2026-02-30'), null);
  assert.equal(new Date(localDayBoundary('2026-10-13', true)).getTime() - new Date(localDayBoundary('2026-10-13')).getTime(), 24 * 60 * 60 * 1000);
});

test('history cards report saved attempts without inventing missing analysis', () => {
  const scan = { created_at: '2026-10-12T09:00:00Z', prompt_runs: [{ status: 'SUCCEEDED' }, { status: 'FAILED' }, { status: 'PENDING' }] };
  assert.deepEqual(historyCounts(scan), { successful: 1, total: 3 });
  assert.match(historyTitle(scan, 'en-GB'), /^Discovery scan · /);
  assert.equal(scanStatusLabel('PARTIALLY_FAILED'), 'Partially failed');
});
