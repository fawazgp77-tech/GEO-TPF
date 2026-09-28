import React, { useState } from 'react';
import { Terminal } from 'lucide-react';

const SYNTHESIZER_PRESETS = [
  {
    id: 'pm',
    tab: 'Project Mgmt',
    prompt: 'Compare the top five enterprise platforms for cross-functional sprint planning, resource velocity, and SOC2 compliance.',
    geoScore: '78/100',
    accuracy: '94.2% Grounded',
    coords: '0.812 · -0.419 · 0.12',
    entities: [
      { rank: '01', name: 'Linear', confidence: '99.1%', tag: 'Benchmark Leader', isTarget: false },
      { rank: '02', name: 'Jira Enterprise', confidence: '97.4%', tag: 'Legacy Anchor', isTarget: false },
      { rank: '03', name: 'YOUR BRAND [ACME]', confidence: '94.2%', tag: 'ACTIVE TARGET // SURFACED', isTarget: true },
      { rank: '04', name: 'Asana Workspace', confidence: '89.0%', tag: 'Secondary Citation', isTarget: false },
      { rank: '05', name: 'Monday.com', confidence: '85.3%', tag: 'Alternative Mention', isTarget: false },
    ]
  },
  {
    id: 'crm',
    tab: 'Enterprise CRM',
    prompt: 'Synthesize the leading high-velocity enterprise sales hubs capable of real-time multi-currency attribution and custom LLM co-pilot integration.',
    geoScore: '84/100',
    accuracy: '96.8% Grounded',
    coords: '0.941 · -0.218 · 0.05',
    entities: [
      { rank: '01', name: 'Salesforce Core', confidence: '98.7%', tag: 'Dominant Entity', isTarget: false },
      { rank: '02', name: 'HubSpot Enterprise', confidence: '96.2%', tag: 'Benchmark Alternate', isTarget: false },
      { rank: '03', name: 'YOUR BRAND [ACME]', confidence: '93.5%', tag: 'ACTIVE TARGET // SURFACED', isTarget: true },
      { rank: '04', name: 'Attio Cloud', confidence: '88.1%', tag: 'Challenger Vector', isTarget: false },
      { rank: '05', name: 'Microsoft Dynamics', confidence: '84.6%', tag: 'Legacy Enterprise', isTarget: false },
    ]
  },
  {
    id: 'sec',
    tab: 'Cloud Security',
    prompt: 'Benchmark the top automated CSPM and continuous compliance verification architectures for multi-cloud Kubernetes clusters.',
    geoScore: '89/100',
    accuracy: '98.1% Grounded',
    coords: '0.763 · -0.584 · 0.29',
    entities: [
      { rank: '01', name: 'Wiz Enterprise', confidence: '99.4%', tag: 'Benchmark Leader', isTarget: false },
      { rank: '02', name: 'YOUR BRAND [ACME]', confidence: '95.8%', tag: 'ACTIVE TARGET // SURFACED', isTarget: true },
      { rank: '03', name: 'Orca Security', confidence: '93.1%', tag: 'Co-Occurrence Vector', isTarget: false },
      { rank: '04', name: 'Palo Alto Prisma', confidence: '90.4%', tag: 'Legacy Authority', isTarget: false },
      { rank: '05', name: 'Lacework Cloud', confidence: '83.9%', tag: 'Secondary Mention', isTarget: false },
    ]
  }
];

