import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function AccountSettingsModal({ isOpen, onClose, currentUser, onUpdateUser, onLogout }) {
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states initialized directly from currentUser
  const [name, setName] = useState(currentUser?.name || 'Sarah Chen');
  const [email, setEmail] = useState(currentUser?.email || 'sarah.chen@acme.com');
  const [company, setCompany] = useState(currentUser?.company || currentUser?.website || 'acme.com');
  const [role, setRole] = useState('Lead Growth Engineer');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        name,
        email,
        company,
      });
    }
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#0b0f17] border border-white/[0.12] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold font-tech-mono text-sm">
              {name ? name.substring(0, 2).toUpperCase() : 'SC'}
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Account Settings
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {company} • Profile Settings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-tech-mono uppercase text-slate-400 mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-tech-mono uppercase text-slate-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-tech-mono uppercase text-slate-400 mb-1.5">
                    Company / Corporate Domain
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-tech-mono uppercase text-slate-400 mb-1.5">
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/80"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-tech-mono uppercase text-slate-400 mb-1.5">
                  Timezone
                </label>
                <select
                  className="w-full bg-[#06080e] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/80"
                >
                  <option>UTC-05:00 (Eastern Time)</option>
                  <option>UTC-08:00 (Pacific Time)</option>
                  <option>UTC+00:00 (London, GMT)</option>
                  <option>UTC+05:30 (India Standard Time)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-between">
                {saveSuccess ? (
                  <div className="flex items-center gap-1.5 text-xs font-tech-mono text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Profile settings updated successfully!</span>
                  </div>
                ) : <div />}

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-tech-mono text-xs font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between flex-shrink-0 text-xs font-tech-mono">
          <button
            onClick={onLogout}
            className="text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            Sign Out of All Sessions
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
