import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileText, RefreshCw, ScanSearch } from 'lucide-react';
import { api } from '../../lib/api';
import { summarizeScan } from '../../../shared/scanMetrics';

const panel = 'rounded-2xl border border-white/10 bg-[#0b0f17]';
const button = 'rounded-xl bg-emerald-400 text-slate-950 px-4 py-2.5 text-sm font-semibold';
const summaryScan = scans => scans.find(scan => ['COMPLETED', 'PARTIALLY_FAILED'].includes(scan.status)) || scans[0];

export default function BusinessDashboard({ business, onBack, onOpenPrompts, onOpenTruth }) {
  const [prompts, setPrompts] = useState([]);
  const [scans, setScans] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    const [promptResult, scanResult] = await Promise.all([
      api(`/businesses/${business.id}/prompts`), api(`/businesses/${business.id}/scans`),
    ]);
    setPrompts(promptResult.prompts);
    setScans(scanResult.scans);
    const latest = summaryScan(scanResult.scans);
    setDetail(latest ? await api(`/scans/${latest.id}`) : null);
  }, [business.id]);

  useEffect(() => {
    let active = true;
    Promise.all([api(`/businesses/${business.id}/prompts`), api(`/businesses/${business.id}/scans`)])
      .then(async ([promptResult, scanResult]) => {
        const latest = summaryScan(scanResult.scans);
        const scanDetail = latest ? await api(`/scans/${latest.id}`) : null;
        if (active) { setPrompts(promptResult.prompts); setScans(scanResult.scans); setDetail(scanDetail); }
      })
      .catch(e => { if (active) setError(e.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [business.id]);

  useEffect(() => {
    if (!scans.some(scan => ['PENDING', 'RUNNING'].includes(scan.status))) return undefined;
    const timer = setInterval(() => refresh().catch(e => setError(e.message)), 5000);
    return () => clearInterval(timer);
  }, [scans, refresh]);

  const current = detail?.scan || summaryScan(scans);
  const metrics = summarizeScan(detail?.runs, business);
  const report = Array.isArray(detail?.scan.scan_analyses) ? detail.scan.scan_analyses[0] : detail?.scan.scan_analyses;
  const activePrompts = prompts.filter(prompt => prompt.active).length;
  const cards = [
    { label: 'Tracked prompts', value: activePrompts, hint: 'Active for next scan', icon: FileText },
    { label: 'Answers saved', value: `${metrics.answered}/${metrics.total}`, hint: 'Latest scan', icon: CheckCircle2 },
    { label: 'Unprompted name mentions', value: metrics.unpromptedNameMentions, hint: `Of ${metrics.unbrandedAnswered} unbranded answers`, icon: ScanSearch },
    { label: 'Answers with citations', value: metrics.citedAnswers, hint: `Of ${metrics.answered} saved answers`, icon: FileText },
  ];

  return <section className="space-y-6">
    <button onClick={onBack} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={16} /> All businesses</button>
    <div className={`${panel} p-6 sm:p-8 bg-gradient-to-br from-[#0d1e1a] via-[#0b0f17] to-[#0b0f17]`}>
      <div className="flex flex-wrap justify-between gap-5"><div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] font-mono text-emerald-300">Business dashboard</p>
        <h1 className="text-3xl font-bold">{business.name}</h1>
        <p className="text-sm text-slate-300">{business.category} · {business.city}, {business.country}{business.branch ? ` · ${business.branch}` : ''}</p>
        <p className="text-xs text-emerald-300">Owner-verified Brand Truth · revision {business.truth_version}</p>
      </div><div className="flex flex-wrap items-start gap-3">
        <button onClick={onOpenTruth} className="rounded-xl border border-white/15 px-4 py-2.5 text-sm">Review Brand Truth</button>
        <button onClick={onOpenPrompts} className={`${button} flex items-center gap-2`}>Prompts & scans <ArrowRight size={16} /></button>
      </div></div>
    </div>
    {error && <p role="alert" className="rounded-xl border border-red-400/30 p-4 text-red-300">{error}</p>}
    {loading ? <p role="status" className="text-slate-400">Loading business data…</p> : <>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">{cards.map(card => <div key={card.label} className={`${panel} p-5`}>
        <card.icon size={18} className="text-emerald-300" /><p className="text-xs text-slate-400 mt-4">{card.label}</p>
        <p className="text-3xl font-semibold mt-1">{card.value}</p><p className="text-xs text-slate-500 mt-2">{card.hint}</p>
      </div>)}</div>
      <p className="text-xs text-slate-500">Counts come from saved scan answers. Unprompted mentions exclude questions that name this business and can match its full name or a location-free form ({metrics.matchedNames.join(' / ')}). A name match is not a recommendation or verified fact. Citations reflect links returned by Gemini.</p>
      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-5">
        <div className={`${panel} p-6 space-y-5`}>
          <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-mono text-emerald-300">LATEST SCAN</p>
            <h2 className="text-xl font-semibold mt-1">Combined analysis</h2></div>
            <button onClick={() => refresh().catch(e => setError(e.message))} aria-label="Refresh dashboard" className="text-slate-400 hover:text-white"><RefreshCw size={18} /></button></div>
          {current ? <><p className="text-xs text-slate-400">{new Date(current.created_at).toLocaleString()} · {current.provider} / {current.model} · {current.status.replaceAll('_', ' ')}</p>
            {report?.status === 'SUCCEEDED' ? <><p className="text-sm leading-7 text-slate-200">{report.report.summary}</p>
              <div className="space-y-3">{report.report.themes?.map((theme, index) => <div key={index} className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-4">
                <h3 className="font-medium text-emerald-300">{theme.title}</h3><p className="text-sm text-slate-300 mt-1">{theme.finding}</p>
                <p className="text-xs text-slate-500 mt-2">Prompts {theme.promptNumbers?.join(', ') || 'not specified'}</p>
              </div>)}</div><p className="text-xs text-slate-500">{report.report.limitations}</p></>
              : report?.status === 'FAILED' ? <p className="text-sm text-amber-300">Analysis failed; saved individual answers are still available in Prompts & scans.</p>
                : <p className="text-sm text-slate-400">{['PENDING', 'RUNNING'].includes(current.status) ? 'Scan in progress. The summary appears after the answers are saved.' : 'This scan has no combined analysis.'}</p>}</>
            : <div className="space-y-3"><p className="text-sm text-slate-400">No scan yet. Generate and review prompts, then run Gemini to create your first report.</p><button onClick={onOpenPrompts} className={button}>Set up prompts</button></div>}
        </div>
        <div className="space-y-5"><div className={`${panel} p-6 space-y-4`}><p className="text-xs font-mono text-emerald-300">COVERAGE</p><h2 className="text-xl font-semibold">Latest scan breakdown</h2>
          {metrics.categories.length ? metrics.categories.map(item => <div key={item.category}><div className="flex justify-between text-xs text-slate-300"><span>{item.category}</span><span>{item.answered}/{item.total} answered</span></div>
            <div className="h-1.5 rounded-full bg-white/10 mt-2"><div className="h-full rounded-full bg-emerald-400" style={{ width: `${item.total ? 100 * item.answered / item.total : 0}%` }} /></div></div>)
            : <p className="text-sm text-slate-400">Category coverage appears after a scan.</p>}
          {metrics.failed > 0 && <p className="text-xs text-amber-300">{metrics.failed} prompt{metrics.failed === 1 ? '' : 's'} failed. See individual answers for details.</p>}</div>
          <div className={`${panel} p-6 space-y-3`}><p className="text-xs font-mono text-emerald-300">ACTIVITY</p><h2 className="text-xl font-semibold">Recent scans</h2>
            {scans.length ? scans.slice(0, 5).map(scan => <div key={scan.id} className="flex items-center justify-between gap-2 text-xs border-t border-white/10 pt-3"><span className="text-slate-300">{new Date(scan.created_at).toLocaleString()}</span><span className="text-emerald-300">{scan.status.replaceAll('_', ' ')}</span></div>)
              : <p className="text-sm text-slate-400">No runs recorded.</p>}</div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-500"><Clock3 size={14} /> Analysis summarizes Gemini outputs. Factual accuracy and recommendation scoring are not yet measured.</div>
    </>}
  </section>;
}
