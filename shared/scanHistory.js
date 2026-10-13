export const HISTORY_PAGE_SIZE = 12;
export const historyStatuses = ['all', 'completed', 'partial', 'failed', 'active'];

export function parseHistoryFilters(params) {
  const status = params.get('historyStatus') || 'all';
  const from = params.get('historyFrom') || '';
  const to = params.get('historyTo') || '';
  const sort = params.get('historySort') || 'newest';
  const page = Number(params.get('historyPage'));
  return {
    status: historyStatuses.includes(status) ? status : 'all',
    from: localDayBoundary(from) ? from : '',
    to: localDayBoundary(to) ? to : '',
    sort: sort === 'oldest' ? 'oldest' : 'newest',
    page: Number.isSafeInteger(page) && page > 0 && page <= 10000 ? page : 1,
  };
}

export function historyRequest(businessId, filters) {
  const params = new URLSearchParams({
    status: filters.status,
    sort: filters.sort,
    offset: String((filters.page - 1) * HISTORY_PAGE_SIZE),
    limit: String(HISTORY_PAGE_SIZE),
  });
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  return `/businesses/${businessId}/scan-history?${params}`;
}

export function historyTitle(scan, locale) {
  const timestamp = new Date(scan.created_at);
  const when = Number.isNaN(timestamp.getTime()) ? 'date unavailable' : timestamp.toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' });
  return `Discovery scan · ${when}`;
}

export function historyCounts(scan) {
  const runs = scan.prompt_runs || [];
  return { successful: runs.filter(run => run.status === 'SUCCEEDED').length, total: runs.length };
}

export function scanStatusLabel(status) {
  return ({ PENDING: 'Queued', RUNNING: 'Running', COMPLETED: 'Completed', PARTIALLY_FAILED: 'Partially failed', FAILED: 'Failed' })[status] || 'Unknown';
}

export function localDayBoundary(value, nextDay = false) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return null;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day + Number(nextDay));
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day + Number(nextDay)) {
    // The date may be the last day of a month when requesting the next boundary.
    if (!nextDay || new Date(year, month - 1, day).getMonth() !== month - 1) return null;
  }
  return date.toISOString();
}
