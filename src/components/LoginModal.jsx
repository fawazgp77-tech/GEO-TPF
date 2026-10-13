import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import AuthBackground from './auth/AuthBackground';
import AuthForm from './auth/AuthForm';
import GlassPanel from './ui/GlassPanel';

function AuthDialog({ initialMode, onModeChange, onLoginSuccess, onSignupSuccess }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = dialogRef.current;
    dialog.showModal();
    dialog.querySelector('input')?.focus();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return <dialog ref={dialogRef} className="auth-page" aria-labelledby="auth-title" onCancel={event => event.preventDefault()}>
    <AuthBackground />
    <header className="auth-page-header"><div className="auth-brand"><Sparkles size={22} /><span>PresenceAI</span></div></header>
    <div className="auth-stage"><GlassPanel className="auth-panel">
      <AuthForm mode={initialMode} onModeChange={onModeChange} onLoginSuccess={onLoginSuccess} onSignupSuccess={onSignupSuccess} />
    </GlassPanel></div>
    <footer className="auth-page-footer"><span>A clearer view of your AI presence.</span></footer>
  </dialog>;
}

export default function LoginModal({ isOpen, initialMode = 'login', ...props }) {
  return isOpen ? <AuthDialog initialMode={initialMode} {...props} /> : null;
}
