import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { basicFields, truthFields } from '../../../shared/business';
import PromptWorkspace from './PromptWorkspace';

const button = 'rounded-xl bg-emerald-400 text-slate-950 px-5 py-3 text-sm font-semibold disabled:opacity-50';
const input = 'mt-2 w-full rounded-xl bg-[#06080e] border border-white/10 px-4 py-3 text-sm text-slate-100 focus:outline-emerald-400';

export default function BusinessWorkspace() {
  const [businesses, setBusinesses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [stage, setStage] = useState('list');
  const [form, setForm] = useState({});
  const [version, setVersion] = useState(0);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function refresh() {
    const data = await api('/businesses');
    setBusinesses(data.businesses);
  }
  useEffect(() => {
    let active = true;
    api('/businesses').then(data => { if (active) setBusinesses(data.businesses); })
      .catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);
  async function openTruth(business) {
    setBusy(true); setError(''); setNotice('');
    try {
      const { truth } = await api(`/businesses/${business.id}/truth`);
      setSelected(business);
      setForm(truth?.data || { officialName: business.name, website: business.website, areasServed: business.city });
      setVersion(truth?.version || 0); setVerified(false); setStage('truth');
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  async function save(event) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (stage === 'create') {
        const { business } = await api('/businesses', { method: 'POST', body: form });
        await refresh(); await openTruth(business);
      } else {
        await api(`/businesses/${selected.id}/truth`, { method: 'POST', body: { data: form, verified, version } });
        await refresh(); setStage('list'); setNotice('Verified Brand Truth saved. Your business profile is ready.');
      }
    } catch (e) { setError(e.message); } finally { setBusy(false); }
  }
  if (stage === 'prompts' && selected) return <PromptWorkspace business={selected} onBack={() => { setStage('list'); refresh().catch(e => setError(e.message)); }} />;
  return <section className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><h1 className="text-2xl font-bold">{stage === 'create' ? 'Add Business' : stage === 'truth' ? 'Business Truth' : 'Your businesses'}</h1>
        <p className="text-sm text-slate-400 mt-2">{stage === 'truth' ? `Verified facts for ${selected.name}. Leave unknown optional facts blank.` : 'Build your verified business profile before measuring AI visibility.'}</p></div>
      {stage === 'list' && <button className={button} disabled={busy} onClick={() => { setForm({}); setError(''); setNotice(''); setStage('create'); }}>Add Business</button>}
    </div>
    {error && <p role="alert" className="text-red-300 border border-red-400/30 rounded-xl p-4">{error}</p>}
    {notice && <p role="status" className="text-emerald-300">{notice}</p>}
    {stage === 'list' ? <>
      {busy && <p role="status">Loading businesses…</p>}
      {!busy && !businesses.length && <div className="rounded-2xl border border-white/10 bg-[#0b0f17] p-8 text-slate-400">No businesses yet. Add your first business to begin onboarding.</div>}
      <div className="grid md:grid-cols-2 gap-5">{businesses.map(business => <article key={business.id} className="rounded-2xl border border-white/10 bg-[#0b0f17] p-6 space-y-4">
        <h2 className="text-lg font-semibold">{business.name}</h2><p className="text-sm text-slate-400">{business.category} · {business.city}, {business.country}{business.branch ? ` · ${business.branch}` : ''}</p>
        <p className="text-sm text-emerald-300">{business.truth_version ? `Brand Truth verified · revision ${business.truth_version}` : 'Onboarding incomplete'}</p>
        <p className="text-sm text-slate-500">{business.latest_scan_status ? `Latest scan: ${business.latest_scan_status.replaceAll('_', ' ')}. Analysis metrics are not yet available.` : 'No scans yet. Visibility, issues and changes will appear after analysis is implemented.'}</p>
        <div className="flex flex-wrap gap-3"><button disabled={busy} className={button} onClick={() => openTruth(business)}>{business.truth_version ? 'Review Brand Truth' : 'Complete onboarding'}</button>
          {business.truth_version && <button disabled={busy} className="rounded-xl border border-emerald-400/40 text-emerald-300 px-5 py-3 text-sm" onClick={() => { setSelected(business); setStage('prompts'); setError(''); }}>Prompts & scans</button>}</div>
      </article>)}</div>
    </> : <form onSubmit={save} className="rounded-2xl border border-white/10 bg-[#0b0f17] p-6 space-y-6">
      <div className="grid md:grid-cols-2 gap-5">{(stage === 'create' ? basicFields : truthFields).map(([key, label, required]) => <label key={key} className="text-sm text-slate-300">{label}{required ? ' *' : ' (optional)'}
        {stage === 'truth' && !['officialName', 'phone', 'website'].includes(key)
          ? <textarea className={input} rows={3} required={required} maxLength={4000} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />
          : <input className={input} type={key === 'website' ? 'url' : 'text'} required={required} maxLength={4000} value={form[key] || ''} onChange={e => setForm({ ...form, [key]: e.target.value })} />}
      </label>)}</div>
      {stage === 'truth' && <label className="flex gap-3 text-sm text-slate-300"><input type="checkbox" required checked={verified} onChange={e => setVerified(e.target.checked)} />I confirm these facts are verified by the business owner. AI-generated answers are not business truth.</label>}
      <div className="flex gap-4"><button className={button} disabled={busy}>{busy ? 'Saving…' : stage === 'create' ? 'Create and continue' : 'Save verified Brand Truth'}</button><button type="button" disabled={busy} onClick={() => { setStage('list'); setError(''); }} className="text-sm text-slate-400">Back to businesses</button></div>
    </form>}
  </section>;
}
