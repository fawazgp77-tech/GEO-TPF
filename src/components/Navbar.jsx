import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut } from 'lucide-react';

export default function Navbar({ onOpenLogin, currentUser, onLogout, onGoToDashboard }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'What We Do', href: '#forensic-extraction' },
    { name: 'Framework', href: '#framework-architecture' },
    { name: 'About Us', href: '#institutional-research' },
    { name: 'Inquiries', href: '#technical-faq' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#07090e]/92 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl'
          : 'bg-[#07090e]/60 backdrop-blur-sm border-b border-white/[0.04] py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-tech-mono font-bold tracking-wider text-xl text-white group-hover:text-emerald-400 transition-colors">
              GEO
            </span>
          </a>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-slate-300 hover:text-white transition-colors duration-200 text-[13px] font-medium tracking-wide"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right: Actions */}
        <div className="hidden sm:flex items-center gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2.5 bg-[#0e131d] border border-emerald-500/40 px-3 py-1.5 rounded-full">
              <button
                onClick={onGoToDashboard}
                className="flex items-center gap-2 cursor-pointer"
                title="Open Dashboard"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-xs font-tech-mono text-emerald-300 truncate max-w-[140px]">
                  {currentUser.name || currentUser.email}
                </span>
              </button>
              <button
                onClick={onLogout}
                title="Log Out"
                className="text-slate-400 hover:text-red-400 p-0.5 ml-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="text-slate-300 hover:text-white text-[13px] font-medium transition-colors cursor-pointer"
            >
              Log In
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded text-slate-400 hover:text-white hover:bg-white/5 border border-white/10"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0d15] border-b border-white/10 px-6 py-5 space-y-4 animate-in fade-in duration-200 shadow-2xl">
          <nav className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-300 hover:text-emerald-400 text-sm font-medium py-1.5 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            {currentUser ? (
              <div className="flex items-center justify-between py-2 text-xs font-tech-mono text-emerald-400">
                <span>{currentUser.name || currentUser.email}</span>
                <button onClick={onLogout} className="text-red-400">Log Out</button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 rounded text-xs font-tech-mono text-slate-300 hover:text-white bg-white/5 border border-white/10 text-center"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
