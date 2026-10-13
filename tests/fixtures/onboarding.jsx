// This local fixture persists only mock data in its tab; it never calls Supabase.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import BusinessWizard from '../../src/components/onboarding/BusinessWizard';
import DotGridBackground from '../../src/components/onboarding/DotGridBackground';
import { useTheme } from '../../src/hooks/useTheme';
import { newWizardDraft, wizardQuestions } from '../../shared/onboarding';

const storeKey = 'presence-wizard-fixture-data';
const user = { id: 'wizard-fixture-user' };
export default function Fixture() {
  const [scenario, setScenario] = useState(new URLSearchParams(location.search).get('scenario') || 'truth-error');
  const [result, setResult] = useState('');
  const [stats, setStats] = useState('');
  const { theme, toggleTheme } = useTheme();
  const client = async (path, options) => {
    const store = JSON.parse(sessionStorage.getItem(storeKey) || '{"businesses":[],"truth":null,"creates":0,"writes":0,"failed":false}');
    const persist = () => { sessionStorage.setItem(storeKey, JSON.stringify(store)); setStats(`Businesses: ${store.businesses.length}; creates: ${store.creates}; truth writes: ${store.writes}`); };
    if (path === '/businesses' && options?.method === 'POST') {
      let business = store.businesses.find(item => item.id === options.body.creationId);
      if (!business) { business = { ...options.body, id: options.body.creationId }; store.businesses.push(business); store.creates++; }
      if (scenario === 'creation-error' && !store.failed) { store.failed = true; persist(); throw new Error('Creation response lost. Retry this draft.'); }
      persist(); return { business };
    }
    if (path === '/businesses') return { businesses: store.businesses };
    if (!options?.method || options.method === 'GET') return { truth: store.truth };
    if (scenario === 'truth-error' && !store.failed) { store.failed = true; persist(); throw new Error('Truth save failed. Your business is already created; retry this draft.'); }
    store.writes++; store.truth = { version: options.body.version + 1, data: options.body.data }; persist();
    if (scenario === 'truth-response-error' && !store.failed) { store.failed = true; persist(); throw new Error('Truth response lost.'); }
    return { version: store.truth.version };
  };
  return <div className="wizard-page"><DotGridBackground /><header className="wizard-page-header"><label>Fixture scenario <select aria-label="Fixture scenario" value={scenario} onChange={e => { setScenario(e.target.value); const params = new URLSearchParams(location.search); params.set('scenario', e.target.value); history.replaceState({}, '', `?${params}`); }} className="ui-input"><option value="truth-error">Failed truth save</option><option value="creation-error">Lost creation response</option><option value="truth-response-error">Lost truth response</option><option value="success">Successful save</option></select></label><button onClick={toggleTheme}>Switch to {theme === 'dark' ? 'light' : 'dark'} theme</button></header>
    <main className="wizard-stage">{result ? <p role="status">{result}</p> : <BusinessWizard currentUser={user} creationId={new URLSearchParams(location.search).get('draft') || ''} apiClient={client}
      onDraftId={id => { const params = new URLSearchParams(location.search); params.set('draft', id); history.replaceState({}, '', `?${params}`); }} onComplete={id => setResult(`Profile opened: ${id}`)} onSkip={() => setResult('Draft saved for later')} />}</main>
    <footer className="wizard-page-footer"><p data-testid="fixture-stats">{stats}</p><button onClick={() => { sessionStorage.removeItem(storeKey); sessionStorage.removeItem('presence-onboarding:wizard-fixture-user:new'); history.replaceState({}, '', location.pathname); location.reload(); }}>Reset fixture</button>
      <button onClick={() => {
        const id = crypto.randomUUID();
        const draft = { ...newWizardDraft(id), step: wizardQuestions.length, basics: { name: 'Fixture Furniture', website: 'https://example.com', category: 'Furniture store', country: 'India', city: 'Hyderabad', branch: '' }, truth: { officialName: 'Fixture Furniture', website: 'https://example.com', description: 'Furniture retail', address: 'Fixture road', services: 'Tables', audience: 'Homeowners', areasServed: 'Hyderabad' } };
        sessionStorage.removeItem(storeKey); sessionStorage.setItem('presence-onboarding:wizard-fixture-user:new', JSON.stringify(draft)); history.replaceState({}, '', `?scenario=${scenario}&draft=${id}`); location.reload();
      }}>Load ready test draft</button></footer>
  </div>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
