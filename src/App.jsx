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

function App() {
  const [currentView, setCurrentView] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') || 'landing';
    } catch {
      return 'landing';
    }
  });
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
  const [loginModalOpen, setLoginModalOpen] = useState(() => {
    try {
      return new URLSearchParams(window.location.search).get('modal') === 'login';
    } catch {
      return false;
    }
  });
  const [authMode, setAuthMode] = useState('login');

  const [currentUser, setCurrentUser] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionError, setSessionError] = useState('');
  useEffect(() => {
    api('/auth/me').then(({ user }) => setCurrentUser(user))
      .catch(() => setCurrentUser(null)).finally(() => setSessionLoading(false));
  }, []);
  useEffect(() => {
    const expire = () => setCurrentUser(null);
    window.addEventListener('presence:session-expired', expire);
    return () => window.removeEventListener('presence:session-expired', expire);
  }, []);
  const handleLoginSuccess = (user) => {
    setCurrentUser(user); setLoginModalOpen(false); setCurrentView('dashboard');
  };
  const handleSignupSuccess = (user) => {
    setCurrentUser(user); setLoginModalOpen(false); setCurrentView('onboarding');
  };
  const handleLogout = async () => {
    try {
      await api('/auth/logout', { method: 'POST', body: {} });
      setCurrentUser(null); setCurrentView('landing'); setSessionError('');
    } catch (error) { setSessionError(error.message); }
  };
  if (sessionLoading) return <div className="p-10 text-slate-300" role="status">Loading your session…</div>;

  // Onboarding view: rendered after signup or direct navigation
  if (currentView === 'onboarding') {
    return (
      <Onboarding
        currentUser={currentUser}
        onComplete={(answers) => {
          const updatedUser = {
            ...(currentUser || {}),
            onboarding: answers
          };
          setCurrentUser(updatedUser);
          try {
            localStorage.setItem('geo_user_session', JSON.stringify(updatedUser));
          } catch (e) {
            console.error(e);
          }
          setCurrentView('dashboard');
        }}
        onSkip={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'dashboard' && !currentUser) {
    const isDemo = new URLSearchParams(window.location.search).get('demo') === 'true' || window.location.search.includes('view=dashboard');
    if (!isDemo) {
      return <div className="min-h-screen bg-[#07090e]"><LoginModal isOpen initialMode="login" onClose={() => setCurrentView('landing')} onLoginSuccess={handleLoginSuccess} onSignupSuccess={handleSignupSuccess} /></div>;
    }
  }

  // If in dashboard view, render the complete GEO ENGINE dashboard
  if (currentView === 'dashboard') {
    return (
      <> {sessionError && <p role="alert" className="p-4 text-red-300">{sessionError}</p>}<Dashboard
        currentUser={currentUser || { name: 'Enterprise Analyst', email: 'analyst@enterprise.com', company: 'Acme Enterprise' }}
        onLogout={handleLogout}
      /></>
    );
  }

  // Otherwise, render the Marketing Landing Page
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-200 font-sans antialiased">
      {/* 00. Top Navigation Bar */}
      <Navbar
        onOpenLogin={() => {
          setAuthMode('login');
          setLoginModalOpen(true);
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
            setAuthMode('login');
            setLoginModalOpen(true);
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

      <LoginModal
        key={loginModalOpen ? `open_${authMode}` : 'closed'}
        isOpen={loginModalOpen}
        initialMode={authMode}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}
      />
    </div>
  );
}

export default App;
