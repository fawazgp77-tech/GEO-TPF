import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  MapPin, 
  DollarSign, 
  Server, 
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

export default function AiAccuracyTrustTab() {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [patchModalItem, setPatchModalItem] = useState(null);

  // 03 AI ACCURACY & TRUST - CORE METRICS
  const metrics = [
    {
      id: 'overall-accuracy',
      label: 'Overall Accuracy',
      sublabel: 'Aggregate truth alignment index',
      value: '78.4 / 100',
      delta: '+4.2%',
      positive: true,
      fraction: 'Good Condition',
      badge: 'Certified',
      color: 'text-emerald-400',
    },
    {
      id: 'incorrect-claims',
      label: 'Incorrect Claims',
      sublabel: 'Hallucinations detected in output',
      value: '14 Active',
      delta: '-6 claims',
      positive: true,
      fraction: 'Down from 20',
      badge: 'Remediating',
      color: 'text-amber-400',
    },
    {
      id: 'critical-errors',
      label: 'Critical Errors',
      sublabel: 'Severe high-stakes misstatements',
      value: '3 Flagged',
      delta: '-2 errors',
      positive: true,
      fraction: 'Pricing & SOC2',
      badge: 'High Priority',
      color: 'text-rose-400',
    },
    {
      id: 'address-accuracy',
      label: 'Address Accuracy',
      sublabel: 'Corporate HQ & regional offices',
      value: '98.2%',
      delta: '+0.5%',
      positive: true,
      fraction: '54 of 55 correct',
      badge: 'Verified',
      color: 'text-emerald-400',
    },
    {
      id: 'hours-accuracy',
      label: 'Hours Accuracy',
      sublabel: 'Support SLA & operating schedules',
      value: '94.0%',
      delta: '+1.2%',
      positive: true,
      fraction: '24/7 SLA accurate',
      badge: 'Reliable',
      color: 'text-emerald-400',
    },
    {
      id: 'service-accuracy',
      label: 'Service Accuracy',
      sublabel: 'Feature inventory & capabilities',
      value: '86.5%',
      delta: '+3.4%',
      positive: true,
      fraction: '92 features tracked',
      badge: 'Improving',
      color: 'text-cyan-400',
    },
    {
      id: 'pricing-accuracy',
      label: 'Pricing Accuracy',
      sublabel: 'Active subscription tier alignment',
      value: '71.2%',
      delta: '+8.1%',
      positive: true,
      fraction: 'Outdated legacy tiers',
      badge: 'Action Needed',
      color: 'text-amber-400',
    },
    {
      id: 'response-consistency',
      label: 'Response Consistency',
      sublabel: 'Repeat prompt agreement in ChatGPT',
      value: '88.6%',
      delta: '+4.8%',
      positive: true,
      fraction: 'Monte Carlo repeat runs',
      badge: 'High Consensus',
      color: 'text-emerald-400',
    },
  ];

  // Hallucination Triage Queue
  const claimsQueue = [
    {
      id: 'err-1',
      category: 'Pricing Accuracy',
      severity: 'Critical',
      severityColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      engine: 'GPT-4o Parametric & Cache',
      claim: 'Claims Acme Pro plan is priced at $299/month with max 500 prompts.',
      truth: 'Acme Pro plan was updated to $499/month with 1,000 prompt quota in Q3 2026.',
      impact: 'Distorts buyer price expectations; prompts self-checkout confusion.',
      patchAction: 'JSON-LD PriceSpecification schema injection',
    },
    {
      id: 'err-2',
      category: 'Critical Errors',
      severity: 'Critical',
      severityColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      engine: 'OpenAI ChatGPT',
      claim: 'States that Acme lacks SOC2 Type II security compliance certification.',
      truth: 'Acme has maintained SOC2 Type II certification continuously since 2024.',
      impact: 'Instant blocker for enterprise infosec vendor assessments.',
      patchAction: 'Deploy TrustCenter.json & schema.org/SecurityReview',
    },
    {
      id: 'err-3',
      category: 'Service Accuracy',
      severity: 'High',
      severityColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      engine: 'OpenAI ChatGPT',
      claim: 'States Acme only offers basic keyword tracking without real-time RAG prompt simulation.',
      truth: 'Acme provides full synthetic Monte Carlo sweeps for generative response layers.',
      impact: 'Causes prospects seeking automated GEO monitoring to evaluate competitors.',
      patchAction: 'Publish updated Feature Catalog documentation & FAQ schema',
    },
    {
      id: 'err-4',
      category: 'Hours Accuracy',
      severity: 'Medium',
      severityColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      engine: 'OpenAI ChatGPT',
      claim: 'Claims customer support is limited to Monday-Friday 9am-5pm EST.',
      truth: 'Enterprise plan includes 24/7 dedicated Slack SLA support.',
      impact: 'Minor enterprise procurement hesitation.',
      patchAction: 'ContactPoint schema update',
    },
    {
      id: 'err-5',
      category: 'Address Accuracy',
      severity: 'Low',
      severityColor: 'bg-slate-700/50 text-slate-300 border-slate-600',
      engine: 'OpenAI ChatGPT',
      claim: 'Lists former San Francisco incubator address instead of current HQ.',
      truth: 'Corporate HQ moved to 500 Howard Street, Suite 400, San Francisco.',
      impact: 'Low impact on digital sales; impacts postal verification.',
      patchAction: 'Google Business Profile & Wikidata entity sync',
    },
  ];

  // Ground Truth Fact Verification Data (Tested against OpenAI ChatGPT)
  const consistencyFacts = [
    {
      fact: 'Headquarters Location',
      groundTruth: 'San Francisco, CA (500 Howard St)',
      chatgptOutput: 'San Francisco, California',
      status: 'Verified',
      statusType: 'success',
      grounding: '100% Grounded',
    },
    {
      fact: 'Active Subscription Tiers',
      groundTruth: '$499/mo (Enterprise Tier)',
      chatgptOutput: 'Legacy $299 plan cited in older prompt sessions',
      status: 'Discrepancy',
      statusType: 'error',
      grounding: '50% Divergence',
    },
    {
      fact: 'SOC2 Type II Security Compliance',
      groundTruth: 'Certified SOC2 Type II (Annual Audit)',
      chatgptOutput: 'Ambiguous compliance verification phrasing',
      status: 'Remediation Needed',
      statusType: 'warning',
      grounding: '88% Consistent',
    },
    {
      fact: '24/7 Enterprise Dedicated Support SLA',
      groundTruth: '24/7 Dedicated Support with 15-min SLA',
      chatgptOutput: '24/7 Dedicated Support verified',
      status: 'Verified',
      statusType: 'success',
      grounding: '100% Grounded',
    },
    {
      fact: 'Real-Time Webhook & REST API Telemetry',
      groundTruth: 'Public REST API & Real-Time Webhooks',
      chatgptOutput: 'Full REST API support verified',
      status: 'Verified',
      statusType: 'success',
      grounding: '100% Grounded',
    },
  ];

  const handleResolve = (id) => {
    if (!resolvedIssues.includes(id)) {
      setResolvedIssues([...resolvedIssues, id]);
    }
  };

  const filteredClaims = claimsQueue.filter((c) => {
    if (filterSeverity === 'all') return true;
    return c.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Tab Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#0a0f1d] to-[#07090e] border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-tech-mono text-[10px] uppercase tracking-wider font-bold">
                Ground Truth Verification
              </span>
              <span className="text-xs font-tech-mono text-slate-400">
                Ground Truth Alignment & Hallucination Elimination
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <span>AI ACCURACY & TRUST</span>
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-1 max-w-2xl leading-relaxed">
              Detect, isolate, and remediate incorrect model hallucinations regarding pricing, security compliance, operating hours, and service specs before they mislead buyers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-tech-mono text-slate-400">Status:</span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-xs font-tech-mono text-emerald-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Diagnostic Pass: 78.4%</span>
            </span>
          </div>
        </div>
      </div>

      {/* 8 Core Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {metrics.map((m) => (
          <div 
            key={m.id}
            className="p-4 rounded-xl bg-[#090d16] border border-white/[0.08] hover:border-emerald-500/40 transition-all flex flex-col justify-between group shadow-sm"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-tech-mono text-slate-400 mb-1">
                <span className="truncate">{m.label}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-300 font-mono">
                  {m.badge}
                </span>
              </div>
              <div className={`text-2xl font-bold font-tech-mono mt-1 ${m.color}`}>
                {m.value}
              </div>
              <div className="text-[10px] text-slate-500 font-mono mt-0.5 truncate">
                {m.sublabel}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-tech-mono">
              <span className="text-slate-400 truncate">{m.fraction}</span>
              <span className="text-emerald-400 font-bold flex items-center">
                <ArrowUpRight className="w-3 h-3" />
                {m.delta}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Accuracy Sub-Dimensions Breakdown + Dial */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dial & Health Summary (1 Col) */}
        <div className="p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <div className="text-xs font-tech-mono uppercase tracking-widest text-emerald-400 font-bold pb-2 border-b border-white/[0.06] text-left">
              OVERALL ACCURACY DIAL
            </div>
            
            {/* Visual SVG Circular Dial */}
            <div className="relative w-44 h-44 mx-auto my-6 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#10b981"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * 78.4) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-tech-mono text-white">78.4</span>
                <span className="text-[10px] font-tech-mono text-slate-400 uppercase tracking-widest">/ 100 TRUST</span>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-300 px-4">
              Ground truth alignment has improved by <strong className="text-emerald-400">+4.2%</strong> following the August JSON-LD documentation sync.
            </div>
          </div>

          <div className="w-full mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-tech-mono">
            <span className="text-slate-400">Total Facts Audited:</span>
            <span className="text-white font-bold">142 Data Points</span>
          </div>
        </div>

        {/* 5 Core Accuracy Dimensions (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] flex flex-col justify-between space-y-4">
          <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <div className="text-xs font-tech-mono uppercase tracking-widest text-emerald-400 font-bold">
                FACTUAL ACCURACY BY ATTRIBUTE
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Precision breakdown across verified business entities
              </div>
            </div>
            <span className="text-xs font-tech-mono text-slate-400">Target: 95.0%+</span>
          </div>

          <div className="space-y-4">
            {[
              { label: 'Address Accuracy (Physical HQ & Legal Entity)', score: 98.2, icon: MapPin, note: '98.2% (54 of 55 verified)' },
              { label: 'Hours Accuracy (Support Availability & SLA)', score: 94.0, icon: Clock, note: '94.0% (24/7 SLA accurate)' },
              { label: 'Service Accuracy (Product Modules & APIs)', score: 86.5, icon: Server, note: '86.5% (deprecated features flagged)' },
              { label: 'Pricing Accuracy (Subscription Tiers & Prompts)', score: 71.2, icon: DollarSign, note: '71.2% (legacy $299 plan cited by ChatGPT)' },
              { label: 'Response Grounding Consistency', score: 88.6, icon: Layers, note: '88.6% alignment with verified ground truth facts' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-tech-mono">
                    <span className="text-slate-200 flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{item.label}</span>
                    </span>
                    <span className="font-bold text-white">{item.score}%</span>
                  </div>

                  <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${
                        item.score >= 90 ? 'bg-emerald-400' :
                        item.score >= 80 ? 'bg-cyan-400' : 'bg-amber-400'
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>

                  <div className="text-[10px] text-slate-500 font-mono">
                    {item.note}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-2 text-xs font-mono text-slate-400 border-t border-white/[0.04]">
            Action recommendation: Inject <strong className="text-white">schema.org/PriceSpecification</strong> to immediately correct legacy pricing in GPT-4o training weights.
          </div>
        </div>

      </div>

      {/* Ground Truth & Fact Verification Matrix */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
        <div className="pb-3 border-b border-white/[0.06] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-tech-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>CHATGPT GROUND TRUTH & FACT VERIFICATION MATRIX</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Continuous audit of core brand facts, pricing, and compliance in OpenAI ChatGPT responses
            </p>
          </div>
          <span className="text-xs font-tech-mono text-emerald-400 font-bold">
            Grounding Score: 88.6%
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11px] font-tech-mono uppercase text-slate-400 bg-white/[0.01]">
                <th className="py-2.5 px-3">Tested Fact / Entity Attribute</th>
                <th className="py-2.5 px-3">Canonical Ground Truth</th>
                <th className="py-2.5 px-3">ChatGPT Output</th>
                <th className="py-2.5 px-3">Audit Status</th>
                <th className="py-2.5 px-3 text-right">Grounding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {consistencyFacts.map((f, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-3 font-medium text-white">{f.fact}</td>
                  <td className="py-3 px-3 text-slate-300 font-tech-mono">{f.groundTruth}</td>
                  <td className="py-3 px-3 text-slate-300 font-tech-mono">{f.chatgptOutput}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-tech-mono font-bold border ${
                      f.statusType === 'success' 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' 
                        : f.statusType === 'error'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-tech-mono font-bold text-slate-300">
                    {f.grounding}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hallucination Triage & Critical Error Log */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#080c14] border border-white/[0.08] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div>
            <h3 className="text-base font-bold text-white font-tech-mono flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>ACTIVE HALLUCINATIONS & CRITICAL ERROR REMEDIATION</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              14 detected discrepancies requiring schema ground-truth injection
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['all', 'critical', 'high', 'medium'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-lg text-xs font-tech-mono uppercase transition-colors cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-white/10 text-white font-bold border border-white/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredClaims.map((item) => {
            const isResolved = resolvedIssues.includes(item.id);
            return (
              <div 
                key={item.id}
                className={`p-4 rounded-xl border transition-all ${
                  isResolved 
                    ? 'bg-emerald-950/10 border-emerald-500/30 opacity-70'
                    : 'bg-[#06080e] border-white/[0.06] hover:border-amber-500/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-tech-mono uppercase font-bold border ${item.severityColor}`}>
                        {item.severity}
                      </span>
                      <span className="text-xs font-tech-mono text-slate-400">
                        {item.category} • {item.engine}
                      </span>
                      {isResolved && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-tech-mono flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Patch Deployed</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      <div className="p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-xs font-mono">
                        <span className="text-[10px] uppercase font-tech-mono text-rose-400 font-bold block mb-0.5">
                          Detected Hallucination:
                        </span>
                        <p className="text-slate-300">{item.claim}</p>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-xs font-mono">
                        <span className="text-[10px] uppercase font-tech-mono text-emerald-400 font-bold block mb-0.5">
                          Verified Ground Truth:
                        </span>
                        <p className="text-slate-300">{item.truth}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
                      <span className="text-slate-500">Commercial Impact:</span>
                      <span>{item.impact}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 self-start md:self-center flex-shrink-0">
                    <button
                      onClick={() => setPatchModalItem(item)}
                      className="px-3.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-tech-mono text-slate-200 transition-colors cursor-pointer"
                    >
                      View Schema Fix
                    </button>
                    <button
                      onClick={() => handleResolve(item.id)}
                      disabled={isResolved}
                      className={`px-3.5 py-1.5 rounded-lg text-xs font-tech-mono font-bold transition-colors cursor-pointer ${
                        isResolved
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-emerald-400 hover:bg-emerald-300 text-emerald-950'
                      }`}
                    >
                      {isResolved ? 'Patched' : 'Deploy Patch'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Schema Fix Inspector */}
      {patchModalItem && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0c101b] border border-white/[0.12] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white font-tech-mono">
                  Ground Truth Schema Patch
                </h4>
              </div>
              <button
                onClick={() => setPatchModalItem(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="text-slate-300">
                Recommended Action: <strong className="text-emerald-400">{patchModalItem.patchAction}</strong>
              </div>

              <div className="p-3 rounded-lg bg-[#05070c] border border-white/[0.08] text-[11px] font-mono text-emerald-300 overflow-x-auto">
                <pre>{JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "SoftwareApplication",
                  "name": "GEO Platform",
                  "price": "499.00",
                  "priceCurrency": "USD",
                  "securityStandard": "SOC2 Type II",
                  "operatingHours": "24/7 Dedicated Support SLA"
                }, null, 2)}</pre>
              </div>
              <p className="text-[11px] text-slate-400">
                Deploying this structured payload to <code className="text-slate-200">acme.com/pricing</code> forces immediate web indexing recrawls across OpenAI ChatGPT knowledge and citation graphs.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                onClick={() => setPatchModalItem(null)}
                className="px-4 py-1.5 rounded-lg bg-white/5 text-slate-300 text-xs font-tech-mono"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleResolve(patchModalItem.id);
                  setPatchModalItem(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-emerald-400 text-emerald-950 font-bold text-xs font-tech-mono"
              >
                Execute Injection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
