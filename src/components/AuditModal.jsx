import React, { useState } from 'react';
import { X, Activity } from 'lucide-react';

export default function AuditModal({ isOpen, onClose }) {
  const [step, setStep] = useState('input'); // 'input', 'scanning', 'result'
  const [brand, setBrand] = useState('');
  const [domain, setDomain] = useState('');
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanStep, setCurrentScanStep] = useState('Connecting to LLM clusters...');

  if (!isOpen) return null;

  const handleStartAudit = (e) => {
    e.preventDefault();
    if (!brand.trim()) return;

    setStep('scanning');
    setScanProgress(15);
    setCurrentScanStep('Querying OpenAI ChatGPT & SearchGPT response clusters...');

    setTimeout(() => {
      setScanProgress(45);
      setCurrentScanStep('Reverse-tracing citation graph & documentation nodes...');
    }, 800);

    setTimeout(() => {
      setScanProgress(80);
      setCurrentScanStep('Calculating sentiment deflection & positioning frequency...');
    }, 1600);

    setTimeout(() => {
      setScanProgress(100);
      setStep('result');
    }, 2400);
  };

  const handleReset = () => {
    setStep('input');
    setScanProgress(0);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#080b13] border border-emerald-500/30 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_50px_-10px_rgba(16,185,129,0.2)] relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 'input' && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-tech-mono uppercase tracking-widest text-emerald-400">
                Custom Assessment Setup
              </span>
            </div>

            <h3 className="font-serif-display text-2xl sm:text-3xl text-white font-normal mb-2">
              Schedule Custom Brand Audit
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light mb-6">
              Enter your brand details to initiate real-time probing across OpenAI ChatGPT & SearchGPT response environments.
            </p>

            <form onSubmit={handleStartAudit} className="space-y-4">
              <div>
                <label className="block text-xs font-tech-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Brand / Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Supabase, Linear, Datadog"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full bg-[#030408] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-tech-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-tech-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Primary Domain
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://yourcompany.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full bg-[#030408] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-tech-mono"
                />
              </div>

              <div className="pt-2">
                <label className="block text-xs font-tech-mono text-slate-400 uppercase tracking-wider mb-2">
                  Monitored OpenAI Environments (All Included)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-tech-mono text-slate-300">
                  {['ChatGPT Search', 'GPT-4o Standard', 'ChatGPT Enterprise', 'GPT-4o Mini'].map((engine) => (
                    <div
                      key={engine}
                      className="px-2.5 py-1.5 rounded bg-white/[0.03] border border-white/[0.06] text-center text-emerald-300"
                    >
                      ✓ {engine}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_20px_0_rgba(16,185,129,0.4)]"
                >
                  Generate Preliminary Audit →
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 'scanning' && (
          <div className="py-8 text-center space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <Activity className="w-8 h-8 text-emerald-400 animate-pulse" />
            </div>

            <div>
              <h4 className="text-lg font-medium text-white mb-2">
                Analyzing Generative Visibility for "{brand}"
              </h4>
              <p className="text-xs font-tech-mono text-emerald-400 tracking-wider">
                {currentScanStep}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/[0.05] h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full transition-all duration-500 ease-out"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="text-[11px] font-tech-mono text-slate-500">
              SYNTHESIS PIPELINE: {scanProgress}% COMPLETE
            </div>
          </div>
        )}

        {step === 'result' && (
          <div>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] font-tech-mono text-emerald-400 uppercase tracking-widest block">
                  AUDIT RESULT READY
                </span>
                <h3 className="font-serif-display text-2xl text-white">
                  Generative Profile: {brand}
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-tech-mono text-slate-500 uppercase block">
                  GEO SCORE
                </span>
                <span className="font-tech-mono text-3xl font-bold text-emerald-400">
                  81.5
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 font-tech-mono text-xs">
              <div className="bg-[#030408] p-3 rounded-lg border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px] uppercase">Positional Standing</span>
                <span className="text-white font-semibold">Top #02 - #04 Average</span>
              </div>
              <div className="bg-[#030408] p-3 rounded-lg border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px] uppercase">Citation Density</span>
                <span className="text-emerald-400 font-semibold">19 High-Trust Repos</span>
              </div>
              <div className="bg-[#030408] p-3 rounded-lg border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px] uppercase">Hallucination Risk</span>
                <span className="text-cyan-400 font-semibold">&lt; 0.4% Drift Detected</span>
              </div>
              <div className="bg-[#030408] p-3 rounded-lg border border-white/[0.06]">
                <span className="text-slate-500 block text-[10px] uppercase">Optimization Gap</span>
                <span className="text-amber-400 font-semibold">4 High-Impact Fixes</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-light mb-6">
              A comprehensive technical teardown with exact schema markups and citation authority graph has been queued for your full brand assessment.
            </p>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-tech-mono text-slate-400 hover:text-white"
              >
                ← Test Another Brand
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-full text-xs font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all shadow-[0_0_20px_0_rgba(16,185,129,0.4)]"
              >
                Receive Full PDF Teardown
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
