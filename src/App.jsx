import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import BrainDumpTab from './components/BrainDumpTab.jsx';
import AIBuyerSimulatorTab from './components/AIBuyerSimulatorTab.jsx';
import CommerceTerminalTab from './components/CommerceTerminalTab.jsx';
import AuditInspectorTab from './components/AuditInspectorTab.jsx';
import { auditLogger } from './services/auditLogger.js';

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-zinc-100 antialiased">
      {/* Top Navbar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        auditCount={auditLogs.length}
        recoveredAmount={recoveredTotal}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'ai-buyer' && (
          <AIBuyerSimulatorTab onNavigateTab={tab => setActiveTab(tab)} />
        )}

        {activeTab === 'brain-dump' && (
          <BrainDumpTab onNavigateTab={tab => setActiveTab(tab)} />
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
