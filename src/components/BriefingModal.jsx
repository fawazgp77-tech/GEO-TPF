import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function BriefingModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Chief Technology Officer (CTO)',
    email: '',
    company: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#080b13] border border-emerald-500/30 rounded-lg max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-2xl text-white">
              Private Architecture Briefing Requested
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Our lead ingestion architect will contact you at <span className="text-emerald-400 font-mono">{formData.email}</span> to confirm an executive briefing session.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 px-5 py-2 rounded text-xs font-tech-mono font-medium text-emerald-950 bg-emerald-400 hover:bg-emerald-300 transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="text-[10px] font-tech-mono uppercase tracking-widest text-emerald-400 mb-2">
              CONFIDENTIAL INGESTION PROTOCOL
            </div>
            <h3 className="font-serif-display text-2xl text-white font-normal mb-2">
              Schedule Architecture Briefing
            </h3>
            <p className="text-xs text-slate-400 font-light mb-6">
              Private technical briefing for enterprise CMOs, CTOs, and Search Architecture leaders.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-tech-mono">
              <div>
                <label className="block text-slate-400 mb-1.5 uppercase">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="Dr. Katherine Vance"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#05070c] border border-white/[0.1] rounded px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase">Executive Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-[#05070c] border border-white/[0.1] rounded px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500/80"
                >
                  <option value="Chief Technology Officer (CTO)">Chief Technology Officer (CTO)</option>
                  <option value="Chief Marketing Officer (CMO)">Chief Marketing Officer (CMO)</option>
                  <option value="VP Search / AI Infrastructure">VP Search / AI Infrastructure</option>
                  <option value="Head of Data & Knowledge Graphs">Head of Data & Knowledge Graphs</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase">Corporate Email</label>
                <input
                  type="email"
                  required
                  placeholder="kvance@enterprise.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#05070c] border border-white/[0.1] rounded px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5 uppercase">Specific Retrieval Challenge / Target Entity</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Inverting competitor co-occurrence in OpenAI ChatGPT & SearchGPT"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#05070c] border border-white/[0.1] rounded px-3 py-2 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/80"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold tracking-wider transition-colors cursor-pointer"
                >
                  CONFIRM BRIEFING REQUEST
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center pt-1">
                Covered under mutual NDA. SOC2 Type II compliant communications.
              </p>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
