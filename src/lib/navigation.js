import { useSyncExternalStore } from 'react';
import { parseHistoryFilters } from '../../shared/scanHistory.js';

const sections = ['profile', 'prompts', 'analytics', 'history'];
const views = ['landing', 'dashboard', 'onboarding', 'login', 'signup', 'create-account'];
const identifier = /^[a-zA-Z0-9_-]{1,128}$/;

export function parseNavigation(search = '') {
  const params = new URLSearchParams(search);
  const view = params.get('view');
  const section = params.get('section');
  const business = params.get('business') || '';
  const scan = params.get('scan') || '';
  const draft = params.get('draft') || '';
  return {
    view: views.includes(view) ? view : 'landing',
    section: sections.includes(section) ? section : 'profile',
    business: identifier.test(business) ? business : '',
    scan: identifier.test(scan) ? scan : '',
    draft: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(draft) ? draft.toLowerCase() : '',
    mode: ['create', 'truth'].includes(params.get('mode')) ? params.get('mode') : '',
    modal: params.get('modal') || '',
    history: parseHistoryFilters(params),
    invalidSelection: Boolean((business && !identifier.test(business)) || (scan && !identifier.test(scan)) || (draft && !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(draft))),
  };
}

export function navigationUrl(search, changes) {
  const params = new URLSearchParams(search);
  for (const [key, value] of Object.entries(changes)) {
    if (value === '' || value === null || value === undefined) params.delete(key);
    else params.set(key, value);
  }
  params.delete('tab');
  params.delete('demo');
  return params.size ? `?${params}` : '';
}

export function navigate(changes, { replace = false } = {}) {
  const next = navigationUrl(window.location.search, changes);
  if (next === window.location.search) return;
  const hash = window.location.hash.startsWith('#answer-') ? '' : window.location.hash;
  window.history[replace ? 'replaceState' : 'pushState']({}, '', `${window.location.pathname}${next}${hash}`);
  window.dispatchEvent(new Event('presence:navigation'));
}

function subscribe(callback) {
  window.addEventListener('popstate', callback);
  window.addEventListener('presence:navigation', callback);
  return () => {
    window.removeEventListener('popstate', callback);
    window.removeEventListener('presence:navigation', callback);
  };
}

export function useNavigation() {
  const search = useSyncExternalStore(subscribe, () => window.location.search, () => '');
  return parseNavigation(search);
}
