import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import BrainDumpTab from './components/BrainDumpTab.jsx';
import AIBuyerSimulatorTab from './components/AIBuyerSimulatorTab.jsx';
import CommerceTerminalTab from './components/CommerceTerminalTab.jsx';
import AuditInspectorTab from './components/AuditInspectorTab.jsx';
import { auditLogger } from './services/auditLogger.js';

export default function App() {
  const [activeTab, setActiveTab] = useState('brain-dump'); // Default Hero screen as chosen by user!
  const [auditLogs, setAuditLogs] = useState(auditLogger.getLogs());
  const [recoveredTotal, setRecoveredTotal] = useState(0);

  useEffect(() => {
    const unsub = auditLogger.subscribe(logs => {
      setAuditLogs([...logs]);
    });
    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1117] text-slate-200 font-sans antialiased pb-20 selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        auditCount={auditLogs.length}
      />

      {/* Main Walkthrough Container */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === 'brain-dump' && (
          <BrainDumpTab onNavigateTab={tab => setActiveTab(tab)} />
        )}

        {activeTab === 'ai-buyer' && (
          <AIBuyerSimulatorTab onNavigateTab={tab => setActiveTab(tab)} />
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
  );
}
