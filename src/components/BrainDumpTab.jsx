import React, { useState, useRef } from 'react';
import { ArrowRight, Check, Sparkles, ExternalLink, RefreshCw } from 'lucide-react';
import { agentEngine } from '../services/agentEngine.js';

export default function BrainDumpTab({ onNavigateTab }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(new Set());
  const textareaRef = useRef(null);

  const samplePrompts = [
    {
      label: "🔥 Recover Carts + BTech Lab",
      text: "OS lab quiz due tomorrow 11pm. Also 3 customers dropped out of the hoodie checkout today on UPI timeouts. Recover the dropped checkouts with dynamic payment links and clear my mind."
    },
    {
      label: "⚡ Flash Sale + Brand Focus",
      text: "Need to launch a 10% flash sale link for the Cybernetic Hoodie to hit monthly sales targets. Also need to prepare slides for ML project review."
    },
    {
      label: "🧠 Sunday Founder Reset",
      text: "Feeling scattered between supplier calls, brand packaging design, and preparing for end-sem exams. Prioritize what actually moves the needle."
    }
  ];

  async function handleProcess() {
    if (!input.trim() || loading) return;
    setLoading(true);
    try {
      const res = await agentEngine.processBrainDump(input);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function toggleTask(id) {
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalTasks = result
    ? (result.structuredTasks.college?.length || 0) +
      (result.structuredTasks.brand?.length || 0) +
      (result.structuredTasks.personal?.length || 0)
    : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Quick Test Scenarios */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[11px] text-slate-400 mr-1">Quick Scenarios:</span>
        {samplePrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => setInput(p.text)}
            className="px-3 py-1 rounded-lg bg-[#12161f] hover:bg-[#171c27] border border-[#222838] text-slate-300 text-xs transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Card */}
      <div className="bg-[#12161f] border border-[#222838] rounded-2xl p-5 shadow-lg focus-within:border-emerald-500/40 transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Dump everything here. Assignments due. Brand ideas. Dropped checkouts to recover. Half-formed thoughts. Don't filter..."
          rows={5}
          className="w-full bg-transparent border-none text-slate-200 text-sm font-sans focus:outline-none placeholder:text-slate-400 resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-[#222838] text-xs font-mono">
          <span className="text-slate-400">
            {input.length > 0 ? `${input.length} chars` : 'Ctrl + Enter to process'}
          </span>

          <button
            onClick={handleProcess}
            disabled={!input.trim() || loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider transition-all ${
              input.trim() && !loading
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-md'
                : 'bg-[#171c27] text-slate-400 cursor-not-allowed border border-[#222838]'
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>PROCESSING...</span>
              </>
            ) : (
              <>
                <span>PROCESS DUMP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Sections */}
      {result && (
        <div className="space-y-5">
          {/* Automated Razorpay Commerce Alert (If triggered) */}
          {result.actionsTriggered && result.actionsTriggered.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-200 font-medium">
                  {result.actionsTriggered[0]?.message}
                </span>
              </div>
              <button
                onClick={() => onNavigateTab('commerce')}
                className="text-emerald-400 hover:underline font-mono text-[11px] flex items-center gap-1 whitespace-nowrap"
              >
                <span>View in Store & Recovery</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Acknowledge Note */}
          <div className="p-4 rounded-xl bg-[#12161f] border-l-4 border-emerald-500 border border-[#222838] text-xs italic text-slate-300">
            "{result.structuredTasks.acknowledge}"
          </div>

          {/* Quick Stats Bar */}
          {totalTasks > 0 && (
            <div className="flex gap-3 font-mono text-xs">
              <div className="px-3.5 py-2 rounded-xl bg-[#12161f] border border-[#222838] text-center">
                <span className="text-white font-bold">{totalTasks}</span>
                <span className="text-slate-400 text-[10px] ml-1.5 uppercase">tasks</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#12161f] border border-[#222838] text-center">
                <span className="text-emerald-400 font-bold">{result.structuredTasks.brand.length}</span>
                <span className="text-slate-400 text-[10px] ml-1.5 uppercase">brand</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#12161f] border border-[#222838] text-center">
                <span className="text-sky-400 font-bold">{result.structuredTasks.college.length}</span>
                <span className="text-slate-400 text-[10px] ml-1.5 uppercase">college</span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#12161f] border border-[#222838] text-center">
                <span className="text-amber-400 font-bold">{result.structuredTasks.personal.length}</span>
                <span className="text-slate-400 text-[10px] ml-1.5 uppercase">personal</span>
              </div>
            </div>
          )}

          {/* 3 Categories: Brand, College, Personal */}
          <div className="space-y-4">
            {/* Brand Category */}
            {result.structuredTasks.brand.length > 0 && (
              <div className="bg-[#12161f] border border-[#222838] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#222838]">
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Brand & Commerce
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {result.structuredTasks.brand.length} items
                  </span>
                </div>
                <div className="space-y-2">
                  {result.structuredTasks.brand.map((item, idx) => {
                    const taskId = `brand_${idx}`;
                    const isDone = completedTasks.has(taskId);
                    return (
                      <div
                        key={taskId}
                        onClick={() => toggleTask(taskId)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isDone
                            ? 'bg-transparent border-[#222838]/40 text-slate-400 line-through'
                            : 'bg-[#171c27]/60 border-[#222838] text-slate-200 hover:border-emerald-500/30'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isDone ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' : 'border-slate-600'
                        }`}>
                          {isDone && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-sans flex-1">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* College Category */}
            {result.structuredTasks.college.length > 0 && (
              <div className="bg-[#12161f] border border-[#222838] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#222838]">
                  <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                    College & BTech
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {result.structuredTasks.college.length} items
                  </span>
                </div>
                <div className="space-y-2">
                  {result.structuredTasks.college.map((item, idx) => {
                    const taskId = `college_${idx}`;
                    const isDone = completedTasks.has(taskId);
                    return (
                      <div
                        key={taskId}
                        onClick={() => toggleTask(taskId)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isDone
                            ? 'bg-transparent border-[#222838]/40 text-slate-400 line-through'
                            : 'bg-[#171c27]/60 border-[#222838] text-slate-200 hover:border-sky-500/30'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isDone ? 'border-sky-500 bg-sky-500/20 text-sky-400' : 'border-slate-600'
                        }`}>
                          {isDone && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-sans flex-1">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Personal Category */}
            {result.structuredTasks.personal.length > 0 && (
              <div className="bg-[#12161f] border border-[#222838] rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#222838]">
                  <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Personal & Energy
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {result.structuredTasks.personal.length} items
                  </span>
                </div>
                <div className="space-y-2">
                  {result.structuredTasks.personal.map((item, idx) => {
                    const taskId = `personal_${idx}`;
                    const isDone = completedTasks.has(taskId);
                    return (
                      <div
                        key={taskId}
                        onClick={() => toggleTask(taskId)}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isDone
                            ? 'bg-transparent border-[#222838]/40 text-slate-400 line-through'
                            : 'bg-[#171c27]/60 border-[#222838] text-slate-200 hover:border-amber-500/30'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                          isDone ? 'border-amber-500 bg-amber-500/20 text-amber-400' : 'border-slate-600'
                        }`}>
                          {isDone && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-sans flex-1">{item}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Focus of the Day Card */}
          {result.structuredTasks.focus && (
            <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-bold">
                ⚡ Focus of the Day
              </span>
              <p className="text-sm font-semibold text-white">
                {result.structuredTasks.focus}
              </p>
            </div>
          )}

          {/* Reset button */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setInput('');
                setResult(null);
                setTimeout(() => textareaRef.current?.focus(), 100);
              }}
              className="px-4 py-2 rounded-xl bg-[#12161f] hover:bg-[#171c27] border border-[#222838] text-slate-400 hover:text-slate-200 font-mono text-xs transition-colors"
            >
              + New Brain Dump
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!result && !loading && (
        <div className="text-center py-12 text-slate-400 font-mono text-xs space-y-2">
          <p>your chaos goes in. clarity comes out.</p>
          <p className="text-[11px] text-slate-400">
            Autonomous revenue recovery and agent-to-agent commerce protocol.
          </p>
        </div>
      )}
    </div>
  );
}
