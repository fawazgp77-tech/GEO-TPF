import React, { useState } from 'react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#05060a] border-t border-white/[0.08] pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-xs font-light">
      <div className="max-w-7xl mx-auto">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/[0.06]">
          
          {/* Column 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-tech-mono font-bold tracking-wider text-xl text-white">
                GEO LAB
              </span>
              <span className="text-[10px] font-tech-mono tracking-widest text-emerald-400 uppercase px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">
                SPEC-09
              </span>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Generative Engine Optimization systems architecture and programmatic synthesis diagnostics for enterprise models.
            </p>
          </div>

          {/* Column 2: Intelligence Modules */}
          <div className="lg:col-span-3">
            <h4 className="font-tech-mono text-[11px] uppercase tracking-widest text-slate-300 font-semibold mb-4">
              INTELLIGENCE MODULES
            </h4>
            <ul className="space-y-2.5 font-mono text-xs">
              <li>
                <a href="#forensic-extraction" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Citation Matrix API
                </a>
              </li>
              <li>
                <a href="#framework-architecture" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Syntactic Semantic Alignment
                </a>
              </li>
              <li>
                <a href="#framework-architecture" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Perplexity Vector Diagnostic
                </a>
              </li>
              <li>
                <a href="#forensic-extraction" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  LLM Corpus Ingestion Radar
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Data Protocol & Specs */}
          <div className="lg:col-span-2">
            <h4 className="font-tech-mono text-[11px] uppercase tracking-widest text-slate-300 font-semibold mb-4">
              DATA PROTOCOL & SPECS
            </h4>
            <ul className="space-y-2.5 font-mono text-[11px] text-slate-400">
              <li>
                LATENCY TOLERANCE: <span className="text-slate-200">&lt;42ms</span>
              </li>
              <li>
                CORPUS AUDIT RUNTIME: <span className="text-slate-200">v3.4 STABLE</span>
              </li>
              <li>
                SYNTHESIS PRECISION: <span className="text-emerald-400 font-semibold">99.84%</span>
              </li>
              <li>
                ENCRYPTION SPEC: <span className="text-slate-200">ECDSA P-384</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Institutional Dispatches */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-tech-mono text-[11px] uppercase tracking-widest text-slate-300 font-semibold mb-2">
              INSTITUTIONAL DISPATCHES
            </h4>

            <p className="text-slate-400 text-xs leading-relaxed">
              Weekly generative retrieval indexes & algorithm transition briefs.
            </p>

            {subscribed ? (
              <div className="text-emerald-400 font-tech-mono text-xs py-2">
                ✓ Node added to distribution stream.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="analyst@institution.com"
                  className="bg-[#080b12] border border-white/[0.1] rounded px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 font-mono flex-1"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-tech-mono font-semibold transition-colors"
                >
                  Join
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Legal / Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px] font-tech-mono">
          <div>
            © 2025 GEO Lab Inc. Forensic Generative Diagnostics. All research rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-5">
            <a href="#" className="hover:text-slate-400 transition-colors">
              Security Disclosures
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Terms of Ingestion
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              Privacy Architecture
            </a>
            <a href="#" className="hover:text-slate-400 transition-colors">
              System Status
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
