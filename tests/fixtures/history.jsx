// Isolated scan history states; no Supabase or Gemini calls.
import { useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import ScanHistory from '../../src/components/dashboard/ScanHistory';
import { useTheme } from '../../src/hooks/useTheme';

const business = { id: 'fixture-business', name: 'Furniture House' };
const scans = Array.from({ length: 15 }, (_, index) => ({
  id: `scan-${String(index + 1).padStart(2, '0')}`,
  status: index === 0 ? 'PARTIALLY_FAILED' : 'COMPLETED', provider: 'gemini', model: 'fixture-model',
  created_at: `2026-10-${String(index + 1).padStart(2, '0')}T12:00:00Z`,
  prompt_runs: index === 0 ? [{ status: 'SUCCEEDED' }, { status: 'FAILED' }] : [{ status: 'SUCCEEDED' }],
  scan_analyses: index === 0 ? [{ status: 'FAILED' }] : index === 1 ? [] : [{ status: 'SUCCEEDED' }],
}));

export default function Fixture() {
  const [filters, setFilters] = useState({ status: 'all', from: '', to: '', sort: 'newest', page: 1 });
  const [opened, setOpened] = useState('');
  const { theme, toggleTheme } = useTheme();
  const client = useCallback(async path => {
    const params = new URL(path, 'http://fixture.local').searchParams;
    let list = scans.filter(scan => {
      const status = params.get('status');
      if (status === 'partial' && scan.status !== 'PARTIALLY_FAILED') return false;
      if (status === 'completed' && scan.status !== 'COMPLETED') return false;
      if (status === 'failed' || status === 'active') return false;
      if (params.get('from') && scan.created_at < `${params.get('from')}T00:00:00Z`) return false;
      if (params.get('to') && scan.created_at >= `${params.get('to')}T23:59:59Z`) return false;
      return true;
    });
    list = list.sort((a, b) => params.get('sort') === 'oldest' ? a.created_at.localeCompare(b.created_at) : b.created_at.localeCompare(a.created_at));
    const offset = Number(params.get('offset'));
    return { scans: list.slice(offset, offset + Number(params.get('limit'))), total: list.length };
  }, []);
  return <div className="presence-workspace"><aside className="workspace-sidebar workspace-sidebar-desktop"><strong>PresenceAI history fixture</strong></aside><div className="workspace-body"><header className="workspace-topbar"><strong>History fixture</strong><button onClick={toggleTheme}>Switch to {theme === 'dark' ? 'light' : 'dark'} theme</button></header><main className="workspace-main"><div className="workspace-page-heading"><h1>Scan history</h1></div><p role="status">Opened: {opened || 'none'}</p><ScanHistory key={JSON.stringify(filters)} business={business} currentUser={{ id: 'fixture-owner' }} filters={filters} onFilter={changes => setFilters(previous => ({ ...previous, ...changes }))} onOpenScan={setOpened} apiClient={client} /></main></div></div>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
