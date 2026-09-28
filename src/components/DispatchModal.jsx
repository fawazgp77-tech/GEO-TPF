import React from 'react';
import { X, Download, FileText } from 'lucide-react';

export default function DispatchModal({ dispatchId, onClose }) {
  if (!dispatchId) return null;

  const isCase84 = dispatchId === 'SPEC-CASE-084';
  const isCase91 = dispatchId === 'SPEC-CASE-091';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#080b13] border border-white/[0.15] rounded-lg max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Paper Header */}
        <div className="flex items-center gap-2 text-[10px] font-tech-mono text-emerald-400 tracking-wider mb-2 uppercase">
          <FileText className="w-3.5 h-3.5" />
          <span>INSTITUTIONAL RESEARCH DISPATCH ARCHIVE</span>
        </div>

        {isCase84 && (
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-tech-mono text-slate-500 mb-1">
                SPEC-CASE-084 // PEER-REVIEWED FORENSIC AUDIT
              </div>
              <h3 className="font-serif-display text-2xl sm:text-3xl text-white font-normal leading-snug">
                Fintech Enterprise Index: The Cross-LLM Payment Gateway Matrix
              </h3>
            </div>

            <div className="bg-[#05070c] border border-white/[0.08] p-4 rounded text-xs font-mono space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-white/[0.06] pb-2 text-[11px] text-slate-400">
                <span>SAMPLE POOL: 240,000 QUERIES</span>
                <span>OCTOBER 2024</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                <strong className="text-white">Abstract:</strong> A 90-day multi-turn diagnostic evaluating tier-1 payment processor entity presence across OpenAI ChatGPT & SearchGPT response environments. We observed that 34% of zero-shot commercial queries surfaced hallucinated merchant fee structures due to ungrounded aggregator blog indexing.
              </p>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                <strong className="text-white">Intervention:</strong> Deployment of a canonical vector schema anchor containing cryptographically verifiable fee schedules and SOC2 Type II compliance credentials.
              </p>
              <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono text-[11px]">
                RESULT: Hallucination rate reduced to 0.0% across 50,000 validation runs. GEO visibility increased by +38pt (from 44/100 to 82/100), placing the client at #1 recommendation rank.
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div className="text-[11px] font-tech-mono text-slate-500">
                PDF FILE SIZE: 3.4 MB // ECDSA SIGNED
              </div>
              <button
                onClick={() => alert('Downloading official research dispatch: SPEC-CASE-084.pdf')}
                className="px-4 py-2 rounded bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-tech-mono font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Complete Whitepaper</span>
              </button>
            </div>
          </div>
        )}

        {isCase91 && (
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-tech-mono text-red-400 mb-1">
                SPEC-CASE-091 // RETRIEVAL SHIFT INVESTIGATION
              </div>
              <h3 className="font-serif-display text-2xl sm:text-3xl text-white font-normal leading-snug">
                B2B Workspace Benchmark: Generative Disruption Following Model Weights Update
              </h3>
            </div>

            <div className="bg-[#05070c] border border-white/[0.08] p-4 rounded text-xs font-mono space-y-2 text-slate-300">
              <div className="flex justify-between border-b border-white/[0.06] pb-2 text-[11px] text-slate-400">
                <span>SAMPLE POOL: 510,000 SIMULATIONS</span>
                <span>NOVEMBER 2024</span>
              </div>
              <p className="text-slate-300 leading-relaxed font-sans text-xs">
                <strong className="text-white">Abstract:</strong> Analysis of the sudden drop in citation velocity for legacy enterprise workspace software after major foundation model updates. The subject enterprise experienced an overnight 42% decrease in zero-shot AI citations as new reasoning models favored modular documentation schemas.
              </p>
              <div className="p-2.5 rounded bg-red-950/40 border border-red-500/30 text-red-300 font-mono text-[11px]">
                COLLAPSE VECTOR: LLMs substituted the primary legacy brand with modern venture-backed competitors due to token compression in legacy API documentation.
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <div className="text-[11px] font-tech-mono text-slate-500">
                PDF FILE SIZE: 4.1 MB // ECDSA SIGNED
              </div>
              <button
                onClick={() => alert('Downloading official research dispatch: SPEC-CASE-091.pdf')}
                className="px-4 py-2 rounded bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-tech-mono font-bold transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Complete Whitepaper</span>
              </button>
            </div>
          </div>
        )}

        {!isCase84 && !isCase91 && (
          <div className="space-y-4">
            <h3 className="font-serif-display text-2xl text-white">
              Institutional Research Library
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Access the complete repository of 48 empirical research papers examining LLM corpus ingestion, retrieval degradation, and generative consensus dynamics.
            </p>
            <div className="space-y-2 pt-2">
              <div className="p-3 bg-[#05070c] border border-white/[0.06] rounded flex items-center justify-between text-xs font-tech-mono">
                <span className="text-slate-200">SPEC-CASE-084: Fintech Enterprise Index</span>
                <span className="text-emerald-400">3.4 MB</span>
              </div>
              <div className="p-3 bg-[#05070c] border border-white/[0.06] rounded flex items-center justify-between text-xs font-tech-mono">
                <span className="text-slate-200">SPEC-CASE-091: B2B Workspace Benchmark</span>
                <span className="text-red-400">4.1 MB</span>
              </div>
              <div className="p-3 bg-[#05070c] border border-white/[0.06] rounded flex items-center justify-between text-xs font-tech-mono">
                <span className="text-slate-200">SPEC-CASE-076: Cross-Entropy Entity Adjacencies</span>
                <span className="text-slate-400">2.8 MB</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
