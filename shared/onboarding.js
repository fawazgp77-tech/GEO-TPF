import { basicFields, truthFields, validateFields } from './business.js';

const truthOrder = ['officialName', 'website', 'description', 'address', 'services', 'audience', 'areasServed', 'phone', 'openingHours', 'priceRange', 'differentiators', 'competitors', 'otherFacts'];
export const wizardQuestions = [
  ...basicFields.map(([key, label, required]) => ({ group: 'basics', key, label, required })),
  ...truthOrder.map(key => { const [, label, required] = truthFields.find(field => field[0] === key); return { group: 'truth', key, label, required }; }),
];
export function validateQuestion(question, value) {
  return validateFields({ [question.key]: value }, [[question.key, question.label, question.required]])[question.key];
}
export function truthDefaults(basics, truth = {}) {
  return { officialName: basics.name || '', website: basics.website || '', areasServed: basics.city || '', ...truth };
}
export function equalTruth(first, second) {
  return truthFields.every(([key]) => String(first?.[key] || '').trim() === String(second?.[key] || '').trim());
}
export function newWizardDraft(creationId) {
  return { schema: 1, creationId, createdId: '', basics: {}, truth: {}, step: 0, version: 0, submittedBasics: null };
}
export function draftKey(userId, businessId = '') { return `presence-onboarding:${userId}:${businessId || 'new'}`; }
let draftEpoch = 0;
export function wizardDraftEpoch() { return draftEpoch; }
export function clearWizardDrafts(storage) {
  draftEpoch++;
  try { storage ||= window.sessionStorage; for (let index = storage.length - 1; index >= 0; index--) { const key = storage.key(index); if (key?.startsWith('presence-onboarding:')) storage.removeItem(key); } } catch { /* Storage can be disabled. */ }
}

export async function saveWizard(api, draft, verified, checkpoint = () => {}) {
  if (verified !== true) throw new Error('Confirm that these facts are owner-verified before saving.');
  const basics = validateFields(draft.basics, basicFields);
  const truth = validateFields(truthDefaults(basics, draft.truth), truthFields);
  let next = { ...draft, submittedBasics: draft.submittedBasics || basics, truth };
  checkpoint(next);
  if (!next.createdId) {
    const { business } = await api('/businesses', { method: 'POST', body: { ...next.submittedBasics, creationId: next.creationId } });
    if (!business?.id) throw new Error('Business creation could not be confirmed. Retry this draft.');
    next = { ...next, createdId: business.id };
    checkpoint(next);
  }
  const path = `/businesses/${next.createdId}/truth`;
  const recovered = latest => latest && latest.version === next.version + 1 && equalTruth(latest.data, truth);
  const { truth: latest } = await api(path);
  if (recovered(latest)) return { businessId: next.createdId, version: latest.version };
  if ((latest?.version || 0) !== next.version) throw new Error('Brand Truth changed. Reload the wizard and review the latest facts before saving.');
  try {
    const result = await api(path, { method: 'POST', body: { data: truth, verified: true, version: next.version } });
    if (result?.version !== next.version + 1) throw new Error('Brand Truth saving could not be confirmed. Retry this draft.');
    return { businessId: next.createdId, version: result.version };
  } catch (error) {
    // A lost response must not append another revision on retry.
    try { const { truth: saved } = await api(path); if (recovered(saved)) return { businessId: next.createdId, version: saved.version }; } catch { /* Keep the original error. */ }
    throw error;
  }
}
