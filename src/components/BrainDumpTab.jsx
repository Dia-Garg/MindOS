import React, { useState } from 'react';
import { Terminal, ArrowRight, CheckCircle2, AlertCircle, ShoppingBag, ExternalLink, CornerDownLeft, Sparkles } from 'lucide-react';
import { agentEngine } from '../services/agentEngine.js';

export default function BrainDumpTab({ onNavigateTab }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const samplePrompts = [
    {
      title: "Recover Checkout Drops + Lab Workload",
      text: "Operating Systems lab due tomorrow 11pm. We also had 3 customer dropoffs on the hoodie checkout today due to payment timeouts. Execute recovery links and organize remaining engineering tasks."
    },
    {
      title: "Promotional Campaign + Model Training",
      text: "Deploy a 10% promotional flash sale payment link for the Cybernetic Hoodie to accelerate monthly target. Need to finish hyperparameter tuning script for AI specialization project."
    },
    {
      title: "Daily Founder Operations Standup",
      text: "Reviewing supplier quotes for next inventory batch, verifying AP2 AI Buyer Gateway status, and preparing for end-semester project review."
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

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Description */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>FOUNDER EXECUTIVE WORKBENCH</span>
              <span>•</span>
              <span className="text-zinc-300">NATURAL LANGUAGE OPERATIONS</span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-100 mt-1">
              Natural Language Operations & Task Extraction
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
              Input unstructured thoughts, deadlines, and merchant directives. MindOS classifies action items and autonomously dispatches bounded Razorpay commerce workflows.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="mt-5 pt-4 border-t border-zinc-800 flex flex-wrap gap-2 items-center text-xs">
          <span className="text-zinc-400 text-[11px] font-mono mr-1">PRESET SCENARIOS:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => setInput(p.text)}
              className="px-3 py-1.5 rounded-md bg-zinc-800/60 hover:bg-zinc-800 border border-zinc-700/60 text-zinc-300 text-xs transition-colors"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Editor */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter founder directives, operational notes, assignments due, or payment recovery instructions..."
          rows={5}
          className="w-full bg-transparent border-none text-zinc-200 text-sm font-sans placeholder:text-zinc-400 focus:outline-none resize-none leading-relaxed"
        />

        <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-xs">
          <span className="text-zinc-400 font-mono text-[11px]">
            {input.length > 0 ? `${input.length} characters` : 'Press "Dispatch to Agent" to classify and execute'}
          </span>

          <button
            onClick={handleProcess}
            disabled={!input.trim() || loading}
            className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-colors ${
              input.trim() && !loading
                ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 cursor-pointer shadow-sm'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <span>Classifying Directives...</span>
            ) : (
              <>
                <span>Dispatch to Agent</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Processed Output */}
      {result && (
        <div className="space-y-6">
          {/* Automated Actions Banner */}
          {result.actionsTriggered && result.actionsTriggered.length > 0 && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-emerald-300">
                    Automated Razorpay Commerce Actions Executed
                  </div>
                  <div className="text-xs text-zinc-300 mt-0.5">
                    {result.actionsTriggered[0]?.message}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('commerce')}
                className="text-xs font-medium text-emerald-400 hover:underline flex items-center gap-1 whitespace-nowrap self-start md:self-auto"
              >
                <span>View in Merchant Console</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Acknowledgement & Focus */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 md:col-span-1">
              <span className="text-[11px] font-mono text-zinc-400 block mb-1">EXECUTIVE STATUS</span>
              <p className="text-xs text-zinc-300 italic leading-relaxed">
                "{result.structuredTasks.acknowledge}"
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 md:col-span-2">
              <span className="text-[11px] font-mono text-zinc-400 block mb-1">PRIMARY FOCUS TARGET</span>
              <p className="text-sm font-medium text-zinc-100 leading-snug">
                {result.structuredTasks.focus}
              </p>
            </div>
          </div>

          {/* 3 Classified Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Revenue & Brand */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-semibold text-zinc-200">Revenue & Commerce</span>
                <span className="text-[11px] font-mono text-zinc-400">{result.structuredTasks.brand.length} items</span>
              </div>
              <div className="space-y-2">
                {result.structuredTasks.brand.map((item, idx) => {
                  const taskId = `brand_${idx}`;
                  const isDone = completedTasks.has(taskId);
                  return (
                    <div
                      key={taskId}
                      onClick={() => toggleTask(taskId)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isDone
                          ? 'bg-zinc-950/40 border-zinc-800/40 text-zinc-400 line-through'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Academic & CSE */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-semibold text-zinc-200">Academic & Engineering</span>
                <span className="text-[11px] font-mono text-zinc-400">{result.structuredTasks.college.length} items</span>
              </div>
              <div className="space-y-2">
                {result.structuredTasks.college.map((item, idx) => {
                  const taskId = `college_${idx}`;
                  const isDone = completedTasks.has(taskId);
                  return (
                    <div
                      key={taskId}
                      onClick={() => toggleTask(taskId)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isDone
                          ? 'bg-zinc-950/40 border-zinc-800/40 text-zinc-400 line-through'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personal / Focus */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
                <span className="text-xs font-semibold text-zinc-200">Operations & Personal</span>
                <span className="text-[11px] font-mono text-zinc-400">{result.structuredTasks.personal.length} items</span>
              </div>
              <div className="space-y-2">
                {result.structuredTasks.personal.map((item, idx) => {
                  const taskId = `personal_${idx}`;
                  const isDone = completedTasks.has(taskId);
                  return (
                    <div
                      key={taskId}
                      onClick={() => toggleTask(taskId)}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                        isDone
                          ? 'bg-zinc-950/40 border-zinc-800/40 text-zinc-400 line-through'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
