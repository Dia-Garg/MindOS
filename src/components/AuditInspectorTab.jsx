import React, { useState, useEffect } from 'react';
import { ShieldCheck, Download, Code, ChevronDown, ChevronRight } from 'lucide-react';
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
    downloadAnchor.setAttribute("download", `mindos_razorpay_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white font-syne flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Explainable Decision & Audit Trail
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Every money action explainable, bounded and gated. Immutable log for Buildathon evaluators.
          </p>
        </div>

        <button
          onClick={downloadAuditJson}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#12161f] hover:bg-[#171c27] border border-[#222838] text-slate-300 text-xs font-mono transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit JSON</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
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
            className={`px-3 py-1.5 rounded-lg border transition-colors ${
              filter === f.id
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 font-bold'
                : 'bg-[#12161f] border-[#222838] text-slate-400 hover:text-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Log Feed */}
      <div className="space-y-3">
        {filteredLogs.map(log => {
          const isExpanded = expandedId === log.id;
          return (
            <div
              key={log.id}
              className="bg-[#12161f] border border-[#222838] rounded-2xl p-4 space-y-2 hover:border-slate-600 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                    log.status === 'APPROVED_BOUNDED' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' :
                    log.status === 'RECOVERED_FAILOVER' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {log.status}
                  </span>
                  <span className="text-white font-bold">{log.intent}</span>
                  <span className="text-slate-400 text-[11px]">by {log.actor}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {log.action}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-[#222838] text-[11px] font-mono">
                <span className="text-amber-400/90">Policy Gate: <span className="text-slate-300">{log.policyCheck}</span></span>

                {log.payload && (
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Code className="w-3 h-3" />
                    <span>{isExpanded ? 'Hide Payload' : 'View Payload'}</span>
                    {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                  </button>
                )}
              </div>

              {isExpanded && log.payload && (
                <div className="mt-2 p-3 rounded-xl bg-[#0a0c10] border border-[#222838] font-mono text-[11px] text-emerald-400 overflow-x-auto">
                  <pre>{JSON.stringify(log.payload, null, 2)}</pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
