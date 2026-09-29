import { useState, useRef, useEffect } from 'react';
import { X, Eye, EyeOff, ShieldCheck, MailCheck, ArrowLeft } from 'lucide-react';
import { api } from '../lib/api';

const inputClass = 'w-full bg-[#06080e] border border-white/[0.09] hover:border-white/20 focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none';

export default function LoginModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess, onSignupSuccess }) {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMessage, setResendMessage] = useState('');
  const [resendCountdown, setResendCountdown] = useState(60);
  const [resending, setResending] = useState(false);
  const [createdUser, setCreatedUser] = useState(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (step === 'otp' && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  if (!isOpen) return null;

  async function submit(event) {
    event.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    setResendMessage('');

    try {
      if (mode === 'signup') {
        const result = await api('/auth/signup', {
          method: 'POST',
          body: { email, name, password },
        });
        setCreatedUser(result?.user || { email, name });
        // Transition to OTP verification step
        setStep('otp');
        setOtp(['', '', '', '', '', '']);
        setResendCountdown(60);
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      } else {
        const { user } = await api('/auth/login', {
          method: 'POST',
          body: { email, password },
        });
        onClose();
        onLoginSuccess?.(user);
      }
    } catch (failure) {
      setError(failure.message);
    } finally {
      setLoading(false);
    }
  }

  function handleOtpChange(index, value) {
    const clean = value.replace(/\D/g, '');
    if (!clean) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }
    const char = clean.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto advance to next input box
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index, event) {
    if (event.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpPaste(event) {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] || '';
    }
    setOtp(newOtp);
    const nextIdx = Math.min(pasted.length, 5);
    inputRefs.current[nextIdx]?.focus();
  }

  async function handleVerifyOtp(event) {
    if (event) event.preventDefault();
    const token = otp.join('').trim();
    if (token.length < 6 || loading) return;
    setLoading(true);
    setError('');
    setResendMessage('');

    try {
      const response = await api('/auth/verify-otp', {
        method: 'POST',
        body: { email, token },
      });
      const resolvedUser = response?.user || createdUser || { email, name };
      onClose();
      onSignupSuccess?.(resolvedUser);
    } catch (failure) {
      setError(failure.message || 'Invalid or expired verification code. Please check and try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resending || resendCountdown > 0) return;
    setResending(true);
    setError('');
    setResendMessage('');

    try {
      await api('/auth/resend-otp', {
        method: 'POST',
        body: { email },
      });
      setResendMessage('A fresh verification code has been dispatched to your email.');
      setResendCountdown(60);
    } catch (failure) {
      setError(failure.message || 'Unable to resend verification code. Please try again.');
    } finally {
      setResending(false);
    }
  }

  function switchMode() {
    setMode(mode === 'signup' ? 'login' : 'signup');
    setStep('form');
    setPassword('');
    setError('');
    setResendMessage('');
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-3xl max-w-[460px] w-full p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_-15px_rgba(16,185,129,0.15)] relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'otp' ? (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-tech-mono text-emerald-400 uppercase tracking-widest mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                OTP VERIFICATION // 2FA
              </div>
              <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight mb-1.5">Verify your email</h2>
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed max-w-sm mx-auto">
                We've sent a 6-digit verification code to <span className="text-white font-medium break-all">{email}</span>. Enter the code below to complete registration.
              </p>
            </div>

            {error && <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}
            {resendMessage && (
              <p role="status" className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-300 flex items-center gap-2">
                <MailCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{resendMessage}</span>
              </p>
            )}

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-center text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider mb-3">
                  Enter 6-Digit Code
                </label>
                <div className="flex justify-center items-center gap-2 sm:gap-2.5">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={el => { inputRefs.current[index] = el; }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      autoComplete={index === 0 ? 'one-time-code' : 'off'}
                      value={digit}
                      onChange={e => handleOtpChange(index, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(index, e)}
                      onPaste={handleOtpPaste}
                      className="w-11 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-bold font-tech-mono bg-[#06080e] border border-white/[0.12] rounded-xl text-emerald-400 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50 outline-none transition-all shadow-inner"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.join('').trim().length < 6}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#2ee59d] hover:bg-[#25c485] text-[#031d14] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-3px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                {loading ? 'Verifying code…' : 'Verify & Complete Registration'}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>Didn't receive code?</span>
                <button
                  type="button"
                  disabled={resendCountdown > 0 || resending}
                  onClick={handleResendOtp}
                  className="text-[#2ee59d] hover:text-emerald-300 font-semibold underline underline-offset-2 disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {resending ? 'Sending…' : resendCountdown > 0 ? `Resend code in ${resendCountdown}s` : 'Resend code'}
                </button>
              </div>

              <div className="pt-2 border-t border-white/[0.08] text-center">
                <button
                  type="button"
                  onClick={() => { setStep('form'); setError(''); setResendMessage(''); }}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Wrong email? Back to create account
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-tech-mono text-emerald-400 uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                GEO TELEMETRY CONSOLE
              </div>
              <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight mb-1.5">
                {mode === 'signup' ? 'Create your account' : 'Sign in to your account'}
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed">
                {mode === 'signup'
                  ? 'Create your workspace, then add your business and verified facts.'
                  : 'Access your businesses and verified information.'}
              </p>
            </div>

            {error && <p role="alert" className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>}

            <form onSubmit={submit} className="space-y-4">
              {mode === 'signup' && (
                <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider">
                  Your name
                  <input
                    className={`${inputClass} mt-1.5`}
                    type="text"
                    autoComplete="name"
                    required
                    maxLength={200}
                    value={name}
                    onChange={event => setName(event.target.value)}
                    placeholder="Your name"
                  />
                </label>
              )}
              <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider">
                Email
                <input
                  className={`${inputClass} mt-1.5`}
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={email}
                  onChange={event => setEmail(event.target.value)}
                  placeholder="name@company.com"
                />
              </label>
              <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider">
                Password
                <div className="relative mt-1.5">
                  <input
                    className={`${inputClass} pr-11`}
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    required
                    minLength={mode === 'signup' ? 6 : undefined}
                    maxLength={128}
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Enter your password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </label>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#2ee59d] hover:bg-[#25c485] text-[#031d14] transition-all disabled:opacity-50 cursor-pointer"
              >
                {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-400">
              {mode === 'signup' ? 'Already have an account?' : 'New to GEO?'}{' '}
              <button
                type="button"
                onClick={switchMode}
                className="text-[#2ee59d] hover:text-emerald-300 font-semibold underline underline-offset-2 cursor-pointer"
              >
                {mode === 'signup' ? 'Sign in' : 'Create an account'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
