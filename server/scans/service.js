function value(result) {
  if (result.error) throw new Error(result.error.message);
  return result.data;
}

export function createScanService(db, provider) {
  async function createScan(userId, businessId) {
    const business = value(await db.from('businesses').select('id').eq('id', businessId).eq('user_id', userId).maybeSingle());
    if (!business) throw new Error('Business not found.');
    const truth = value(await db.from('business_truth').select('version').eq('business_id', businessId)
      .order('version', { ascending: false }).limit(1).maybeSingle());
    if (!truth) throw new Error('Verify Brand Truth before scanning.');
    const prompts = value(await db.from('prompts').select('id,category,text').eq('business_id', businessId).eq('active', true).order('created_at'));
    if (!prompts.length) throw new Error('Add at least one active prompt.');
    if (prompts.length > 40) throw new Error('The MVP scan limit is 40 active prompts.');
    const existing = value(await db.from('scans').select('id').eq('business_id', businessId).in('status', ['PENDING', 'RUNNING']).limit(1).maybeSingle());
    if (existing) throw new Error('A scan is already running for this business.');
    const scan = value(await db.from('scans').insert({ business_id: businessId, truth_version: truth.version,
      provider: provider.name, model: provider.model }).select('id,status').single());
    try {
      value(await db.from('prompt_runs').insert(prompts.map(prompt => ({
        scan_id: scan.id, prompt_id: prompt.id, exact_prompt: prompt.text, category: prompt.category,
      }))));
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
            const answer = await provider.runPrompt(run.exact_prompt);
            value(await db.from('raw_responses').insert({ prompt_run_id: run.id, provider: answer.provider,
              model: answer.model, response_text: answer.responseText, citations: answer.citations,
              metadata: answer.metadata, provider_payload: answer.providerPayload, received_at: answer.timestamp }));
            value(await db.from('prompt_runs').update({ status: 'SUCCEEDED', completed_at: new Date().toISOString(), error_text: null }).eq('id', run.id));
            lastError = '';
            break;
          } catch (error) {
            lastError = String(error.message || error).slice(0, 2000);
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
      value(await db.from('scans').update({ status, completed_at: new Date().toISOString(), worker_lease_until: null }).eq('id', scanId));
    } finally { clearInterval(heartbeat); }
  }

  return { createScan, claimScan, processScan };
}
