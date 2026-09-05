import React from 'react';
import { ShieldCheck, Cpu, Sparkles, Terminal, ShoppingBag, ListCheck, History, AlertCircle } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, auditCount, recoveredAmount }) {
  return (
    <header className="border-b border-white/10 bg-[#0c0c14]/80 backdrop-blur-md sticky top-0 z-40 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-syne text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-[#00ff9d] to-[#4da6ff] bg-clip-text text-transparent animate-gradient">
                MINDOS
              </h1>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d] font-bold">
                COMMERCE v2.0
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#4da6ff]/10 border border-[#4da6ff]/30 text-[#4da6ff]">
                AP2 / UAP ACTIVE
              </span>
            </div>
            <p className="font-mono text-[11px] text-white/40 tracking-wider">
              Autonomous Merchant OS & AI Buyer Gateway • Razorpay Test Mode
            </p>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-[#00ff9d] animate-ping" />
            <span className="text-white/60">RAZORPAY RAILS:</span>
            <span className="text-[#00ff9d] font-bold">CONNECTED</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ffc35a]" />
            <span className="text-white/60">SAFETY GATES:</span>
            <span className="text-[#ffc35a] font-bold">BOUNDED &le;15%</span>
          </div>
          {recoveredAmount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00ff9d]/10 border border-[#00ff9d]/30 text-[#00ff9d]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RECOVERED: ₹{recoveredAmount.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 bg-white/[0.04] p-1 rounded-xl border border-white/10 font-mono text-xs">
          <button
            onClick={() => setActiveTab('brain-dump')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'brain-dump'
                ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/40 font-bold shadow-[0_0_12px_rgba(0,255,157,0.2)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Founder Brain Dump</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-buyer')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'ai-buyer'
                ? 'bg-[#4da6ff]/20 text-[#4da6ff] border border-[#4da6ff]/40 font-bold shadow-[0_0_12px_rgba(77,166,255,0.2)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>AI Buyer Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('commerce')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'commerce'
                ? 'bg-[#ff6b9d]/20 text-[#ff6b9d] border border-[#ff6b9d]/40 font-bold shadow-[0_0_12px_rgba(255,107,157,0.2)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Commerce & Recovery</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              activeTab === 'audit'
                ? 'bg-[#ffc35a]/20 text-[#ffc35a] border border-[#ffc35a]/40 font-bold shadow-[0_0_12px_rgba(255,195,90,0.2)]'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditCount})</span>
          </button>
        </div>
      </div>
    </header>
  );
}
