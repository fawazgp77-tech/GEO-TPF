import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CheckCircle2, CircleHelp, PauseCircle, Plus, Search, Sparkles } from 'lucide-react';
import { api } from '../../lib/api';
import { generatePromptSuggestions, generatePrompts, promptCategories } from '../../../shared/prompts';
import { filterPrompts, isBrandedQuestion, normalizedPrompt, promptsWithResults, resultFilters } from '../../../shared/promptResults';
import GlassPanel from '../ui/GlassPanel';
import { Select } from '../ui';

const blank = { text: '', category: 'DISCOVERY', active: true };
const finished = status => ['COMPLETED', 'PARTIALLY_FAILED', 'FAILED'].includes(status);
const working = status => ['PENDING', 'RUNNING'].includes(status);
const formatDate = value => new Date(value).toLocaleString();

export default function PromptWorkspace({ business, currentUser, onOpenScan, onScanStarted, scanRevision = 0, apiClient = api }) {
  const [prompts, setPrompts] = useState([]);
  const [scans, setScans] = useState([]);
  const [scanDetail, setScanDetail] = useState(null);
  const [selectedScan, setSelectedScan] = useState('');
  const [tab, setTab] = useState('yours');
  const [filters, setFilters] = useState({ query: '', category: 'all', active: 'all', result: 'all' });
  const [editingId, setEditingId] = useState('');
  const [editDraft, setEditDraft] = useState(blank);
  const [showCustom, setShowCustom] = useState(false);
  const [customDraft, setCustomDraft] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [revision, setRevision] = useState(0);
  const launchLock = useRef(false);
  const request = useCallback((path, options = {}) => apiClient(path, { ...options, expectedUserId: currentUser?.id }), [apiClient, currentUser?.id]);
  const starter = useMemo(() => generatePrompts(business), [business]);
  const suggestions = useMemo(() => generatePromptSuggestions(business), [business]);
  const savedTexts = useMemo(() => new Set(prompts.map(prompt => normalizedPrompt(prompt.text))), [prompts]);
  const unsaved = Boolean(editingId || (showCustom && customDraft.text.trim()));

  useEffect(() => {
    let active = true;
    Promise.all([request(`/businesses/${business.id}/prompts`), request(`/businesses/${business.id}/scans`)])
      .then(([p, s]) => { if (active) { setPrompts(p.prompts || []); setScans(s.scans || []); setDataReady(true); setError(''); } })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [business.id, revision, scanRevision, request]);

  const finishedScans = scans.filter(scan => finished(scan.status));
  const scanId = finishedScans.some(scan => scan.id === selectedScan) ? selectedScan : finishedScans[0]?.id || '';
  useEffect(() => {
    let active = true;
    if (!scanId) return () => { active = false; };
    request(`/scans/${scanId}`).then(detail => {
      if (active) {
        if (detail.scan?.business_id && detail.scan.business_id !== business.id) throw new Error('This scan belongs to another business.');
        setScanDetail(detail);
      }
    }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [scanId, business.id, request]);

  async function perform(action, success) {
    setBusy(true); setError(''); setNotice('');
    try {
      await action();
      setRevision(value => value + 1);
      if (success) setNotice(success);
    } catch (e) {
      setError(e.message);
      setRevision(value => value + 1);
    } finally { setBusy(false); }
  }
  const activeCount = prompts.filter(prompt => prompt.active).length;
  const activeScan = scans.find(scan => working(scan.status));
  const selectedDetail = scanDetail?.scan?.id === scanId ? scanDetail : null;
  const detailLoading = Boolean(scanId && !selectedDetail);
  const rows = useMemo(() => promptsWithResults(prompts, selectedDetail, business), [prompts, selectedDetail, business]);
  const visible = filterPrompts(rows, filters);
  const unsavedStarter = starter.filter(prompt => !savedTexts.has(normalizedPrompt(prompt.text)));
  const availableSuggestions = suggestions.filter(prompt => !savedTexts.has(normalizedPrompt(prompt.text)));
  const selectedRuns = selectedDetail?.runs || [];
  const testedCount = rows.filter(row => row.outcome.kind !== 'untested').length;

  function beginEdit(prompt) {
    setEditingId(prompt.id);
    setEditDraft({ text: prompt.text, category: prompt.category, active: prompt.active });
  }
  function saveEdit(event) {
    event.preventDefault();
    perform(async () => {
      await request(`/businesses/${business.id}/prompts/${editingId}`, { method: 'PATCH', body: editDraft });
      setEditingId('');
    }, 'Prompt saved. Earlier scan questions and answers remain unchanged.');
  }
  function saveCustom(event) {
    event.preventDefault();
    perform(async () => {
      await request(`/businesses/${business.id}/prompts`, { method: 'POST', body: customDraft });
      setCustomDraft(blank); setShowCustom(false); setTab('yours');
    }, 'Your prompt was added.');
  }
  function generate(replace = false) {
    if (replace && !window.confirm('Replace your current prompts with 20 generic discovery questions? Earlier scan questions and answers will remain saved.')) return;
    perform(() => request(`/businesses/${business.id}/prompts/generate`, { method: 'POST', body: replace ? { replace: true } : {} }),
      replace ? 'Your current prompts were replaced. Review them before scanning.' : 'Starter discovery prompts added. Review them before scanning.');
  }
  async function launch() {
    if (launchLock.current || busy || activeScan || !activeCount || activeCount > 40 || unsaved) return;
    launchLock.current = true;
    await perform(async () => {
      const result = await request(`/businesses/${business.id}/scans`, { method: 'POST' });
      if (!result.scan?.id) throw new Error('The scan start was not confirmed. Refresh scan status before trying again.');
      setNotice('Scan started. Your saved prompts and raw answers will appear in the analysis board.');
      onScanStarted?.();
      onOpenScan(result.scan.id);
    });
    launchLock.current = false;
  }
  function setFilter(name, value) { setFilters(previous => ({ ...previous, [name]: value })); }
  const statusLabel = scan => scan.status.replaceAll('_', ' ').toLowerCase();

  return <div className="prompt-workspace">
    {error && <div className="prompt-message prompt-error" role="alert">{error}</div>}
    {notice && <div className="prompt-message prompt-success" role="status">{notice}</div>}
    <div className="prompt-tabs" role="tablist" aria-label="Prompt views">
      <button type="button" role="tab" aria-selected={tab === 'yours'} onClick={() => setTab('yours')}>Your prompts</button>
      <button type="button" role="tab" aria-selected={tab === 'suggestions'} onClick={() => setTab('suggestions')}><Sparkles size={17} /> Prompt suggestions</button>
    </div>
    <div className="prompt-stat-grid">
      {[
        [CircleHelp, 'Total prompts', prompts.length, 'total'],
        [CheckCircle2, 'Active prompts', activeCount, 'active'],
        [PauseCircle, 'Paused prompts', prompts.length - activeCount, 'paused'],
        [Search, 'Tested in selected scan', scanId ? testedCount : '—', 'tested'],
      ].map(([Icon, label, value, tone]) => <GlassPanel className="prompt-stat" key={label}>
        <span className={`prompt-stat-icon prompt-stat-icon--${tone}`}><Icon size={25} /></span>
        <span><small>{label}</small><strong>{loading ? '…' : value}</strong></span>
      </GlassPanel>)}
    </div>
    {loading ? <GlassPanel className="profile-panel"><p className="profile-muted" role="status">Loading saved prompts and scan history…</p></GlassPanel> : !dataReady ? <GlassPanel className="profile-panel"><p className="profile-muted">Saved prompts could not be loaded.</p><button className="prompt-button" onClick={() => setRevision(value => value + 1)}>Retry</button></GlassPanel> : <>
      {tab === 'yours' ? <>
        <GlassPanel className="profile-panel prompt-panel">
          <div className="prompt-panel-heading">
            <div><p className="profile-eyebrow">Visibility questions</p><h2>Your prompts</h2><p>Ask what a customer would ask before they know your business. Only active prompts are included in a new scan.</p></div>
            <div className="prompt-actions">
              {prompts.length < 20 && <button type="button" className="prompt-button prompt-button--primary" disabled={busy || unsaved} onClick={() => generate()}>{prompts.length ? 'Fill to 20' : 'Add starter 20'}</button>}
              <button type="button" className="prompt-button" disabled={busy} onClick={() => setShowCustom(true)}><Plus size={16} /> Add prompt</button>
            </div>
          </div>
          {showCustom && <form className="prompt-custom-form" onSubmit={saveCustom}>
            <h3>Add your own customer question</h3>
            <div className="prompt-form-grid"><Select aria-label="New prompt category" value={customDraft.category} onValueChange={category => setCustomDraft({ ...customDraft, category })}>{promptCategories.map(category => <option key={category}>{category}</option>)}</Select>
              <textarea className="ui-input" aria-label="New prompt question" placeholder="What might a customer ask?" required minLength={5} maxLength={500} value={customDraft.text} onChange={e => setCustomDraft({ ...customDraft, text: e.target.value })} /></div>
            {isBrandedQuestion(customDraft.text, business) && customDraft.text.trim().length >= 5 && <p className="prompt-caution">This question names your business, so it cannot measure discovery visibility.</p>}
            <div className="prompt-actions"><button className="prompt-button prompt-button--primary" disabled={busy}>Save prompt</button><button type="button" className="prompt-button" onClick={() => { setShowCustom(false); setCustomDraft(blank); }}>Cancel</button></div>
          </form>}
          {prompts.length > 0 && <div className="prompt-filterbar">
            <label className="prompt-search"><Search size={17} /><input aria-label="Search prompts" placeholder="Search prompts" value={filters.query} onChange={e => setFilter('query', e.target.value)} /></label>
            <Select aria-label="Filter by category" value={filters.category} onValueChange={category => setFilter('category', category)}><option value="all">All categories</option>{promptCategories.map(category => <option key={category}>{category}</option>)}</Select>
            <Select aria-label="Filter by active status" value={filters.active} onValueChange={active => setFilter('active', active)}><option value="all">All status</option><option value="active">Active</option><option value="paused">Paused</option></Select>
            <Select aria-label="Filter by scan result" value={filters.result} onValueChange={result => setFilter('result', result)} disabled={!scanId || detailLoading}><option value="all">All scan results</option>{resultFilters.filter(([key]) => key !== 'all').map(([key, label]) => <option value={key} key={key}>{label}</option>)}</Select>
          </div>}
          {finishedScans.length > 0 && <div className="prompt-scan-selector"><label htmlFor="prompt-scan">Compare against scan</label><Select id="prompt-scan" aria-label="Compare against scan" value={scanId} onValueChange={setSelectedScan}>{finishedScans.map(scan => <option value={scan.id} key={scan.id}>{formatDate(scan.created_at)} · {statusLabel(scan)}</option>)}</Select><span>{detailLoading ? 'Loading results…' : `${selectedRuns.length} saved answers`}</span></div>}
          {prompts.length === 0 ? <div className="prompt-empty"><Sparkles size={28} /><h3>Start with 20 customer questions</h3><p>These ready-made questions are tailored to your category and location. Review them here, then add the set or choose individual questions in Suggestions.</p><div className="prompt-starter-preview">{unsavedStarter.map((prompt, index) => <p key={index}><span>{String(index + 1).padStart(2, '0')}</span>{prompt.text}</p>)}</div></div>
            : <><div className="prompt-list-count">Showing {visible.length} of {prompts.length} prompts{scanId ? ' · Result filters use the selected saved scan' : ' · Run a scan to filter by results'}</div>
              <div className="prompt-list">{visible.map((prompt, index) => <article className="prompt-row" key={prompt.id}>
                <div className="prompt-row-number">{String(index + 1).padStart(2, '0')}</div>
                <div className="prompt-row-main"><div className="prompt-row-meta"><span>{prompt.category.toLowerCase()}</span><span className={`prompt-result prompt-result--${prompt.outcome.kind}`}>{prompt.outcome.brandCited ? 'Brand website cited' : prompt.outcome.label}</span>{prompt.outcome.brandCited && <span className="prompt-result"> {prompt.outcome.label}</span>}</div>
                  {editingId === prompt.id ? <form onSubmit={saveEdit} className="prompt-edit-form"><Select aria-label="Edit category" value={editDraft.category} onValueChange={category => setEditDraft({ ...editDraft, category })}>{promptCategories.map(category => <option key={category}>{category}</option>)}</Select><textarea className="ui-input" aria-label="Edit prompt" required minLength={5} maxLength={500} value={editDraft.text} onChange={e => setEditDraft({ ...editDraft, text: e.target.value })} /><div className="prompt-actions"><button className="prompt-button prompt-button--primary" disabled={busy}>Save</button><button type="button" className="prompt-button" onClick={() => setEditingId('')}>Cancel</button></div></form>
                    : <p className="prompt-question">{prompt.text}</p>}
                  {prompt.outcome.previousWording && <p className="prompt-context">Selected scan used: “{prompt.outcome.previousWording}”</p>}
                  {isBrandedQuestion(prompt.text, business) && <p className="prompt-caution">This question names your brand; its answer is excluded from discovery visibility.</p>}
                </div>
                <div className="prompt-row-controls"><label className="prompt-switch"><input type="checkbox" checked={prompt.active} disabled={busy} aria-label={`Include ${prompt.text} in scans`} onChange={() => perform(() => request(`/businesses/${business.id}/prompts/${prompt.id}`, { method: 'PATCH', body: { text: prompt.text, category: prompt.category, active: !prompt.active } }))} /><span>{prompt.active ? 'Active' : 'Paused'}</span></label><button type="button" disabled={busy} onClick={() => beginEdit(prompt)}>Edit</button><button type="button" disabled={busy} onClick={() => { if (window.confirm('Delete this prompt? Previous scan answers will remain saved.')) perform(() => request(`/businesses/${business.id}/prompts/${prompt.id}`, { method: 'DELETE' })); }}>Delete</button></div>
              </article>)}</div>
              {visible.length === 0 && <p className="prompt-no-results">No prompts match these filters. Try another category, status, or scan result.</p>}
              {prompts.length < 20 && unsavedStarter.length > 0 && <div className="prompt-more-starters"><h3>Ready-made prompts to add</h3><p>Fill to 20 above, or choose individual starter questions.</p><div className="prompt-suggestions">{unsavedStarter.map(suggestion => <article key={suggestion.text} className="prompt-suggestion"><div><small>{suggestion.category.toLowerCase()}</small><p>{suggestion.text}</p></div><button type="button" className="prompt-button" disabled={busy} onClick={() => perform(() => request(`/businesses/${business.id}/prompts`, { method: 'POST', body: suggestion }), 'Starter prompt added.')}><Plus size={15} /> Add</button></article>)}</div></div>}</>}
        </GlassPanel>
      </> : <GlassPanel className="profile-panel prompt-panel">
        <div className="prompt-panel-heading"><div><p className="profile-eyebrow">More questions to explore</p><h2>Prompt suggestions</h2><p>Generic customer questions tailored to {business.category} and {business.city}. Add any question to your saved prompts, then edit it if needed.</p></div>{prompts.length > 0 && prompts.length <= 20 && <button type="button" className="prompt-button" disabled={busy || unsaved} onClick={() => generate(true)}>Replace current set</button>}</div>
        {availableSuggestions.length ? <div className="prompt-suggestions">{availableSuggestions.map((suggestion, index) => <article key={`${suggestion.category}-${suggestion.text}`} className="prompt-suggestion"><div><small>{suggestion.category.toLowerCase()} · {String(index + 1).padStart(2, '0')}</small><p>{suggestion.text}</p></div><button type="button" className="prompt-button" disabled={busy} onClick={() => perform(() => request(`/businesses/${business.id}/prompts`, { method: 'POST', body: suggestion }), 'Suggestion added to your prompts.')}><Plus size={15} /> Add</button></article>)}</div> : <p className="prompt-no-results">You have added all current suggestions. You can still add your own prompt.</p>}
      </GlassPanel>}
      <GlassPanel className="profile-panel prompt-scan-panel"><div><p className="profile-eyebrow">Next scan</p><h2>{activeScan ? 'Scan in progress' : 'Ready to scan'}</h2><p>{activeScan ? `${activeScan.prompt_runs?.filter(run => ['SUCCEEDED', 'FAILED'].includes(run.status)).length || 0} of ${activeScan.prompt_runs?.length || 0} answers saved · ${activeScan.model}` : `${activeCount} active prompts will run on Gemini. Filters above only change what you see.`}</p>{activeCount > 40 && <p className="prompt-caution">Pause prompts until 40 or fewer are active to scan.</p>}{unsaved && <p className="prompt-caution">Save or cancel your draft before starting a scan.</p>}</div><div className="prompt-actions">{activeScan && <button className="prompt-button" onClick={() => onOpenScan(activeScan.id)}>View progress</button>}<button type="button" className="prompt-button prompt-button--primary" disabled={busy || Boolean(activeScan) || !activeCount || activeCount > 40 || unsaved} onClick={launch}>Run {activeCount} prompt{activeCount === 1 ? '' : 's'}</button></div></GlassPanel>
    </>}
  </div>;
}
