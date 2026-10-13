export const METRIC_VERSION = 1;
export const EXTRACTION_VERSION = 1;

const normalized = value => String(value || '').trim().toLocaleLowerCase();
const wordMatch = (text, name) => {
  if (!name) return false;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(^|[^\\p{L}\\p{N}])${escaped}(?=$|[^\\p{L}\\p{N}])`, 'iu').test(text);
};

export function validateIdentity(input, targetName = '') {
  const aliases = Array.isArray(input?.targetAliases) ? input.targetAliases : [];
  const competitors = Array.isArray(input?.competitors) ? input.competitors : [];
  if (competitors.length > 8) throw new Error('Use at most 8 competitors.');
  const cleanName = value => {
    if (typeof value !== 'string' || value.trim().length < 3 || value.trim().length > 120) throw new Error('Each tracked name must contain 3–120 characters.');
    return value.trim();
  };
  const targetAliases = [...new Map(aliases.map(cleanName)
    .filter(name => normalized(name) !== normalized(targetName))
    .map(name => [normalized(name), name])).values()];
  if (targetAliases.length > 9) throw new Error('Use at most 9 business aliases.');
  const seen = new Set([...targetAliases, targetName].filter(Boolean).map(normalized));
  const cleaned = competitors.map(item => {
    const name = cleanName(item?.name);
    const itemAliases = Array.isArray(item.aliases) ? item.aliases : [];
    if (itemAliases.length > 8) throw new Error('Use at most 8 aliases per competitor.');
    const names = [name, ...itemAliases.map(cleanName)];
    for (const alias of names) {
      const key = normalized(alias);
      if (seen.has(key)) throw new Error(`Tracked name “${alias}” appears more than once.`);
      seen.add(key);
    }
    return { name, aliases: [...new Set(itemAliases)] };
  });
  return { targetAliases, competitors: cleaned };
}

export function makeEntities(snapshot) {
  const target = { id: 'target', name: snapshot.identity.name,
    aliases: [...new Set([snapshot.identity.name, ...snapshot.identity.aliases])] };
  return [target, ...(snapshot.competitors || []).map((item, index) => ({ id: `competitor-${index + 1}`,
    name: item.name, aliases: [item.name, ...(item.aliases || [])] }))];
}

export function isNeutralPrompt(prompt, entities) {
  return !entities.some(entity => entity.aliases.some(alias => wordMatch(prompt, alias)));
}

const containsExact = (answer, quote) => typeof quote === 'string' && quote.trim() && answer.includes(quote.trim());

export function validateExtraction(run, extracted, snapshot) {
  const answer = run.answer;
  const entities = makeEntities(snapshot);
  const neutralPrompt = isNeutralPrompt(run.prompt, entities);
  const output = { promptRunId: run.id, neutralPrompt, brands: [], claims: [], extractionVersion: EXTRACTION_VERSION };
  for (const entity of entities) {
    const candidate = (Array.isArray(extracted?.brands) ? extracted.brands : []).find(item => item.id === entity.id) || {};
    const quote = containsExact(answer, candidate.mentionQuote) ? candidate.mentionQuote.trim() : '';
    const literalMatch = entity.aliases.some(alias => wordMatch(answer, alias));
    const quotedMatch = quote && entity.aliases.some(alias => wordMatch(quote, alias));
    const collision = entities.some(other => other.id !== entity.id && other.aliases.some(alias =>
      quote && wordMatch(quote, alias)));
    const mention = collision || (literalMatch && !quotedMatch) ? 'unknown' : quotedMatch ? 'yes' : 'no';
    const recommendationQuote = containsExact(answer, candidate.recommendationQuote) ? candidate.recommendationQuote.trim() : '';
    const proposed = candidate.recommendation;
    const recommendation = mention === 'yes' && recommendationQuote &&
      ['recommended', 'not_recommended', 'neutral'].includes(proposed) ? proposed :
      mention === 'no' ? 'not_recommended' : 'unknown';
    output.brands.push({ id: entity.id, name: entity.name, mention, mentionQuote: mention === 'yes' ? quote : '',
      recommendation, recommendationQuote: recommendation === 'unknown' ? '' : recommendationQuote });
  }
  const truth = snapshot.truth?.data || {};
  output.claims = (Array.isArray(extracted?.claims) ? extracted.claims : []).slice(0, 8).flatMap(item => {
    if (!containsExact(answer, item?.quote) || typeof item?.truthKey !== 'string' ||
      !Object.hasOwn(truth, item.truthKey) || !String(truth[item.truthKey] || '').trim()) return [];
    const verdict = ['supported', 'contradicted', 'unknown'].includes(item.verdict) ? item.verdict : 'unknown';
    return [{ quote: item.quote.trim(), truthKey: item.truthKey, verdict }];
  });
  return output;
}

export function aggregateMeasurement(snapshot, runs, evidence) {
  const entities = makeEntities(snapshot);
  const byRun = new Map(evidence.map(item => [item.promptRunId, item]));
  const eligible = runs.filter(run => run.status === 'SUCCEEDED' && run.answer && isNeutralPrompt(run.prompt, entities));
  const evaluated = eligible.map(run => byRun.get(run.id)).filter(Boolean);
  const brandMetrics = entities.map(entity => {
    const records = evaluated.map(row => ({ runId: row.promptRunId, brand: row.brands.find(item => item.id === entity.id) }))
      .filter(item => item.brand);
    const knownMentions = records.filter(item => item.brand.mention !== 'unknown');
    const mentioned = records.filter(item => item.brand.mention === 'yes');
    const classified = records.filter(item => item.brand.recommendation !== 'unknown');
    const recommended = records.filter(item => item.brand.recommendation === 'recommended');
    return { id: entity.id, name: entity.name, eligible: eligible.length, extracted: records.length,
      mentionKnown: knownMentions.length, mentions: mentioned.length,
      mentionScore: knownMentions.length ? Math.round(100 * mentioned.length / knownMentions.length) : null,
      recommendationKnown: classified.length, recommended: recommended.length,
      recommendationScore: classified.length ? Math.round(100 * recommended.length / classified.length) : null,
      mentionRunIds: mentioned.map(item => item.runId), recommendationRunIds: recommended.map(item => item.runId) };
  });
  const claims = evidence.flatMap(row => row.claims || []);
  const supported = claims.filter(item => item.verdict === 'supported').length;
  const contradicted = claims.filter(item => item.verdict === 'contradicted').length;
  return { savedAnswers: runs.filter(run => run.status === 'SUCCEEDED' && run.answer).length,
    eligibleAnswers: eligible.length, extractedAnswers: evaluated.length, failedExtraction: eligible.length - evaluated.length,
    brands: brandMetrics, factualAgreement: {
      score: supported + contradicted ? Math.round(100 * supported / (supported + contradicted)) : null,
      supported, contradicted, unknown: claims.length - supported - contradicted,
      claimRunIds: evidence.filter(row => row.claims?.length).map(row => row.promptRunId),
    } };
}

export function comparableMeasurements(a, b) {
  if (!a?.snapshot || !b?.snapshot || a.status !== 'SUCCEEDED' || b.status !== 'SUCCEEDED') return false;
  const key = item => JSON.stringify({ promptFingerprint: item.promptFingerprint, identity: item.identity,
    competitors: item.competitors, provider: item.provider, model: item.model,
    metricVersion: item.metricVersion, extractionVersion: item.extractionVersion, truthVersion: item.truth?.version });
  return key(a.snapshot) === key(b.snapshot);
}
