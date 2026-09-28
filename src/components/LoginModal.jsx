import React, { useState } from 'react';
import { X, Eye, EyeOff, CheckCircle, Mail } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, initialMode = 'login', onLoginSuccess }) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot'
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // UI state
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Access Granted');
      const user = {
        name: loginEmail.split('@')[0],
        email: loginEmail,
        company: loginEmail.split('@')[1] || 'enterprise.com'
      };
      if (onLoginSuccess) onLoginSuccess(user);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    }, 700);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!signupEmail || !signupPassword) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Account Created Successfully');
      const user = {
        name: companyName || signupEmail.split('@')[0],
        email: signupEmail,
        company: companyName || 'Enterprise',
        website: website || 'company.com'
      };
      if (onLoginSuccess) onLoginSuccess(user);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    }, 700);
  };

  const handleSocialAuth = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage(`Authenticated via ${provider}`);
      const user = {
        name: `${provider} User`,
        email: `analyst@${provider.toLowerCase()}.internal`,
        company: 'enterprise.com'
      };
      if (onLoginSuccess) onLoginSuccess(user);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 1200);
    }, 600);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setResetSent(true);
    }, 600);
  };

  // Password strength helper
  const getPasswordStrength = (pwd) => {
    if (!pwd) return { level: 0, text: '', color: '' };
    if (pwd.length < 6) return { level: 1, text: 'Weak', color: 'bg-red-500' };
    if (pwd.length < 10) return { level: 2, text: 'Moderate', color: 'bg-amber-400' };
    return { level: 3, text: 'Strong', color: 'bg-emerald-400' };
  };

  const strength = getPasswordStrength(signupPassword);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f17] border border-white/[0.08] rounded-3xl max-w-[460px] w-full p-7 sm:p-9 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_-15px_rgba(16,185,129,0.15)] relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {successMessage ? (
          <div className="py-10 text-center space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {successMessage}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Synchronizing your enterprise telemetry and diagnostic console...
            </p>
          </div>
        ) : mode === 'login' ? (
          /* ================= LOGIN VIEW ================= */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-tech-mono text-emerald-400 uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>GEO TELEMETRY CONSOLE</span>
              </div>
              <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight mb-1.5">
                Sign in to your account
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed max-w-[320px] mx-auto">
                Access your secure workspace and monitor real-time AI search citations.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider mb-1.5">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-[#06080e] border border-white/[0.09] hover:border-white/20 focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.09] hover:border-white/20 focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/80 rounded-xl pl-4 pr-11 py-3 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                    tabIndex={-1}
                    aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5 px-0.5">
                <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-[#06080e] border-white/20 text-[#2ee59d] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#2ee59d]"
                  />
                  <span>Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setResetSent(false);
                    setMode('forgot');
                  }}
                  className="text-slate-400 hover:text-[#2ee59d] transition-colors cursor-pointer text-xs"
                >
                  Forgot password?
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#2ee59d] hover:bg-[#25c485] text-[#031d14] transition-all shadow-[0_0_25px_-5px_rgba(46,229,157,0.4)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Authenticating...' : 'Proceed'}
                </button>
              </div>
            </form>

            {/* OR Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-wider">
                <span className="bg-[#0b0f17] px-3 text-slate-500 font-mono">OR</span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialAuth('Google')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-white/[0.09] hover:border-white/20 bg-[#06080e]/60 hover:bg-[#06080e] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.54 0 2.9.54 3.97 1.43l2.97-2.97C17.13 1.8 14.73 1 12 1 7.6 1 3.86 3.5 2.11 7.15l3.66 2.84C6.64 7.2 9.07 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.16-2 3.71-4.94 3.71-8.7z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.77 14.01c-.24-.71-.38-1.47-.38-2.26s.14-1.55.38-2.26L2.11 6.65C1.35 8.16.92 9.87.92 11.75s.43 3.59 1.19 5.1l3.66-2.84z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.24 0 5.96-1.07 7.95-2.91l-3.71-2.88c-1.08.72-2.46 1.16-4.24 1.16-2.93 0-5.36-2.2-6.23-4.99L2.11 16.22C3.86 19.87 7.6 23 12 23z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialAuth('GitHub')}
                className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-white/[0.09] hover:border-white/20 bg-[#06080e]/60 hover:bg-[#06080e] text-xs font-medium text-slate-200 transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4 fill-current text-slate-100" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Don't have an account? Sign up */}
            <div className="mt-6 text-center text-xs text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-[#2ee59d] hover:text-emerald-300 font-semibold ml-1 transition-colors cursor-pointer underline underline-offset-2"
              >
                Sign up
              </button>
            </div>
          </div>
        ) : mode === 'signup' ? (
          /* ================= SIGN UP VIEW ================= */
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/30 text-[10px] font-tech-mono text-emerald-400 uppercase tracking-widest mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>NEW PROTOCOL ACCESS</span>
              </div>
              <h2 className="text-2xl sm:text-[26px] font-bold text-white tracking-tight mb-1.5">
                Create your GEO account
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-400 font-normal leading-relaxed max-w-[320px] mx-auto">
                Start monitoring your enterprise citation footprint across frontier models.
              </p>
            </div>

            <form onSubmit={handleSignupSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider mb-1">
                  Your Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full bg-[#06080e] border border-white/[0.09] hover:border-white/20 focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider mb-1">
                    Company's Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Corp"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.09] hover:border-white/20 focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider mb-1">
                    Website
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://company.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.09] hover:border-white/20 focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/80 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider">
                    Password
                  </label>
                  {signupPassword && (
                    <span className="text-[10px] font-tech-mono text-slate-400">
                      Strength: <span className={strength.level === 3 ? 'text-emerald-400' : strength.level === 2 ? 'text-amber-400' : 'text-red-400'}>{strength.text}</span>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showSignupPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.09] hover:border-white/20 focus:border-emerald-400/80 focus:ring-1 focus:ring-emerald-400/80 rounded-xl pl-4 pr-11 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition-all outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword(!showSignupPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {signupPassword && (
                  <div className="flex gap-1.5 mt-1.5 h-1">
                    <div className={`flex-1 rounded-full ${strength.level >= 1 ? strength.color : 'bg-white/10'}`} />
                    <div className={`flex-1 rounded-full ${strength.level >= 2 ? strength.color : 'bg-white/10'}`} />
                    <div className={`flex-1 rounded-full ${strength.level >= 3 ? strength.color : 'bg-white/10'}`} />
                  </div>
                )}
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    required
                    className="w-3.5 h-3.5 mt-0.5 rounded bg-[#06080e] border-white/20 text-[#2ee59d] cursor-pointer accent-[#2ee59d]"
                  />
                  <span className="text-[11px] leading-tight">
                    I agree to the <span className="text-slate-300 underline">Terms of Ingestion</span> and <span className="text-slate-300 underline">SOC2 Confidentiality</span> agreement.
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm bg-[#2ee59d] hover:bg-[#25c485] text-[#031d14] transition-all shadow-[0_0_25px_-5px_rgba(46,229,157,0.4)] active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Creating Enterprise Workspace...' : 'Create Enterprise Account'}
                </button>
              </div>
            </form>

            {/* Already have an account? Log in */}
            <div className="mt-5 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#2ee59d] hover:text-emerald-300 font-semibold ml-1 transition-colors cursor-pointer underline underline-offset-2"
              >
                Sign in
              </button>
            </div>
          </div>
        ) : (
          /* ================= FORGOT PASSWORD VIEW ================= */
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-3 text-slate-300">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight mb-1.5">
                Reset your password
              </h2>
              <p className="text-xs text-slate-400 font-normal leading-relaxed max-w-[300px] mx-auto">
                Enter your work email and we will dispatch a secure cryptographic verification link.
              </p>
            </div>

            {resetSent ? (
              <div className="py-6 text-center space-y-4">
                <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-mono">
                  Instructions dispatched to: {resetEmail}
                </div>
                <p className="text-xs text-slate-400">
                  Please check your inbox. The reset token expires in 15 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="w-full py-2.5 rounded-xl text-xs font-tech-mono font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-tech-mono uppercase text-slate-400 tracking-wider mb-1.5">
                    Corporate Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.09] hover:border-white/20 focus:border-emerald-400/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 outline-none font-mono"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl font-semibold text-xs font-tech-mono bg-[#2ee59d] hover:bg-[#25c485] text-[#031d14] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Dispatching Token...' : 'Send Reset Instructions'}
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    ← Back to Sign in
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
