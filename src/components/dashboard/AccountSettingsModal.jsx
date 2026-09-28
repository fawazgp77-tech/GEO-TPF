import React, { useState } from 'react';
import { X, User, CreditCard, Key, CheckCircle2, Building, Copy, Check } from 'lucide-react';

export default function AccountSettingsModal({ isOpen, onClose, currentUser, onUpdateUser, onLogout, initialTab = 'general' }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'general'); // 'general' | 'workspace' | 'api' | 'billing'
  const [copiedKey, setCopiedKey] = useState(false);
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

  const handleCopyKey = () => {
    setCopiedKey(true);
    navigator.clipboard?.writeText('geo_live_sk_948f98a2b37c41e893e9821876');
    setTimeout(() => setCopiedKey(false), 2000);
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
                Account & Workspace Settings
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {company} • Pro Plan Active
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

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 pt-4 pb-2 border-b border-white/[0.06] text-xs font-tech-mono flex-shrink-0 overflow-x-auto">
          {[
            { id: 'general', label: 'General Profile', icon: User },
            { id: 'workspace', label: 'Workspace & Scope', icon: Building },
            { id: 'api', label: 'API Keys (Coming Soon)', icon: Key },
            { id: 'billing', label: 'Billing & Plan', icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-medium'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          
          {/* GENERAL TAB */}
          {activeTab === 'general' && (
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
                    Role / Title
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#06080e] border border-white/[0.1] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-emerald-500/80"
                  />
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
          )}

          {/* WORKSPACE TAB */}
          {activeTab === 'workspace' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="p-4 rounded-xl bg-[#06080e] border border-white/[0.06] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-sm">Corporate Domain Scope</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">Primary entity tracked across ChatGPT answer generations</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-[10px]">
                    ACTIVE TARGET
                  </span>
                </div>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-[#0a0d15] border border-white/[0.1] rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#06080e] border border-white/[0.06] space-y-2">
                <div className="text-white font-bold text-sm">Monitored OpenAI Environments</div>
                <div className="text-slate-400 text-[11px] mb-3">Active ChatGPT and GPT-4o telemetry channels</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {['ChatGPT Search (Web)', 'GPT-4o Standard', 'GPT-4o Mini', 'ChatGPT Enterprise', 'ChatGPT Canvas', 'ChatGPT Voice', 'OpenAI o1 Reasoning', 'ChatGPT Plus'].map((eng) => (
                    <div key={eng} className="p-2 rounded bg-white/[0.03] border border-white/[0.06] text-slate-300 text-center">
                      ✓ {eng}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API KEYS TAB */}
          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs font-tech-mono">
                <span className="text-emerald-300 font-semibold">DEVELOPER PREVIEW // COMING SOON</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase">
                  v1.0 Beta
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#06080e] border border-white/[0.06] space-y-3">
                <div className="text-white font-bold text-sm">Programmatic Telemetry API Key</div>
                <p className="text-xs text-slate-400">
                  Direct programmatic access to citation benchmarks and prompt evaluation telemetry will be available to enterprise workspaces in the upcoming v1.0 release.
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    readOnly
                    value="geo_preview_sk_948f98a2b37c41e893e9821876"
                    className="flex-1 bg-[#0a0d15] border border-white/[0.1] rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 opacity-60"
                  />
                  <button
                    onClick={handleCopyKey}
                    className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-tech-mono text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#06080e] border border-white/[0.06] space-y-2 text-xs font-mono">
                <div className="text-slate-300 font-bold">Planned API Endpoints:</div>
                <div className="text-slate-400 space-y-1">
                  <div>• GET /v1/telemetry/chatgpt-score</div>
                  <div>• GET /v1/telemetry/citation-provenance</div>
                  <div>• POST /v1/telemetry/prompt-simulations</div>
                </div>
              </div>
            </div>
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-[#070a10] border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-tech-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
                      CURRENT SUBSCRIPTION
                    </span>
                    <h4 className="text-xl font-bold text-white">Pro Plan ($499 / month)</h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-tech-mono font-bold">
                    Active
                  </span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/[0.08] text-xs font-tech-mono">
                  <div className="flex justify-between text-slate-300">
                    <span>Monthly Query Allowance</span>
                    <span className="text-emerald-400 font-bold">847 / 1,000 Prompts Used (84%)</span>
                  </div>
                  <div className="h-2 w-full bg-[#06080e] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-400 rounded-full" style={{ width: '84%' }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-[11px] font-tech-mono text-slate-400">
                  <span>Renews automatically on Oct 26, 2026</span>
                  <span className="text-slate-200">Payment: Mastercard •••• 8842</span>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => alert('Invoice receipt dispatched to email.')}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-tech-mono text-slate-300 transition-colors cursor-pointer"
                >
                  Download Invoices
                </button>
                <button
                  onClick={() => alert('Enterprise upgrade inquiry queued.')}
                  className="px-4 py-2 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-emerald-950 text-xs font-tech-mono font-bold transition-colors cursor-pointer"
                >
                  Upgrade to Enterprise
                </button>
              </div>
            </div>
          )}

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
