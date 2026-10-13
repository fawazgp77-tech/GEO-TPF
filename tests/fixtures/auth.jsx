// Isolated UI checks. This fixture does not call Supabase or send emails.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/index.css';
import AuthForm from '../../src/components/auth/AuthForm';
import AuthBackground from '../../src/components/auth/AuthBackground';

export default function Fixture() {
  const [mode, setMode] = useState('signup');
  const [scenario, setScenario] = useState('confirmation');
  const [result, setResult] = useState('');
  const [calls, setCalls] = useState([]);
  const client = async (path, options) => {
    setCalls(previous => [...previous, path]);
    await new Promise(resolve => setTimeout(resolve, scenario === 'slow-login' ? 1200 : 150));
    if (scenario === 'missing-user') return { user: null };
    if (path === '/auth/login' && scenario === 'login-error') throw new Error('Invalid login credentials');
    if (path === '/auth/signup' && scenario === 'confirmation') return { requiresEmailConfirmation: true, user: { id: 'pending-user' } };
    if (path === '/auth/resend-otp') return { ok: true };
    if (path === '/auth/verify-otp' && options.body.token !== '123456') throw new Error('Invalid or expired verification code');
    return { user: { id: 'fixture-user', name: 'Fixture User', email: 'fixture@example.com' } };
  };
  return <div className="auth-page" style={{ display: 'flex' }}>
    <AuthBackground key={scenario} src={scenario === 'video-error' ? '/tests/fixtures/missing-video.mp4' : undefined} />
    <header className="auth-page-header" style={{ color: 'white' }}><label>Test scenario <select aria-label="Test scenario" value={scenario} onChange={e => { setScenario(e.target.value); setResult(''); setCalls([]); }} style={{ color: '#111', background: '#fff' }}>
      <option value="confirmation">Email confirmation</option><option value="immediate">Immediate signup</option><option value="login-error">Rejected login</option><option value="missing-user">Missing authenticated user</option><option value="video-error">Failed video</option><option value="slow-login">Slow abandoned login</option>
    </select></label><button type="button" onClick={() => setMode(previous => previous === 'login' ? 'signup' : 'login')}>Force mode change</button></header>
    <div className="auth-stage"><section className="auth-panel">{result ? <p role="status">{result}</p> : <AuthForm key={scenario} mode={mode} onModeChange={setMode} apiClient={client} cooldownSeconds={1} onLoginSuccess={() => setResult('Login completed')} onSignupSuccess={() => setResult('Signup completed')} />}</section></div>
    <footer className="auth-page-footer"><span data-testid="fixture-calls">{calls.join(', ')}</span></footer>
  </div>;
}
document.documentElement.dataset.theme = new URLSearchParams(window.location.search).get('theme') === 'light' ? 'light' : 'dark';
createRoot(document.getElementById('root')).render(<Fixture />);
