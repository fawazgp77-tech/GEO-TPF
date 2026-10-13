import { useState } from 'react';
import { Building2, FileText, ChartNoAxesCombined, ListChecks, History, Sun, Moon, Menu, LogOut, Settings2, Sparkles, ChevronRight, Plus, ArrowUpRight } from 'lucide-react';
import { useNavigation, navigate } from '../../lib/navigation';
import { useBusinesses } from '../../hooks/useBusinesses';
import { useScanActivity } from '../../hooks/useScanActivity';
import { useTheme } from '../../hooks/useTheme';
import { Badge, Button, EmptyState, ErrorNotice, Select, Skeleton } from '../ui';
import Dialog from '../ui/Dialog';
import BusinessWorkspace from './BusinessWorkspace';
import AccountSettingsModal from './AccountSettingsModal';

const navigation = [
  { id: 'profile', label: 'Business profile', icon: Building2 },
  { id: 'prompts', label: 'Prompts', icon: FileText },
  { id: 'analytics', label: 'Analytics', icon: ChartNoAxesCombined },
  { id: 'fixes', label: 'Fix queue', icon: ListChecks, upcoming: true },
  { id: 'history', label: 'Scan history', icon: History },
];
const descriptions = {
  profile: 'Your business details and the context behind every scan.',
  prompts: 'Manage and organise your visibility prompts.',
  analytics: 'Explore what Gemini says, with the saved answers behind it.',
  history: 'Return to the questions, answers, and analysis from earlier scans.',
};

