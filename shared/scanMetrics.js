function responseFor(run) {
  return Array.isArray(run.raw_responses) ? run.raw_responses[0] : run.raw_responses;
}

function namePattern(names) {
  if (!names.length) return null;
  const escaped = names.map(name => name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  return new RegExp(`(^|[^\\p{L}\\p{N}])(?:${escaped.join('|')})(?=$|[^\\p{L}\\p{N}])`, 'iu');
}

export function summarizeScan(runs = [], business = '') {
  const details = typeof business === 'string' ? { name: business } : business || {};
  const fullName = String(details.name || '').trim();
  let shortName = fullName;
  for (const location of [details.country, details.city]) {
    if (location && shortName.toLowerCase().endsWith(` ${location.toLowerCase()}`))
      shortName = shortName.slice(0, -(location.length + 1)).trim();
  }
  const names = fullName ? [fullName] : [];
  if (shortName !== fullName && shortName.length >= 4 && shortName.toLowerCase() !== String(details.category || '').toLowerCase())
    names.push(shortName);
  const fullPattern = namePattern(fullName ? [fullName] : []);
  const visibilityPattern = namePattern(names);
  const answered = runs.filter(run => run.status === 'SUCCEEDED' && responseFor(run)?.response_text);
  const unbrandedAnswered = visibilityPattern
    ? answered.filter(run => !visibilityPattern.test(run.exact_prompt || '')) : answered;
  const categories = [...new Set(runs.map(run => run.category))].map(category => ({
    category,
    total: runs.filter(run => run.category === category).length,
    answered: answered.filter(run => run.category === category).length,
  }));
  return {
    total: runs.length,
    answered: answered.length,
    failed: runs.filter(run => run.status === 'FAILED').length,
    exactNameMentions: fullPattern ? answered.filter(run => fullPattern.test(responseFor(run).response_text)).length : 0,
    unbrandedAnswered: unbrandedAnswered.length,
    unpromptedNameMentions: visibilityPattern
      ? unbrandedAnswered.filter(run => visibilityPattern.test(responseFor(run).response_text)).length : 0,
    matchedNames: names,
    citedAnswers: answered.filter(run => Array.isArray(responseFor(run).citations) && responseFor(run).citations.length > 0).length,
    categories,
  };
}
