import test from 'node:test';
import assert from 'node:assert/strict';
import { parseNavigation, navigationUrl } from '../src/lib/navigation.js';

test('workspace navigation rejects invalid selection and defaults unknown sections', () => {
  const route = parseNavigation('?view=dashboard&business=business-1&section=unknown&scan=scan-1');
  assert.equal(route.section, 'profile');
  assert.equal(route.business, 'business-1');
  assert.equal(route.scan, 'scan-1');
  assert.equal(parseNavigation('?business=../other').invalidSelection, true);
  assert.equal(parseNavigation('?view=unknown').view, 'landing');
  assert.equal(parseNavigation('?mode=delete').mode, '');
});

test('workspace links clear stale scan scope and preserve authentication query parameters', () => {
  const next = new URLSearchParams(navigationUrl('?view=dashboard&business=old&scan=old-scan&tab=accuracy&demo=true&code=callback-code', {
    business: 'new-business', scan: '', section: 'prompts',
  }));
  assert.equal(next.get('business'), 'new-business');
  assert.equal(next.has('scan'), false);
  assert.equal(next.has('tab'), false);
  assert.equal(next.has('demo'), false);
  assert.equal(next.get('code'), 'callback-code');
});
