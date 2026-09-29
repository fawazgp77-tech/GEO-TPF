import { basicFields, truthFields, validateFields } from '../../shared/business';
import { toAppUser } from './supabase';
import { generatePrompts, validatePrompt } from '../../shared/prompts';

function check(error) {
  if (error) throw new Error(error.message || 'Supabase request failed.');
}

export function createSupabaseApi(client) {
  async function currentUser() {
    const { data, error } = await client.auth.getUser();
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
      const { data, error } = await client.from('businesses')
        .insert({ ...fields, user_id: user.id }).select('id,name,website,category,country,city,branch,created_at').single();
      check(error);
      return { business: data };
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
        const { count, error: countError } = await client.from('prompts').select('id', { count: 'exact', head: true }).eq('business_id', businessId);
        check(countError);
        if (count) throw new Error('Prompts already exist. Edit them or add more manually.');
        const [{ data: business, error: businessError }, { data: truth, error: truthError }] = await Promise.all([
          client.from('businesses').select('name,category,city').eq('id', businessId).single(),
          client.from('business_truth').select('data').eq('business_id', businessId).order('version', { ascending: false }).limit(1).maybeSingle(),
        ]);
        check(businessError); check(truthError);
        if (!truth) throw new Error('Verify Brand Truth before generating prompts.');
        const prompts = generatePrompts(business, truth.data).map(prompt => ({ ...prompt, business_id: businessId }));
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
    const scansMatch = path.match(/^\/businesses\/([0-9a-f-]+)\/scans$/i);
    if (scansMatch) {
      await ownedBusiness(scansMatch[1]);
      if (method === 'GET') {
        const { data, error } = await client.from('scans').select('id,status,provider,model,created_at,started_at,completed_at,prompt_runs(status)')
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
      const { data: scan, error } = await client.from('scans').select('id,business_id,status,provider,model,created_at,started_at,completed_at').eq('id', scanDetail[1]).maybeSingle();
      check(error);
      if (!scan) throw new Error('Scan not found.');
      const { data: runs, error: runError } = await client.from('prompt_runs')
        .select('id,exact_prompt,category,status,attempt,error_text,raw_responses(response_text,citations,received_at)')
        .eq('scan_id', scan.id).order('started_at');
      check(runError);
      return { scan, runs };
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
