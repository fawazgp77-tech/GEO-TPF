import { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { api } from '../lib/api';

const inputClass = 'w-full bg-[#06080e] border border-white/[0.09] hover:border-white/20 focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none';

export default function LoginModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess, onSignupSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');

  if (!isOpen) return null;

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const { user, requiresEmailConfirmation } = await api(mode === 'signup' ? '/auth/signup' : '/auth/login', {
        method: 'POST',
        body: mode === 'signup' ? { email, name, password } : { email, password },
      });
      if (requiresEmailConfirmation) {
        setPendingEmail(email);
        return;
      }
      onClose();
      (mode === 'signup' ? onSignupSuccess : onLoginSuccess)?.(user);
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoading(false);
    }
  }

  function switchMode() {
    setMode(mode === 'signup' ? 'login' : 'signup');
    setPassword('');
    setError('');
  }

  return <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
    <div className="bg-[#0b0f17] border border-white/[0.08] rounded-3xl max-w-[460px] w-full p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_-15px_rgba(16,185,129,0.15)] relative">
      <button type="button" onClick={onClose} className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5" aria-label="Close"><X className="w-5 h-5" /></button>
      {pendingEmail ? <div className="py-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Check your email</h2>
        <p className="text-sm text-slate-300">If confirmation is required, Supabase has sent a link to {pendingEmail}. Open it to finish creating your account.</p>
        <button type="button" onClick={() => { setPendingEmail(''); setMode('login'); }} className="text-[#2ee59d] underline underline-offset-2">Back to sign in</button>
      </div> : <>
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-tech-mono text-emerald-400 uppercase tracking-widest mb-3"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />GEO TELEMETRY CONSOLE</div>
        <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight mb-1.5">{mode === 'signup' ? 'Create your account' : 'Sign in to your account'}</h2>
        <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed">{mode === 'signup' ? 'Create your workspace, then add your business and verified facts.' : 'Access your businesses and verified information.'}</p>
      </div>
      {error && <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider">Your name
          <input className={`${inputClass} mt-1.5`} type="text" autoComplete="name" required maxLength={200} value={name} onChange={event => setName(event.target.value)} placeholder="Your name" />
        </label>}
        <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider">Email
          <input className={`${inputClass} mt-1.5`} type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="name@company.com" />
        </label>
        <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider">Password
          <div className="relative mt-1.5">
            <input className={`${inputClass} pr-11`} type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required minLength={mode === 'signup' ? 12 : undefined} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} placeholder={mode === 'signup' ? 'At least 12 characters' : 'Enter your password'} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
          </div>
        </label>
        <button type="submit" disabled={loading} className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#2ee59d] hover:bg-[#25c485] text-[#031d14] transition-all disabled:opacity-50">{loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}</button>
      </form>
      <div className="mt-6 text-center text-xs text-slate-400">{mode === 'signup' ? 'Already have an account?' : 'New to GEO?'}{' '}<button type="button" onClick={switchMode} className="text-[#2ee59d] hover:text-emerald-300 font-semibold underline underline-offset-2">{mode === 'signup' ? 'Sign in' : 'Create an account'}</button></div>
      </>}
    </div>
  </div>;
}
