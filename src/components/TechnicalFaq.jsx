import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ_DATA = [
  {
    question: "What is GEO (Generative Engine Optimization)?",
    answer: "Generative Engine Optimization (GEO) is the forensic and engineering discipline of auditing, shaping, and validating how generative answer models (OpenAI ChatGPT, GPT-4o, SearchGPT) retrieve, weigh, and synthesize your enterprise within zero-click answer generations. Unlike classical SEO—which optimized for crawler-based indexing and backlink graphs—GEO operates at the latent token representation layer, optimizing for entity co-occurrence, semantic anchor density, and knowledge graph grounding."
  },
  {
    question: "How does GEO measure my brand's visibility across LLMs?",
    answer: "GEO executes high-throughput Monte Carlo prompt simulations across millions of localized, multi-turn permutations. We probe model layers for entity inclusion rates, citation fidelity, relative positional confidence (rank order in recommendation matrices), and prompt-sensitivity thresholds across temperature variations ranging from 0.0 to 1.0."
  },
  {
    question: "What is the GEO Score and how is it calculated?",
    answer: "The GEO Score (0–100) is a normalized, cross-model composite index evaluating three primary dimensions: Prominence (frequency and positional rank in answer listings), Authority Grounding (verified linkage to primary canonical sources and zero hallucination drift), and Entity Co-Occurrence (favorable adjacency against primary category benchmarks)."
  },
  {
    question: "Can we influence how generative engines describe our product?",
    answer: "Yes. Generative engines construct consensus models based on information gravity, schema structure, and token adjacencies found across training corpora and real-time retrieval sweeps. By deploying our Algorithmic Remediation schemas (structural JSON-LD disambiguation, vector-aligned technical specifications, and canonical semantic anchors), enterprises force immediate re-alignment in retrieval-augmented generation (RAG) pipelines."
  },
  {
    question: "How does competitor analysis function in generative contexts?",
    answer: "We map the exact embedding graph topology showing which alternative entities frontier models associate with your trademark. This reveals 'Deflection Vectors'—scenarios where an AI model acknowledges your product but deflects to a competitor due to perceived limitations, missing compliance badges, or outdated benchmark citations."
  },
  {
    question: "What about hallucination and outdated pricing data?",
    answer: "GEO’s Fact Grounding & Drift engine audits model outputs against your verified corporate knowledge base to detect hallucinations (e.g., deprecated pricing tiers, invented limitations, or missing SOC2 certifications). When drift is detected, GEO isolates the corrupted source node in the public corpus and issues targeted programmatic remediation blueprints."
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
          05 // TECHNICAL FAQ
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
