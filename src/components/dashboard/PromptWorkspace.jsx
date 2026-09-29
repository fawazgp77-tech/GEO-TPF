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
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    const timer = setInterval(() => { refresh().catch(e => setError(e.message)); }, 5000);
    return () => clearInterval(timer);
  }, [scans, refresh]);

  async function act(operation) {
    setBusy(true); setError('');
    try { await operation(); await refresh(); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function save(event) {
    event.preventDefault();
    await act(async () => {
      const path = `/businesses/${business.id}/prompts${editingId ? `/${editingId}` : ''}`;
      await api(path, { method: editingId ? 'PATCH' : 'POST', body: draft });
      setDraft({ category: 'DISCOVERY', text: '', active: true }); setEditingId(null);
    });
  }

  async function viewScan(id) {
    setBusy(true); setError('');
    try { setDetail(await api(`/scans/${id}`)); }
    catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  const activeCount = prompts.filter(prompt => prompt.active).length;
  return <section className="space-y-6">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-2xl font-bold">Prompts & scans</h1>
        <p className="text-sm text-slate-400 mt-2">{business.name} · Review the tracked customer questions before a scan. Edits do not change earlier scan snapshots.</p></div>
      <button className={secondary} onClick={onBack}>Back to businesses</button>
    </div>
    {error && <p role="alert" className="rounded-xl border border-red-400/30 p-4 text-red-300">{error}</p>}
    {loading ? <p role="status">Loading prompts…</p> : <>
      <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="font-semibold">Tracked prompts · {activeCount} active / {prompts.length} total</h2>
          {!prompts.length && <button className={button} disabled={busy} onClick={() => act(() => api(`/businesses/${business.id}/prompts/generate`, { method: 'POST' }))}>Generate 20 suggestions</button>}
        </div>
        {!prompts.length && <p className="text-sm text-slate-400">Suggestions use your verified business profile. You can edit, disable or delete any question before scanning.</p>}
        <div className="space-y-3">{prompts.map(prompt => <article key={prompt.id} className="rounded-xl border border-white/10 p-4 flex flex-col sm:flex-row sm:items-start gap-3">
          <input aria-label={`Include ${prompt.text} in scans`} type="checkbox" checked={prompt.active} disabled={busy} onChange={() => act(() => api(`/businesses/${business.id}/prompts/${prompt.id}`, { method: 'PATCH', body: { ...prompt, active: !prompt.active } }))} />
          <div className="flex-1"><span className="text-[10px] text-emerald-300 font-mono">{prompt.category}</span><p className="text-sm mt-1">{prompt.text}</p></div>
          <div className="flex gap-3"><button className="text-sm text-emerald-300" disabled={busy} onClick={() => { setEditingId(prompt.id); setDraft({ text: prompt.text, category: prompt.category, active: prompt.active }); }}>Edit</button>
            <button className="text-sm text-red-300" disabled={busy} onClick={() => act(() => api(`/businesses/${business.id}/prompts/${prompt.id}`, { method: 'DELETE' }))}>Delete</button></div>
        </article>)}</div>
      </div>
      <form onSubmit={save} className="rounded-2xl border border-white/10 bg-[#0b0f17] p-5 space-y-4">
        <h2 className="font-semibold">{editingId ? 'Edit prompt' : 'Add a prompt'}</h2>
        <div className="grid sm:grid-cols-[180px_1fr] gap-3"><select aria-label="Prompt category" className={input} value={draft.category} onChange={e => setDraft({ ...draft, category: e.target.value })}>
          {promptCategories.map(category => <option key={category} value={category}>{category}</option>)}</select>
          <input aria-label="Customer question" className={input} required minLength={5} maxLength={500} placeholder="What might a customer ask an AI assistant?" value={draft.text} onChange={e => setDraft({ ...draft, text: e.target.value })} /></div>
        <div className="flex gap-3"><button disabled={busy} className={button}>{editingId ? 'Save changes' : 'Add prompt'}</button>
          {editingId && <button type="button" className={secondary} onClick={() => { setEditingId(null); setDraft({ category: 'DISCOVERY', text: '', active: true }); }}>Cancel</button>}</div>
      </form>
      <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">Scan history</h2><p className="text-xs text-slate-400 mt-1">Each scan saves exact prompts, individual status and raw answers.</p></div>
          <button className={button} disabled={busy || !activeCount} onClick={() => act(() => api(`/businesses/${business.id}/scans`, { method: 'POST' }))}>Run scan ({activeCount})</button></div>
        {!scans.length && <p className="text-sm text-slate-400">No scans yet. Live scans need the server-side scan worker and API keys.</p>}
        {scans.map(scan => <button key={scan.id} onClick={() => viewScan(scan.id)} className="w-full text-left rounded-xl border border-white/10 p-4 flex justify-between gap-3 text-sm">
          <span>{new Date(scan.created_at).toLocaleString()} · {scan.provider} / {scan.model}</span><strong className="text-emerald-300">{scan.status.replaceAll('_', ' ')} · {scan.prompt_runs?.filter(run => ['SUCCEEDED', 'FAILED'].includes(run.status)).length || 0}/{scan.prompt_runs?.length || 0}</strong>
        </button>)}
      </div>
      {detail && <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-5 space-y-4"><div className="flex justify-between"><h2 className="font-semibold">Scan evidence · {detail.scan.status}</h2><button onClick={() => viewScan(detail.scan.id)} className="text-sm text-emerald-300">Refresh</button></div>
        {detail.runs.map(run => <details key={run.id} className="rounded-xl border border-white/10 p-4 text-sm"><summary className="cursor-pointer">{run.status} · {run.exact_prompt}</summary>
          {run.error_text && <p className="text-red-300 mt-3">{run.error_text}</p>}
          {(Array.isArray(run.raw_responses) ? run.raw_responses[0] : run.raw_responses)?.response_text && <pre className="mt-3 whitespace-pre-wrap font-sans text-slate-300">{(Array.isArray(run.raw_responses) ? run.raw_responses[0] : run.raw_responses).response_text}</pre>}</details>)}</div>}
    </>}
  </section>;
}
