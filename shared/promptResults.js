import { summarizeScan } from './scanMetrics.js';

export const resultFilters = [
  ['all', 'All results'], ['brand-cited', 'Brand website cited'], ['positive', 'Positive visibility'],
  ['negative', 'Negative visibility'], ['other-citation', 'Other citation'],
  ['failed', 'Failed answer'], ['untested', 'Not tested in this scan'], ['branded', 'Branded question'],
];

export const normalizedPrompt = value => String(value || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase();
export function isBrandedQuestion(text, business) {
  return summarizeScan([{ status: 'SUCCEEDED', exact_prompt: text, raw_responses: { response_text: 'answer', citations: [] } }], business).unbrandedAnswered === 0;
}
const responseFor = run => Array.isArray(run?.raw_responses) ? run.raw_responses[0] : run?.raw_responses;
function hostname(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.hostname.toLowerCase().replace(/^www\./, '') : ''; }
  catch { return ''; }
}

export function promptOutcome(prompt, run, business) {
  if (!run) return { kind: 'untested', label: 'Not tested in this scan', cited: false, brandCited: false, previousWording: '' };
  const previousWording = normalizedPrompt(prompt.text) === normalizedPrompt(run.exact_prompt) ? '' : run.exact_prompt;
  if (run.status === 'FAILED') return { kind: 'failed', label: 'Answer failed', cited: false, brandCited: false, previousWording };
  const response = responseFor(run);
  if (run.status !== 'SUCCEEDED' || !response?.response_text) return { kind: 'untested', label: 'No saved answer', cited: false, brandCited: false, previousWording };
  const metrics = summarizeScan([run], business);
  const branded = metrics.unbrandedAnswered === 0;
  const citations = Array.isArray(response.citations) ? response.citations : [];
  const officialHost = hostname(business.website);
  const brandCited = Boolean(officialHost && citations.some(item => hostname(item.url) === officialHost));
  const cited = citations.length > 0;
  return { kind: branded ? 'branded' : metrics.unpromptedNameMentions ? 'positive' : 'negative',
    label: branded ? 'Branded question' : metrics.unpromptedNameMentions ? 'Positive visibility' : 'Negative visibility', cited, brandCited, previousWording };
}

export function promptsWithResults(prompts, detail, business) {
  const runs = new Map((detail?.runs || []).filter(run => run.prompt_id).map(run => [run.prompt_id, run]));
  return prompts.map(prompt => ({ ...prompt, outcome: promptOutcome(prompt, runs.get(prompt.id), business) }));
}

export function filterPrompts(prompts, { query = '', category = 'all', active = 'all', result = 'all' } = {}) {
  const search = normalizedPrompt(query);
  return prompts.filter(prompt => {
    if (search && !normalizedPrompt(prompt.text).includes(search)) return false;
    if (category !== 'all' && prompt.category !== category) return false;
    if (active !== 'all' && prompt.active !== (active === 'active')) return false;
    if (result === 'brand-cited' && !prompt.outcome.brandCited) return false;
    if (result === 'other-citation' && (!prompt.outcome.cited || prompt.outcome.brandCited)) return false;
    if (!['all', 'brand-cited', 'other-citation'].includes(result) && prompt.outcome.kind !== result) return false;
    return true;
  });
}
