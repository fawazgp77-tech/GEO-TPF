import React, { useState } from 'react';
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
  
  // User session state
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('geo_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('geo_user_session', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    // Lead user directly into the dashboard upon Proceed / Account creation!
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('geo_user_session');
    } catch (e) {
      console.error(e);
    }
    setCurrentView('landing');
  };

  // If in dashboard view, render the complete GEO ENGINE dashboard
  if (currentView === 'dashboard') {
    return (
      <Dashboard
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
        onLogout={handleLogout}
      />
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

      {/* Main Sections */}
      <main className="flex-1">
        {/* Hero Section: Your Brand Through AI's Eyes + Live Prompt Vector Synthesizer */}
        <Hero onOpenAudit={() => setAuditModalOpen(true)} />

        {/* 01 // FORENSIC EXTRACTION ENGINE */}
        <ForensicExtraction onOpenAudit={() => setAuditModalOpen(true)} />

        {/* 02 // FRAMEWORK ARCHITECTURE: The Five Dimensions of Brand Generative Equity */}
        <FrameworkArchitecture />

        {/* 04 // INSTITUTIONAL RESEARCH: Natural Language & Retrieval Systems */}
        <InstitutionalResearch />

        {/* 05 // TECHNICAL FAQ: Frequently Asked Questions */}
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
        isOpen={loginModalOpen}
        initialMode={authMode}
        onClose={() => setLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default App;
