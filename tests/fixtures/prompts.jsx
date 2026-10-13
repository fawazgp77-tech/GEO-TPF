// Browser-only mock: no hosted Supabase or Gemini requests.
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import PromptWorkspace from '../../src/components/dashboard/PromptWorkspace';
import { useTheme } from '../../src/hooks/useTheme';

const business = { id: 'prompt-fixture', name: 'Furniture House', category: 'Furniture store', city: 'Hyderabad', country: 'India', website: 'https://furniture.example' };
const basePrompts = [
  { id: 'p1', text: 'What are the best furniture stores in Hyderabad?', category: 'DISCOVERY', active: true },
  { id: 'p2', text: 'Where can I find affordable good-quality furniture?', category: 'COMMERCIAL', active: true },
  { id: 'p3', text: 'Which furniture stores have good delivery?', category: 'SERVICE', active: false },
  { id: 'p4', text: 'What does Furniture House sell?', category: 'DISCOVERY', active: true },
];
let saved = basePrompts.map(prompt => ({ ...prompt }));
let writes = 0;
let launches = 0;
const scan = { id: 'scan-one', business_id: business.id, status: 'COMPLETED', provider: 'gemini', model: 'fixture-model', created_at: '2026-10-11T12:00:00Z', prompt_runs: [{ status: 'SUCCEEDED' }, { status: 'SUCCEEDED' }, { status: 'FAILED' }, { status: 'SUCCEEDED' }] };
const runs = [
  { id: 'r1', prompt_id: 'p1', exact_prompt: basePrompts[0].text, status: 'SUCCEEDED', raw_responses: { response_text: 'Furniture House is one option.', citations: [{ url: 'https://furniture.example/products' }] } },
  { id: 'r2', prompt_id: 'p2', exact_prompt: basePrompts[1].text, status: 'SUCCEEDED', raw_responses: { response_text: 'Try other stores.', citations: [{ url: 'https://other.example' }] } },
  { id: 'r3', prompt_id: 'p3', exact_prompt: basePrompts[2].text, status: 'FAILED', error_text: 'Fixture error' },
  { id: 'r4', prompt_id: 'p4', exact_prompt: basePrompts[3].text, status: 'SUCCEEDED', raw_responses: { response_text: 'Furniture House sells sofas.', citations: [] } },
];
export default function Fixture() {
  const [tick, setTick] = useState(0);
  const [action, setAction] = useState('');
  const { theme, toggleTheme } = useTheme();
  const client = useCallback(async (path, options = {}) => {
    const method = options.method || 'GET';
    if (path === `/businesses/${business.id}/prompts`) {
      if (method === 'GET') return { prompts: saved.map(prompt => ({ ...prompt })) };
      if (method === 'POST') { const prompt = { ...options.body, id: `p${Date.now()}` }; saved.push(prompt); writes++; setTick(value => value + 1); return { prompt }; }
    }
    if (path.endsWith('/prompts/generate')) {
      const { generatePrompts } = await import('../../shared/prompts');
      const generated = generatePrompts(business).map((prompt, index) => ({ ...prompt, id: `g${index}` }));
      saved = options.body?.replace ? generated : [...saved, ...generated.slice(0, Math.max(0, 20 - saved.length))];
      writes++; setTick(value => value + 1); return { prompts: saved };
    }
    const item = path.match(/\/prompts\/(p\d+|g\d+)$/);
    if (item) {
      if (method === 'PATCH') saved = saved.map(prompt => prompt.id === item[1] ? { ...prompt, ...options.body } : prompt);
      if (method === 'DELETE') saved = saved.filter(prompt => prompt.id !== item[1]);
      writes++; setTick(value => value + 1); return { ok: true };
    }
    if (path === `/businesses/${business.id}/scans`) {
      if (method === 'POST') { launches++; setTick(value => value + 1); return { scan: { id: 'new-scan' } }; }
      return { scans: [scan] };
    }
    if (path === '/scans/scan-one') return { scan, runs };
    throw new Error(`Unexpected fixture request: ${method} ${path}`);
  }, []);
  return <div className="presence-workspace"><aside className="workspace-sidebar workspace-sidebar-desktop"><strong>PresenceAI prompt fixture</strong><button onClick={toggleTheme}>Switch to {theme === 'dark' ? 'light' : 'dark'} theme</button><button onClick={() => { saved = basePrompts.map(prompt => ({ ...prompt })); setTick(value => value + 1); }}>Reset prompts</button><span>Writes: {writes} · Launches: {launches} · Tick: {tick}</span></aside><div className="workspace-body"><header className="workspace-topbar">Isolated prompts test</header><main className="workspace-main"><div className="workspace-page-heading"><h1>Prompts</h1><p>Manage and organise your visibility prompts.</p></div><p role="status">{action}</p><PromptWorkspace business={business} currentUser={{ id: 'fixture-user' }} apiClient={client} onOpenScan={id => setAction(`Opened ${id}`)} /></main></div></div>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
