import { summarizeScan } from './scanMetrics.js';

export const truthGroups = [
  { title: 'Identity & location', keys: ['officialName', 'description', 'website', 'address', 'phone', 'openingHours'] },
  { title: 'Products & customers', keys: ['services', 'audience', 'areasServed', 'priceRange'] },
  { title: 'What makes you different', keys: ['differentiators', 'competitors', 'otherFacts'] },
];
export const isActiveScan = scan => ['PENDING', 'RUNNING'].includes(scan.status);
export function latestFinishedScan(scans = []) {
  return [...scans].sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at))
    .find(scan => ['COMPLETED', 'PARTIALLY_FAILED'].includes(scan.status)) || null;
}

// Keep independent failures separate: unavailable scan data must not hide verified facts.
export async function loadBusinessProfile(request, business) {
  const paths = ['truth', 'prompts', 'scans'];
  const results = await Promise.allSettled(paths.map(path => request(`/businesses/${business.id}/${path}`)));
  const data = { truth: null, prompts: [], scans: [], summary: null, metrics: null, errors: {} };
  results.forEach((result, index) => {
    const key = paths[index];
    if (result.status === 'fulfilled') data[key] = result.value[key];
    else data.errors[key] = result.reason.message || `Could not load ${key}.`;
  });
  const latest = latestFinishedScan(data.scans);
  if (latest) {
    try {
      const detail = await request(`/scans/${latest.id}`);
      if (detail.scan.id !== latest.id || detail.scan.business_id !== business.id) throw new Error('This scan is unavailable for the selected business.');
      data.summary = detail;
      data.metrics = summarizeScan(detail.runs, business);
    } catch (error) { data.errors.summary = error.message; }
  }
  return data;
}

export function scanReadiness(data) {
  if (!data) return { ready: false, reason: 'Loading saved business data…' };
  if (data.errors.truth) return { ready: false, reason: 'Reload your verified facts before scanning.' };
  if (!data.truth?.version) return { ready: false, reason: 'Verify Brand Truth before scanning.' };
  if (data.errors.prompts || data.errors.scans) return { ready: false, reason: 'Reload prompts and scan status before scanning.' };
  if (data.scans.some(isActiveScan)) return { ready: false, reason: 'A scan is already queued or running.' };
  const count = data.prompts.filter(prompt => prompt.active).length;
  if (!count) return { ready: false, reason: 'Add or activate a saved prompt before scanning.' };
  if (count > 40) return { ready: false, reason: 'Keep 40 or fewer prompts active for an MVP scan.' };
  return { ready: true, count, reason: `${count} active saved prompt${count === 1 ? '' : 's'} · Gemini` };
}
