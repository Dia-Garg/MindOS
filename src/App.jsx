import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import BrainDumpTab from './components/BrainDumpTab';
import AIBuyerSimulatorTab from './components/AIBuyerSimulatorTab';
import CommerceTerminalTab from './components/CommerceTerminalTab';
import AuditInspectorTab from './components/AuditInspectorTab';
import { auditLogger } from './services/auditLogger';

export default function App() {
  const [activeTab, setActiveTab] = useState('ai-buyer');
  const [auditLogs, setAuditLogs] = useState(auditLogger.getLogs());
  const [recoveredTotal, setRecoveredTotal] = useState(0);

  useEffect(() => {
    const unsub = auditLogger.subscribe(logs => {
      setAuditLogs([...logs]);
    });
    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e0e0e0] font-sans selection:bg-[#00ff9d33] selection:text-[#00ff9d] relative pb-20">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#1a0a2e] opacity-40 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full bg-[#0a1a2e] opacity-40 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Navigation & Status Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          auditCount={auditLogs.length}
          recoveredAmount={recoveredTotal}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {activeTab === 'brain-dump' && (
            <BrainDumpTab
              onNavigateTab={tab => setActiveTab(tab)}
            />
          )}

          {activeTab === 'ai-buyer' && (
            <AIBuyerSimulatorTab
              onNavigateTab={tab => setActiveTab(tab)}
            />
          )}

          {activeTab === 'commerce' && (
            <CommerceTerminalTab
              onNavigateTab={tab => setActiveTab(tab)}
              onRevenueUpdate={amt => setRecoveredTotal(amt)}
            />
          )}

          {activeTab === 'audit' && (
            <AuditInspectorTab />
          )}
        </main>
      </div>
    </div>
  );
}
