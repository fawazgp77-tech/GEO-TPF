// Isolated browser fixture: all business, truth and scan requests use the mock below.
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import BusinessProfile from '../../src/components/dashboard/BusinessProfile';
import TruthEditor from '../../src/components/dashboard/TruthEditor';
import { useTheme } from '../../src/hooks/useTheme';

const user = { id: 'profile-fixture-user' };
const businesses = [
  { id: 'fixture-a', name: 'Furniture House', website: 'https://example.com', category: 'Furniture store', country: 'India', city: 'Hyderabad', branch: '' },
  { id: 'fixture-b', name: 'City Dental', website: 'https://example.org', category: 'Dental clinic', country: 'India', city: 'Mumbai', branch: 'Central' },
];
const initialFacts = business => ({ officialName: business.name, description: `${business.category} serving local customers.`, website: business.website, address: `Sample road, ${business.city}`, services: business.id === 'fixture-a' ? 'Tables, sofas and chairs' : 'Dental care', audience: 'Local residents', areasServed: business.city, phone: '', openingHours: 'Monday–Saturday, 10am–7pm', differentiators: 'Personal customer support', competitors: '', otherFacts: '', priceRange: '' });
export default function Fixture() {
  const [scenario, setScenario] = useState('running');
  const [business, setBusiness] = useState(businesses[0]);
  const [editor, setEditor] = useState(false);
  const [action, setAction] = useState('');
  const [truth, setTruth] = useState({});
  const [writes, setWrites] = useState(0);
  const [launches, setLaunches] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const client = useCallback(async (path, options) => {
    const target = businesses.find(item => path.includes(item.id)) || business;
    if (scenario === 'slow' && target.id === 'fixture-a') await new Promise(resolve => setTimeout(resolve, 1200));
    if (scenario === 'error' && path.endsWith('/prompts')) throw new Error('Fixture prompt request failed');
    if (path.endsWith('/truth')) {
      if (options?.method === 'POST') { const revision = options.body.version + 1; setTruth(old => ({ ...old, [target.id]: { version: revision, data: options.body.data } })); setWrites(old => old + 1); return { version: revision }; }
      return { truth: scenario === 'incomplete' ? null : truth[target.id] || { version: 2, data: initialFacts(target), verified_at: '2026-10-11T10:00:00Z' } };
    }
    if (path.endsWith('/prompts')) return { prompts: scenario === 'no-prompts' ? [] : [{ id: 'p1', active: true }, { id: 'p2', active: true }, { id: 'p3', active: false }] };
    const finished = { id: `finished-${target.id}`, business_id: target.id, status: scenario === 'partial' ? 'PARTIALLY_FAILED' : 'COMPLETED', provider: 'gemini', model: 'fixture-model', created_at: '2026-10-10T10:00:00Z', completed_at: '2026-10-10T10:01:00Z' };
    if (path.endsWith('/scans')) {
      if (options?.method === 'POST') { setLaunches(old => old + 1); return { scan: { id: `new-${target.id}` } }; }
      return { scans: ['no-scan', 'incomplete'].includes(scenario) ? [] : scenario === 'running' ? [{ ...finished, id: `running-${target.id}`, status: 'RUNNING', created_at: '2026-10-12T10:00:00Z', prompt_runs: [{ status: 'SUCCEEDED' }, { status: 'RUNNING' }] }, finished] : [finished] };
    }
    if (path.startsWith('/scans/')) return { scan: { ...finished, scan_analyses: [{ status: 'SUCCEEDED', report: { summary: `${target.name} appeared in one saved discovery answer. This fixture summary describes the saved model outputs and does not verify factual accuracy.` } }] }, runs: [
      { status: 'SUCCEEDED', exact_prompt: 'Best businesses near me?', raw_responses: { response_text: `Consider ${target.name}.`, citations: [{ url: target.website }] } },
      { status: scenario === 'partial' ? 'FAILED' : 'SUCCEEDED', exact_prompt: 'Where can I find affordable services?', raw_responses: scenario === 'partial' ? null : { response_text: 'Consider other providers.', citations: [] } },
    ] };
    throw new Error('Unexpected fixture request');
  }, [business, scenario, truth]);
  const actionLabel = label => { setAction(label); };
  return <div className="presence-workspace"><aside className="workspace-sidebar workspace-sidebar-desktop"><div className="workspace-brand">PresenceAI fixture</div><label>Business<select className="ui-input" aria-label="Fixture business" value={business.id} onChange={e => { setBusiness(businesses.find(item => item.id === e.target.value)); setEditor(false); setAction(''); }}>{businesses.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label><label>Scenario<select className="ui-input" aria-label="Profile scenario" value={scenario} onChange={e => { setScenario(e.target.value); setAction(''); }}>{['running', 'complete', 'partial', 'no-scan', 'no-prompts', 'incomplete', 'error', 'slow'].map(item => <option key={item}>{item}</option>)}</select></label><button onClick={toggleTheme}>Switch to {theme === 'dark' ? 'light' : 'dark'} theme</button></aside><div className="workspace-body"><header className="workspace-topbar"><span>Isolated profile tests</span><span>Truth writes: {writes} · Scan launches: {launches}</span></header><main className="workspace-main"><div role="status">{action}</div>{editor ? <TruthEditor key={business.id} business={business} currentUser={user} apiClient={client} onCancel={() => setEditor(false)} onSaved={() => setEditor(false)} /> : <BusinessProfile key={`${business.id}:${scenario}`} business={business} currentUser={user} apiClient={client} onOpenTruth={() => setEditor(true)} onSetup={() => actionLabel('Setup opened')} onOpenPrompts={() => actionLabel('Prompts opened')} onOpenAnalytics={() => actionLabel('Analytics opened')} onOpenScan={id => actionLabel(`Scan opened: ${id}`)} onRemove={() => actionLabel('Removal confirmation requested')} />}</main></div></div>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
