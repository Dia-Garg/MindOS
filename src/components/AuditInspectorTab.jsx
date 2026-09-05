import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Code, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { auditLogger } from '../services/auditLogger.js';

export default function AuditInspectorTab() {
  const [logs, setLogs] = useState(auditLogger.getLogs());
  const [filter, setFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const unsubscribe = auditLogger.subscribe(updatedLogs => {
      setLogs([...updatedLogs]);
    });
    return unsubscribe;
  }, []);

  const filteredLogs = logs.filter(l => {
    if (filter === 'ALL') return true;
    return l.status === filter;
  });

  function downloadAuditJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(auditLogger.exportJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `razorpay_audit_ledger_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <span>COMPLIANCE & TRACEABILITY</span>
            <span>•</span>
            <span className="text-zinc-300">DETERMINISTIC LEDGER</span>
          </div>
          <h2 className="text-lg font-semibold text-zinc-100 mt-1">
            Policy Evaluation & Audit Event Stream
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Immutable log of agent decisions, threshold gate evaluations, Razorpay API payloads, and failover states.
          </p>
        </div>

        <button
          onClick={downloadAuditJson}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors whitespace-nowrap self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Ledger (JSON)</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
        {[
          { id: 'ALL', label: `All Events (${logs.length})` },
          { id: 'SUCCESS', label: '200 Success' },
          { id: 'APPROVED_BOUNDED', label: 'Policy Bounded' },
          { id: 'RECOVERED_FAILOVER', label: 'Failover Handled' },
          { id: 'ESCALATED_HUMAN', label: 'Halted (Human-in-Loop)' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-md border transition-colors ${
              filter === f.id
                ? 'bg-zinc-800 text-zinc-100 border-zinc-600 font-medium'
                : 'bg-zinc-900/40 text-zinc-400 border-zinc-800/80 hover:text-zinc-300'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Event Stream Table */}
      <div className="space-y-2.5">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 text-xs bg-zinc-900/40 rounded-xl border border-zinc-800">
            No audit records matching filter: {filter}
          </div>
        ) : (
          filteredLogs.map(log => {
            const isExpanded = expandedId === log.id;
            return (
              <div
                key={log.id}
                className="bg-zinc-900/50 border border-zinc-800/80 rounded-lg p-3.5 hover:border-zinc-700 transition-colors space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      log.status === 'APPROVED_BOUNDED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      log.status === 'RECOVERED_FAILOVER' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {log.status}
                    </span>

                    <span className="font-mono text-xs font-semibold text-zinc-200">
                      {log.intent}
                    </span>

                    <span className="text-zinc-400 text-xs font-sans">
                      by <span className="text-zinc-300 font-medium">{log.actor}</span>
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-zinc-400">
                    {log.timestamp}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed pl-0.5">
                  {log.action}
                </p>

                <div className="pt-2 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono">
                  <div className="text-zinc-400">
                    Policy Gate: <span className="text-zinc-300">{log.policyCheck}</span>
                  </div>

                  {log.payload && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 self-start sm:self-auto"
                    >
                      <Code className="w-3 h-3" />
                      <span>{isExpanded ? 'Collapse Payload' : 'Inspect Payload'}</span>
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {isExpanded && log.payload && (
                  <div className="mt-2 p-3 rounded bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 overflow-x-auto">
                    <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
