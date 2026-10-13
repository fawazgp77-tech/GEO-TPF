import { useState } from 'react';
import { ArrowLeft, Moon, Sparkles, Sun } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { Button } from './ui';
import DotGridBackground from './onboarding/DotGridBackground';
import BusinessWizard from './onboarding/BusinessWizard';

export default function Onboarding({ currentUser, businessId, creationId, invalidSelection, onComplete, onSkip, onDraftId }) {
  const { theme, toggleTheme } = useTheme();
  const [busy, setBusy] = useState(false);
  return <div className="wizard-page">
    <DotGridBackground />
    <header className="wizard-page-header"><div className="workspace-brand"><span className="workspace-brand-mark"><Sparkles size={21} /></span>PresenceAI</div>
      <div className="flex items-center gap-2"><Button variant="ghost" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={19} /> : <Moon size={19} />}</Button>
        <Button variant="ghost" disabled={busy} onClick={() => onSkip(businessId)}>Save for later <ArrowLeft size={16} /></Button></div>
    </header>
    <main className="wizard-stage"><BusinessWizard currentUser={currentUser} businessId={businessId} creationId={creationId} invalidSelection={invalidSelection}
      onComplete={onComplete} onSkip={onSkip} onDraftId={onDraftId} onBusyChange={setBusy} /></main>
    <footer className="wizard-page-footer">A little context. A clearer perspective.</footer>
  </div>;
}