export default function Dashboard({ currentUser, onLogout }) {
  const route = useNavigation();
  const { businesses, loading, error, refresh } = useBusinesses();
  const { theme, toggleTheme } = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(route.modal === 'settings');
  const [displayName, setDisplayName] = useState(() => {
    try { return localStorage.getItem(`presence-display:${currentUser.id || currentUser.email}`) || currentUser.name; } catch { return currentUser.name; }
  });
  const selected = businesses.find(business => business.id === route.business);
  const scanActivity = useScanActivity(selected?.id, currentUser.id);
  const activity = scanActivity.scan;
  const attempted = activity?.prompt_runs?.filter(run => ['SUCCEEDED', 'FAILED'].includes(run.status)).length || 0;
  const failed = activity?.prompt_runs?.filter(run => run.status === 'FAILED').length || 0;
  const successful = activity?.prompt_runs?.filter(run => run.status === 'SUCCEEDED').length || 0;
  const total = activity?.prompt_runs?.length || 0;
  const selectBusiness = id => {
    navigate({ view: 'dashboard', business: id, section: route.section, scan: '', mode: '', modal: '' });
    setDrawerOpen(false);
  };
  const navigateSection = section => {
    navigate({ section, mode: '', scan: '' });
    setDrawerOpen(false);
  };
  const openAccount = () => { setDrawerOpen(false); setAccountOpen(true); };
  const sidebar = <>
    <div className="workspace-brand"><span className="workspace-brand-mark"><Sparkles size={21} /></span>PresenceAI</div>
    <div className="workspace-switcher"><label htmlFor={drawerOpen ? 'business-mobile' : 'business-desktop'} className="workspace-label">Your business</label>
      <Select id={drawerOpen ? 'business-mobile' : 'business-desktop'} aria-label="Your business" value={selected?.id || ''} disabled={loading} onValueChange={selectBusiness}>
        <option value="">All businesses</option>{businesses.map(business => <option key={business.id} value={business.id}>{business.name}</option>)}
      </Select></div>
    <nav className="workspace-nav" aria-label="Workspace">{navigation.map(item => <button key={item.id}
      className="workspace-nav-item" disabled={item.upcoming} aria-current={!route.mode && route.section === item.id ? 'page' : undefined}
      onClick={() => navigateSection(item.id)}><item.icon size={19} aria-hidden="true" /><span>{item.label}</span>
      {item.upcoming && <Badge>Coming soon</Badge>}</button>)}</nav>
    <div className="workspace-sidebar-bottom"><Button variant="secondary" onClick={() => { navigate({ view: 'onboarding', mode: '', business: '', scan: '', draft: '', section: '' }); setDrawerOpen(false); }}><Plus size={16} />Add business</Button>
      <button className="workspace-account" onClick={openAccount} aria-label="Open account settings"><span className="workspace-avatar">{(currentUser.name || currentUser.email || 'U').slice(0, 2).toUpperCase()}</span>
        <span className="workspace-account-copy"><strong>{displayName || currentUser.name || 'Your account'}</strong><span>{currentUser.email}</span></span><Settings2 size={17} /></button>
      <Button variant="ghost" onClick={onLogout}><LogOut size={16} />Sign out</Button>
    </div>
  </>;
  const heading = route.mode === 'create' ? 'Add business' : route.mode === 'truth' ? 'Brand Truth' : navigation.find(item => item.id === route.section)?.label;
  return <div className="presence-workspace">
    <a href="#workspace-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 ui-button ui-button--primary">Skip to content</a>
    <aside className="workspace-sidebar workspace-sidebar-desktop">{!drawerOpen && sidebar}</aside>
    <div className="workspace-body"><header className="workspace-topbar"><div className="workspace-topbar-context">
      <Button variant="ghost" className="workspace-mobile-toggle" aria-label="Open navigation" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}><Menu size={21} /></Button>
      <span>Workspace</span><ChevronRight size={15} aria-hidden="true" /><strong>{selected?.name || 'Your businesses'}</strong>
    </div><div className="workspace-topbar-actions"><Badge>Gemini</Badge>
      <Button variant="ghost" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</Button>
      <Button variant="ghost" aria-label="Open account settings" onClick={openAccount}><span className="workspace-avatar">{(currentUser.name || currentUser.email || 'U').slice(0, 2).toUpperCase()}</span></Button>
    </div></header>
    <main id="workspace-content" className="workspace-main" tabIndex={-1}>
      {activity && <div className="workspace-scan-activity" role="status"><span className="workspace-scan-pulse" aria-hidden="true" /><div><strong>{activity.status === 'PENDING' ? 'Scan queued' : activity.status === 'RUNNING' ? 'Scan in progress' : 'Scoring saved answers'}</strong><small>{total ? `${successful} saved · ${failed} failed · ${Math.max(0, total - attempted)} pending` : 'Waiting for saved prompt status'}</small></div>{total > 0 && <progress aria-label="Current scan progress" value={attempted} max={total} />}<Button variant="secondary" onClick={() => navigate({ section: 'analytics', scan: activity.id, mode: '' })}>Open results<ChevronRight size={15} /></Button></div>}
      <div className="workspace-page-heading"><h1>{heading}</h1><p>{route.mode === 'create' ? 'Start with the basics, then verify the facts about your business.' : route.mode === 'truth' ? 'Facts reviewed and confirmed by the business owner.' : descriptions[route.section]}</p></div>
      {loading ? <div role="status" aria-label="Loading your businesses"><Skeleton className="h-24 mb-5" /><div className="workspace-grid"><Skeleton className="h-64" /><Skeleton className="h-64" /></div></div>
        : error ? <ErrorNotice onRetry={() => refresh().catch(() => {})}>{error}</ErrorNotice>
          : route.invalidSelection || (route.business && !selected) ? <EmptyState icon={Building2} title="Business unavailable" description="This business may have been removed, or you may not have access to it."><Button onClick={() => navigate({ business: '', scan: '', mode: '', section: 'profile' })}>View your businesses</Button></EmptyState>
            : <BusinessWorkspace key={`${currentUser.id}:${selected?.id || 'all'}:${route.mode}:${route.section}:${route.scan}`} currentUser={currentUser} businesses={businesses} selected={selected} route={route} refreshBusinesses={refresh} scanRevision={scanActivity.revision} onScanStarted={scanActivity.refresh} />}
      <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: 'var(--ws-muted)' }}><span>PresenceAI · Your business through AI’s eyes</span><Button variant="ghost" onClick={() => navigate({ view: 'landing', business: '', section: '', scan: '', mode: '' })}>Visit website <ArrowUpRight size={14} /></Button></footer>
    </main></div>
    {drawerOpen && <Dialog title="Your workspace" className="workspace-drawer" onClose={() => setDrawerOpen(false)}><div className="workspace-sidebar">{sidebar}</div></Dialog>}
    {accountOpen && <AccountSettingsModal currentUser={currentUser} onDisplayName={setDisplayName} onClose={() => { setAccountOpen(false); navigate({ modal: '' }, { replace: true }); }} onLogout={onLogout} />}
  </div>;
}
