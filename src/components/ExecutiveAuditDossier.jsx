import React, { useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

export default function ExecutiveAuditDossier({ onGenerateAudit }) {
  const [formData, setFormData] = useState({
    corporateDomain: '',
    workEmail: '',
    marketSector: 'Enterprise B2B SaaS',
    competitorDomain: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.corporateDomain || !formData.workEmail) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onGenerateAudit) {
        onGenerateAudit(formData);
      }
    }, 1200);
  };

  return (
    <section id="request-audit" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] relative bg-[#06080d]">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/[0.06] rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto text-center">
        
        {/* Identifier Badge */}
        <div className="text-xs font-tech-mono text-emerald-400 tracking-wider mb-4 uppercase">
          TELEMETRY ACCESS DOSSIER
        </div>

        {/* Heading */}
        <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight mb-4">
          Request an Executive GEO Audit
        </h2>

        {/* Subtitle */}
        <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto mb-12">
          Receive a custom 14-page diagnostic detailing your organization's current rank position, citation ground-truth fidelity, and competitor co-occurrence across 5 frontier LLMs.
        </p>

        {/* Form Container */}
        <div className="rounded-lg bg-[#080b12]/95 border border-white/[0.12] p-8 sm:p-10 shadow-2xl backdrop-blur text-left">
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-in fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-2xl text-white">
                Executive Dossier Generation Initialized
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                Monte Carlo sampling nodes are querying GPT-4o, Claude 3.5, and Perplexity Pro for <span className="text-emerald-400 font-mono">{formData.corporateDomain}</span>. The 14-page PDF brief will be dispatched to <span className="text-slate-200 font-mono">{formData.workEmail}</span>.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded text-xs font-tech-mono text-slate-300 hover:text-white bg-white/5 border border-white/10"
              >
                Request Another Diagnostic
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 2x2 Grid of Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Field 1: Corporate Domain */}
                <div>
                  <label className="block text-[11px] font-tech-mono uppercase tracking-widest text-slate-400 mb-2 font-medium">
                    CORPORATE DOMAIN
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.corporateDomain}
                    onChange={(e) => setFormData({ ...formData, corporateDomain: e.target.value })}
                    placeholder="acmecorp.com"
                    className="w-full bg-[#05070c] border border-white/[0.1] rounded px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 font-mono transition-colors"
                  />
                </div>

                {/* Field 2: Work Email */}
                <div>
                  <label className="block text-[11px] font-tech-mono uppercase tracking-widest text-slate-400 mb-2 font-medium">
                    WORK EMAIL (EXECUTIVE / ANALYST)
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.workEmail}
                    onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                    placeholder="vp.growth@acmecorp.com"
                    className="w-full bg-[#05070c] border border-white/[0.1] rounded px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 font-mono transition-colors"
                  />
                </div>

                {/* Field 3: Primary Market Sector */}
                <div>
                  <label className="block text-[11px] font-tech-mono uppercase tracking-widest text-slate-400 mb-2 font-medium">
                    PRIMARY MARKET SECTOR
                  </label>
                  <select
                    value={formData.marketSector}
                    onChange={(e) => setFormData({ ...formData, marketSector: e.target.value })}
                    className="w-full bg-[#05070c] border border-white/[0.1] rounded px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-emerald-500/80 font-mono transition-colors"
                  >
                    <option value="Enterprise B2B SaaS">Enterprise B2B SaaS</option>
                    <option value="Fintech & Payment Infrastructure">Fintech & Payment Infrastructure</option>
                    <option value="Cloud Security & DevSecOps">Cloud Security & DevSecOps</option>
                    <option value="Healthcare & BioTech Tech">Healthcare & BioTech Tech</option>
                    <option value="Consumer Tech & Hardware">Consumer Tech & Hardware</option>
                  </select>
                </div>

                {/* Field 4: Key Competitor Domain */}
                <div>
                  <label className="block text-[11px] font-tech-mono uppercase tracking-widest text-slate-400 mb-2 font-medium">
                    KEY COMPETITOR DOMAIN
                  </label>
                  <input
                    type="text"
                    value={formData.competitorDomain}
                    onChange={(e) => setFormData({ ...formData, competitorDomain: e.target.value })}
                    placeholder="primarycompetitor.com"
                    className="w-full bg-[#05070c] border border-white/[0.1] rounded px-4 py-3 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80 font-mono transition-colors"
                  />
                </div>

              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded text-xs font-tech-mono font-bold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-[0_0_25px_-3px_rgba(16,185,129,0.5)] hover:shadow-[0_0_35px_0_rgba(16,185,129,0.7)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>INITIALIZING MONTE CARLO INGESTION SWEEP...</span>
                    </>
                  ) : (
                    <span>Generate Comprehensive Enterprise Audit</span>
                  )}
                </button>
              </div>

              {/* Security & Confidentiality Tagline */}
              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-500 font-light leading-relaxed">
                  Zero link farming. Zero marketing fluff. Pure Monte Carlo inference telemetry compliant with SOC2 Type II confidentiality standards.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </section>
  );
}
