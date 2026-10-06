import { useCallback, useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { promptCategories } from '../../../shared/prompts';

const button = 'rounded-xl bg-emerald-400 text-slate-950 px-4 py-2.5 text-sm font-semibold disabled:opacity-50';
const secondary = 'rounded-xl border border-white/15 px-4 py-2.5 text-sm text-slate-200 disabled:opacity-50';
const input = 'w-full rounded-xl bg-[#06080e] border border-white/10 px-3 py-2.5 text-sm text-slate-100 focus:outline-emerald-400';

export default function PromptWorkspace({ business, onBack }) {
  const [prompts, setPrompts] = useState([]);
  const [scans, setScans] = useState([]);
  const [detail, setDetail] = useState(null);
  const [draft, setDraft] = useState({ category: 'DISCOVERY', text: '', active: true });
  const [customDraft, setCustomDraft] = useState({ category: 'DISCOVERY', text: '', active: true });
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const refresh = useCallback(async () => {
    const [promptResult, scanResult] = await Promise.all([
      api(`/businesses/${business.id}/prompts`), api(`/businesses/${business.id}/scans`),
    ]);
    setPrompts(promptResult.prompts);
    setScans(scanResult.scans);
  }, [business.id]);

  useEffect(() => {
    let active = true;
    Promise.all([api(`/businesses/${business.id}/prompts`), api(`/businesses/${business.id}/scans`)]).then(([p, s]) => {
      if (active) { setPrompts(p.prompts); setScans(s.scans); }
    }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [business.id]);

  useEffect(() => {
    if (!scans.some(scan => ['PENDING', 'RUNNING'].includes(scan.status))) return undefined;
    const timer = setInterval(() => {
      refresh().catch(e => setError(e.message));
      if (detail) api(`/scans/${detail.scan.id}`).then(setDetail).catch(e => setError(e.message));
    }, 5000);
    return () => clearInterval(timer);
  }, [scans, refresh, detail]);

  async function act(operation) {
    setBusy(true); setError(''); setNotice('');
    try { await operation(); await refresh(); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function save(event) {
    event.preventDefault();
    await act(async () => {
      await api(`/businesses/${business.id}/prompts/${editingId}`, { method: 'PATCH', body: draft });
      setDraft({ category: 'DISCOVERY', text: '', active: true }); setEditingId(null);
    });
  }

  async function addCustom(event) {
    event.preventDefault();
    await act(async () => {
      await api(`/businesses/${business.id}/prompts`, { method: 'POST', body: customDraft });
      setCustomDraft({ category: 'DISCOVERY', text: '', active: true });
    });
  }

  async function viewScan(id) {
    setBusy(true); setError('');
    try { setDetail(await api(`/scans/${id}`)); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  const activeCount = prompts.filter(prompt => prompt.active).length;
  const analysis = Array.isArray(detail?.scan.scan_analyses) ? detail.scan.scan_analyses[0] : detail?.scan.scan_analyses;
  return <section className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-2xl font-bold">Prompts & scans</h1>
        <p className="text-sm text-slate-400 mt-2">{business.name} · Build your questions, then see how Gemini answers and describes them together.</p></div>
      <button className={secondary} onClick={onBack}>Back to dashboard</button>
    </div>
    {error && <p role="alert" className="rounded-xl border border-red-400/30 p-4 text-red-300">{error}</p>}
    {notice && <p role="status" className="rounded-xl border border-emerald-400/30 p-4 text-emerald-300">{notice}</p>}
    {loading ? <p role="status">Loading prompts…</p> : <>
      <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-mono text-emerald-300">STEP 1 · PROMPTS</p><h2 className="font-semibold mt-1">Generate and review · {activeCount} active / {prompts.length} total</h2></div>
          {prompts.length < 20 && <button className={button} disabled={busy} onClick={() => act(async () => { const result = await api(`/businesses/${business.id}/prompts/generate`, { method: 'POST' }); setNotice(`${result.prompts.length} suggested prompts added. Review and edit them before scanning.`); })}>{prompts.length ? 'Fill to 20 prompts' : 'Generate 20 prompts'}</button>}
        </div>
        <p className="text-sm text-slate-400">Suggestions use your verified business profile. Each question can be edited, excluded, or deleted. Only active questions run in the next scan.</p>
        <div className="space-y-3">{prompts.map((prompt, index) => <article key={prompt.id} className="rounded-xl border border-white/10 p-4 flex flex-col sm:flex-row sm:items-start gap-3">
          <input aria-label={`Include ${prompt.text} in scans`} type="checkbox" checked={prompt.active} disabled={busy} onChange={() => act(() => api(`/businesses/${business.id}/prompts/${prompt.id}`, { method: 'PATCH', body: { ...prompt, active: !prompt.active } }))} />
          <div className="flex-1 min-w-0"><span className="text-[10px] text-emerald-300 font-mono">{String(index + 1).padStart(2, '0')} · {prompt.category}</span>
            {editingId === prompt.id ? <form onSubmit={save} className="mt-2 space-y-3"><select aria-label={`Category for prompt ${index + 1}`} className={input} value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>{promptCategories.map(category => <option key={category} value={category}>{category}</option>)}</select>
              <textarea aria-label={`Edit prompt ${index + 1}`} className={input} rows={3} required minLength={5} maxLength={500} value={draft.text} onChange={e => setDraft({ ...draft, text: e.target.value })} />
              <div className="flex gap-3"><button disabled={busy} className={button}>Save prompt</button><button type="button" className={secondary} onClick={() => { setEditingId(null); setDraft({ category: 'DISCOVERY', text: '', active: true }); }}>Cancel</button></div></form>
              : <p className="text-sm mt-1">{prompt.text}</p>}</div>
          <div className="flex gap-3"><button className="text-sm text-emerald-300" disabled={busy} onClick={() => { setEditingId(prompt.id); setDraft({ text: prompt.text, category: prompt.category, active: prompt.active }); }}>Edit</button>
            <button className="text-sm text-red-300" disabled={busy} onClick={() => act(() => api(`/businesses/${business.id}/prompts/${prompt.id}`, { method: 'DELETE' }))}>Delete</button></div>
        </article>)}</div>
      </div>
      <form onSubmit={addCustom} className="rounded-2xl border border-white/10 bg-[#0b0f17] p-5 space-y-4">
        <h2 className="font-semibold">Add a custom prompt</h2>
        <div className="grid sm:grid-cols-[180px_1fr] gap-3"><select aria-label="Prompt category" className={input} value={customDraft.category} onChange={e => setCustomDraft({ ...customDraft, category: e.target.value })}>
          {promptCategories.map(category => <option key={category} value={category}>{category}</option>)}</select>
          <input aria-label="Customer question" className={input} required minLength={5} maxLength={500} placeholder="What might a customer ask an AI assistant?" value={customDraft.text} onChange={e => setCustomDraft({ ...customDraft, text: e.target.value })} /></div>
        <div className="flex gap-3"><button disabled={busy} className={button}>Add prompt</button></div>
      </form>
      <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-mono text-emerald-300">STEP 2 · SCAN & ANALYSIS</p><h2 className="font-semibold mt-1">Run Gemini scan</h2><p className="text-xs text-slate-400 mt-1">Saves every exact question and answer, then analyzes the completed answers together.</p></div>
          <button className={button} disabled={busy || !activeCount || scans.some(scan => ['PENDING', 'RUNNING'].includes(scan.status))} onClick={() => act(async () => { const result = await api(`/businesses/${business.id}/scans`, { method: 'POST' }); setDetail(await api(`/scans/${result.scan.id}`)); setNotice('Scan started. Answers and combined analysis will appear below.'); })}>Run {activeCount} prompt{activeCount === 1 ? '' : 's'} on Gemini</button></div>
        {!scans.length && <p className="text-sm text-slate-400">No scans yet. Live scans need the server-side scan worker and API keys.</p>}
        {scans.map(scan => <button key={scan.id} onClick={() => viewScan(scan.id)} className="w-full text-left rounded-xl border border-white/10 p-4 flex justify-between gap-3 text-sm">
          <span>{new Date(scan.created_at).toLocaleString()} · {scan.provider} / {scan.model}</span><strong className="text-emerald-300">{scan.status.replaceAll('_', ' ')} · {scan.prompt_runs?.filter(run => ['SUCCEEDED', 'FAILED'].includes(run.status)).length || 0}/{scan.prompt_runs?.length || 0}</strong>
        </button>)}
      </div>
      {detail && <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-5 space-y-4"><div className="flex justify-between"><h2 className="font-semibold">Scan results · {detail.scan.status.replaceAll('_', ' ')}</h2><button onClick={() => viewScan(detail.scan.id)} className="text-sm text-emerald-300">Refresh</button></div>
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 space-y-3"><h3 className="font-semibold">Combined analysis</h3>
          {analysis?.status === 'SUCCEEDED' ? <><p className="text-sm text-slate-200 whitespace-pre-wrap">{analysis.report.summary}</p>
            {analysis.report.themes?.map((theme, index) => <div key={index} className="text-sm"><h4 className="font-semibold text-emerald-300">{theme.title}</h4><p className="text-slate-300">{theme.finding}</p><p className="text-xs text-slate-500">Evidence: prompt {theme.promptNumbers?.join(', ') || 'not specified'}</p></div>)}
            <p className="text-xs text-slate-400">{analysis.report.limitations}</p></>
            : analysis?.status === 'FAILED' ? <p className="text-sm text-amber-300">Analysis could not be completed: {analysis.error_text}. Individual answers are saved below.</p>
              : <p className="text-sm text-slate-400">{['PENDING', 'RUNNING'].includes(detail.scan.status) ? 'The worker is still answering prompts. Analysis follows the saved answers.' : 'No combined analysis is available for this scan.'}</p>}</div>
        <h3 className="font-semibold">Individual answers · {detail.runs.length} prompts</h3>
        {detail.runs.map((run, index) => <details key={run.id} className="rounded-xl border border-white/10 p-4 text-sm"><summary className="cursor-pointer">{index + 1}. {run.status} · {run.exact_prompt}</summary>
          {run.error_text && <p className="text-red-300 mt-3">{run.error_text}</p>}
          {(Array.isArray(run.raw_responses) ? run.raw_responses[0] : run.raw_responses)?.response_text && <pre className="mt-3 whitespace-pre-wrap font-sans text-slate-300">{(Array.isArray(run.raw_responses) ? run.raw_responses[0] : run.raw_responses).response_text}</pre>}</details>)}</div>}
    </>}
  </section>;
}
