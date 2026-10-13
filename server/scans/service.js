import { createHash } from 'node:crypto';
import { aggregateMeasurement, METRIC_VERSION, EXTRACTION_VERSION,
  validateExtraction, validateIdentity } from '../../shared/measurement.js';

function value(result) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

// Number before removing failed runs so report references match the full saved run list.
export function buildAnalysisEvidence(orderedRuns) {
  return orderedRuns.map((run, index) => ({ number: index + 1, prompt: run.exact_prompt, status: run.status,
    answer: Array.isArray(run.raw_responses) ? run.raw_responses[0]?.response_text : run.raw_responses?.response_text }))
    .filter(item => item.status === 'SUCCEEDED' && item.answer);
}

export function createScanService(db, provider, { requestIntervalMs = 0 } = {}) {
  let lastProviderCallAt = 0;
  async function callProvider(operation) {
    const wait = lastProviderCallAt + requestIntervalMs - Date.now();
    if (wait > 0) await new Promise(resolve => setTimeout(resolve, wait));
    lastProviderCallAt = Date.now();
    return operation();
  }
  async function createScan(userId, businessId) {
    const business = value(await db.from('businesses').select('id,name,website,category,city,country').eq('id', businessId).eq('user_id', userId).maybeSingle());
    if (!business) throw new Error('Business not found.');
    const truth = value(await db.from('business_truth').select('version,data').eq('business_id', businessId)
      .order('version', { ascending: false }).limit(1).maybeSingle());
    if (!truth) throw new Error('Verify Brand Truth before scanning.');
    const prompts = value(await db.from('prompts').select('id,category,text').eq('business_id', businessId).eq('active', true).order('created_at'));
    if (!prompts.length) throw new Error('Add at least one active prompt.');
    if (prompts.length > 40) throw new Error('The MVP scan limit is 40 active prompts.');
    const existing = value(await db.from('scans').select('id').eq('business_id', businessId).in('status', ['PENDING', 'RUNNING']).limit(1).maybeSingle());
    if (existing) throw new Error('A scan is already running for this business.');
    const config = value(await db.from('business_measurement_config').select('target_aliases,competitors')
      .eq('business_id', businessId).maybeSingle());
    const reviewed = validateIdentity({ targetAliases: [truth.data?.officialName,
      ...(config?.target_aliases || [])].filter(name => name && name.trim().length >= 3),
      competitors: config?.competitors || [] }, business.name);
    const snapshot = { identity: { name: business.name, website: business.website, category: business.category,
      city: business.city, country: business.country, aliases: reviewed.targetAliases }, competitors: reviewed.competitors,
    truth: { version: truth.version, data: truth.data }, provider: provider.name, model: provider.model,
    metricVersion: METRIC_VERSION, extractionVersion: EXTRACTION_VERSION,
    promptFingerprint: createHash('sha256').update(JSON.stringify(prompts.map(prompt =>
      ({ id: prompt.id, text: prompt.text, category: prompt.category })))).digest('hex') };
    const scan = value(await db.from('scans').insert({ business_id: businessId, truth_version: truth.version,
      provider: provider.name, model: provider.model }).select('id,status').single());
    try {
      value(await db.from('prompt_runs').insert(prompts.map(prompt => ({
        scan_id: scan.id, prompt_id: prompt.id, exact_prompt: prompt.text, category: prompt.category,
      }))));
      value(await db.from('scan_measurements').insert({ scan_id: scan.id, snapshot }));
    } catch (error) {
      await db.from('scans').update({ status: 'FAILED', completed_at: new Date().toISOString() }).eq('id', scan.id);
      throw error;
    }
    return scan;
  }

  async function claimScan() {
    const now = new Date().toISOString();
    const pending = value(await db.from('scans').select('id,status,attempt,worker_lease_until')
      .eq('status', 'PENDING').order('created_at').limit(1).maybeSingle());
    const candidate = pending || value(await db.from('scans').select('id,status,attempt,worker_lease_until')
      .eq('status', 'RUNNING').lt('worker_lease_until', now).order('created_at').limit(1).maybeSingle());
    if (!candidate) return null;
    if (candidate.attempt >= 3) {
      await db.from('prompt_runs').update({ status: 'FAILED', error_text: 'Worker retry limit reached.', completed_at: now })
        .eq('scan_id', candidate.id).in('status', ['PENDING', 'RUNNING']);
      await db.from('scans').update({ status: 'FAILED', completed_at: now, worker_lease_until: null })
        .eq('id', candidate.id).eq('attempt', candidate.attempt);
      return null;
    }
    let claim = db.from('scans').update({ status: 'RUNNING', attempt: candidate.attempt + 1,
      started_at: now, worker_lease_until: new Date(Date.now() + 300000).toISOString() })
      .eq('id', candidate.id).eq('status', candidate.status).eq('attempt', candidate.attempt);
    if (candidate.status === 'RUNNING') claim = claim.eq('worker_lease_until', candidate.worker_lease_until);
    return value(await claim.select('id').maybeSingle());
  }

  async function processScan(scanId) {
    const heartbeat = setInterval(() => {
      db.from('scans').update({ worker_lease_until: new Date(Date.now() + 300000).toISOString() })
        .eq('id', scanId).eq('status', 'RUNNING').then(() => {}, () => {});
    }, 30000);
    try {
      const runs = value(await db.from('prompt_runs').select('id,exact_prompt,status,attempt').eq('scan_id', scanId).order('id'));
      for (const run of runs) {
        if (run.status === 'SUCCEEDED' || run.status === 'FAILED') continue;
        const saved = value(await db.from('raw_responses').select('id').eq('prompt_run_id', run.id).maybeSingle());
        if (saved) {
          value(await db.from('prompt_runs').update({ status: 'SUCCEEDED', completed_at: new Date().toISOString(), error_text: null }).eq('id', run.id));
          continue;
        }
        let lastError = run.attempt >= 2 ? 'Prompt retry limit reached.' : '';
        for (let attempt = run.attempt + 1; attempt <= 2; attempt += 1) {
          value(await db.from('prompt_runs').update({ status: 'RUNNING', attempt, started_at: new Date().toISOString() }).eq('id', run.id));
          try {
            const answer = await callProvider(() => provider.runPrompt(run.exact_prompt));
            value(await db.from('raw_responses').insert({ prompt_run_id: run.id, provider: answer.provider,
              model: answer.model, response_text: answer.responseText, citations: answer.citations,
              metadata: answer.metadata, provider_payload: answer.providerPayload, received_at: answer.timestamp }));
            value(await db.from('prompt_runs').update({ status: 'SUCCEEDED', completed_at: new Date().toISOString(), error_text: null }).eq('id', run.id));
            lastError = '';
            break;
          } catch (error) {
            lastError = String(error.message || error).slice(0, 2000);
            if (error.status === 429 && attempt < 2) await new Promise(resolve => setTimeout(resolve, 30000));
            // A failed insert may follow a successful earlier insert on a recovered job.
            const recovered = value(await db.from('raw_responses').select('id').eq('prompt_run_id', run.id).maybeSingle());
            if (recovered) {
              value(await db.from('prompt_runs').update({ status: 'SUCCEEDED', completed_at: new Date().toISOString(), error_text: null }).eq('id', run.id));
              lastError = '';
              break;
            }
          }
        }
        if (lastError) value(await db.from('prompt_runs').update({ status: 'FAILED', error_text: lastError,
          completed_at: new Date().toISOString() }).eq('id', run.id));
      }
      const finalRuns = value(await db.from('prompt_runs').select('status').eq('scan_id', scanId));
      const successes = finalRuns.filter(run => run.status === 'SUCCEEDED').length;
      const status = finalRuns.length && successes === finalRuns.length ? 'COMPLETED' : successes ? 'PARTIALLY_FAILED' : 'FAILED';
      const existingAnalysis = value(await db.from('scan_analyses').select('id').eq('scan_id', scanId).maybeSingle());
      if (successes && !existingAnalysis) {
        const evidence = buildAnalysisEvidence(value(await db.from('prompt_runs')
          .select('exact_prompt,status,raw_responses(response_text)').eq('scan_id', scanId).order('id')));
        let analysis;
        let analysisError;
        try { analysis = await callProvider(() => provider.analyzeResponses(evidence)); }
        catch (error) {
          analysisError = error;
          if (error.status === 429) {
            await new Promise(resolve => setTimeout(resolve, 30000));
            try { analysis = await callProvider(() => provider.analyzeResponses(evidence)); analysisError = null; }
            catch (retryError) { analysisError = retryError; }
          }
        }
        value(await db.from('scan_analyses').insert(analysis
          ? { scan_id: scanId, status: 'SUCCEEDED', report: analysis.report, provider_payload: analysis.providerPayload }
          : { scan_id: scanId, status: 'FAILED', error_text: String(analysisError.message || analysisError).slice(0, 2000) }));
      }
      value(await db.from('scans').update({ status, completed_at: new Date().toISOString(), worker_lease_until: null }).eq('id', scanId));
    } finally { clearInterval(heartbeat); }
  }

  async function claimMeasurement() {
    const now = new Date().toISOString();
    const pending = value(await db.from('scan_measurements').select('scan_id,status,attempt,worker_lease_until')
      .eq('status', 'PENDING').order('created_at').limit(1).maybeSingle());
    const candidate = pending || value(await db.from('scan_measurements').select('scan_id,status,attempt,worker_lease_until')
      .eq('status', 'RUNNING').lt('worker_lease_until', now).order('created_at').limit(1).maybeSingle());
    if (!candidate) return null;
    const scan = value(await db.from('scans').select('status').eq('id', candidate.scan_id).maybeSingle());
    if (!scan || ['PENDING', 'RUNNING'].includes(scan.status)) return null;
    if (candidate.attempt >= 3) {
      value(await db.from('scan_measurements').update({ status: 'FAILED', error_text: 'Evidence extraction retry limit reached.',
        completed_at: now, worker_lease_until: null }).eq('scan_id', candidate.scan_id));
      return null;
    }
    let claim = db.from('scan_measurements').update({ status: 'RUNNING', attempt: candidate.attempt + 1,
      worker_lease_until: new Date(Date.now() + 300000).toISOString() })
      .eq('scan_id', candidate.scan_id).eq('status', candidate.status).eq('attempt', candidate.attempt);
    if (candidate.status === 'RUNNING') claim = claim.eq('worker_lease_until', candidate.worker_lease_until);
    return value(await claim.select('scan_id').maybeSingle());
  }

  async function processMeasurement(scanId) {
    const heartbeat = setInterval(() => {
      db.from('scan_measurements').update({ worker_lease_until: new Date(Date.now() + 300000).toISOString() })
        .eq('scan_id', scanId).eq('status', 'RUNNING').then(() => {}, () => {});
    }, 30000);
    try {
      const row = value(await db.from('scan_measurements').select('snapshot,evidence,provider_payloads').eq('scan_id', scanId).single());
      const rawRuns = value(await db.from('prompt_runs').select('id,exact_prompt,status,raw_responses(response_text)')
        .eq('scan_id', scanId).order('id'));
      const runs = rawRuns.map(run => ({ id: run.id, prompt: run.exact_prompt, status: run.status,
        answer: Array.isArray(run.raw_responses) ? run.raw_responses[0]?.response_text : run.raw_responses?.response_text }));
      const evidence = Array.isArray(row.evidence) ? [...row.evidence] : [];
      const payloads = Array.isArray(row.provider_payloads) ? [...row.provider_payloads] : [];
      const completed = new Set(evidence.map(item => item.promptRunId));
      const remaining = runs.filter(run => run.status === 'SUCCEEDED' && run.answer && !completed.has(run.id));
      let lastError = '';
      for (let index = 0; index < remaining.length; index += 4) {
        const batch = remaining.slice(index, index + 4);
        try {
          const result = await callProvider(() => provider.extractEvidence(batch, row.snapshot));
          for (const run of batch) {
            const item = result.items.find(candidate => candidate.id === run.id);
            if (item) evidence.push(validateExtraction(run, item, row.snapshot));
          }
          payloads.push(result.providerPayload);
          value(await db.from('scan_measurements').update({ evidence, provider_payloads: payloads })
            .eq('scan_id', scanId).eq('status', 'RUNNING'));
        } catch (error) { lastError = String(error.message || error).slice(0, 2000); }
      }
      const metrics = aggregateMeasurement(row.snapshot, runs, evidence);
      const succeeded = runs.filter(run => run.status === 'SUCCEEDED' && run.answer).length;
      const status = !succeeded || !evidence.length ? 'FAILED' : evidence.length < succeeded ? 'PARTIALLY_FAILED' : 'SUCCEEDED';
      value(await db.from('scan_measurements').update({ evidence, metrics, status, error_text: lastError || null,
        worker_lease_until: null, completed_at: new Date().toISOString() }).eq('scan_id', scanId).eq('status', 'RUNNING'));
    } finally { clearInterval(heartbeat); }
  }

  async function retryMeasurement(userId, scanId) {
    const scan = value(await db.from('scans').select('id,business_id,status').eq('id', scanId).maybeSingle());
    if (!scan || !value(await db.from('businesses').select('id').eq('id', scan.business_id).eq('user_id', userId).maybeSingle()))
      throw new Error('Scan not found.');
    if (!['COMPLETED', 'PARTIALLY_FAILED', 'FAILED'].includes(scan.status)) throw new Error('Wait for answer collection to finish.');
    const result = value(await db.from('scan_measurements').update({ status: 'PENDING', attempt: 0,
      error_text: null, worker_lease_until: null, completed_at: null }).eq('scan_id', scanId)
      .in('status', ['FAILED', 'PARTIALLY_FAILED']).select('scan_id').maybeSingle());
    if (!result) throw new Error('No failed measurement is available to retry.');
    return result;
  }

  return { createScan, claimScan, processScan, claimMeasurement, processMeasurement, retryMeasurement };
}
