import test from 'node:test';
import assert from 'node:assert/strict';
import { basicFields, truthFields } from '../shared/business.js';
import { confirmCreationMatch, createOwnedBusiness, validateCreationId } from '../shared/businessCreation.js';
import { clearWizardDrafts, draftKey, newWizardDraft, saveWizard, validateQuestion, wizardQuestions } from '../shared/onboarding.js';

const id = 'ed2f3aa3-9b27-4d98-a90d-3798eebcb679';
const basics = { name: 'Fixture Furniture', website: 'https://example.com', category: 'Furniture store', country: 'India', city: 'Hyderabad', branch: '' };
const truth = { officialName: basics.name, website: basics.website, description: 'Furniture retail', address: 'Fixture road', services: 'Tables and chairs', audience: 'Homeowners', areasServed: 'Hyderabad' };
const draft = () => ({ ...newWizardDraft(id), basics, truth });

test('wizard questions cover every required schema field and reject unsafe website values', () => {
  for (const [group, fields] of [['basics', basicFields], ['truth', truthFields]]) {
    for (const [key, , required] of fields) assert.equal(wizardQuestions.find(q => q.group === group && q.key === key)?.required, required);
  }
  assert.throws(() => validateQuestion(wizardQuestions.find(q => q.key === 'website'), 'javascript:alert(1)'), /http/);
  assert.throws(() => validateCreationId('another-user-id'), /Invalid/);
  assert.equal(validateCreationId(id.toUpperCase()), id);
  assert.throws(() => confirmCreationMatch({ ...basics, name: 'Different' }, basics), /different business details/);
});

test('wizard never creates a business until owner verification is explicit', async () => {
  let calls = 0;
  await assert.rejects(saveWizard(async () => { calls++; }, draft(), false), /owner-verified/);
  assert.equal(calls, 0);
});

test('truth-save retry reuses the confirmed business instead of creating another', async () => {
  let current = draft(), creates = 0, truthWrites = 0;
  const api = async (path, options) => {
    if (path === '/businesses') { creates++; assert.equal(options.body.creationId, id); return { business: { id } }; }
    if (!options) return { truth: null };
    truthWrites++;
    if (truthWrites === 1) throw new Error('Worker offline');
    assert.equal(options.body.verified, true);
    return { version: 1 };
  };
  await assert.rejects(saveWizard(api, current, true, next => { current = next; }), /Worker offline/);
  assert.equal(current.createdId, id);
  const saved = await saveWizard(api, current, true, next => { current = next; });
  assert.equal(saved.version, 1); assert.equal(creates, 1); assert.equal(truthWrites, 2);
});

test('a lost truth response is recovered without appending a second revision', async () => {
  let latest = null, writes = 0;
  const api = async (path, options) => {
    if (path === '/businesses') return { business: { id } };
    if (!options) return { truth: latest };
    writes++; latest = { version: 1, data: options.body.data };
    throw new Error('Response lost');
  };
  const saved = await saveWizard(api, draft(), true);
  assert.equal(saved.version, 1); assert.equal(writes, 1);
});

test('a lost creation response retries with the same identity and payload', async () => {
  let current = draft(), exists = false, creates = 0;
  const api = async (path, options) => {
    if (path === '/businesses') {
      assert.equal(options.body.creationId, id);
      if (!exists) { creates++; exists = true; throw new Error('Creation response lost'); }
      return { business: { id } };
    }
    return options ? { version: 1 } : { truth: null };
  };
  await assert.rejects(saveWizard(api, current, true, next => { current = next; }), /Creation response lost/);
  assert.deepEqual(current.submittedBasics, basics);
  const saved = await saveWizard(api, current, true);
  assert.equal(saved.businessId, id); assert.equal(creates, 1);
});

test('creation race recovers the winning owned record on a duplicate-key response', async () => {
  let reads = 0;
  const client = { from() { return { select() { return this; }, eq() { return this; },
    maybeSingle: async () => ({ data: ++reads === 1 ? null : { id, ...basics }, error: null }),
    insert() { return this; }, single: async () => ({ data: null, error: { code: '23505' } }) }; } };
  assert.equal((await createOwnedBusiness(client, 'owner', basics, id)).id, id);
  assert.equal(reads, 2);
});

test('a changed truth revision is not overwritten by an old draft', async () => {
  let writes = 0;
  const api = async (_path, options) => { if (options) writes++; return { truth: { version: 2, data: { ...truth, description: 'Updated by owner' } } }; };
  await assert.rejects(saveWizard(api, { ...draft(), createdId: id }, true), /Brand Truth changed/);
  assert.equal(writes, 0);
});

test('wizard completion requires a confirmed truth revision', async () => {
  const api = async (_path, options) => options ? {} : { truth: null };
  await assert.rejects(saveWizard(api, { ...draft(), createdId: id }, true), /could not be confirmed/);
});

test('creation recovery always reads by owner and never adopts another owner record', async () => {
  const filters = [], own = { id, ...basics };
  let mode = 'own', inserts = 0;
  const client = { from() {
    return { select() { return this; }, eq(key, value) { filters.push([key, value]); return this; },
      maybeSingle: async () => ({ data: mode === 'own' ? own : null, error: null }),
      insert() { inserts++; return this; }, single: async () => ({ data: null, error: { code: '23505' } }) };
  } };
  assert.equal((await createOwnedBusiness(client, 'owner-1', basics, id)).id, id);
  assert.equal(inserts, 0); assert.ok(filters.some(([key, value]) => key === 'user_id' && value === 'owner-1'));
  mode = 'other';
  await assert.rejects(createOwnedBusiness(client, 'owner-2', basics, id), /Unable to recover/);
});

test('drafts are scoped by owner and clearing them preserves unrelated storage', () => {
  assert.notEqual(draftKey('owner-1'), draftKey('owner-2'));
  const values = new Map([[draftKey('owner-1'), 'draft'], [draftKey('owner-2'), 'draft'], ['presence-theme', 'dark']]);
  const storage = { get length() { return values.size; }, key(index) { return [...values.keys()][index]; }, removeItem(key) { values.delete(key); } };
  clearWizardDrafts(storage);
  assert.deepEqual([...values.keys()], ['presence-theme']);
});
