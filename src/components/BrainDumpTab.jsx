import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, AlertCircle, ShoppingCart, Zap, ExternalLink } from 'lucide-react';
import { agentEngine } from '../services/agentEngine';

export default function BrainDumpTab({ onNavigateTab }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const samplePrompts = [
    {
      title: "🔥 Recover Carts + College Chaos",
      text: "Drowning in OS lab assignment due tomorrow 11pm. We also had 3 carts abandoned on the hoodie today because of UPI checkout dropoffs. Need to recover them now and keep focus clear."
    },
    {
      title: "⚡ Flash Sale + Brand Launch",
      text: "Launching a flash sale with 10% discount for our Cybernetic Hoodie to push end-of-month GMV on Razorpay. Need to study for neural networks quiz too."
    },
    {
      title: "🧠 General Founder Sync",
      text: "Feeling overwhelmed balancing final year project with manufacturing vendor calls. Need to review daily revenue and make sure our AI Buyer endpoints are responding."
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#00ff9d]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-syne text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#00ff9d]" />
              Executive Founder Terminal
            </h2>
            <p className="text-sm text-white/60 mt-1 font-sans">
              Dump raw thoughts, college deadlines, stress, and brand ideas. MindOS structures your focus and autonomously executes bounded Razorpay commerce actions.
            </p>
          </div>
          <span className="font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-[#00ff9d]/10 border border-[#00ff9d]/20 text-[#00ff9d]">
            Autonomous Agent Loop
          </span>
        </div>

        {/* Quick Sample Prompts */}
        <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-2 items-center">
          <span className="font-mono text-[11px] text-white/40 mr-1">Quick Test Scenarios:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => setInput(p.text)}
              className="font-mono text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-all text-left"
            >
              {p.title}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 shadow-2xl focus-within:border-[#00ff9d]/40 transition-all">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Dump everything here. Assignments due. Brand ideas. Customer dropoffs to recover. Half-formed thoughts. Don't filter..."
          rows={5}
          className="w-full bg-transparent border-none text-white text-sm font-sans leading-relaxed focus:outline-none placeholder:text-white/30 resize-none"
        />

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10 font-mono text-xs">
          <span className="text-white/40">
            {input.length > 0 ? `${input.length} characters` : 'Press "Process with Agent" to organize & execute'}
          </span>
          <button
            onClick={handleProcess}
            disabled={!input.trim() || loading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold font-mono tracking-wider text-xs transition-all ${
              input.trim() && !loading
                ? 'bg-[#00ff9d] text-black hover:bg-[#00ff9d]/90 shadow-[0_0_20px_rgba(0,255,157,0.3)] cursor-pointer'
                : 'bg-white/10 text-white/30 cursor-not-allowed'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span>REASONING & EXECUTING...</span>
              </>
            ) : (
              <>
                <span>PROCESS WITH AGENT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Stream */}
      {result && (
        <div className="space-y-6 animate-fade-slide">
          {/* Automated Actions Triggered Banner (Commerce Wow Factor!) */}
          {result.actionsTriggered && result.actionsTriggered.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#00ff9d]/10 via-[#4da6ff]/10 to-transparent border border-[#00ff9d]/30 shadow-lg">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-[#00ff9d] uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-[#00ff9d]" />
                Automated Razorpay Commerce Actions Executed:
              </div>
              <div className="space-y-2">
                {result.actionsTriggered.map((act, i) => (
                  <div key={i} className="flex flex-col md:flex-row md:items-center justify-between p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono">
                    <span className="text-white font-medium">{act.message}</span>
                    <button
                      onClick={() => onNavigateTab('commerce')}
                      className="mt-2 md:mt-0 flex items-center gap-1 text-[#00ff9d] hover:underline font-bold"
                    >
                      <span>View in Commerce Terminal</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Acknowledge Note */}
          <div className="p-4 rounded-xl bg-white/[0.03] border-l-4 border-[#00ff9d] border-t border-r border-b border-white/10 text-sm italic text-white/80">
            "{result.structuredTasks.acknowledge}"
          </div>

          {/* Focus of the Day */}
          {result.structuredTasks.focus && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#00ff9d]/10 to-[#4da6ff]/10 border border-[#00ff9d]/40 shadow-xl">
              <div className="font-mono text-[10px] text-[#00ff9d] uppercase tracking-widest font-bold mb-1">
                ⚡ Focus of the Day
              </div>
              <div className="text-base font-semibold text-white font-sans">
                {result.structuredTasks.focus}
              </div>
            </div>
          )}

          {/* 3 Categories: College, Brand, Personal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Brand Category */}
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  <h3 className="font-mono text-xs font-bold text-[#ff6b9d] uppercase tracking-wider">
                    Brand & Revenue
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-white/40">
                  {result.structuredTasks.brand.length} tasks
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
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        isDone
                          ? 'bg-white/[0.02] border-white/5 text-white/30 line-through'
                          : 'bg-white/[0.04] border-white/10 text-white hover:border-[#ff6b9d]/30'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-all ${
                        isDone ? 'border-[#00ff9d] bg-[#00ff9d]/20 text-[#00ff9d]' : 'border-white/30'
                      }`}>
                        {isDone && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-sans leading-relaxed flex-1">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* College Category */}
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎓</span>
                  <h3 className="font-mono text-xs font-bold text-[#4da6ff] uppercase tracking-wider">
                    College & BTech
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-white/40">
                  {result.structuredTasks.college.length} tasks
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
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        isDone
                          ? 'bg-white/[0.02] border-white/5 text-white/30 line-through'
                          : 'bg-white/[0.04] border-white/10 text-white hover:border-[#4da6ff]/30'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-all ${
                        isDone ? 'border-[#00ff9d] bg-[#00ff9d]/20 text-[#00ff9d]' : 'border-white/30'
                      }`}>
                        {isDone && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-sans leading-relaxed flex-1">
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Personal Category */}
            <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  <h3 className="font-mono text-xs font-bold text-[#ffc35a] uppercase tracking-wider">
                    Personal & Energy
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-white/40">
                  {result.structuredTasks.personal.length} tasks
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
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        isDone
                          ? 'bg-white/[0.02] border-white/5 text-white/30 line-through'
                          : 'bg-white/[0.04] border-white/10 text-white hover:border-[#ffc35a]/30'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 border flex items-center justify-center transition-all ${
                        isDone ? 'border-[#00ff9d] bg-[#00ff9d]/20 text-[#00ff9d]' : 'border-white/30'
                      }`}>
                        {isDone && <CheckCircle2 className="w-3 h-3" />}
                      </div>
                      <span className="text-xs font-sans leading-relaxed flex-1">
                        {item}
                      </span>
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
