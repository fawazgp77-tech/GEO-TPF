import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, BarChart3, CheckCircle2, FileText, Link2, RefreshCw, ScanLine, TriangleAlert } from 'lucide-react';
import { api } from '../../lib/api';
import { analyticsMetrics } from '../../../shared/analyticsMetrics';
import { comparableMeasurements } from '../../../shared/measurement';
import { isBrandedQuestion } from '../../../shared/promptResults';
import { Badge, Button, Select } from '../ui';
import GlassPanel from '../ui/GlassPanel';
import MeasurementPanel from './MeasurementPanel';

const activeStatus = status => ['PENDING', 'RUNNING'].includes(status);
const finishedStatus = status => ['COMPLETED', 'PARTIALLY_FAILED'].includes(status);
const date = value => value ? new Date(value).toLocaleString() : 'Date unavailable';
const label = value => String(value || 'Unknown').replaceAll('_', ' ').toLowerCase();
const percent = value => value === null ? '—' : `${Math.round(value * 100)}%`;
const analysisFor = scan => Array.isArray(scan?.scan_analyses) ? scan.scan_analyses[0] : scan?.scan_analyses;

export default function AnalyticsBoard({ business, currentUser, scanId = '', onOpenPrompts, onOpenScan, onBackHistory, onScanStarted, scanRevision = 0, apiClient = api }) {
  const [scans, setScans] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [promptKnown, setPromptKnown] = useState(false);
  const [scanKnown, setScanKnown] = useState(false);
  const [warning, setWarning] = useState('');
  const [error, setError] = useState('');
  const [launching, setLaunching] = useState(false);
  const [revision, setRevision] = useState(0);
  const [search, setSearch] = useState('');
  const [answerFilter, setAnswerFilter] = useState('all');
  const launchLock = useRef(false);
  const request = useCallback((path, options = {}) => apiClient(path, { ...options, expectedUserId: currentUser?.id }), [apiClient, currentUser?.id]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([request(`/businesses/${business.id}/scans`), request(`/businesses/${business.id}/prompts`)])
      .then(async ([scanResult, promptResult]) => {
        if (scanResult.status === 'rejected' && !scanId) throw scanResult.reason;
        const list = scanResult.status === 'fulfilled' ? scanResult.value.scans || [] : [];
        const selected = scanId || list.find(scan => finishedStatus(scan.status))?.id || list[0]?.id;
        const fetched = selected ? await request(`/scans/${selected}`) : null;
        if (fetched && fetched.scan?.business_id !== business.id) throw new Error('This scan is unavailable for the selected business.');
        if (active) {
          setScans(list); setPrompts(promptResult.status === 'fulfilled' ? promptResult.value.prompts || [] : []);
          setScanKnown(scanResult.status === 'fulfilled'); setPromptKnown(promptResult.status === 'fulfilled');
          setWarning([scanResult.status === 'rejected' ? 'Scan list unavailable; showing only this direct-linked scan.' : '',
            promptResult.status === 'rejected' ? 'Current prompts unavailable; scan launch is disabled.' : ''].filter(Boolean).join(' '));
          setDetail(fetched); setError(''); setReady(true);
        }
      })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [business.id, scanId, request, revision, scanRevision]);

  const scan = detail?.scan;
  const metrics = useMemo(() => analyticsMetrics(detail?.runs || [], business), [detail, business]);
  const analysis = analysisFor(scan);
  const selectedPosition = scans.findIndex(item => item.id === scan?.id);
  const previousMeasurement = selectedPosition >= 0 ? scans.slice(selectedPosition + 1)
    .map(item => Array.isArray(item.scan_measurements) ? item.scan_measurements[0] : item.scan_measurements)
    .find(item => comparableMeasurements(detail?.measurement, item)) : null;
  const activeScan = scans.find(item => activeStatus(item.status));
  const activeCount = prompts.filter(prompt => prompt.active).length;
  const hasKnownScanState = ready && scanKnown && promptKnown && Boolean(business.truth_version);
  const canRun = hasKnownScanState && !activeScan && !launching && activeCount > 0 && activeCount <= 40;
  const cards = [
    { icon: BarChart3, label: 'Unprompted mentions', value: percent(metrics.mentionRate), hint: `${metrics.mentions} of ${metrics.unbrandedAnswered} successful unbranded answers` },
    { icon: CheckCircle2, label: 'Answers saved', value: metrics.total ? `${metrics.answered}/${metrics.total}` : '—', hint: 'Successful saved answers / attempted prompts' },
    { icon: Link2, label: 'Answers with citations', value: metrics.answered ? `${metrics.cited}/${metrics.answered}` : '—', hint: 'Links returned by Gemini in successful answers' },
    { icon: TriangleAlert, label: 'Failed / unanswered', value: metrics.total ? metrics.failed + metrics.unanswered : '—', hint: `${metrics.failed} failed · ${metrics.unanswered} without a saved answer` },
  ];
  const shown = metrics.answers.filter(item => {
    const term = search.trim().toLocaleLowerCase();
    if (term && ![item.exact_prompt, item.responseText, item.category].some(value => String(value || '').toLocaleLowerCase().includes(term))) return false;
    if (answerFilter === 'mentioned') return item.mentioned;
    if (answerFilter === 'not-mentioned') return item.unbranded && !item.mentioned;
    if (answerFilter === 'cited') return item.cited;
    if (answerFilter === 'failed') return item.status === 'FAILED';
    if (answerFilter === 'unanswered') return !item.answered && item.status !== 'FAILED';
    return true;
  });

  async function launch() {
    if (!canRun || launchLock.current) return;
    launchLock.current = true; setLaunching(true); setError('');
    try {
      const result = await request(`/businesses/${business.id}/scans`, { method: 'POST' });
      if (!result.scan?.id) throw new Error('The scan started, but its saved ID was not returned. Refresh the board to find it.');
      onScanStarted?.();
      onOpenScan(result.scan.id);
    } catch (e) {
      setError(e.message);
      setRevision(value => value + 1);
    } finally { launchLock.current = false; setLaunching(false); }
  }

  return <div className="analytics-board">
    <GlassPanel className="profile-panel analytics-header">
      <div><p className="profile-eyebrow">Saved AI visibility evidence</p><h2>{business.name}</h2><p>{business.category} · {business.city}, {business.country}</p>
        {scan && <div className="analytics-scan-meta"><Badge tone={scan.status === 'COMPLETED' ? 'success' : activeStatus(scan.status) || scan.status === 'PARTIALLY_FAILED' ? 'warning' : 'neutral'}>{label(scan.status)}</Badge><span>{date(scan.created_at)}</span><span>{scan.provider} / {scan.model}</span>{scanId && <Badge>Historical scan</Badge>}</div>}{scanId && onBackHistory && <Button variant="ghost" className="analytics-history-back" onClick={onBackHistory}>← Back to scan history</Button>}</div>
      <div className="analytics-header-actions"><div className="analytics-scan-selector"><label htmlFor="analytics-scan">Scan</label><Select id="analytics-scan" aria-label="Select scan" value={scan?.id || ''} onValueChange={onOpenScan} disabled={!scans.length && !scan}><option value="" disabled>{scan ? 'Select scan' : 'No scans'}</option>{scan && !scans.some(item => item.id === scan.id) && <option value={scan.id}>{date(scan.created_at)} · {label(scan.status)}</option>}{scans.map(item => <option key={item.id} value={item.id}>{date(item.created_at)} · {label(item.status)}</option>)}</Select></div>
        <div className="analytics-buttons"><Button variant="secondary" onClick={onOpenPrompts}>Manage prompts</Button><Button disabled={!canRun} onClick={launch}><ScanLine size={16} />{launching ? 'Starting…' : 'Run scan'}</Button></div>
        {!canRun && ready && !activeScan && <small>{!scanKnown ? 'Scan status unavailable; retry before launching.' : !promptKnown ? 'Current prompts unavailable; retry before launching.' : !business.truth_version ? 'Verify Brand Truth before scanning.' : activeCount === 0 ? 'Add active prompts before scanning.' : activeCount > 40 ? 'Pause prompts until 40 or fewer are active.' : ''}</small>}</div>
    </GlassPanel>
    {error && <div role="alert" className="prompt-message prompt-error">{error} <button type="button" onClick={() => setRevision(value => value + 1)}>Retry</button></div>}
    {warning && <div role="status" className="prompt-message prompt-error">{warning} <button type="button" onClick={() => setRevision(value => value + 1)}>Retry</button></div>}
    {ready && <MeasurementPanel key={business.id} business={business} currentUser={currentUser} scan={scan} measurement={detail?.measurement}
      previous={previousMeasurement} apiClient={apiClient} onRefresh={() => setRevision(value => value + 1)} />}
    {loading ? <GlassPanel className="profile-panel"><p role="status" className="profile-muted">Loading saved scan evidence…</p></GlassPanel>
      : !ready ? <GlassPanel className="profile-panel"><p className="profile-muted">Analysis could not be loaded for this business.</p></GlassPanel>
        : !scan ? <GlassPanel className="profile-panel analytics-empty"><BarChart3 size={30} /><h3>No scan yet</h3><p>Review your discovery questions, then run Gemini to create the first saved analysis.</p><Button onClick={onOpenPrompts}>Set up prompts <ArrowRight size={16} /></Button></GlassPanel>
          : <>
            {activeScan && activeScan.id !== scan.id && <GlassPanel className="profile-panel analytics-activity"><span>A newer scan is {label(activeScan.status)}. The selected saved scan remains available.</span><Button variant="secondary" onClick={() => onOpenScan(activeScan.id)}>View progress</Button></GlassPanel>}
            {activeStatus(scan.status) && <GlassPanel className="profile-panel analytics-activity"><span>This scan is {label(scan.status)}. Counts below are provisional and will refresh as answers are saved.</span><Button variant="secondary" onClick={() => setRevision(value => value + 1)}><RefreshCw size={15} />Refresh</Button></GlassPanel>}
            <div className="analytics-card-grid">{cards.map(({ icon: Icon, label: cardLabel, value, hint }) => <GlassPanel key={cardLabel} className="analytics-metric"><span><Icon size={20} /></span><p>{cardLabel}</p><strong>{value}</strong><small>{hint}</small></GlassPanel>)}</div>
            <div className="analytics-main-grid">
              <GlassPanel className="profile-panel analytics-summary"><div className="analytics-section-heading"><div><p className="profile-eyebrow">Combined model analysis</p><h3>What the answers say together</h3></div><FileText size={19} /></div>
                {analysis?.status === 'SUCCEEDED' ? <><p className="analytics-summary-text">{analysis.report?.summary || 'The saved analysis contains no summary text.'}</p>
                  {analysis.report?.themes?.length > 0 && <div className="analytics-findings">{analysis.report.themes.map((theme, index) => <details key={index}><summary>{theme.title}</summary><p>{theme.finding}</p><div className="analytics-evidence">Evidence: {(theme.promptNumbers || []).length ? theme.promptNumbers.map(number => { const answer = metrics.answers[number - 1]; return answer ? <a key={number} href={`#answer-${answer.id}`} onClick={() => { const target = document.getElementById(`answer-${answer.id}`); if (target) target.open = true; }}>Prompt {number}</a> : null; }) : <span>No prompt number supplied</span>}</div></details>)}</div>}
                  {analysis.report?.limitations && <p className="analytics-limitations">{analysis.report.limitations}</p>}</>
                  : analysis?.status === 'FAILED' ? <p className="analytics-summary-text">Combined analysis failed: {analysis.error_text || 'No error details were saved.'} The individual answers below remain available.</p>
                    : <p className="analytics-summary-text">{activeStatus(scan.status) ? 'The summary will appear after answer collection finishes.' : 'No combined summary is available for this scan. Individual answers remain available below.'}</p>}
                <p className="analytics-method">This section summarizes Gemini outputs. It does not verify claims against Brand Truth.</p>
              </GlassPanel>
              <GlassPanel className="profile-panel analytics-categories"><div className="analytics-section-heading"><div><p className="profile-eyebrow">Question categories</p><h3>Where visibility appears</h3></div><BarChart3 size={19} /></div>
                {metrics.categories.length ? metrics.categories.map(item => <div className="analytics-category" key={item.category}><div><strong>{item.category.toLowerCase()}</strong><span>{item.answered}/{item.total} answers saved</span></div><div className="analytics-bars"><div className="analytics-bar"><span style={{ width: `${item.total ? item.answered / item.total * 100 : 0}%` }} /></div><div className="analytics-bar analytics-bar--mention"><span style={{ width: `${item.mentionRate === null ? 0 : item.mentionRate * 100}%` }} /></div></div><small>{item.eligible ? `${item.mentions}/${item.eligible} unprompted name mentions (${percent(item.mentionRate)})` : 'No successful unbranded answer to measure mentions'}</small></div>) : <p className="profile-muted">Category coverage appears once prompts are attempted.</p>}
                <div className="analytics-legend"><span>Answer coverage</span><span>Unprompted mention rate</span></div>
              </GlassPanel>
            </div>
            <GlassPanel className="profile-panel analytics-explorer"><div className="analytics-section-heading"><div><p className="profile-eyebrow">Raw saved evidence</p><h3>Answer explorer</h3><p>Exact scan questions and full saved answers. {metrics.answered} of {metrics.total} answers saved.</p></div><Badge>{metrics.total} prompts</Badge></div>
              <div className="analytics-filters"><input className="ui-input" aria-label="Search answers" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions or answers" /><Select aria-label="Filter answers" value={answerFilter} onValueChange={setAnswerFilter}><option value="all">All answers</option><option value="mentioned">Unprompted name mentioned</option><option value="not-mentioned">Unprompted name omitted</option><option value="cited">Citation returned</option><option value="failed">Failed</option><option value="unanswered">Unanswered</option></Select></div>
              <p className="analytics-count">Showing {shown.length} of {metrics.total} scan prompts</p>
              <div className="analytics-answer-list">{shown.map(item => <details key={item.id} id={`answer-${item.id}`} className="analytics-answer"><summary><span className="analytics-answer-number">{String(item.number).padStart(2, '0')}</span><span className="analytics-answer-title"><small>{(item.category || 'other').toLowerCase()} · {label(item.status)}</small><strong>{item.exact_prompt}</strong></span><Badge tone={item.mentioned ? 'success' : item.status === 'FAILED' ? 'warning' : 'neutral'}>{item.mentioned ? 'Name mentioned' : isBrandedQuestion(item.exact_prompt, business) ? 'Branded question' : item.status === 'FAILED' ? 'Failed' : item.answered ? 'No name match' : 'No saved answer'}</Badge></summary><div className="analytics-answer-body"><p className="analytics-answer-match">Literal full-name match in answer: {item.answered ? item.nameMatch ? 'Yes' : 'No' : 'Unavailable'}</p>{item.error_text && <p className="analytics-answer-error">{item.error_text}</p>}{item.responseText ? <p className="analytics-raw-text">{item.responseText}</p> : <p className="profile-muted">No raw answer was saved for this prompt.</p>}<div className="analytics-citations"><strong>Returned citations</strong>{item.citations.length ? <ul>{item.citations.map((citation, index) => <li key={`${citation.url}-${index}`}><a href={citation.url} target="_blank" rel="noopener noreferrer">{citation.title}<ArrowRight size={13} /></a></li>)}</ul> : <p>None returned with this answer.</p>}</div></div></details>)}</div>
              {!shown.length && <p className="profile-muted">No saved prompts match these answer filters.</p>}
            </GlassPanel>
            <p className="analytics-method">Method: unprompted mention rate counts literal business-name matches in successful answers to questions that did not name the business. It does not measure recommendations or factual accuracy. Citation counts reflect links returned by Gemini, not every source the model may have used. These counts are calculated from saved answers using the current business name; older scans do not contain an identity-versioned score. {scan.status !== 'COMPLETED' && 'This scan is incomplete or had failures; inspect each answer before comparing results.'}</p>
          </>}
  </div>;
}
