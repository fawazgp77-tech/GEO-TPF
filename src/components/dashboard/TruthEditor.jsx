import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { truthFields } from '../../../shared/business';
import { truthGroups } from '../../../shared/businessProfile';
import { saveTruthRevision } from '../../../shared/truthRevision';
import { Badge, Button, ErrorNotice, Input, Skeleton, Textarea } from '../ui';
import GlassPanel from '../ui/GlassPanel';

export default function TruthEditor({ business, currentUser, onCancel, onSaved, apiClient = api }) {
  const [form, setForm] = useState({});
  const [version, setVersion] = useState(0);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(0);
  const [error, setError] = useState('');
  const [reload, setReload] = useState(0);
  const mounted = useRef(false);
  const savedHeading = useRef(null);
  const saveLock = useRef(false);
  const request = (path, options = {}) => apiClient(path, { ...options, expectedUserId: currentUser.id });
  useEffect(() => { if (saved) savedHeading.current?.focus(); }, [saved]);
  useEffect(() => {
    let active = true; mounted.current = true;
    apiClient(`/businesses/${business.id}/truth`, { expectedUserId: currentUser.id }).then(({ truth }) => {
      if (active) { setForm(truth?.data || { officialName: business.name, website: business.website, areasServed: business.city }); setVersion(truth?.version || 0); setVerified(false); setLoaded(true); }
    }).catch(e => { if (active) setError(e.message); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; mounted.current = false; };
  }, [business.id, business.name, business.website, business.city, currentUser.id, apiClient, reload]);
  async function finish(event) {
    event.preventDefault();
    if (saveLock.current || !loaded || !verified) return;
    saveLock.current = true; setBusy(true); setError('');
    try {
      const revision = await saveTruthRevision(request, business.id, form, version, verified);
      if (!mounted.current) return;
      setSaved(revision); setVerified(false);
    } catch (e) { if (mounted.current) { setError(e.message); setVerified(false); } }
    finally { saveLock.current = false; if (mounted.current) setBusy(false); }
  }
  if (saved) return <GlassPanel className="profile-panel profile-editor-success" role="status"><ShieldCheck size={30} className="profile-accent" /><h2 ref={savedHeading} tabIndex={-1}>Verified facts saved</h2><p>Brand Truth revision {saved} is saved. Earlier revisions and scan evidence stay unchanged.</p><Button onClick={onSaved}>Return to business profile<ArrowLeft size={16} /></Button></GlassPanel>;
  return <form onSubmit={finish} className="profile-truth-editor" aria-busy={busy || loading}>
    <GlassPanel className="profile-panel profile-editor-heading"><div><h2>{business.name}</h2><p className="profile-muted">Review these owner-supplied facts. Saving creates a new verified revision.</p></div><Badge tone="success">Revision {version || 'not yet saved'}</Badge></GlassPanel>
    {error && <ErrorNotice onRetry={!loaded ? () => { setError(''); setLoading(true); setReload(value => value + 1); } : undefined}>{error}{loaded && <span className="profile-error-line">Your edits remain here. Cancel and reopen to load the current saved revision if another update was made.</span>}</ErrorNotice>}
    {loading ? <div role="status" aria-label="Loading saved facts"><Skeleton className="h-64" /></div> : loaded && <>{truthGroups.map(group => <GlassPanel className="profile-panel" key={group.title}><fieldset disabled={busy}><legend>{group.title}</legend><div className="profile-editor-fields">{truthFields.filter(([key]) => group.keys.includes(key)).map(([key, label, required]) => <label key={key}>{label}<small>{required ? 'Required' : 'Optional'}</small>
      {['officialName', 'phone', 'website'].includes(key) ? <Input type={key === 'website' ? 'url' : key === 'phone' ? 'tel' : 'text'} value={form[key] || ''} required={required} maxLength={4000} onChange={e => { setForm({ ...form, [key]: e.target.value }); setVerified(false); }} /> : <Textarea rows={3} value={form[key] || ''} required={required} maxLength={4000} onChange={e => { setForm({ ...form, [key]: e.target.value }); setVerified(false); }} />}
    </label>)}</div></fieldset></GlassPanel>)}<GlassPanel className="profile-panel"><label className="workspace-verification"><input type="checkbox" required checked={verified} disabled={busy} onChange={e => setVerified(e.target.checked)} /><span>I confirm these facts are verified by the business owner.<small className="profile-error-line profile-muted">Model outputs are stored separately and never replace these facts.</small></span></label><div className="flex flex-wrap gap-3"><Button type="submit" disabled={busy || !verified}>{busy ? 'Saving revision…' : 'Save verified Brand Truth'}<ShieldCheck size={16} /></Button><Button variant="secondary" disabled={busy} onClick={onCancel}>Cancel</Button></div></GlassPanel></>}
    {!loaded && !loading && <Button variant="secondary" onClick={onCancel}>Back to profile</Button>}
  </form>;
}
