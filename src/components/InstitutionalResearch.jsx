import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function InstitutionalResearch() {
  return (
    <section id="institutional-research" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Identifier */}
        <div className="text-xs font-tech-mono text-emerald-400 tracking-wider mb-4 uppercase">
          04 // INSTITUTIONAL RESEARCH
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading, Bio, and 2 Stats */}
          <div className="lg:col-span-6 space-y-8">
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-[1.08]">
              Engineered at the
              <span className="block">Intersection of Natural</span>
              <span className="block text-slate-200">Language & Retrieval</span>
              <span className="block text-slate-300">Systems</span>
            </h2>

            <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
              GEO Lab was established by information retrieval specialists and enterprise search practitioners. As search morphs from deterministic indexes into generative answer synthesis, our mission is to provide organizations with clarity over their presence across AI responses.
            </p>

            {/* Two Stats in a Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-white/[0.08]">
              <div>
                <div className="font-tech-mono text-2xl sm:text-3xl font-bold text-white tracking-tight mb-1">
                  3 Regional Clusters
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Telemetry hubs running across US East, EU Central, and AP East.
                </p>
              </div>

              <div>
                <div className="font-tech-mono text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight mb-1">
                  &lt;400ms Pipeline
                </div>
                <p className="text-xs text-slate-400 font-light leading-relaxed">
                  Automated prompt dispatch and response text attribution analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Node Network Quote Box */}
          <div className="lg:col-span-6">
            <div className="rounded-lg bg-[#080b12]/95 border border-white/[0.12] p-8 shadow-2xl relative overflow-hidden backdrop-blur">
              
              {/* Subtle ambient gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-center gap-2 pb-6 border-b border-white/[0.08] mb-6">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                <span className="text-[11px] font-tech-mono uppercase tracking-widest text-slate-300 font-medium">
                  TELEMETRY NODE NETWORK: STATUS 100% OPERATIONAL
                </span>
              </div>

              {/* Quote */}
              <blockquote className="font-serif-display text-xl sm:text-2xl text-slate-100 font-normal leading-relaxed italic mb-8">
                "Modern generative engines synthesize responses based on clear, authoritative public information. We make your brand's presence and accuracy measurable and actionable."
              </blockquote>

              {/* Author & Protocol Info */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
                <div>
                  <div className="text-sm font-semibold text-white tracking-wide">
                    Dr. Aris Thorne
                  </div>
                  <div className="text-xs font-tech-mono text-slate-400">
                    Lead Ingestion Architect <span className="text-slate-600">|</span> ex-IR Researcher
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-tech-mono text-emerald-300 font-semibold tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VERIFIED PROTOCOL</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
