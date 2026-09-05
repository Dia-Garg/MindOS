import React from 'react';
import { Terminal, Cpu, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, auditCount }) {
  const steps = [
    { id: 'brain-dump', label: '1. Founder Dump', icon: Terminal },
    { id: 'ai-buyer', label: '2. AI Buyer Handshake', icon: Cpu },
    { id: 'commerce', label: '3. Store & Recovery', icon: ShoppingBag },
    { id: 'audit', label: `4. Audit Log (${auditCount})`, icon: ShieldCheck },
  ];

  return (
    <header className="border-b border-[#222838] bg-[#0e1117]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-syne font-bold text-sm">
            M
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-syne text-base font-bold tracking-tight text-white">
                MINDOS
              </h1>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                Commerce v2.0
              </span>
            </div>
            <p className="font-mono text-[10px] text-slate-400">
              your mind. organized. powered by razorpay.
            </p>
          </div>
        </div>

        {/* Step Navigation */}
        <nav className="flex items-center gap-1 bg-[#12161f] border border-[#222838] p-1 rounded-xl">
          {steps.map(step => {
            const Icon = step.icon;
            const isActive = activeTab === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveTab(step.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="font-sans">{step.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
