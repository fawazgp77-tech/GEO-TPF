import React, { useState } from 'react';
import { 
  Globe, 
  Download, 
  LogOut, 
  Menu,
  X,
} from 'lucide-react';

import BusinessWorkspace from './BusinessWorkspace';

export default function Dashboard({ currentUser, onLogout }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const userData = currentUser;
  const navItems = [{ id: 'businesses', label: 'YOUR BUSINESSES', icon: Globe }];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#06080d] text-slate-100 flex flex-col lg:flex-row font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-[#0a0d15] border-b border-white/[0.08] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-tech-mono font-bold text-emerald-400 text-sm">
            G
          </div>
          <div>
            <span className="font-tech-mono font-bold text-white text-sm">GEO ENGINE</span>
          </div>
        </div>

        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded bg-white/5 border border-white/10 text-slate-300 cursor-pointer"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-30 bg-black/70 backdrop-blur-xs"
        />
      )}

      {/* ================= LEFT SIDEBAR (FIXED, DOES NOT SCROLL WITH RIGHT PANE) ================= */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-40 w-64 h-full flex-shrink-0 bg-[#070910] border-r border-white/[0.08] flex flex-col justify-between p-5 overflow-y-auto transition-transform duration-300 select-none
        ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="space-y-6">
          {/* Logo */}
          <div className="hidden lg:flex items-center gap-2.5 pb-4 border-b border-white/[0.06]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-tech-mono font-bold text-emerald-400 text-base shadow-[0_0_12px_rgba(16,185,129,0.2)]">
              G
            </div>
            <div>
              <div className="font-tech-mono font-bold tracking-wider text-white text-sm">
                GEO ENGINE
              </div>
            </div>
          </div>

          {/* ANALYSIS RUNS Navigation */}
          <div>
            <div className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-500 mb-2.5 px-2">
              ANALYSIS RUNS
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = true;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className="leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* RECENT RUNS */}
          <div className="pt-2">
            <div className="text-[10px] font-tech-mono uppercase tracking-widest text-slate-500 mb-2.5 px-2">
              RECENT RUNS
            </div>
            <div className="space-y-1">
              <button
                disabled
                className="w-full text-left px-3 pt-2 text-[11px] font-tech-mono text-emerald-400/80 hover:text-emerald-300 transition-colors"
              >
                No scans yet
              </button>
            </div>
          </div>
        </div>

        {/* User Profile Card & Back to Website */}
        <div className="pt-4 border-t border-white/[0.08] space-y-3 relative">
          
          {/* Profile Popover Menu */}
          {/* Profile Popover Menu */}
          {profileMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40 cursor-default" 
                onClick={() => setProfileMenuOpen(false)} 
              />
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#0c101b] border border-white/[0.12] rounded-xl p-3 shadow-2xl space-y-2.5 animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="pb-2 border-b border-white/[0.06]">
                  <div className="text-xs font-bold text-white truncate">
                    {userData?.name || 'Sarah Chen'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {userData?.email || 'sarah.chen@acme.com'}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[9px] font-tech-mono">
                    <span className="text-emerald-400 font-bold uppercase">Foundation</span>
                    <span className="text-slate-500">No scans yet</span>
                  </div>
                </div>

                <div className="pt-1.5 border-t border-white/[0.06]">
                  <button
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-2.5 py-1 rounded hover:bg-red-500/10 text-red-400 text-left text-[11px] font-tech-mono transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Profile Card Button */}
          <div className="p-1.5 rounded-lg hover:bg-white/[0.04] transition-colors group">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 text-left cursor-pointer w-full min-w-0"
              title="Open account menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 text-white font-bold text-xs flex items-center justify-center font-tech-mono shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
                {userData?.name ? userData.name.substring(0, 2).toUpperCase() : 'SC'}
              </div>
              <div className="leading-tight truncate flex-1 min-w-0">
                <div className="text-xs font-medium text-white truncate group-hover:text-emerald-300 transition-colors">
                  {userData?.name || 'Sarah Chen'}
                </div>
                <div className="text-[10px] font-tech-mono text-emerald-400 flex items-center gap-1">
                  <span>Workspace</span>
                  <span className="text-[9px] text-slate-500">▾</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN DASHBOARD BODY (INDEPENDENTLY SCROLLABLE) ================= */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col min-w-0">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#07090e]/95 backdrop-blur-md border-b border-white/[0.08] px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          
          {/* Breadcrumb & Scope */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-tech-mono text-sm font-bold text-white">
                GEO Analysis
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs font-mono text-slate-400">
                {currentUser.email}
              </span>
            </div>

            <div className="flex items-center gap-3 mt-1 text-[11px] font-tech-mono text-slate-500">
              <span>PROMPTS: <strong className="text-emerald-400">Not generated</strong></span>
              <span>AI MODEL: <strong className="text-emerald-400">Not configured</strong></span>
              <span className="text-slate-400 hidden sm:inline">• Business onboarding</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              disabled title="Available after your first scan"
              className="px-3.5 py-1.5 rounded-lg border border-white/[0.1] hover:border-white/20 bg-white/[0.03] hover:bg-white/[0.06] text-xs font-tech-mono text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Report</span>
            </button>
          </div>
        </header>

        {/* Tab Content Canvas */}
        <main className="flex-1 p-5 sm:p-7 max-w-7xl w-full mx-auto">
          <BusinessWorkspace />
        </main>

      </div>

    </div>
  );
}
