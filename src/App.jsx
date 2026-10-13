import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ForensicExtraction from './components/ForensicExtraction';
import FrameworkArchitecture from './components/FrameworkArchitecture';
import InstitutionalResearch from './components/InstitutionalResearch';
import TechnicalFaq from './components/TechnicalFaq';
import Footer from './components/Footer';

import AuditModal from './components/AuditModal';
import BriefingModal from './components/BriefingModal';
import LoginModal from './components/LoginModal';
import Dashboard from './components/dashboard/Dashboard';
import Onboarding from './components/Onboarding';
import { api } from './lib/api';
import { navigate, useNavigation } from './lib/navigation';
import { clearWizardDrafts } from '../shared/onboarding';

function App() {
  const route = useNavigation();
  const { view: currentView, modal: currentModal } = route;
  const setCurrentView = view => navigate({ view, modal: '', ...(view === 'landing' ? { business: '', section: '', scan: '', mode: '' } : {}) });
  const [auditModalOpen, setAuditModalOpen] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('modal') === 'audit';
    } catch {
      return false;
    }
  });
  const [briefingModalOpen, setBriefingModalOpen] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('modal') === 'briefing';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  useEffect(() => {
    api('/auth/me').then(({ user }) => setCurrentUser(user))
      .catch(() => setCurrentUser(null)).finally(() => setSessionLoading(false));
  }, []);
  useEffect(() => {
    const expire = () => { clearWizardDrafts(); setCurrentUser(null); };
    window.addEventListener('presence:session-expired', expire);
    return () => window.removeEventListener('presence:session-expired', expire);
  }, []);
  const handleLoginSuccess = (user) => {
    setCurrentUser(user); setCurrentView('dashboard');
  };
  const handleSignupSuccess = (user) => {
    setCurrentUser(user); navigate({ view: 'onboarding', business: '', draft: '', section: '', mode: '', scan: '', modal: '' });
  };
  const handleLogout = async () => {
    try {
      await api('/auth/logout', { method: 'POST', body: {} });
      clearWizardDrafts();
      setCurrentUser(null); setCurrentView('landing'); setSessionError('');
    } catch (error) { setSessionError(error.message); }
  };
  if (sessionLoading) return <div className="p-10 text-slate-300" role="status">Loading your session…</div>;

  const authPage = ['login', 'signup', 'create-account'].includes(currentView);
  const authRequested = authPage || ['login', 'signup'].includes(currentModal);
  if (authRequested || (['dashboard', 'onboarding'].includes(currentView) && !currentUser)) {
    const mode = currentModal === 'signup' || ['signup', 'create-account'].includes(currentView) ? 'signup' : 'login';
    return <LoginModal isOpen initialMode={mode}
      onModeChange={next => authPage ? navigate({ view: next === 'signup' ? 'signup' : 'login', modal: '' }) : navigate({ modal: next === 'signup' ? 'signup' : 'login' })}
      onLoginSuccess={handleLoginSuccess} onSignupSuccess={handleSignupSuccess} />;
  }

  if (currentView === 'onboarding' || (currentView === 'dashboard' && route.mode === 'create')) {
    return (
      <Onboarding
        key={`${currentUser.id}:${route.business || 'new'}`}
        currentUser={currentUser} businessId={route.business} creationId={route.draft} invalidSelection={route.invalidSelection}
        onDraftId={id => navigate({ draft: id }, { replace: true })}
        onComplete={id => navigate({ view: 'dashboard', business: id, section: 'profile', mode: '', scan: '', draft: '' })}
        onSkip={id => navigate({ view: 'dashboard', business: id || '', section: 'profile', mode: '', scan: '', draft: '' })}
      />
    );
  }

  // If in dashboard view, render the complete GEO ENGINE dashboard
  if (currentView === 'dashboard') {
    return (
      <> {sessionError && <p role="alert" className="p-4 text-red-300">{sessionError}</p>}<Dashboard
        currentUser={currentUser}
        onLogout={handleLogout}
        onUpdateUser={setCurrentUser}
      /></>
    );
  }

  // Otherwise, render the Marketing Landing Page
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200 font-sans antialiased">
      {/* 00. Top Navigation Bar */}
      <Navbar
        onOpenLogin={() => {
          navigate({ modal: 'login' });
        }}
        currentUser={currentUser}
        onLogout={handleLogout}
        onGoToDashboard={() => setCurrentView('dashboard')}
      />

      <p className="px-6 py-3 text-center text-xs text-slate-400 border-y border-white/10">Product preview: the examples below use demonstration data.</p>
      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section: Your Brand Through AI's Eyes + Live Prompt Vector Synthesizer */}
        <Hero
          onOpenLogin={() => {
            navigate({ modal: 'signup' });
          }}
        />

        {/* 01 // FORENSIC EXTRACTION ENGINE */}
        <ForensicExtraction onOpenAudit={() => setAuditModalOpen(true)} />

        {/* 02 // FRAMEWORK ARCHITECTURE: The Five Dimensions of Brand Generative Equity */}
        <FrameworkArchitecture />

        {/* 03 // INSTITUTIONAL RESEARCH: Natural Language & Retrieval Systems */}
        <InstitutionalResearch />

        {/* 04 // TECHNICAL FAQ: Frequently Asked Questions */}
        <TechnicalFaq onOpenBriefing={() => setBriefingModalOpen(true)} />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Overlays / Modals */}
      <AuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />

      <BriefingModal
        isOpen={briefingModalOpen}
        onClose={() => setBriefingModalOpen(false)}
      />

    </div>
  );
}

export default App;
