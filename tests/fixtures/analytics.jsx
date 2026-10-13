// Isolated analytics states; no Supabase or Gemini calls.
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import AnalyticsBoard from '../../src/components/dashboard/AnalyticsBoard';
import { useTheme } from '../../src/hooks/useTheme';

const business = { id: 'fixture-business', name: 'Furniture House', category: 'Furniture store', city: 'Hyderabad', country: 'India', truth_version: 2 };
const baseScan = { id: 'scan-main', business_id: business.id, status: 'COMPLETED', provider: 'gemini', model: 'fixture-model', created_at: '2026-10-11T12:00:00Z' };
const historical = { ...baseScan, id: 'scan-old', created_at: '2026-10-01T12:00:00Z' };
const response = (text, citations = []) => ({ response_text: text, citations });
const fullRuns = [
  { id: 'r1', exact_prompt: 'Best furniture stores near me?', category: 'DISCOVERY', status: 'SUCCEEDED', raw_responses: response('Furniture House is one option.', [{ url: 'https://example.com', title: 'Example' }, { url: 'javascript:alert(1)', title: 'Unsafe' }]) },
  { id: 'r2', exact_prompt: 'Where can I find affordable furniture?', category: 'COMMERCIAL', status: 'SUCCEEDED', raw_responses: response('Other stores have affordable sofas.') },
  { id: 'r3', exact_prompt: 'Does Furniture House offer delivery?', category: 'SERVICE', status: 'SUCCEEDED', raw_responses: response('Furniture House offers delivery.') },
  { id: 'r4', exact_prompt: 'Which furniture stores deliver?', category: 'SERVICE', status: 'FAILED', error_text: 'Fixture provider error', raw_responses: null },
  { id: 'r5', exact_prompt: 'What are good chairs?', category: 'DISCOVERY', status: 'PENDING', raw_responses: null },
];
const analysis = { status: 'SUCCEEDED', report: { summary: 'Saved answers named Furniture House in one generic discovery answer.', themes: [{ title: 'Named option', finding: 'The first saved answer named the business.', promptNumbers: [1] }], limitations: 'The answers are not fact-checked.' } };
const snapshot = { identity: { name: business.name, aliases: [] }, competitors: [{ name: 'Other Stores', aliases: [] }],
  truth: { version: 2, data: { services: 'Tables and chairs' } }, provider: 'gemini', model: 'fixture-model', metricVersion: 1,
  extractionVersion: 1, promptFingerprint: 'fixture' };
const measurement = { status: 'SUCCEEDED', snapshot,
  metrics: { eligibleAnswers: 2, extractedAnswers: 2, brands: [
    { id: 'target', name: business.name, mentions: 1, mentionKnown: 2, mentionScore: 50, recommendationKnown: 2, recommended: 1, recommendationScore: 50, extracted: 2, eligible: 2, mentionRunIds: ['r1'] },
    { id: 'competitor-1', name: 'Other Stores', mentions: 1, mentionKnown: 2, mentionScore: 50, recommendationKnown: 2, recommended: 0, recommendationScore: 0, extracted: 2, eligible: 2, mentionRunIds: ['r2'] },
  ], factualAgreement: { score: 100, supported: 1, contradicted: 0, unknown: 0 } },
  evidence: [{ promptRunId: 'r1', brands: [{ id: 'target', name: business.name, mention: 'yes', mentionQuote: 'Furniture House', recommendation: 'recommended' }], claims: [{ quote: 'Furniture House', truthKey: 'services', verdict: 'supported' }] }] };

export default function Fixture() {
  const [scenario, setScenario] = useState('complete');
  const [selected, setSelected] = useState('');
  const [action, setAction] = useState('');
  const [launches, setLaunches] = useState(0);
  const { theme, toggleTheme } = useTheme();
  const client = useCallback(async (path, options = {}) => {
    if (path.endsWith('/measurement-config')) {
      if (options.method === 'PUT') return { config: { target_aliases: options.body.targetAliases, competitors: options.body.competitors } };
      return { config: { target_aliases: [], competitors: [{ name: 'Other Stores', aliases: [] }] } };
    }
    if (path.endsWith('/truth')) return { truth: { data: { competitors: 'Other Stores, Another Shop' } } };
    if (path.endsWith('/prompts')) {
      if (scenario === 'prompt-error') throw new Error('Prompts unavailable');
      return { prompts: [{ id: 'p1', active: true }] };
    }
    if (path.endsWith('/scans')) {
      if (options.method === 'POST') { setLaunches(count => count + 1); return { scan: { id: 'scan-new' } }; }
      if (scenario === 'scan-list-error') throw new Error('Scan list unavailable');
      return { scans: scenario === 'empty' ? [] : [scenario === 'partial' || scenario === 'analysis-error' ? { ...baseScan, status: 'PARTIALLY_FAILED' } : { ...baseScan, scan_measurements: scenario === 'scored' ? measurement : null }, historical] };
    }
    if (path.startsWith('/scans/')) {
      const id = path.split('/').pop();
      if (scenario === 'wrong-owner') return { scan: { ...historical, business_id: 'someone-else' }, runs: fullRuns };
      if (id === 'scan-old') return { scan: { ...historical, scan_analyses: [{ ...analysis, report: { summary: 'An older one-answer report.', themes: [], limitations: 'Small sample.' } }] }, runs: [fullRuns[1]] };
      return { scan: { ...baseScan, status: scenario === 'partial' || scenario === 'analysis-error' ? 'PARTIALLY_FAILED' : 'COMPLETED', scan_analyses: [scenario === 'analysis-error' ? { status: 'FAILED', error_text: 'Fixture summary failure' } : analysis] }, runs: scenario === 'partial' || scenario === 'analysis-error' ? fullRuns : fullRuns.slice(0, 3), measurement: scenario === 'scored' ? measurement : null };
    }
    throw new Error(`Unexpected fixture request: ${path}`);
  }, [scenario]);
  return <div className="presence-workspace"><aside className="workspace-sidebar workspace-sidebar-desktop"><strong>PresenceAI analytics fixture</strong><label>Scenario<select className="ui-input" aria-label="Analytics scenario" value={scenario} onChange={e => { setScenario(e.target.value); setSelected(''); }}>{['complete', 'scored', 'partial', 'analysis-error', 'empty', 'prompt-error', 'scan-list-error', 'wrong-owner'].map(item => <option key={item}>{item}</option>)}</select></label><button onClick={toggleTheme}>Switch to {theme === 'dark' ? 'light' : 'dark'} theme</button><span>Launches: {launches}</span></aside><div className="workspace-body"><header className="workspace-topbar">Isolated analytics test</header><main className="workspace-main"><div className="workspace-page-heading"><h1>Analytics</h1><p>Explore what Gemini says, with the saved answers behind it.</p></div><p role="status">{action}</p><AnalyticsBoard key={scenario + selected} business={business} currentUser={{ id: 'fixture-owner' }} scanId={selected} apiClient={client} onOpenPrompts={() => setAction('Prompts opened')} onOpenScan={id => setSelected(id)} /></main></div></div>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
