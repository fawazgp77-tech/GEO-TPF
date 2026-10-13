import { useEffect, useRef, useState } from 'react';
import { Building2, ArrowRight, Plus, ScanLine } from 'lucide-react';
import { api } from '../../lib/api';
import { navigate } from '../../lib/navigation';
import { Badge, Button, EmptyState, ErrorNotice } from '../ui';
import GlassPanel from '../ui/GlassPanel';
import PromptWorkspace from './PromptWorkspace';
import ScanHistory from './ScanHistory';
import AnalyticsBoard from './AnalyticsBoard';
import BusinessProfile from './BusinessProfile';
import TruthEditor from './TruthEditor';

export default function BusinessWorkspace({ businesses, selected, currentUser, route, refreshBusinesses, scanRevision = 0, onScanStarted }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const mounted = useRef(false);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const go = changes => navigate({ view: 'dashboard', ...changes });
  const changeHistory = changes => {
    const status = changes.status === undefined ? route.history.status : changes.status;
    const from = changes.from === undefined ? route.history.from : changes.from;
    const to = changes.to === undefined ? route.history.to : changes.to;
    const sort = changes.sort === undefined ? route.history.sort : changes.sort;
    const page = changes.page === undefined ? route.history.page : changes.page;
    go({ historyStatus: status === 'all' ? '' : status, historyFrom: from, historyTo: to,
      historySort: sort === 'newest' ? '' : sort, historyPage: page === 1 ? '' : String(page) });
  };
  const setup = () => go({ view: 'onboarding', mode: '', draft: '', scan: '' });
  async function remove(business) {
    if (busy || !window.confirm(`Remove "${business.name}" and its saved business data? This cannot be undone.`)) return;
    setBusy(true); setError('');
    try {
      await api(`/businesses/${business.id}`, { method: 'DELETE', expectedUserId: currentUser.id });
      await refreshBusinesses();
      if (!mounted.current) return;
      if (selected?.id === business.id) go({ business: '', mode: '', scan: '', section: 'profile' });
      else setNotice(`Removed ${business.name}.`);
    } catch (e) { if (mounted.current) setError(e.message); } finally { if (mounted.current) setBusy(false); }
  }
  if (route.mode === 'truth') return selected ? <TruthEditor business={selected} currentUser={currentUser} onCancel={() => go({ mode: '', section: 'profile', scan: '' })} onSaved={() => {
    go({ mode: '', section: 'profile', scan: '' });
    refreshBusinesses().catch(() => {});
  }} /> : <EmptyState icon={Building2} title="Choose a business" description="Select a business before reviewing its verified facts." />;
  if (!selected) return <>
    {error && <ErrorNotice>{error}</ErrorNotice>}{notice && <p role="status" className="workspace-notice">{notice}</p>}
    {!businesses.length ? <EmptyState icon={Building2} title="Meet your business through AI’s eyes" description="Add your business, verify its facts, and start exploring how Gemini answers your customers’ questions."><Button onClick={() => go({ view: 'onboarding', mode: '', business: '', draft: '', section: '' })}><Plus size={16} />Add your first business</Button></EmptyState>
      : <><div className="workspace-selection-row mb-5"><p style={{ color: 'var(--ws-muted)' }}>Select a business to explore {route.section === 'profile' ? 'its profile' : route.section === 'history' ? 'its scan history' : route.section}.</p><Badge>{businesses.length} business{businesses.length === 1 ? '' : 'es'}</Badge></div>
        <div className="workspace-grid">{businesses.map(business => <GlassPanel key={business.id} className="profile-panel workspace-business-card"><div className="flex items-center justify-between gap-3"><span className="workspace-business-icon"><Building2 size={22} /></span><Badge tone={business.truth_version ? 'success' : 'warning'}>{business.truth_version ? 'Verified' : 'Setup needed'}</Badge></div>
          <div><h2>{business.name}</h2><p>{business.category} · {business.city}, {business.country}</p></div><p>{business.latest_scan_status ? `Latest scan: ${business.latest_scan_status.replaceAll('_', ' ').toLowerCase()}` : business.truth_version ? 'Ready for your first discovery scan' : 'Verify your business facts to get started'}</p>
          <div className="workspace-business-actions"><Button disabled={busy} onClick={() => go({ business: business.id, mode: '', scan: '' })}>Open business<ArrowRight size={16} /></Button><Button variant="ghost" disabled={busy} onClick={() => remove(business)}>Remove</Button></div>
        </GlassPanel>)}</div></>}
  </>;
  if (!selected.truth_version && route.section !== 'profile') return <EmptyState icon={ScanLine} title="Verify your business first" description="Review and confirm Brand Truth before generating prompts or running scans."><Button onClick={setup}>Complete business setup</Button></EmptyState>;
  if (route.section === 'analytics') return <AnalyticsBoard key={`${selected.id}:${route.scan || 'latest'}`} currentUser={currentUser} business={selected} scanId={route.scan} scanRevision={scanRevision} onScanStarted={onScanStarted}
    onOpenPrompts={() => go({ section: 'prompts', scan: '' })} onOpenScan={id => go({ section: 'analytics', scan: id })}
    onBackHistory={() => go({ section: 'history', scan: '' })} />;
  if (route.section === 'prompts') return <PromptWorkspace key={selected.id} currentUser={currentUser} business={selected} scanRevision={scanRevision} onScanStarted={onScanStarted} onOpenScan={id => go({ section: 'analytics', scan: id })} />;
  if (route.section === 'history') return <ScanHistory key={`${route.history.status}:${route.history.from}:${route.history.to}:${route.history.sort}:${route.history.page}`} business={selected} currentUser={currentUser} filters={route.history} scanRevision={scanRevision}
    onFilter={changeHistory} onOpenScan={id => go({ section: 'analytics', scan: id })} />;
  return <>{error && <ErrorNotice>{error}</ErrorNotice>}<BusinessProfile key={selected.id} currentUser={currentUser} business={selected} scanRevision={scanRevision} onScanStarted={onScanStarted} onSetup={setup}
    onOpenTruth={() => go({ mode: 'truth', scan: '' })} onOpenPrompts={() => go({ section: 'prompts', scan: '' })} onOpenAnalytics={() => go({ section: 'analytics', scan: '' })}
    onOpenScan={id => go({ section: 'analytics', scan: id })} onRemove={() => remove(selected)} removing={busy} /></>;
}