export default function Hero({ onOpenAudit }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const [brandName] = useState('YOUR BRAND [ACME]');
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const currentPreset = SYNTHESIZER_PRESETS[activeTabIdx];

  const handleTabChange = (idx) => {
    if (idx === activeTabIdx) return;
    setIsSynthesizing(true);
    setActiveTabIdx(idx);
    setTimeout(() => {
      setIsSynthesizing(false);
    }, 450);
  };

  return (
    <section className="relative pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] overflow-hidden bg-grid-pattern">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-emerald-500/[0.07] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[450px] h-[350px] bg-cyan-500/[0.05] rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* ================= LEFT COLUMN ================= */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div>
              {/* Main Headline */}
              <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-[58px] leading-[1.08] tracking-tight text-white font-normal mb-4">
                Your Brand.
                <span className="block text-slate-100 font-light mt-1">Through AI's Eyes.</span>
              </h1>

              {/* Paragraph */}
              <p className="text-slate-400 text-sm sm:text-base font-light leading-relaxed max-w-lg mb-7">
                See how your enterprise surfaces, ranks, and synthesizes across LLM retrieval layers. Authoritative intelligence engineered for the post-keyword paradigm.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenAudit}
                  className="px-6 py-2.5 rounded text-xs font-tech-mono font-semibold text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-[0_0_25px_-3px_rgba(16,185,129,0.5)] hover:shadow-[0_0_30px_0_rgba(16,185,129,0.7)] hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer"
                >
                  Get Started
                </button>

                <a
                  href="#forensic-extraction"
                  className="px-5 py-2.5 rounded text-xs font-tech-mono text-slate-300 hover:text-white bg-[#0e121a]/80 hover:bg-[#151c28] border border-white/10 hover:border-white/20 transition-all duration-200 flex items-center gap-2 group"
                >
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>See How It Works</span>
                </a>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: Interactive Synthesizer ================= */}
          <div className="lg:col-span-6 lg:-mt-2">
            <div className="rounded-lg bg-[#080b12] border border-white/[0.12] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85)] relative overflow-hidden backdrop-blur-sm max-w-xl mx-auto lg:max-w-none">
              
              {/* Card Header: Title + Live Status */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 border-b border-white/[0.08] bg-[#0c101a]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
                  <span className="font-tech-mono text-[11px] tracking-wider text-slate-200 uppercase font-semibold">
                    PROMPT_VECTOR_SYNTHESIZER // LIVE STREAM
                  </span>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-1 bg-[#06080e] p-0.5 rounded border border-white/[0.06]">
                  {SYNTHESIZER_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.id}
                      onClick={() => handleTabChange(idx)}
                      className={`px-2 py-0.5 rounded text-[10px] font-tech-mono transition-all cursor-pointer ${
                        activeTabIdx === idx
                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                    >
                      {preset.tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Synthetic Prompt Container */}
              <div className="px-4 py-2.5 border-b border-white/[0.08] bg-[#090d16]">
                <div className="flex items-center justify-between text-[9px] font-tech-mono uppercase text-slate-500 mb-1.5">
                  <span className="tracking-widest">EVALUATED SYNTHETIC PROMPT</span>
                  <span className="text-emerald-400/80">LATENT TEMPERATURE: 0.27</span>
                </div>
                <div className="bg-[#05070c] border border-white/[0.06] rounded px-3 py-2 text-[11px] sm:text-xs text-slate-300 font-mono leading-relaxed relative">
                  <span className="text-emerald-400 font-bold mr-1.5">&gt;</span>
                  {currentPreset.prompt}
                </div>
              </div>

              {/* Entity Ranking Stream */}
              <div className={`p-3 sm:px-4 sm:py-2.5 space-y-1.5 transition-opacity duration-300 ${isSynthesizing ? 'opacity-40' : 'opacity-100'}`}>
                {currentPreset.entities.map((item) => {
                  const displayName = item.isTarget ? brandName : item.name;

                  if (item.isTarget) {
                    return (
                      <div
                        key={item.rank}
                        className="rounded bg-gradient-to-r from-emerald-950/40 via-emerald-900/20 to-[#0c121e] border border-emerald-500/60 py-1.5 px-2.5 sm:py-2 sm:px-3 flex items-center justify-between gap-3 shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)] relative group"
                      >
                        {/* Glowing left line */}
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-l" />

                        <div className="flex items-center gap-2.5 pl-1">
                          <span className="text-xs font-tech-mono font-bold text-emerald-400">
                            {item.rank}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-[13px] font-semibold text-white tracking-wide">
                                {displayName}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-500/50 text-[8px] font-tech-mono font-bold text-emerald-300">
                                YOU SYNCHRONIZED
                              </span>
                            </div>
                            <div className="text-[9px] font-tech-mono text-emerald-400/90 tracking-wider">
                              {item.tag}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs sm:text-sm font-tech-mono font-bold text-emerald-400">
                            {item.confidence}
                          </div>
                          <div className="text-[9px] font-tech-mono text-slate-400">
                            Confidence
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={item.rank}
                      className="rounded bg-[#0a0d15]/80 border border-white/[0.06] py-1.5 px-2.5 sm:py-2 sm:px-3 flex items-center justify-between gap-3 hover:border-white/15 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xs font-tech-mono text-slate-500 font-bold">
                          {item.rank}
                        </span>
                        <div>
                          <div className="text-xs sm:text-[13px] font-medium text-slate-200">
                            {displayName}
                          </div>
                          <div className="text-[9px] font-tech-mono text-slate-500">
                            {item.tag} Confidence
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs sm:text-sm font-tech-mono font-medium text-slate-300">
                          {item.confidence}
                        </div>
                        <div className="text-[9px] font-tech-mono text-slate-500">
                          Confidence
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Telemetry Strip */}
              <div className="grid grid-cols-3 divide-x divide-white/[0.08] border-t border-white/[0.08] bg-[#06080d] py-2 px-3 text-center">
                <div>
                  <div className="text-[8px] font-tech-mono uppercase text-slate-500 tracking-wider">
                    GEO SCORE
                  </div>
                  <div className="text-[11px] font-tech-mono font-bold text-emerald-400 mt-0.5">
                    {currentPreset.geoScore}
                  </div>
                </div>
                <div>
                  <div className="text-[8px] font-tech-mono uppercase text-slate-500 tracking-wider">
                    DATA ACCURACY
                  </div>
                  <div className="text-[11px] font-tech-mono font-bold text-slate-200 mt-0.5">
                    {currentPreset.accuracy}
                  </div>
                </div>
                <div>
                  <div className="text-[8px] font-tech-mono uppercase text-slate-500 tracking-wider">
                    LATENT COORD
                  </div>
                  <div className="text-[11px] font-tech-mono text-slate-400 mt-0.5 truncate px-1">
                    {currentPreset.coords}
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
