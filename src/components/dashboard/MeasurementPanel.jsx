import { useEffect, useMemo, useState } from 'react';
import { BarChart3, CheckCircle2, Plus, RefreshCw, ShieldCheck, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';
import { comparableMeasurements } from '../../../shared/measurement';
import { Button } from '../ui';
import GlassPanel from '../ui/GlassPanel';

const splitNames = value => value.split(',').map(item => item.trim()).filter(Boolean);
const percent = value => value === null || value === undefined ? '—' : `${value}%`;
const delta = (now, before) => now === null || before === null || now === undefined || before === undefined
  ? '' : `${now - before > 0 ? '+' : ''}${now - before} points vs comparable scan`;
const jump = id => {
  const target = document.getElementById(`answer-${id}`);
  if (target) { target.open = true; target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
};

export default function MeasurementPanel({ business, currentUser, measurement, scan, previous,
  onRefresh, apiClient = api }) {
  const [config, setConfig] = useState(null);
  const [aliases, setAliases] = useState('');
  const [competitors, setCompetitors] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const request = useMemo(() => (path, options = {}) => apiClient(path, { ...options, expectedUserId: currentUser?.id }),
    [apiClient, currentUser?.id]);

  useEffect(() => {
    let active = true;
    Promise.allSettled([request(`/businesses/${business.id}/measurement-config`), request(`/businesses/${business.id}/truth`)])
      .then(([configResult, truthResult]) => {
        if (!active) return;
        if (configResult.status === 'fulfilled') {
          const saved = configResult.value.config;
          setConfig(saved);
          setAliases((saved?.target_aliases || []).join(', '));
          setCompetitors((saved?.competitors || []).map(item => ({ name: item.name, aliases: item.aliases.join(', ') })));
        } else setError(`Tracking names could not be loaded: ${configResult.reason.message}`);
        if (truthResult.status === 'fulfilled') {
          const text = truthResult.value.truth?.data?.competitors || '';
          setSuggestions(text.split(/[\n,;]+/).map(item => item.trim()).filter(Boolean).slice(0, 12));
        }
      }).finally(() => { if (active) setLoadingConfig(false); });
    return () => { active = false; };
  }, [business.id, request]);

  async function save() {
    setSaving(true); setError(''); setMessage('');
    try {
      const result = await request(`/businesses/${business.id}/measurement-config`, {
        method: 'PUT', body: { reviewed: true, targetAliases: splitNames(aliases),
          competitors: competitors.filter(item => item.name.trim()).map(item =>
            ({ name: item.name.trim(), aliases: splitNames(item.aliases) })) },
      });
      setConfig(result.config); setEditing(false); setMessage('Tracked names saved. Future scans will use this reviewed set.');
    } catch (e) { setError(e.message); } finally { setSaving(false); }
  }

  async function retry() {
    setRetrying(true); setError('');
    try { await request(`/scans/${scan.id}/measurement/retry`, { method: 'POST' }); onRefresh(); }
    catch (e) { setError(e.message); } finally { setRetrying(false); }
  }

  const metrics = measurement?.metrics || {};
  const brands = metrics.brands || [];
  const target = brands.find(item => item.id === 'target');
  const truth = metrics.factualAgreement || {};
  const comparable = comparableMeasurements(measurement, previous);
  const priorTarget = previous?.metrics?.brands?.find(item => item.id === 'target');
  const scores = [
    { icon: BarChart3, label: 'Unprompted mention', score: target?.mentionScore,
      detail: target ? `${target.mentions}/${target.mentionKnown} classified answers · ${target.extracted}/${target.eligible} extracted` : 'No scored answers',
      change: comparable ? delta(target?.mentionScore, priorTarget?.mentionScore) : '' },
    { icon: CheckCircle2, label: 'Explicit recommendation', score: target?.recommendationScore,
      detail: target ? `${target.recommended}/${target.recommendationKnown} classified answers · unknown excluded` : 'No scored answers',
      change: comparable ? delta(target?.recommendationScore, priorTarget?.recommendationScore) : '' },
    { icon: ShieldCheck, label: 'Agreement with Brand Truth', score: truth.score,
      detail: `${truth.supported || 0} supported · ${truth.contradicted || 0} contradicted · ${truth.unknown || 0} unknown claims`,
      change: comparable ? delta(truth.score, previous?.metrics?.factualAgreement?.score) : '' },
  ];
  const evidence = Array.isArray(measurement?.evidence) ? measurement.evidence : [];

  return <div className="measurement-stack">
    <GlassPanel className="profile-panel measurement-config">
      <div className="analytics-section-heading"><div><p className="profile-eyebrow">Measurement setup</p><h3>Tracked business names</h3>
        <p>Review aliases and competitors before the next scan. Editing these names never changes a saved score.</p></div>
        <Button variant="secondary" onClick={() => setEditing(value => !value)} disabled={loadingConfig}>{editing ? 'Close' : 'Review names'}</Button></div>
      {loadingConfig ? <p className="profile-muted">Loading tracking names…</p> : !editing
        ? <p className="measurement-config-summary">{config ? `${config.competitors.length} reviewed competitors · ${config.target_aliases.length} target aliases` : 'No competitors reviewed yet. The next scan can still measure the business name.'}</p>
        : <div className="measurement-config-form">
          <label>Business name aliases<input className="ui-input" value={aliases} onChange={event => setAliases(event.target.value)} placeholder="Comma-separated alternate names" /></label>
          <p>Business name: <strong>{business.name}</strong>. Add only distinct names that identify this business.</p>
          {competitors.map((item, index) => <div className="measurement-competitor-edit" key={index}>
            <input className="ui-input" aria-label={`Competitor ${index + 1} name`} value={item.name} placeholder="Competitor name" onChange={event => setCompetitors(items => items.map((entry, i) => i === index ? { ...entry, name: event.target.value } : entry))} />
            <input className="ui-input" aria-label={`Competitor ${index + 1} aliases`} value={item.aliases} placeholder="Aliases, comma-separated" onChange={event => setCompetitors(items => items.map((entry, i) => i === index ? { ...entry, aliases: event.target.value } : entry))} />
            <button type="button" aria-label={`Remove competitor ${index + 1}`} onClick={() => setCompetitors(items => items.filter((_, i) => i !== index))}><Trash2 size={16} /></button>
          </div>)}
          <Button variant="secondary" onClick={() => setCompetitors(items => [...items, { name: '', aliases: '' }])} disabled={competitors.length >= 8}><Plus size={15} />Add competitor</Button>
          {!!suggestions.length && <div className="measurement-suggestions"><small>From Brand Truth; review before adding</small><div>{suggestions.filter(name => !competitors.some(item => item.name.toLocaleLowerCase() === name.toLocaleLowerCase())).map(name => <button type="button" key={name} onClick={() => setCompetitors(items => [...items, { name, aliases: '' }])} disabled={competitors.length >= 8}>+ {name}</button>)}</div></div>}
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Review & save tracking names'}</Button>
        </div>}
      {message && <p role="status" className="prompt-message prompt-success">{message}</p>}
      {error && <p role="alert" className="prompt-message prompt-error">{error}</p>}
    </GlassPanel>
    {!scan ? null : !measurement ? <GlassPanel className="profile-panel"><p className="profile-eyebrow">Versioned scores</p><h3>Legacy scan</h3><p className="profile-muted">This scan predates saved identity and competitor snapshots. Its raw answers and descriptive counts remain below; it has no historical score.</p></GlassPanel>
      : <>
        {measurement.status === 'PENDING' || measurement.status === 'RUNNING'
          ? <GlassPanel className="profile-panel measurement-progress"><RefreshCw size={18} /><div><strong>Scoring saved answers</strong><p>Gemini is extracting quotes and claim comparisons from saved answers. No customer prompts are being rerun.</p></div></GlassPanel>
          : <>
            <div className="measurement-heading"><div><p className="profile-eyebrow">Versioned scores · method v{measurement.snapshot?.metricVersion}</p><h3>Visibility in this scan</h3><p>{metrics.extractedAnswers || 0}/{metrics.eligibleAnswers || 0} eligible answers extracted. Scores exclude unknown classifications.</p></div>
              {['FAILED', 'PARTIALLY_FAILED'].includes(measurement.status) && metrics.savedAnswers > evidence.length && <Button variant="secondary" onClick={retry} disabled={retrying}><RefreshCw size={15} />{retrying ? 'Retrying…' : 'Retry analysis'}</Button>}</div>
            {measurement.error_text && <p className="prompt-message prompt-error">Some extraction failed: {measurement.error_text}</p>}
            <div className="measurement-score-grid">{scores.map(({ icon: Icon, label, score, detail, change }) => <GlassPanel key={label} className="analytics-metric measurement-score"><span><Icon size={20} /></span><p>{label}</p><strong>{percent(score)}</strong><small>{detail}</small>{change && <small className="measurement-change">{change}</small>}</GlassPanel>)}</div>
            <GlassPanel className="profile-panel measurement-compare"><div className="analytics-section-heading"><div><p className="profile-eyebrow">Same saved discovery questions</p><h3>Business and competitor comparison</h3><p>Only successful questions naming none of the tracked brands are included.</p></div></div>
              <div className="measurement-table-wrap"><table><thead><tr><th>Business</th><th>Mentions</th><th>Mention rate</th><th>Recommendations</th><th>Evidence</th></tr></thead><tbody>{brands.map(brand => <tr key={brand.id}><th scope="row">{brand.name}{brand.id === 'target' ? ' · yours' : ''}</th><td>{brand.mentions}/{brand.mentionKnown}</td><td>{percent(brand.mentionScore)}</td><td>{brand.recommended}/{brand.recommendationKnown} · {percent(brand.recommendationScore)}</td><td>{brand.mentionRunIds?.length ? brand.mentionRunIds.slice(0, 5).map(id => <button type="button" key={id} onClick={() => jump(id)}>View answer</button>) : '—'}</td></tr>)}</tbody></table></div>
              {!brands.length && <p className="profile-muted">No classified answers yet.</p>}
              <p className="analytics-method">Rates describe this prompt sample, not market share. Unknown matches and unclassified recommendations are excluded from their denominators.</p>
            </GlassPanel>
            <GlassPanel className="profile-panel measurement-evidence"><div className="analytics-section-heading"><div><p className="profile-eyebrow">Auditable extraction</p><h3>Quotations and truth checks</h3><p>Open a row to compare each extracted quote with its original saved answer.</p></div></div>
              {evidence.map(row => <details key={row.promptRunId}><summary>Answer {row.promptRunId.slice(0, 8)} · {row.brands.filter(item => item.mention === 'yes').length} name matches · {row.claims.length} truth checks</summary>
                <div><button type="button" onClick={() => jump(row.promptRunId)}>Open original answer</button>
                  {row.brands.filter(item => item.mention !== 'no').map(item => <p key={item.id}><strong>{item.name}</strong>: {item.mention} mention · {item.recommendation} recommendation{item.mentionQuote && <> · “{item.mentionQuote}”</>}</p>)}
                  {row.claims.map((claim, index) => <p key={index}><strong>{claim.verdict}</strong> vs {claim.truthKey}: “{claim.quote}”</p>)}
                </div></details>)}
              {!evidence.length && <p className="profile-muted">No validated quotations were extracted.</p>}
            </GlassPanel>
            <p className="analytics-method">Agreement is Gemini's comparison with the owner-verified Brand Truth saved for this scan. It is not independent fact checking. {comparable ? 'Changes compare with the previous compatible scan.' : 'No earlier comparable scored scan is available for a trend.'}</p>
          </>}
      </>}
  </div>;
}
