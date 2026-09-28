import React, { useState, useEffect } from 'react';
import { 
  User, 
  Building2, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';

export default function Onboarding({ currentUser, onComplete, onSkip }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: About User, 2: About Business
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentStep]);

  // Form State: About User
  const [role, setRole] = useState('');
  const [roleOther, setRoleOther] = useState('');
  
  const [goals, setGoals] = useState([]);
  
  const [queryTypes, setQueryTypes] = useState([]);
  const [queryTypeOther, setQueryTypeOther] = useState('');

  // Form State: About Business
  const [offering, setOffering] = useState('');
  const [offeringOther, setOfferingOther] = useState('');

  const [problemsSolved, setProblemsSolved] = useState([]);
  const [problemOther, setProblemOther] = useState('');

  const [customers, setCustomers] = useState([]);
  const [customerOther, setCustomerOther] = useState('');

  // Toggle helpers for multi-select
  const toggleSelection = (list, setList, item) => {
    if (list.includes(item)) {
      setList(list.filter(x => x !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleFinish = () => {
    setIsFinishing(true);
    const answers = {
      aboutUser: {
        role: role === 'Other' ? (roleOther || 'Other') : role,
        goals,
        queryTypes: queryTypes.includes('Other') 
          ? [...queryTypes.filter(q => q !== 'Other'), queryTypeOther ? `Other: ${queryTypeOther}` : 'Other']
          : queryTypes
      },
      aboutBusiness: {
        offering: offering === 'Other' ? (offeringOther || 'Other') : offering,
        problemsSolved: problemsSolved.includes('Other')
          ? [...problemsSolved.filter(p => p !== 'Other'), problemOther ? `Other: ${problemOther}` : 'Other']
          : problemsSolved,
        customers: customers.includes('Other')
          ? [...customers.filter(c => c !== 'Other'), customerOther ? `Other: ${customerOther}` : 'Other']
          : customers
      }
    };

    setTimeout(() => {
      onComplete(answers);
    }, 700);
  };

  // Section 1: User Options
  const roleOptions = [
    'Founder / Co-founder',
    'Marketing',
    'SEO',
    'Product',
    'Sales',
    'Consultant / Agency',
    'Other'
  ];

  const goalOptions = [
    'Get my brand discovered',
    'Get more customers',
    'Increase brand visibility',
    'Understand how AI describes my business',
    'Outrank competitors in AI answers',
    'Improve my overall online presence'
  ];

  const queryTypeOptions = [
    'Best [product/service]',
    '[product] vs [competitor]',
    'Alternatives to [product]',
    'How to solve [problem]',
    '[product/service] for [specific audience]',
    'Companies/services near me',
    'Other'
  ];

  // Section 2: Business Options
  const offeringOptions = [
    'Product',
    'Service',
    'Software / SaaS',
    'Marketplace',
    'Content / Media',
    'Other'
  ];

  const problemOptions = [
    'Save money',
    'Save time',
    'Increase revenue',
    'Improve productivity',
    'Learn / educate',
    'Find / access something',
    'Other'
  ];

  const customerOptions = [
    'Consumers',
    'Small businesses',
    'Startups',
    'Mid-sized businesses',
    'Enterprises',
    'Professionals',
    'Students',
    'Other'
  ];

  const isStep1Answered = role && goals.length > 0 && queryTypes.length > 0;
  const isStep2Answered = offering && problemsSolved.length > 0 && customers.length > 0;

  if (isFinishing) {
    return (
      <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 bg-grid-pattern relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-emerald-500/[0.08] rounded-full blur-[140px] pointer-events-none" />
        <div className="bg-[#0b0f17] border border-emerald-500/30 rounded-3xl p-10 max-w-md w-full text-center space-y-5 shadow-[0_0_50px_rgba(16,185,129,0.15)] relative z-10 animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.35)] animate-pulse">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-tech-mono text-emerald-300 uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>PROFILE CONFIGURED</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
              Calibrating GEO Telemetry...
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applying your role and search intent parameters to the ChatGPT answer generation radar.
            </p>
          </div>
          <div className="w-full bg-[#111622] h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-400 h-full w-full animate-[pulse_1s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200 bg-grid-pattern relative">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-emerald-500/[0.05] rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-cyan-500/[0.04] rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="border-b border-white/[0.08] bg-[#07090e]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-tech-mono font-bold tracking-wider text-xl text-white">
              GEO
            </span>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-tech-mono text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>WORKSPACE ONBOARDING</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <span className="text-xs font-tech-mono text-slate-400 hidden sm:inline-block">
                {currentUser.email}
              </span>
            )}
            <button
              onClick={onSkip}
              className="text-xs font-tech-mono text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              Skip to Dashboard →
            </button>
          </div>
        </div>

        {/* Stepper Navigation Bar */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pb-3 pt-1">
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
            {/* Step 1 Button */}
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]'
                  : isStep1Answered
                  ? 'bg-[#0b0f17]/90 border-emerald-500/30 hover:border-white/20'
                  : 'bg-[#0b0f17]/60 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-tech-mono font-bold transition-all ${
                isStep1Answered
                  ? 'bg-emerald-400 text-emerald-950'
                  : currentStep === 1
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-white/5 text-slate-400 border border-white/10'
              }`}>
                {isStep1Answered ? <Check className="w-4.5 h-4.5 stroke-[2.5]" /> : '01'}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-tech-mono uppercase tracking-wider text-slate-400">Step 1</div>
                <div className={`text-sm sm:text-base font-semibold truncate ${
                  currentStep === 1 ? 'text-white' : 'text-slate-300'
                }`}>
                  About The User
                </div>
              </div>
            </button>

            {/* Step 2 Button */}
            <button
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-3.5 p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                currentStep === 2
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]'
                  : isStep2Answered
                  ? 'bg-[#0b0f17]/90 border-emerald-500/30 hover:border-white/20'
                  : 'bg-[#0b0f17]/60 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-tech-mono font-bold transition-all ${
                isStep2Answered
                  ? 'bg-emerald-400 text-emerald-950'
                  : currentStep === 2
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-white/5 text-slate-400 border border-white/10'
              }`}>
                {isStep2Answered ? <Check className="w-4.5 h-4.5 stroke-[2.5]" /> : '02'}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-tech-mono uppercase tracking-wider text-slate-400">Step 2</div>
                <div className={`text-sm sm:text-base font-semibold truncate ${
                  currentStep === 2 ? 'text-white' : 'text-slate-300'
                }`}>
                  About The Business
                </div>
              </div>
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="w-full bg-[#111622] h-1.5 rounded-full mt-3.5 overflow-hidden">
            <div 
              className="bg-emerald-400 h-full transition-all duration-300"
              style={{ width: currentStep === 1 ? '50%' : '100%' }}
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        
        {/* ================= STEP 1: ABOUT THE USER ================= */}
        {currentStep === 1 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header Banner */}
            <div className="border-b border-white/[0.08] pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-tech-mono text-emerald-300 uppercase tracking-wider mb-2">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>ABOUT THE USER</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Tell us about your role & search priorities
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                We use these preferences to customize your AI citation benchmarks, monitor the right prompts, and personalize your intelligence feed.
              </p>
            </div>

            {/* Question 1: What is your role in the business? */}
            <div className="space-y-4">
              <div>
                <span className="font-tech-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                  QUESTION 01 // PROFESSIONAL FOCUS
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  1. What is your role in the business?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select the role that best describes your primary responsibilities.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                {roleOptions.map((opt) => {
                  const isSelected = role === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setRole(opt)}
                      className={`p-4 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer min-h-[62px] ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                          : 'bg-[#0b0f17] border-white/[0.09] text-slate-300 hover:border-white/20 hover:bg-[#0e131d]'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-medium">{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-all ${
                        isSelected ? 'border-emerald-400 bg-emerald-400 text-emerald-950' : 'border-white/30 bg-transparent'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* If "Other" is chosen, show custom input */}
              {role === 'Other' && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-tech-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Specify Your Role:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Chief Revenue Officer, Data Scientist, Content Lead..."
                    value={roleOther}
                    onChange={(e) => setRoleOther(e.target.value)}
                    className="w-full sm:max-w-md bg-[#06080e] border border-emerald-500/40 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 font-mono outline-none"
                  />
                </div>
              )}
            </div>

            {/* Question 2: What are you primarily looking to achieve with AI search? */}
            <div className="space-y-4 pt-4 border-t border-white/[0.06]">
              <div>
                <span className="font-tech-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                  QUESTION 02 // STRATEGIC OBJECTIVES
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  2. What are you primarily looking to achieve with AI search?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select all goals that apply to your team.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {goalOptions.map((opt) => {
                  const isSelected = goals.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleSelection(goals, setGoals, opt)}
                      className={`p-5 sm:p-5.5 rounded-2xl border text-left transition-all flex items-start justify-between cursor-pointer min-h-[68px] ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                          : 'bg-[#0b0f17] border-white/[0.09] text-slate-300 hover:border-white/20 hover:bg-[#0e131d]'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-medium pr-3 leading-snug">{opt}</span>
                      <div className={`w-5 h-5 rounded mt-0.5 border flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'border-emerald-400 bg-emerald-400 text-emerald-950' : 'border-white/30 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3: What type of AI searches are most relevant to your work? */}
            <div className="space-y-4 pt-4 border-t border-white/[0.06]">
              <div>
                <span className="font-tech-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                  QUESTION 03 // QUERY PATTERNS & INTENT
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  3. What type of AI searches are most relevant to your work?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select prompt templates and comparison queries that reflect your target buyers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                {queryTypeOptions.map((opt) => {
                  const isSelected = queryTypes.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleSelection(queryTypes, setQueryTypes, opt)}
                      className={`p-5 sm:p-5.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer min-h-[68px] ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                          : 'bg-[#0b0f17] border-white/[0.09] text-slate-300 hover:border-white/20 hover:bg-[#0e131d]'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-mono mr-2 leading-relaxed tracking-tight">{opt}</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'border-emerald-400 bg-emerald-400 text-emerald-950' : 'border-white/30 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* If "Other" is selected, show query text input */}
              {queryTypes.includes('Other') && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-tech-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Specify Custom Search Query Pattern:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Top rated enterprise tools for [industry]..."
                    value={queryTypeOther}
                    onChange={(e) => setQueryTypeOther(e.target.value)}
                    className="w-full sm:max-w-md bg-[#06080e] border border-emerald-500/40 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 font-mono outline-none"
                  />
                </div>
              )}
            </div>

            {/* Step 1 Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-white/[0.08]">
              <span className="text-xs font-tech-mono text-slate-500">
                {isStep1Answered ? '✓ Step 1 Complete' : 'Answer all 3 questions to proceed'}
              </span>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-6 py-3 rounded-xl font-tech-mono font-semibold text-xs sm:text-sm bg-emerald-400 hover:bg-emerald-300 text-emerald-950 transition-all flex items-center gap-2 shadow-[0_0_25px_-5px_rgba(16,185,129,0.5)] cursor-pointer"
              >
                <span>Continue to Business Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: ABOUT THE BUSINESS ================= */}
        {currentStep === 2 && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header Banner */}
            <div className="border-b border-white/[0.08] pb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-[11px] font-tech-mono text-emerald-300 uppercase tracking-wider mb-2">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>ABOUT THE BUSINESS</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Profile your business model & target market
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                This fine-tunes ChatGPT knowledge grounding, categorizes your domain, and accurately identifies direct market competitors.
              </p>
            </div>

            {/* Question 1: What does your business offer? */}
            <div className="space-y-4">
              <div>
                <span className="font-tech-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                  QUESTION 01 // OFFERING TYPE
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  1. What does your business offer?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select your primary offering structure.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                {offeringOptions.map((opt) => {
                  const isSelected = offering === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setOffering(opt)}
                      className={`p-4.5 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer min-h-[62px] ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                          : 'bg-[#0b0f17] border-white/[0.09] text-slate-300 hover:border-white/20 hover:bg-[#0e131d]'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-medium">{opt}</span>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-2 transition-all ${
                        isSelected ? 'border-emerald-400 bg-emerald-400 text-emerald-950' : 'border-white/30 bg-transparent'
                      }`}>
                        {isSelected && <div className="w-2 h-2 rounded-full bg-emerald-950" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* If "Other" is chosen, show custom input */}
              {offering === 'Other' && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-tech-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Specify Your Offering:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Hybrid Hardware + Cloud Platform..."
                    value={offeringOther}
                    onChange={(e) => setOfferingOther(e.target.value)}
                    className="w-full sm:max-w-md bg-[#06080e] border border-emerald-500/40 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 font-mono outline-none"
                  />
                </div>
              )}
            </div>

            {/* Question 2: What problem does your business solve? */}
            <div className="space-y-4 pt-4 border-t border-white/[0.06]">
              <div>
                <span className="font-tech-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                  QUESTION 02 // VALUE PROPOSITION
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  2. What problem does your business solve?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select the key customer outcomes your product or service delivers.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
                {problemOptions.map((opt) => {
                  const isSelected = problemsSolved.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleSelection(problemsSolved, setProblemsSolved, opt)}
                      className={`p-4.5 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer min-h-[62px] ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                          : 'bg-[#0b0f17] border-white/[0.09] text-slate-300 hover:border-white/20 hover:bg-[#0e131d]'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-medium mr-2">{opt}</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'border-emerald-400 bg-emerald-400 text-emerald-950' : 'border-white/30 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* If "Other" is chosen, show custom input */}
              {problemsSolved.includes('Other') && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-tech-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Specify Problem Solved:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Regulatory compliance & risk mitigation..."
                    value={problemOther}
                    onChange={(e) => setProblemOther(e.target.value)}
                    className="w-full sm:max-w-md bg-[#06080e] border border-emerald-500/40 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-3 text-sm sm:text-base text-slate-100 placeholder:text-slate-500 font-mono outline-none"
                  />
                </div>
              )}
            </div>

            {/* Question 3: Who is your primary customer? */}
            <div className="space-y-4 pt-4 border-t border-white/[0.06]">
              <div>
                <span className="font-tech-mono text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                  QUESTION 03 // TARGET AUDIENCE
                </span>
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  3. Who is your primary customer?
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Select the customer tiers you actively serve or acquire.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
                {customerOptions.map((opt) => {
                  const isSelected = customers.includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => toggleSelection(customers, setCustomers, opt)}
                      className={`p-4.5 sm:p-5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer min-h-[62px] ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-400 text-white shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                          : 'bg-[#0b0f17] border-white/[0.09] text-slate-300 hover:border-white/20 hover:bg-[#0e131d]'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-medium mr-1.5">{opt}</span>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                        isSelected ? 'border-emerald-400 bg-emerald-400 text-emerald-950' : 'border-white/30 bg-transparent'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* If "Other" is chosen, show custom input */}
              {customers.includes('Other') && (
                <div className="pt-2 animate-in fade-in duration-200">
                  <label className="block text-[11px] font-tech-mono text-slate-400 uppercase tracking-wider mb-1.5">
                    Specify Target Customer:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Non-profits, Academic Institutions, Healthcare..."
                    value={customerOther}
                    onChange={(e) => setCustomerOther(e.target.value)}
                    className="w-full sm:max-w-md bg-[#06080e] border border-emerald-500/40 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 font-mono outline-none"
                  />
                </div>
              )}
            </div>

            {/* Step 2 Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 rounded-xl font-tech-mono text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Personal Profile</span>
              </button>

              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-3 rounded-xl font-tech-mono font-semibold text-xs sm:text-sm bg-[#2ee59d] hover:bg-[#25c485] text-[#031d14] transition-all flex items-center gap-2 shadow-[0_0_25px_-5px_rgba(46,229,157,0.5)] active:scale-[0.99] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#031d14]" />
                <span>Complete Setup & Launch Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
