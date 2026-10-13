import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, History, RefreshCw } from 'lucide-react';
import { api } from '../../lib/api';
import { historyCounts, historyRequest, historyTitle, HISTORY_PAGE_SIZE, localDayBoundary, scanStatusLabel } from '../../../shared/scanHistory';
import { Badge, Button, ErrorNotice, Select, Skeleton } from '../ui';
import GlassPanel from '../ui/GlassPanel';

const badgeTone = status => status === 'COMPLETED' ? 'success' : ['FAILED', 'PARTIALLY_FAILED', 'RUNNING', 'PENDING'].includes(status) ? 'warning' : 'neutral';
const analysisState = scan => {
  const analysis = Array.isArray(scan.scan_analyses) ? scan.scan_analyses[0] : scan.scan_analyses;
  if (analysis?.status === 'SUCCEEDED') return 'Summary saved';
  if (analysis?.status === 'FAILED') return 'Summary failed';
  return 'No summary';
};

export default function ScanHistory({ business, currentUser, filters, onFilter, onOpenScan, scanRevision = 0, apiClient = api }) {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateError, setDateError] = useState('');
  const [revision, setRevision] = useState(0);
  const { status, from, to, sort, page } = filters;
  const request = useCallback((path) => apiClient(path, { expectedUserId: currentUser.id }), [apiClient, currentUser.id]);

  useEffect(() => {
    let active = true;
    request(historyRequest(business.id, { status, from, to, sort, page }))
      .then(result => { if (active) { setPageData(result); setError(''); setLoading(false); } })
      .catch(e => { if (active) { setError(e.message); setLoading(false); } });
    return () => { active = false; };
  }, [business.id, status, from, to, sort, page, revision, scanRevision, request]);

  const scans = pageData?.scans || [];
  const total = pageData?.total || 0;
  const pageCount = Math.max(1, Math.ceil(total / HISTORY_PAGE_SIZE));
  const change = (field, value) => onFilter({ [field]: value, page: 1 });
  const refresh = () => { setLoading(true); setRevision(value => value + 1); };
  const applyDates = event => {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const nextFrom = String(fields.get('from') || '');
    const nextTo = String(fields.get('to') || '');
    const start = nextFrom ? localDayBoundary(nextFrom) : null;
    const end = nextTo ? localDayBoundary(nextTo, true) : null;
    if ((nextFrom && !start) || (nextTo && !end) || (start && end && start >= end)) {
      setDateError('Choose a valid range with the end date on or after the start date.');
      return;
    }
    setDateError('');
    onFilter({ from: nextFrom, to: nextTo, page: 1 });
  };
  return <div className="scan-history">
    <GlassPanel className="profile-panel history-hero">
      <div className="history-hero-icon"><History size={23} aria-hidden="true" /></div>
      <div><p className="profile-eyebrow">Saved scan archive</p><h2>{business.name}</h2><p>Every scan preserves its own questions and answers. Open one to review the exact evidence and analysis saved for it.</p></div>
      <Badge>{loading && !pageData ? 'Loading' : `${total} ${total === 1 ? 'scan' : 'scans'}`}</Badge>
    </GlassPanel>
    <GlassPanel className="profile-panel history-panel">
      <div className="history-heading"><div><p className="profile-eyebrow">Browse records</p><h3>Scan history</h3></div><Button variant="ghost" disabled={loading} onClick={refresh}><RefreshCw size={15} />Refresh</Button></div>
      <form className="history-filters" onSubmit={applyDates}>
        <label>Status<Select aria-label="Filter scans by status" value={status} onValueChange={value => change('status', value)}><option value="all">All statuses</option><option value="completed">Completed</option><option value="partial">Partially failed</option><option value="failed">Failed</option><option value="active">Queued or running</option></Select></label>
        <label>From<input className="ui-input" name="from" aria-label="Scans from date" type="date" defaultValue={from} /></label>
        <label>To<input className="ui-input" name="to" aria-label="Scans through date" type="date" defaultValue={to} /></label>
        <label>Order<Select aria-label="Sort scans" value={sort} onValueChange={value => change('sort', value)}><option value="newest">Newest first</option><option value="oldest">Oldest first</option></Select></label>
        <Button variant="secondary" type="submit" className="history-date-apply">Apply dates</Button>
      </form>
      {dateError && <p className="history-date-error" role="alert">{dateError}</p>}
      {(status !== 'all' || from || to || sort !== 'newest') && <button className="history-clear" type="button" onClick={() => onFilter({ status: 'all', from: '', to: '', sort: 'newest', page: 1 })}>Clear filters</button>}
      {error && <ErrorNotice onRetry={refresh}>{error}</ErrorNotice>}
      {loading ? <div role="status" aria-label="Loading scan history"><Skeleton className="h-16 mb-2" /><Skeleton className="h-16 mb-2" /><Skeleton className="h-16" /></div>
        : !error && !scans.length ? <div className="history-empty"><CalendarDays size={24} aria-hidden="true" /><h4>{total ? 'No scans on this page' : 'No scans match these filters'}</h4><p>{total ? 'Go to an earlier page.' : 'Change the filters or run your first scan from Prompts or Analytics.'}</p></div>
          : !error && <div className="history-table-wrap" role="region" aria-label="Saved scans" tabIndex={0}><table className="history-table"><thead><tr><th scope="col">Scan</th><th scope="col">Model</th><th scope="col">Status</th><th scope="col">Answers</th><th scope="col">Analysis</th><th scope="col"><span className="sr-only">Action</span></th></tr></thead><tbody>{scans.map(scan => {
            const counts = historyCounts(scan);
            return <tr key={scan.id}><td data-label="Scan"><button type="button" className="history-row-title" onClick={() => onOpenScan(scan.id)}>{historyTitle(scan)}<small>#{scan.id.slice(0, 8)}</small></button></td>
              <td data-label="Model"><span>{scan.provider} / {scan.model}</span></td><td data-label="Status"><Badge tone={badgeTone(scan.status)}>{scanStatusLabel(scan.status)}</Badge></td>
              <td data-label="Answers"><strong>{counts.successful} / {counts.total}</strong><small>successful / total</small></td>
              <td data-label="Analysis"><span>{analysisState(scan)}</span></td>
              <td data-label="Open"><Button variant="ghost" aria-label={`Open ${historyTitle(scan)} ${scan.id.slice(0, 8)}`} onClick={() => onOpenScan(scan.id)}>View<ArrowRight size={14} /></Button></td></tr>;
          })}</tbody></table></div>}
      {!error && !loading && total > 0 && <div className="history-pagination"><p>Showing {(page - 1) * HISTORY_PAGE_SIZE + 1}–{Math.min(page * HISTORY_PAGE_SIZE, total)} of {total} · Page {page} of {pageCount}</p><div><Button variant="secondary" disabled={page <= 1} onClick={() => onFilter({ page: page - 1 })}>Previous</Button><Button variant="secondary" disabled={page >= pageCount} onClick={() => onFilter({ page: page + 1 })}>Next</Button></div></div>}
    </GlassPanel>
  </div>;
}
