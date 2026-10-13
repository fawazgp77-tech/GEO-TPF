import { supabase } from './supabase';
import { createSupabaseApi } from './supabaseApi';

const remoteApi = supabase ? createSupabaseApi(supabase) : null;

export async function api(path, options = {}) {
  if (remoteApi) return remoteApi(path, options);
  let response;
  try {
    response = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      ...options,
      headers: { 'Content-Type': 'application/json', ...(options.expectedUserId ? { 'X-Presence-Owner': options.expectedUserId } : {}), ...options.headers },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
  } catch {
    throw new Error('The API is unavailable. Start the backend and try again.');
  }
  const data = await response.json().catch(() => ({ error: 'The API returned an invalid response.' }));
  if (response.status === 401 && !path.startsWith('/auth/')) window.dispatchEvent(new Event('presence:session-expired'));
  if (!response.ok) throw new Error(data.error || 'Request failed.');
  return data;
}
