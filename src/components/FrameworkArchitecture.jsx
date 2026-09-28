import React from 'react';

export default function FrameworkArchitecture() {
  return (
    <section id="framework-architecture" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Identifier */}
        <div className="text-xs font-tech-mono text-emerald-400 tracking-wider mb-4 uppercase">
          02 // FRAMEWORK ARCHITECTURE
        </div>

        {/* Heading */}
        <div className="max-w-3xl mb-14">
          <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight mb-4">
            The Five Dimensions of Brand Generative Equity
          </h2>
          <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed">
            Each dimension measures a critical vector of generative intelligence visibility, synthesized into actionable enterprise benchmarks.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="space-y-6">
          
          {/* Row 1: Dimensions 01 and 02 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Dimension 01 */}
            <div className="rounded-lg bg-[#080b12]/90 border border-white/[0.08] p-7 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between text-[10px] font-tech-mono uppercase tracking-widest text-slate-500 mb-3">
                  <span>DIMENSION 01 // VISIBILITY</span>
                  <span className="text-emerald-400/90 font-medium">RANK_POSITION</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">
                  AI Synthesis Ranking
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Where does your brand consistently surface in LLM zero-click recommendation lists across diverse prompt temperatures?
                </p>
              </div>

              {/* Visual: Bar Chart */}
              <div className="bg-[#05070c] border border-white/[0.06] rounded p-4 pt-3">
                <div className="flex items-center justify-between text-[10px] font-tech-mono text-slate-500 mb-3">
                  <span>FREQUENCY DISTRIBUTION ACROSS 10,000 MONTE CARLO PROMPTS</span>
                  <span className="text-emerald-400">MEDIAN: #2.4</span>
                </div>

                <div className="grid grid-cols-5 gap-2 items-end h-28 pt-2">
                  {/* #1 */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-tech-mono text-slate-400">28%</span>
                    <div className="w-full bg-slate-700/60 rounded-t h-[56%]" />
                    <span className="text-[10px] font-tech-mono text-slate-400">#1</span>
                  </div>
                  {/* #2 (Highest, Green) */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-tech-mono font-bold text-emerald-400">44%</span>
                    <div className="w-full bg-emerald-400 rounded-t h-[88%] shadow-[0_0_12px_rgba(16,185,129,0.3)]" />
                    <span className="text-[10px] font-tech-mono font-bold text-emerald-400">#2</span>
                  </div>
                  {/* #3 */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-tech-mono text-slate-400">16%</span>
                    <div className="w-full bg-slate-700/60 rounded-t h-[32%]" />
                    <span className="text-[10px] font-tech-mono text-slate-400">#3</span>
                  </div>
                  {/* #4 */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-tech-mono text-slate-400">7%</span>
                    <div className="w-full bg-slate-700/60 rounded-t h-[14%]" />
                    <span className="text-[10px] font-tech-mono text-slate-400">#4</span>
                  </div>
                  {/* N/A */}
                  <div className="flex flex-col items-center gap-1.5 h-full justify-end">
                    <span className="text-[10px] font-tech-mono text-slate-500">5%</span>
                    <div className="w-full bg-slate-800 rounded-t h-[10%]" />
                    <span className="text-[10px] font-tech-mono text-slate-500">N/A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimension 02 */}
            <div className="rounded-lg bg-[#080b12]/90 border border-white/[0.08] p-7 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between text-[10px] font-tech-mono uppercase tracking-widest text-slate-500 mb-3">
                  <span>DIMENSION 02 // CONTEXT</span>
                  <span className="text-emerald-400/90 font-medium">CO-OCCURRENCE</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-medium text-white mb-2">
                  Competitor Co-Occurrence
                </h3>

                <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed mb-6">
                  Who appears alongside your solution, and how frequently do LLMs recommend competitors as superior alternatives?
                </p>
              </div>

              {/* Visual: Progress Bars */}
              <div className="bg-[#05070c] border border-white/[0.06] rounded p-4 space-y-4">
                {/* Your Brand */}
                <div>
                  <div className="flex items-center justify-between text-xs font-tech-mono mb-1.5">
                    <span className="text-white font-medium">Your Brand Visibility</span>
                    <span className="text-emerald-400 font-bold">89.4% Inclusion</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded shadow-[0_0_10px_#10b981]" style={{ width: '89.4%' }} />
                  </div>
                </div>

                {/* Peer Alpha */}
                <div>
                  <div className="flex items-center justify-between text-xs font-tech-mono mb-1.5">
                    <span className="text-slate-400">Peer Alpha (Legacy Corp)</span>
                    <span className="text-slate-300">68.1% Inclusion</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-slate-500 rounded" style={{ width: '68.1%' }} />
                  </div>
                </div>

                {/* Peer Beta */}
                <div>
                  <div className="flex items-center justify-between text-xs font-tech-mono mb-1.5">
                    <span className="text-slate-400">Peer Beta (Venture Backed)</span>
                    <span className="text-slate-300">51.3% Inclusion</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-slate-600 rounded" style={{ width: '51.3%' }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Row 2: Dimensions 03, 04, and 05 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Dimension 03 */}
            <div className="rounded-lg bg-[#080b12]/90 border border-white/[0.08] p-6 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between text-[10px] font-tech-mono uppercase tracking-widest text-slate-500 mb-3">
                  <span>DIMENSION 03 // AGGREGATE INDEX</span>
                  <span className="text-emerald-400/90 font-medium">0 - 100</span>
                </div>

                <h3 className="text-lg font-medium text-white mb-2">
                  Normalized GEO Score
                </h3>

                <p className="text-slate-400 text-xs font-light leading-relaxed mb-6">
                  Cross-model composite index evaluating prominence, authority citations, and zero-shot entity presence.
                </p>
              </div>

              {/* Big Number & Stats */}
              <div className="bg-[#05070c] border border-white/[0.06] rounded p-4 flex items-center justify-between">
                <div>
                  <div className="font-tech-mono text-5xl font-bold text-emerald-400 tracking-tight leading-none mb-1">
                    84
                  </div>
                  <div className="text-[10px] font-tech-mono text-slate-500 tracking-wider uppercase">
                    YOUR INDEX
                  </div>
                </div>

                <div className="text-right space-y-1 font-tech-mono text-[11px] border-l border-white/[0.08] pl-4">
                  <div className="text-slate-400">
                    SECTOR MEDIAN: <span className="text-slate-200">54.2</span>
                  </div>
                  <div className="text-slate-400">
                    TOP QUARTILE: <span className="text-slate-200">82.0</span>
                  </div>
                  <div className="text-slate-400">
                    PERCENTILE: <span className="text-emerald-400 font-bold">91st</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dimension 04 */}
            <div className="rounded-lg bg-[#080b12]/90 border border-white/[0.08] p-6 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between text-[10px] font-tech-mono uppercase tracking-widest text-slate-500 mb-3">
                  <span>DIMENSION 04 // FIDELITY</span>
                  <span className="text-emerald-400/90 font-medium">HALLUCINATION DETECTOR</span>
                </div>

                <h3 className="text-lg font-medium text-white mb-2">
                  Fact Grounding & Drift
                </h3>

                <p className="text-slate-400 text-xs font-light leading-relaxed mb-6">
                  Verifying whether generative models quote current feature specs, verified pricing, and certified security compliance without hallucinations.
                </p>
              </div>

              {/* Grounding Stats */}
              <div className="bg-[#05070c] border border-white/[0.06] rounded p-4 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs font-tech-mono mb-1">
                    <span className="text-slate-300">Verified Sources</span>
                    <span className="text-emerald-400 font-bold">96.8%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded" style={{ width: '96.8%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-tech-mono mb-1">
                    <span className="text-slate-400">Hallucination Drift Rate</span>
                    <span className="text-amber-400 font-medium">3.2%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded overflow-hidden">
                    <div className="h-full bg-amber-400 rounded" style={{ width: '3.2%' }} />
                  </div>
                </div>

                <div className="pt-2 border-t border-white/[0.06] text-[10px] font-tech-mono text-slate-500 text-center tracking-wider">
                  AUDITED: 24,000 FACTUAL STATEMENTS
                </div>
              </div>
            </div>

            {/* Dimension 05 */}
            <div className="rounded-lg bg-[#080b12]/90 border border-white/[0.08] p-6 flex flex-col justify-between hover:border-white/15 transition-all">
              <div>
                <div className="flex items-center justify-between text-[10px] font-tech-mono uppercase tracking-widest text-slate-500 mb-3">
                  <span>DIMENSION 05 // REMEDIATION</span>
                  <span className="text-emerald-400/90 font-medium">SCHEMA INJECTION</span>
                </div>

                <h3 className="text-lg font-medium text-white mb-2">
                  Algorithmic Remediation
                </h3>

                <p className="text-slate-400 text-xs font-light leading-relaxed mb-6">
                  Targeted code and document structural blueprints engineered to force immediate re-alignment in future model pre-training & retrieval sweeps.
                </p>
              </div>

              {/* Code Snippet Box */}
              <div className="bg-[#05070c] border border-white/[0.06] rounded p-3 font-mono text-[11px] leading-relaxed overflow-x-auto">
                <div className="text-slate-500 mb-1">// RECOMMENDATION_PATCH.JSON</div>
                <div className="text-emerald-400">+ schema: "SoftwareApplication"</div>
                <div className="text-emerald-400">+ embedding_anchor: "SOC2 Type II"</div>
                <div className="text-emerald-400">+ disambiguation: "NOT_AN_ADDON"</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
