import { basicFields, truthFields, validateFields } from '../../shared/business.js';
import { toAppUser, isTransientAuthError } from '../../shared/authUser.js';
import { generatePrompts, validatePrompt } from '../../shared/prompts.js';
import { createOwnedBusiness, validateCreationId } from '../../shared/businessCreation.js';
import { validateIdentity } from '../../shared/measurement.js';
import { localDayBoundary } from '../../shared/scanHistory.js';

function check(error) {
  if (error) throw new Error(error.message || 'Supabase request failed.');
}

export function createSupabaseApi(client) {
  async function currentUser() {
    const { data, error } = await client.auth.getUser();
    if (isTransientAuthError(error)) throw new Error('The account service is temporarily unavailable. Keep this page open and retry when your connection returns.');
    if (error || !data.user) {
      window.dispatchEvent(new Event('presence:session-expired'));
      throw new Error('Please sign in.');
    }
    return data.user;
  }

  async function ownedBusiness(id) {
    const { data, error } = await client.from('businesses').select('id').eq('id', id).maybeSingle();
    check(error);
    if (!data) throw new Error('Business not found.');
  }

  return async function supabaseApi(path, options = {}) {
    const method = options.method || 'GET';
    const body = options.body || {};
    if (path === '/auth/signup' && method === 'POST') {
      const { data, error } = await client.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
          data: { name: body.name },
          emailRedirectTo: `${window.location.origin}/?view=dashboard`,
        },
      });
      check(error);
      return { user: toAppUser(data.user), requiresEmailConfirmation: !data.session };
    }
    if (path === '/auth/verify-otp' && method === 'POST') {
      let result = await client.auth.verifyOtp({
        email: body.email,
        token: body.token,
        type: 'signup',
      });
      if (result.error && (result.error.message?.includes('type') || result.error.status === 400)) {
        const retry = await client.auth.verifyOtp({
          email: body.email,
          token: body.token,
          type: 'email',
        });
        if (!retry.error) result = retry;
      }
      check(result.error);
      const user = result.data?.user || (await client.auth.getUser()).data?.user;
      return { user: toAppUser(user) };
    }
    if (path === '/auth/resend-otp' && method === 'POST') {
      const { error } = await client.auth.resend({
        type: 'signup',
        email: body.email,
      });
      check(error);
      return { ok: true };
    }
    if (path === '/auth/login' && method === 'POST') {
      const { data, error } = await client.auth.signInWithPassword({ email: body.email, password: body.password });
      check(error);
      return { user: toAppUser(data.user) };
    }
    if (path === '/auth/logout' && method === 'POST') {
      const { error } = await client.auth.signOut();
      check(error);
      return { ok: true };
    }
    if (path === '/auth/me' && method === 'GET') return { user: toAppUser(await currentUser()) };

    const user = await currentUser();
    if (options.expectedUserId && options.expectedUserId !== user.id) {
      window.dispatchEvent(new Event('presence:session-expired'));
      throw new Error('Your signed-in account changed. Reload before saving.');
    }
    if (path === '/businesses' && method === 'GET') {
      const [businessResult, truthResult, scanResult] = await Promise.all([
        client.from('businesses').select('id,name,website,category,country,city,branch,created_at').order('created_at', { ascending: false }),
        client.from('business_truth').select('business_id,version'),
        client.from('scans').select('business_id,status,created_at').order('created_at', { ascending: false }),
      ]);
      check(businessResult.error);
      check(truthResult.error);
      check(scanResult.error);
      const latest = new Map();
      for (const truth of truthResult.data) latest.set(truth.business_id, Math.max(latest.get(truth.business_id) || 0, truth.version));
      const latestScan = new Map();
      for (const scan of scanResult.data) if (!latestScan.has(scan.business_id)) latestScan.set(scan.business_id, scan.status);
      return { businesses: businessResult.data.map(business => ({ ...business,
        truth_version: latest.get(business.id) || null, latest_scan_status: latestScan.get(business.id) || null })) };
    }
    if (path === '/businesses' && method === 'POST') {
      const fields = validateFields(body, basicFields);
      const creationId = validateCreationId(body.creationId);
      return { business: await createOwnedBusiness(client, user.id, fields, creationId) };
    }
    const businessDeleteMatch = path.match(/^\/businesses\/([0-9a-f-]+)$/i);
    if (businessDeleteMatch && method === 'DELETE') {
      const { error } = await client.from('businesses').delete().eq('id', businessDeleteMatch[1]).eq('user_id', user.id);
      check(error);
      return { ok: true };
    }
    const promptsMatch = path.match(/^\/businesses\/([0-9a-f-]+)\/prompts(?:\/(generate|[0-9a-f-]+))?$/i);
    if (promptsMatch) {
      const businessId = promptsMatch[1];
      const item = promptsMatch[2];
      await ownedBusiness(businessId);
      if (!item && method === 'GET') {
        const { data, error } = await client.from('prompts').select('id,business_id,category,text,active,created_at,updated_at')
          .eq('business_id', businessId).order('created_at');
        check(error);
        return { prompts: data };
      }
      if (item === 'generate' && method === 'POST') {
        const { data: existing, error: existingError } = await client.from('prompts').select('id,text')
          .eq('business_id', businessId).order('created_at');
        check(existingError);
        const replace = body?.replace === true;
        if (existing.length >= 20 && !replace) throw new Error('You already have 20 prompts. Edit or replace the set.');
        if (existing.length > 20 && replace) throw new Error('Remove extra prompts until 20 or fewer remain before replacing the set.');
        const [{ data: business, error: businessError }, { data: truth, error: truthError }] = await Promise.all([
          client.from('businesses').select('name,category,city,country').eq('id', businessId).single(),
          client.from('business_truth').select('version').eq('business_id', businessId).order('version', { ascending: false }).limit(1).maybeSingle(),
        ]);
        check(businessError); check(truthError);
        if (!truth) throw new Error('Verify Brand Truth before generating prompts.');
        if (replace) {
          const prompts = generatePrompts(business).map((prompt, index) => ({ ...prompt,
            id: existing[index]?.id || globalThis.crypto.randomUUID(), business_id: businessId,
            updated_at: new Date().toISOString() }));
          const { data, error } = await client.from('prompts').upsert(prompts, { onConflict: 'id' })
            .select('id,business_id,category,text,active,created_at,updated_at');
          check(error);
          return { prompts: data };
        }
        const used = new Set(existing.map(prompt => prompt.text.trim().toLowerCase()));
        const prompts = generatePrompts(business).filter(prompt => !used.has(prompt.text.toLowerCase()))
          .slice(0, 20 - existing.length).map(prompt => ({ ...prompt, business_id: businessId }));
        if (!prompts.length) throw new Error('All suggested questions are already in your prompt list.');
        const { data, error } = await client.from('prompts').insert(prompts).select('id,business_id,category,text,active,created_at,updated_at');
        check(error);
        return { prompts: data };
      }
      if (!item && method === 'POST') {
        const { data, error } = await client.from('prompts').insert({ ...validatePrompt(body), business_id: businessId })
          .select('id,business_id,category,text,active,created_at,updated_at').single();
        check(error);
        return { prompt: data };
      }
      if (item && item !== 'generate' && (method === 'PATCH' || method === 'DELETE')) {
        const query = client.from('prompts');
        const result = method === 'PATCH'
          ? await query.update({ ...validatePrompt(body), updated_at: new Date().toISOString() }).eq('id', item).eq('business_id', businessId)
            .select('id,business_id,category,text,active,created_at,updated_at').maybeSingle()
          : await query.delete().eq('id', item).eq('business_id', businessId).select('id').maybeSingle();
        check(result.error);
        if (!result.data) throw new Error('Prompt not found.');
        return method === 'PATCH' ? { prompt: result.data } : { ok: true };
      }
    }
    const measurementConfigMatch = path.match(/^\/businesses\/([0-9a-f-]+)\/measurement-config$/i);
    if (measurementConfigMatch && ['GET', 'PUT'].includes(method)) {
      const businessId = measurementConfigMatch[1];
      await ownedBusiness(businessId);
      if (method === 'GET') {
        const { data, error } = await client.from('business_measurement_config')
          .select('target_aliases,competitors,reviewed_at').eq('business_id', businessId).maybeSingle();
        check(error);
        return { config: data };
      }
      if (body.reviewed !== true) throw new Error('Confirm that you reviewed the tracked names.');
      const { data: business, error: businessError } = await client.from('businesses')
        .select('name').eq('id', businessId).single();
      check(businessError);
      const config = validateIdentity(body, business.name);
      const { data, error } = await client.from('business_measurement_config').upsert({
        business_id: businessId, target_aliases: config.targetAliases, competitors: config.competitors,
        reviewed_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }, { onConflict: 'business_id' }).select('target_aliases,competitors,reviewed_at').single();
      check(error);
      return { config: data };
    }
    const retryMeasurementMatch = path.match(/^\/scans\/([0-9a-f-]+)\/measurement\/retry$/i);
    if (retryMeasurementMatch && method === 'POST') {
      const { data: sessionData } = await client.auth.getSession();
      const response = await fetch(`/scan-api/scans/${retryMeasurementMatch[1]}/measurement/retry`, {
        method: 'POST', headers: { Authorization: `Bearer ${sessionData.session?.access_token || ''}` },
      }).catch(() => { throw new Error('Scan worker is offline. Start the scan server before retrying analysis.'); });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'Could not retry analysis.');
      return result;
    }
    const historyMatch = path.match(/^\/businesses\/([0-9a-f-]+)\/scan-history\?(.+)$/i);
    if (historyMatch && method === 'GET') {
      const businessId = historyMatch[1];
      await ownedBusiness(businessId);
      const params = new URLSearchParams(historyMatch[2]);
      const offset = Number(params.get('offset'));
      const limit = Number(params.get('limit'));
      if (!Number.isSafeInteger(offset) || offset < 0 || !Number.isSafeInteger(limit) || limit < 1 || limit > 50) throw new Error('Invalid history page.');
      const status = params.get('status') || 'all';
      const sort = params.get('sort') || 'newest';
      if (!['all', 'completed', 'partial', 'failed', 'active'].includes(status) || !['newest', 'oldest'].includes(sort)) throw new Error('Invalid history filter.');
      const from = params.get('from') ? localDayBoundary(params.get('from')) : null;
      const to = params.get('to') ? localDayBoundary(params.get('to'), true) : null;
      if ((params.has('from') && !from) || (params.has('to') && !to)) throw new Error('Invalid history date.');
      if (from && to && from >= to) throw new Error('End date must be on or after the start date.');
      let query = client.from('scans').select('id,status,provider,model,created_at,started_at,completed_at,prompt_runs(status),scan_analyses(status),scan_measurements(status)', { count: 'exact' })
        .eq('business_id', businessId);
      if (status === 'active') query = query.in('status', ['PENDING', 'RUNNING']);
      else if (status !== 'all') query = query.eq('status', ({ completed: 'COMPLETED', partial: 'PARTIALLY_FAILED', failed: 'FAILED' })[status]);
      if (from) query = query.gte('created_at', from);
      if (to) query = query.lt('created_at', to);
      const { data, count, error } = await query.order('created_at', { ascending: sort === 'oldest' }).order('id', { ascending: sort === 'oldest' }).range(offset, offset + limit - 1);
      check(error);
      return { scans: data || [], total: count || 0 };
    }
    const scansMatch = path.match(/^\/businesses\/([0-9a-f-]+)\/scans$/i);
    if (scansMatch) {
      await ownedBusiness(scansMatch[1]);
      if (method === 'GET') {
        const { data, error } = await client.from('scans').select('id,status,provider,model,created_at,started_at,completed_at,prompt_runs(status),scan_measurements(status,snapshot,metrics)')
          .eq('business_id', scansMatch[1]).order('created_at', { ascending: false }).limit(20);
        check(error);
        return { scans: data };
      }
      if (method === 'POST') {
        const { data: sessionData } = await client.auth.getSession();
        const response = await fetch('/scan-api/scans', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${sessionData.session?.access_token || ''}` },
          body: JSON.stringify({ businessId: scansMatch[1] }),
        }).catch(() => { throw new Error('Scan worker is offline. Start the scan server after configuring server-side keys.'); });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || 'Could not start scan.');
        return result;
      }
    }
    const scanDetail = path.match(/^\/scans\/([0-9a-f-]+)$/i);
    if (scanDetail && method === 'GET') {
      const { data: scan, error } = await client.from('scans').select('id,business_id,status,provider,model,created_at,started_at,completed_at,scan_analyses(status,report,error_text,created_at)')
        .eq('id', scanDetail[1]).maybeSingle();
      check(error);
      if (!scan) throw new Error('Scan not found.');
      const { data: runs, error: runError } = await client.from('prompt_runs')
        .select('id,prompt_id,exact_prompt,category,status,attempt,error_text,raw_responses(response_text,citations,received_at)')
        .eq('scan_id', scan.id).order('id');
      check(runError);
      const { data: measurement, error: measurementError } = await client.from('scan_measurements')
        .select('status,snapshot,evidence,metrics,error_text,created_at,completed_at')
        .eq('scan_id', scan.id).maybeSingle();
      check(measurementError);
      return { scan, runs, measurement };
    }
    const match = path.match(/^\/businesses\/([0-9a-f-]+)\/truth$/i);
    if (match && (method === 'GET' || method === 'POST')) {
      const businessId = match[1];
      await ownedBusiness(businessId);
      const { data: latest, error: readError } = await client.from('business_truth')
        .select('id,business_id,version,data,verified_by,verified_at')
        .eq('business_id', businessId).order('version', { ascending: false }).limit(1).maybeSingle();
      check(readError);
      if (method === 'GET') return { truth: latest };
      if (body.verified !== true) throw new Error('Confirm that these facts are owner-verified.');
      if (body.version !== (latest?.version || 0)) throw new Error('Brand Truth changed. Reopen this business before saving.');
      const data = validateFields(body.data, truthFields);
      const { data: saved, error } = await client.from('business_truth')
        .insert({ business_id: businessId, version: (latest?.version || 0) + 1, data, verified_by: user.id })
        .select('version').single();
      if (error?.code === '23505') throw new Error('Brand Truth changed. Reopen this business before saving.');
      check(error);
      return { version: saved.version };
    }
    throw new Error('Endpoint not found.');
  };
}
