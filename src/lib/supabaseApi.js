import { basicFields, truthFields, validateFields } from '../../shared/business';
import { toAppUser } from './supabase';

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
      const [businessResult, truthResult] = await Promise.all([
        client.from('businesses').select('id,name,website,category,country,city,branch,created_at').order('created_at', { ascending: false }),
        client.from('business_truth').select('business_id,version'),
      ]);
      check(businessResult.error);
      check(truthResult.error);
      const latest = new Map();
      for (const truth of truthResult.data) latest.set(truth.business_id, Math.max(latest.get(truth.business_id) || 0, truth.version));
      return { businesses: businessResult.data.map(business => ({ ...business, truth_version: latest.get(business.id) || null })) };
    }
    if (path === '/businesses' && method === 'POST') {
      const fields = validateFields(body, basicFields);
      const { data, error } = await client.from('businesses')
        .insert({ ...fields, user_id: user.id }).select('id,name,website,category,country,city,branch,created_at').single();
      check(error);
      return { business: data };
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
