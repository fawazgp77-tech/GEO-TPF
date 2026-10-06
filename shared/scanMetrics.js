function responseFor(run) {
  return Array.isArray(run.raw_responses) ? run.raw_responses[0] : run.raw_responses;
}

export function summarizeScan(runs = [], businessName = '') {
  const name = businessName.trim();
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const namePattern = name ? new RegExp(`(^|[^\\p{L}\\p{N}])${escapedName}(?=$|[^\\p{L}\\p{N}])`, 'iu') : null;
  const answered = runs.filter(run => run.status === 'SUCCEEDED' && responseFor(run)?.response_text);
  const categories = [...new Set(runs.map(run => run.category))].map(category => ({
    category,
    total: runs.filter(run => run.category === category).length,
    answered: answered.filter(run => run.category === category).length,
  }));
  return {
    total: runs.length,
    answered: answered.length,
    failed: runs.filter(run => run.status === 'FAILED').length,
    exactNameMentions: namePattern ? answered.filter(run => namePattern.test(responseFor(run).response_text)).length : 0,
    citedAnswers: answered.filter(run => Array.isArray(responseFor(run).citations) && responseFor(run).citations.length > 0).length,
    categories,
  };
}
