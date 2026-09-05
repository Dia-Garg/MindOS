import React from 'react';
import { ShieldCheck, Cpu, Terminal, ShoppingBag, FileText, CheckCircle2, Layers } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, auditCount, recoveredAmount }) {
  const tabs = [
    { id: 'ai-buyer', label: 'Agent Protocol (AP2)', icon: Cpu },
    { id: 'brain-dump', label: 'Executive Ops', icon: Terminal },
    { id: 'commerce', label: 'Merchant Console', icon: ShoppingBag },
    { id: 'audit', label: `Audit Ledger (${auditCount})`, icon: FileText },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Organization */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-zinc-100 shadow-sm font-semibold text-sm">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm tracking-tight text-zinc-100">
                  MindOS
                </span>
                <span className="text-[11px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded">
                  v2.4-enterprise
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-sans">
                Agentic Commerce Gateway • Razorpay Integration
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-zinc-800 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Razorpay Test Rails
            </span>
            <span className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[11px]">
              NPCI UAP / AP2 Compliant
            </span>
          </div>
        </div>

        {/* Segmented Control Navigation */}
        <nav className="flex items-center p-1 bg-zinc-900/90 border border-zinc-800 rounded-lg">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
