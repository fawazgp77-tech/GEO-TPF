import { summarizeScan } from './scanMetrics.js';

export const savedResponse = run => Array.isArray(run?.raw_responses) ? run.raw_responses[0] : run?.raw_responses;

export function safeCitation(value) {
  const href = typeof value === 'string' ? value : value?.url;
  try {
    const url = new URL(href);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    return { url: url.href, title: typeof value?.title === 'string' && value.title.trim() ? value.title.trim() : url.hostname };
  } catch { return null; }
}

export function analyticsMetrics(runs = [], business = {}) {
  const answers = runs.map((run, index) => {
    const raw = savedResponse(run);
    const responseText = typeof raw?.response_text === 'string' ? raw.response_text : '';
    const answered = run.status === 'SUCCEEDED' && Boolean(responseText.trim());
    const single = answered ? summarizeScan([run], business) : null;
    const unbranded = answered && single.unbrandedAnswered === 1;
    const mentioned = unbranded && single.unpromptedNameMentions === 1;
    const nameMatch = answered && single.exactNameMentions === 1;
    const citations = Array.isArray(raw?.citations) ? raw.citations : [];
    return {
      ...run, number: index + 1, responseText, answered, unbranded, mentioned, nameMatch,
      cited: answered && citations.length > 0, citations: citations.map(safeCitation).filter(Boolean),
    };
  });
  const answered = answers.filter(item => item.answered).length;
  const failed = answers.filter(item => item.status === 'FAILED').length;
  const unbrandedAnswered = answers.filter(item => item.unbranded).length;
  const mentions = answers.filter(item => item.mentioned).length;
  const cited = answers.filter(item => item.cited).length;
  const categories = [...new Set(answers.map(item => item.category || 'OTHER'))].map(category => {
    const subset = answers.filter(item => (item.category || 'OTHER') === category);
    const categoryAnswered = subset.filter(item => item.answered).length;
    const eligible = subset.filter(item => item.unbranded).length;
    const categoryMentions = subset.filter(item => item.mentioned).length;
    return { category, total: subset.length, answered: categoryAnswered, eligible, mentions: categoryMentions,
      mentionRate: eligible ? categoryMentions / eligible : null };
  });
  return { answers, total: answers.length, answered, failed, unanswered: answers.length - answered - failed,
    unbrandedAnswered, mentions, mentionRate: unbrandedAnswered ? mentions / unbrandedAnswered : null,
    cited, citationRate: answered ? cited / answered : null, categories };
}
