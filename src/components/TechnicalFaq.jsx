import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    question: "What is GEO (Generative Engine Optimization)?",
    answer: "Generative Engine Optimization (GEO) is the forensic and engineering discipline of auditing, shaping, and validating how OpenAI ChatGPT retrieves, weighs, and synthesizes your enterprise within zero-click conversational answer generations. Unlike classical SEO—which optimized for crawler-based indexing and backlink graphs—GEO analyzes generated text outputs across thousands of prompt variations, optimizing for brand mention frequency, citation authority, structured data schemas, and factual accuracy."
  },
  {
    question: "How does GEO measure my brand's visibility in ChatGPT?",
    answer: "GEO executes high-throughput Monte Carlo prompt simulations across extensive conversational permutations. We analyze ChatGPT response outputs for entity inclusion rates, citation provenance, relative positional ranking in recommendation lists, and prompt-sensitivity variations."
  },
  {
    question: "What is the GEO Score and how is it calculated?",
    answer: "The GEO Score (0–100) is a composite index evaluating ChatGPT answer performance across three primary dimensions: Prominence (frequency and positional rank in answer listings), Authority Grounding (verified linkage to primary canonical sources and absence of hallucination drift), and Entity Co-Occurrence (favorable positioning against primary category benchmarks)."
  },
  {
    question: "Can we influence how generative engines describe our product?",
    answer: "Yes. Generative engines synthesize responses based on authoritative web sources, clear schema structure, and unambiguous public documentation. By deploying our Algorithmic Remediation schemas (structural JSON-LD disambiguation, verified canonical documentation, and comprehensive feature specification anchors), enterprises significantly improve answer accuracy and citation inclusion in ChatGPT responses."
  },
  {
    question: "How does competitor analysis function in generative contexts?",
    answer: "We map the comparative prompt patterns showing which alternative solutions ChatGPT associates with your brand and category. This reveals 'Deflection Scenarios'—queries where ChatGPT mentions your product but recommends a competitor due to perceived capability gaps, outdated pricing citations, or ungrounded competitor claims."
  },
  {
    question: "What about hallucination and outdated pricing data?",
    answer: "GEO's Fact Grounding engine audits ChatGPT outputs against your verified corporate knowledge base to detect hallucinations (e.g., deprecated pricing tiers, invented limitations, or outdated feature specifications). When discrepancies are detected, GEO isolates the inaccurate source citation in the public domain and issues targeted remediation blueprints."
  }
];

export default function TechnicalFaq({ onOpenBriefing }) {
  const [openIdx, setOpenIdx] = useState(0);

  const toggleAccordion = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <section id="technical-faq" className="py-24 px-4 sm:px-6 lg:px-8 border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Identifier */}
        <div className="text-xs font-tech-mono text-emerald-400 tracking-wider mb-4 uppercase">
          04 // TECHNICAL FAQ
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Heading & Briefing Card */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl text-white font-normal tracking-tight leading-[1.08]">
              Frequently Asked
              <span className="block text-slate-200">Questions</span>
            </h2>

            <p className="text-slate-400 text-base font-light leading-relaxed">
              Everything you need to know about the science, data integrity, and strategic utility of Generative Engine Optimization.
            </p>

            {/* Briefing CTA Card */}
            <div className="rounded-lg bg-[#080b12]/90 border border-white/[0.08] p-6 mt-8 space-y-4">
              <h4 className="text-sm font-medium text-white">
                Need a custom technical brief?
              </h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Our engineering team conducts private briefings for enterprise CMOs, CTOs, and Search Architecture teams.
              </p>
              <div>
                <button
                  onClick={onOpenBriefing}
                  className="inline-flex items-center gap-2 text-xs font-tech-mono text-emerald-400 hover:text-emerald-300 font-medium transition-colors group"
                >
                  <span>Schedule Architecture Briefing</span>
                  <span className="text-sm transition-transform group-hover:translate-x-1">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Accordion List */}
          <div className="lg:col-span-7 divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {FAQ_DATA.map((item, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="py-5 transition-colors">
                  <button
                    onClick={() => toggleAccordion(idx)}
                    className="w-full text-left flex items-center justify-between gap-4 group focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-medium text-slate-200 group-hover:text-emerald-300 transition-colors">
                      {item.question}
                    </span>
                    <span className="text-slate-400 group-hover:text-emerald-400 transition-colors flex-shrink-0">
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-3 pr-6 animate-in fade-in duration-200">
                      <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
