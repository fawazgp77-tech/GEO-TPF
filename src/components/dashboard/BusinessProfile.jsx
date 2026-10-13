import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Building2, CheckCheck, Clock3, FileText, MapPin, RefreshCw, ScanLine, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { basicFields, truthFields } from '../../../shared/business';
import { isActiveScan, latestFinishedScan, loadBusinessProfile, scanReadiness, truthGroups } from '../../../shared/businessProfile';
import { Badge, Button, ErrorNotice, Skeleton } from '../ui';
import GlassPanel from '../ui/GlassPanel';
import DotGridBackground from '../onboarding/DotGridBackground';

const date = value => value ? new Date(value).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : 'Date unavailable';
const status = value => value?.replaceAll('_', ' ').toLowerCase();
export function FactList({ fields, data }) {
  return <dl className="profile-facts">{fields.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{data?.[key] || <span className="profile-unprovided">Not provided</span>}</dd></div>)}</dl>;
}

export default function BusinessProfile({ business, currentUser, onOpenTruth, onSetup, onOpenPrompts, onOpenAnalytics, onOpenScan, onScanStarted, scanRevision = 0, onRemove, removing = false, apiClient = api }) {
  const request = useCallback((path, options = {}) => apiClient(path, { ...options, expectedUserId: currentUser.id }), [apiClient, currentUser.id]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reload, setReload] = useState(0);
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState('');
  const mounted = useRef(false);
  const launchLock = useRef(false);
  useEffect(() => {
    let active = true; mounted.current = true;
    async function load() {
      const result = await loadBusinessProfile(request, business);
      if (!active) return;
      setData(result); setLoading(false); setRefreshing(false);
    }
    load();
    return () => { active = false; mounted.current = false; };
  }, [business, request, reload, scanRevision]); // Profile is keyed by owner/business in the workspace.
  const refresh = () => { setRefreshing(true); setError(''); setReload(value => value + 1); };
  const readiness = scanReadiness(data);
  const truth = data?.truth;
  const active = data?.scans.find(isActiveScan);
  const summary = data?.summary;
  const metrics = data?.metrics;
  const latest = latestFinishedScan(data?.scans);
  const analysis = Array.isArray(summary?.scan.scan_analyses) ? summary.scan.scan_analyses[0] : summary?.scan.scan_analyses;
  const progress = active?.prompt_runs || [];
  const finished = progress.filter(run => ['SUCCEEDED', 'FAILED'].includes(run.status)).length;
  const activeCount = data?.prompts.filter(prompt => prompt.active).length || 0;
  async function launch() {
    if (!readiness.ready || launchLock.current) return;
    launchLock.current = true; setLaunching(true); setError('');
    try {
      const result = await request(`/businesses/${business.id}/scans`, { method: 'POST' });
      if (!result.scan?.id) throw new Error('The scan start was not confirmed. Refresh the scan status before trying again.');
      onScanStarted?.();
      if (mounted.current) onOpenScan(result.scan.id);
    } catch (e) { if (mounted.current) { setReload(value => value + 1); setError(e.message); } }
    finally { launchLock.current = false; if (mounted.current) setLaunching(false); }
  }
  const verified = Boolean(truth?.version);
  const knownTruth = data && !data.errors.truth;
  return <div className="business-profile" aria-busy={loading}>
    <GlassPanel className="profile-panel profile-hero">
      <DotGridBackground variant="profile" />
      <div className="profile-hero-content"><div className="profile-identity"><span className="profile-business-mark"><Building2 size={25} aria-hidden="true" /></span><div>
        <p className="profile-eyebrow">Business profile</p><h2>{business.name}</h2><p className="profile-location"><MapPin size={14} aria-hidden="true" />{business.category} · {business.city}, {business.country}{business.branch ? ` · ${business.branch}` : ''}</p>
        <a className="profile-website" href={business.website} target="_blank" rel="noreferrer">{business.website}<ArrowUpRight size={14} aria-hidden="true" /></a>
      </div></div><div className="profile-header-actions"><Badge tone={verified ? 'success' : 'warning'}>{loading ? 'Loading verified facts' : data?.errors.truth ? 'Verification unavailable' : verified ? `Owner verified · revision ${truth.version}` : 'Setup needed'}</Badge>
        <Button disabled={!knownTruth || launching} onClick={verified ? onOpenPrompts : onSetup}>{loading ? 'Loading profile…' : verified ? 'Manage prompts' : 'Complete business setup'}<ArrowRight size={16} /></Button>
      </div></div>
    </GlassPanel>
    {error && <ErrorNotice>{error}</ErrorNotice>}
    {data && Object.keys(data.errors).length > 0 && <ErrorNotice onRetry={refresh}>{Object.entries(data.errors).map(([key, message]) => <span className="profile-error-line" key={key}>{key === 'summary' ? 'Saved scan summary' : key[0].toUpperCase() + key.slice(1)}: {message}</span>)}</ErrorNotice>}
    {loading ? <div role="status" aria-label="Loading business profile"><Skeleton className="h-32 mb-5" /><div className="profile-two-columns"><Skeleton className="h-64" /><Skeleton className="h-64" /></div></div> : <>
      <GlassPanel className="profile-panel profile-scan-overview">
        <div className="profile-section-heading"><div><p className="profile-eyebrow">Saved scan snapshot</p><h3>Latest finished scan</h3></div><Button variant="ghost" disabled={refreshing} aria-label="Refresh business profile" onClick={refresh}><RefreshCw size={16} />{refreshing ? 'Refreshing…' : 'Refresh'}</Button></div>
        {summary ? <><div className="profile-scan-meta"><span>{date(summary.scan.completed_at || summary.scan.created_at)}</span><Badge tone={summary.scan.status === 'COMPLETED' ? 'success' : 'warning'}>{status(summary.scan.status)}</Badge><span>{summary.scan.provider} / {summary.scan.model}</span></div>
          <div className="profile-metrics">{[
            ['Unprompted name mentions', `${metrics.unpromptedNameMentions} / ${metrics.unbrandedAnswered}`, 'Saved answers to unbranded questions', ScanLine],
            ['Answers saved', `${metrics.answered} / ${metrics.total}`, metrics.failed ? `${metrics.failed} failed prompt${metrics.failed === 1 ? '' : 's'}` : 'Snapshot prompts in this scan', CheckCheck],
            ['Answers with citations', `${metrics.citedAnswers} / ${metrics.answered}`, 'Provider links in saved answers', FileText],
          ].map(([label, value, hint, Icon]) => <div className="profile-metric" key={label}><div><Icon size={16} aria-hidden="true" /><span>{label}</span></div><strong>{value}</strong><small>{hint}</small></div>)}</div>
          {analysis?.status === 'SUCCEEDED' && analysis.report?.summary ? <p className="profile-summary-excerpt">{analysis.report.summary}</p> : <p className="profile-muted">{analysis?.status === 'FAILED' ? 'The combined analysis failed. Individual saved answers are still available.' : 'No combined summary is available for this scan.'}</p>}
          <div className="profile-section-footer"><p className="profile-muted">Name matches describe model outputs; they do not measure recommendations or factual accuracy.</p><Button variant="secondary" onClick={() => onOpenScan(summary.scan.id)}>View this scan<ArrowRight size={16} /></Button></div>
        </> : <div className="profile-no-scan"><span className="profile-icon"><ScanLine size={23} /></span><div><h4>{data.errors.scans ? 'Scan status unavailable' : data.errors.summary ? 'Saved scan summary unavailable' : latest ? 'Loading saved scan summary' : 'Your first scan starts here'}</h4><p>{data.errors.summary || data.errors.scans ? 'Retry to load the saved evidence. Your verified business facts remain below.' : !verified ? 'Confirm your business facts, then review discovery prompts to see how Gemini describes your category.' : 'Review your discovery prompts, then run Gemini to see whether customers can find your business.'}</p></div></div>}
      </GlassPanel>
      {active && <GlassPanel className="profile-panel profile-running" role="status"><div className="profile-section-heading"><div><p className="profile-eyebrow">Current activity</p><h3>{active.status === 'PENDING' ? 'Scan queued' : 'Scan in progress'}</h3></div><Button variant="secondary" onClick={() => onOpenScan(active.id)}>View progress<ArrowRight size={16} /></Button></div><p className="profile-muted">{active.model} · {progress.length ? `${finished} / ${progress.length} prompts processed` : 'Waiting for prompt status'} · The finished scan above stays available.</p>{progress.length > 0 && <progress aria-label="Current scan progress" value={finished} max={progress.length} />}</GlassPanel>}
      <div className="profile-two-columns"><GlassPanel className="profile-panel"><div className="profile-section-heading"><div><p className="profile-eyebrow">Business details</p><h3>The essentials</h3></div><Building2 size={18} className="profile-muted" /></div><FactList fields={basicFields.filter(([key]) => key !== 'name')} data={business} /></GlassPanel>
        <GlassPanel className="profile-panel profile-next-step"><div className="profile-section-heading"><div><p className="profile-eyebrow">Next step</p><h3>{data.errors.truth || data.errors.prompts || data.errors.scans ? 'Reload your saved data' : !verified ? 'Verify your business facts' : active ? 'Your scan is underway' : activeCount ? 'Ready to scan' : 'Build your discovery prompts'}</h3></div><ShieldCheck size={19} className="profile-accent" /></div>
          <p className="profile-muted">{verified ? `${data.errors.prompts ? 'Prompt count unavailable' : `${activeCount} active / ${data.prompts.length} saved prompts`}. Each scan preserves the exact questions and raw answers before analysis.` : 'Brand Truth gives you an owner-verified reference for reviewing model outputs.'}</p>
          <div className="profile-action-stack"><Button aria-describedby="profile-scan-readiness" disabled={!readiness.ready || launching || refreshing} onClick={launch}><ScanLine size={16} />{launching ? 'Starting scan…' : 'Run scan'}</Button><p id="profile-scan-readiness" className="profile-muted">{readiness.reason}</p><Button variant="secondary" disabled={!verified || launching} onClick={onOpenPrompts}>Manage prompts<FileText size={16} /></Button><Button variant="ghost" disabled={!verified} onClick={onOpenAnalytics}>View analytics<ArrowRight size={16} /></Button>{knownTruth && !verified && <Button onClick={onSetup}>Complete business setup</Button>}</div>
        </GlassPanel></div>
      <div className="profile-section-heading profile-truth-heading"><div><p className="profile-eyebrow">Owner-verified facts</p><h3>Brand Truth</h3><p className="profile-muted">{verified ? `Revision ${truth.version}${truth.verified_at ? ` · Confirmed ${date(truth.verified_at)}` : ''}. Model outputs are kept separately.` : 'Your facts need owner confirmation before scanning.'}</p></div><Button variant="secondary" disabled={!knownTruth || launching} onClick={verified ? onOpenTruth : onSetup}>{verified ? 'Edit verified facts' : 'Complete setup'}</Button></div>
      {verified ? <div className="profile-truth-grid">{truthGroups.map(group => <GlassPanel className="profile-panel" key={group.title}><h4>{group.title}</h4><FactList fields={truthFields.filter(([key]) => group.keys.includes(key))} data={truth.data} /></GlassPanel>)}</div> : <GlassPanel className="profile-panel"><p className="profile-muted">{data.errors.truth ? 'Verified facts could not be loaded. Try again above.' : 'No owner-verified revision has been saved yet.'}</p></GlassPanel>}
      <GlassPanel className="profile-panel"><div className="profile-section-heading"><div><p className="profile-eyebrow">Activity</p><h3>Recent scans</h3></div><Clock3 size={18} className="profile-muted" /></div>{data.errors.scans ? <p className="profile-muted">Scan history could not be loaded.</p> : data.scans.length ? <div className="profile-recent-scans">{data.scans.slice(0, 3).map(scan => <button key={scan.id} onClick={() => onOpenScan(scan.id)}><span><strong>{date(scan.created_at)}</strong><small>{scan.provider} / {scan.model}</small></span><Badge tone={scan.status === 'COMPLETED' ? 'success' : scan.status === 'FAILED' || scan.status === 'PARTIALLY_FAILED' ? 'warning' : 'neutral'}>{status(scan.status)}</Badge><ArrowRight size={16} /></button>)}</div> : <p className="profile-muted">No scans recorded for this business.</p>}</GlassPanel>
      <GlassPanel className="profile-panel profile-danger"><div><h4>Remove business</h4><p className="profile-muted">Permanently removes this business and its saved facts, prompts, scans, and answers.</p></div><Button variant="danger" disabled={removing || launching} onClick={onRemove}>{removing ? 'Removing…' : 'Remove business'}</Button></GlassPanel>
    </>}
  </div>;
}
