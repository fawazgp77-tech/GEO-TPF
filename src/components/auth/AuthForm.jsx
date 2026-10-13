import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Eye, EyeOff, MailCheck } from 'lucide-react';
import { api } from '../../lib/api';
import { authenticatedUser, applyOtpDigits } from '../../../shared/authForm';

export default function AuthForm({ mode, onModeChange, onLoginSuccess, onSignupSuccess, onBusyChange, apiClient = api, cooldownSeconds = 60 }) {
  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [deadline, setDeadline] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const refs = useRef([]);
  const mounted = useRef(true);
  const previousMode = useRef(mode);
  const requestVersion = useRef(0);
  const [shownMode, setShownMode] = useState(mode);
  const [leavingMode, setLeavingMode] = useState(null);
  const stackRef = useRef(null);
  const enteringRef = useRef(null);
  const leavingRef = useRef(null);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; onBusyChange?.(false); };
  }, [onBusyChange]);
  useEffect(() => {
    if (step !== 'otp') return;
    refs.current[0]?.focus();
    const timer = window.setInterval(() => setRemaining(Math.max(0, Math.ceil((deadline - Date.now()) / 1000))), 1000);
    return () => window.clearInterval(timer);
  }, [step, deadline]);
  useEffect(() => {
    if (previousMode.current === mode) return;
    previousMode.current = mode;
    requestVersion.current += 1;
    setBusy(false); onBusyChange?.(false);
    setStep('form'); setPassword(''); setShowPassword(false); setError(''); setNotice(''); setOtp(Array(6).fill(''));
  }, [mode, onBusyChange]);
  useLayoutEffect(() => {
    if (mode === shownMode) return;
    const frame = window.requestAnimationFrame(() => {
      setLeavingMode(shownMode);
      setShownMode(mode);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [mode, shownMode]);
  useLayoutEffect(() => {
    if (!leavingMode || step !== 'form') return;
    const stack = stackRef.current;
    const entering = enteringRef.current;
    const leaving = leavingRef.current;
    if (!stack || !entering || !leaving) return;
    stack.style.height = `${leaving.offsetHeight}px`;
    const frame = window.requestAnimationFrame(() => { stack.style.height = `${entering.offsetHeight}px`; });
    const timer = window.setTimeout(() => setLeavingMode(null), 560);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      stack.style.height = '';
    };
  }, [leavingMode, shownMode, step]);
  function cooldown() { setRemaining(cooldownSeconds); setDeadline(Date.now() + cooldownSeconds * 1000); }
  function switchMode(next) {
    if (busy || (step === 'form' && next === mode)) return;
    setStep('form'); setPassword(''); setShowPassword(false); setError(''); setNotice(''); setOtp(Array(6).fill(''));
    if (next !== mode) onModeChange(next);
  }
  async function perform(operation) {
    if (busy) return;
    const version = ++requestVersion.current;
    const isCurrent = () => mounted.current && requestVersion.current === version;
    setBusy(true); onBusyChange?.(true); setError(''); setNotice('');
    try { await operation(isCurrent); }
    catch (failure) { if (isCurrent()) setError(failure.message || 'Something went wrong. Please try again.'); }
    finally { if (isCurrent()) { setBusy(false); onBusyChange?.(false); } }
  }
  function complete(callback, response, expectedEmail, isCurrent) { if (isCurrent()) callback(authenticatedUser(response, expectedEmail)); }
  async function submit(event) {
    event.preventDefault();
    await perform(async isCurrent => {
      if (mode === 'signup') {
        const result = await apiClient('/auth/signup', { method: 'POST', body: { email: email.trim(), name: name.trim(), password } });
        if (!isCurrent()) return;
        setPassword('');
        if (result.requiresEmailConfirmation === true) { setLeavingMode(null); setStep('otp'); setOtp(Array(6).fill('')); cooldown(); }
        else complete(onSignupSuccess, result, undefined, isCurrent);
      } else complete(onLoginSuccess, await apiClient('/auth/login', { method: 'POST', body: { email: email.trim(), password } }), undefined, isCurrent);
    });
  }
  async function verify(event) {
    event.preventDefault();
    if (otp.join('').length !== 6) return;
    await perform(async isCurrent => complete(onSignupSuccess, await apiClient('/auth/verify-otp', { method: 'POST', body: { email: email.trim(), token: otp.join('') } }), undefined, isCurrent));
  }
  function changeDigit(index, value) {
    setOtp(applyOtpDigits(otp, index, value));
    const count = value.replace(/\D/g, '').length;
    if (count) refs.current[Math.min(index + count, 5)]?.focus();
  }
  function renderModeContent(contentMode, leaving) {
    return <div key={`${contentMode}-${leaving ? 'leaving' : 'entering'}`}
      ref={leaving ? leavingRef : enteringRef}
      className={`auth-mode-content auth-mode-content--${contentMode} ${leaving ? 'is-leaving' : 'is-entering'}`}
      aria-hidden={leaving || undefined} inert={leaving || undefined}>
      <div className="auth-heading"><p className="auth-eyebrow">Your next perspective</p><h1 id={leaving ? undefined : 'auth-title'}>{contentMode === 'signup' ? 'Create your account' : 'Welcome back'}</h1><p>{contentMode === 'signup' ? 'See your business through AI’s eyes.' : 'Sign in to your PresenceAI workspace.'}</p></div>
      {!leaving && error && <p role="alert" className="auth-error">{error}</p>}
      <form className="auth-form" onSubmit={leaving ? event => event.preventDefault() : submit} aria-busy={busy && !leaving}>
        {contentMode === 'signup' && <label>Your name<input autoFocus={!leaving} autoComplete="name" required maxLength={200} value={name} disabled={busy || leaving} onChange={e => setName(e.target.value)} placeholder="Full name" /></label>}
        <label>Email address<input autoFocus={!leaving && contentMode === 'login'} type="email" autoComplete="email" required maxLength={254} value={email} disabled={busy || leaving} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" /></label>
        <label>Password<div className="auth-password"><input aria-label="Password" type={showPassword ? 'text' : 'password'} autoComplete={contentMode === 'signup' ? 'new-password' : 'current-password'} required minLength={contentMode === 'signup' ? 6 : undefined} maxLength={128} value={password} disabled={busy || leaving} onChange={e => setPassword(e.target.value)} placeholder={contentMode === 'signup' ? 'At least 6 characters' : 'Your password'} />
          <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} disabled={busy || leaving} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
        <button type="submit" className="auth-submit" disabled={busy || leaving}>{busy && !leaving ? 'Please wait…' : contentMode === 'signup' ? 'Create account' : 'Sign in'}{!busy && <ArrowRight size={18} />}</button>
      </form>
      <p className="auth-switch">{contentMode === 'signup' ? 'Already have an account?' : 'New to PresenceAI?'} <button type="button" disabled={busy || leaving} onClick={() => switchMode(contentMode === 'signup' ? 'login' : 'signup')}>{contentMode === 'signup' ? 'Sign in' : 'Create an account'}</button></p>
      <p className="auth-panel-footer">Your business. Through AI’s eyes.</p>
    </div>;
  }
  return <>
    {step === 'form' ? <>
      <div className="auth-segments" data-mode={mode} role="group" aria-label="Account access"><button type="button" aria-pressed={mode === 'signup'} disabled={busy} onClick={() => switchMode('signup')}>Sign up</button><button type="button" aria-pressed={mode === 'login'} disabled={busy} onClick={() => switchMode('login')}>Sign in</button></div>
      <div className="auth-mode-stack" ref={stackRef}>
        {leavingMode && renderModeContent(leavingMode, true)}
        {renderModeContent(shownMode, false)}
      </div>
    </> : <>
      <span className="auth-mail-icon"><MailCheck size={28} /></span>
      <div className="auth-heading"><p className="auth-eyebrow">One more step</p><h1 id="auth-title">Check your inbox</h1><p>Enter the six-digit code sent to <strong>{email}</strong>.</p></div>
      {error && <p role="alert" className="auth-error">{error}</p>}{notice && <p role="status" className="auth-notice">{notice}</p>}
      <form onSubmit={verify} className="auth-form" aria-busy={busy}>
        <div className="auth-otp" role="group" aria-label="Email verification code">{otp.map((digit, index) => <input key={index} ref={element => { refs.current[index] = element; }} aria-label={`Verification digit ${index + 1}`} inputMode="numeric" autoComplete={index === 0 ? 'one-time-code' : 'off'} maxLength={6} value={digit} disabled={busy}
          onFocus={event => event.target.select()} onChange={e => changeDigit(index, e.target.value)}
          onPaste={event => { event.preventDefault(); const value = event.clipboardData.getData('text'); setOtp(applyOtpDigits(Array(6).fill(''), 0, value)); refs.current[Math.min(value.replace(/\D/g, '').length, 5)]?.focus(); }}
          onKeyDown={event => {
            if (event.key === 'Backspace' && !otp[index] && index > 0) { event.preventDefault(); setOtp(applyOtpDigits(otp, index - 1, '')); refs.current[index - 1]?.focus(); }
            if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
            if (event.key === 'ArrowRight' && index < 5) refs.current[index + 1]?.focus();
          }} />)}</div>
        <button className="auth-submit" disabled={busy || otp.join('').length !== 6}>{busy ? 'Please wait…' : 'Verify email'}{!busy && <ArrowRight size={18} />}</button>
      </form>
      <div className="auth-resend"><span>Didn’t receive a code?</span><button type="button" disabled={busy || remaining > 0} onClick={() => perform(async isCurrent => { await apiClient('/auth/resend-otp', { method: 'POST', body: { email: email.trim() } }); if (!isCurrent()) return; cooldown(); setNotice('A fresh code has been sent. Check your inbox and spam folder.'); })}>{remaining ? `Resend in ${remaining}s` : 'Resend code'}</button></div>
      <div className="auth-confirm-link"><p>You can also use the confirmation link in your email.</p><button type="button" disabled={busy} onClick={() => perform(async isCurrent => { const result = await apiClient('/auth/me'); complete(onSignupSuccess, result, email, isCurrent); })}>I’ve confirmed my email</button></div>
      <button type="button" className="auth-back" disabled={busy} onClick={() => switchMode('signup')}><ArrowLeft size={15} />Use a different email</button>
      <p className="auth-panel-footer">Your business. Through AI’s eyes.</p>
    </>}
  </>;
}
