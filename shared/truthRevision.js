import { truthFields, validateFields } from './business.js';
import { equalTruth } from './onboarding.js';

export async function saveTruthRevision(request, businessId, input, version, verified) {
  if (verified !== true) throw new Error('Confirm that these facts are owner-verified.');
  const data = validateFields(input, truthFields);
  const path = `/businesses/${businessId}/truth`;
  try {
    const saved = await request(path, { method: 'POST', body: { data, version, verified: true } });
    if (saved.version !== version + 1) throw new Error('The saved Brand Truth revision was not confirmed.');
    return saved.version;
  } catch (error) {
    // A response can be lost after committing. Recover only the intended next version.
    try {
      const { truth } = await request(path);
      if (truth?.version === version + 1 && equalTruth(truth.data, data)) return truth.version;
    } catch { /* Keep the original save error and the unsaved form. */ }
    throw error;
  }
}
