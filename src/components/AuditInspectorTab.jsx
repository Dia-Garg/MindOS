import React, { useState, useEffect } from 'react';
import { History, ShieldCheck, Download, Filter, CheckCircle2, AlertTriangle, RefreshCw, XCircle, Code, ChevronDown, ChevronRight } from 'lucide-react';
import { auditLogger } from '../services/auditLogger';

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
    downloadAnchor.setAttribute("download", `mindos_razorpay_audit_trail_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Controls */}
      <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ffc35a]" />
            <h2 className="font-syne text-xl font-bold text-white">
              Explainable Decision & Policy Audit Trail
            </h2>
          </div>
          <p className="text-xs text-white/60 font-sans mt-1">
            Immutable log of all agent intentions, bounded policy evaluations, Razorpay API calls, and resilient failover events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadAuditJson}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit JSON</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        {[
          { id: 'ALL', label: `All Events (${logs.length})` },
          { id: 'SUCCESS', label: 'Success' },
          { id: 'APPROVED_BOUNDED', label: 'Policy Bounded' },
          { id: 'RECOVERED_FAILOVER', label: 'Failover Handled' },
          { id: 'ESCALATED_HUMAN', label: 'Human-in-Loop' }
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              filter === f.id
                ? 'bg-white/20 border-white text-white font-bold'
                : 'bg-white/5 border-white/10 text-white/50 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Audit Log Stream */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-white/40 font-mono text-xs bg-[#12121a] rounded-2xl border border-white/10">
            No audit logs found for filter: {filter}
          </div>
        ) : (
          filteredLogs.map(log => {
            const isExpanded = expandedId === log.id;
            return (
              <div
                key={log.id}
                className="bg-[#12121a] border border-white/10 rounded-xl p-4 transition-all hover:border-white/20 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                      log.status === 'SUCCESS' ? 'bg-[#00ff9d]/10 text-[#00ff9d] border-[#00ff9d]/30' :
                      log.status === 'APPROVED_BOUNDED' ? 'bg-[#4da6ff]/10 text-[#4da6ff] border-[#4da6ff]/30' :
                      log.status === 'RECOVERED_FAILOVER' ? 'bg-[#ff6b9d]/10 text-[#ff6b9d] border-[#ff6b9d]/30' :
                      'bg-[#ffc35a]/10 text-[#ffc35a] border-[#ffc35a]/30'
                    }`}>
                      {log.status}
                    </span>

                    <span className="font-mono text-xs font-bold text-white">
                      {log.intent}
                    </span>

                    <span className="font-mono text-[11px] text-white/40">
                      by <strong className="text-white/70">{log.actor}</strong>
                    </span>
                  </div>

                  <span className="font-mono text-[11px] text-white/40">
                    {log.timestamp}
                  </span>
                </div>

                <div className="text-xs font-sans text-white/80 leading-relaxed">
                  {log.action}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-white/5 font-mono text-[11px]">
                  <div className="text-[#ffc35a]">
                    Policy Check: <span className="text-white/80">{log.policyCheck}</span>
                  </div>

                  {log.payload && (
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : log.id)}
                      className="text-white/40 hover:text-white flex items-center gap-1 self-start sm:self-auto"
                    >
                      <Code className="w-3 h-3" />
                      <span>{isExpanded ? 'Hide Payload' : 'View Payload'}</span>
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {isExpanded && log.payload && (
                  <div className="mt-3 p-3 rounded-lg bg-black/60 border border-white/10 font-mono text-[11px] text-[#00ff9d] overflow-x-auto">
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
