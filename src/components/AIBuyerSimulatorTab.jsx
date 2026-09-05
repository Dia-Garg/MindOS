import React, { useState } from 'react';
import { Cpu, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink, ShieldCheck, Play } from 'lucide-react';
import { aiBuyerProtocol } from '../services/aiBuyerProtocol.js';
import { razorpayService } from '../services/razorpay.js';

export default function AIBuyerSimulatorTab({ onNavigateTab }) {
  const [selectedScenario, setSelectedScenario] = useState('success');
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0 = idle, 1 = discovering, 2 = negotiating, 3 = settled
  const [finalResult, setFinalResult] = useState(null);

  const scenarios = [
    {
      id: 'success',
      title: '1. Standard AI Negotiation & Checkout',
      desc: 'AI Buyer requests 12% off. Within 15% merchant cap. Razorpay link issued.',
      badge: 'Happy Path',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    },
    {
      id: 'greedy',
      title: '2. Greedy Offer & Floor Defense',
      desc: 'Buyer bot bids ₹999 (60% off). Policy blocks loss and counters at ₹2,124 floor.',
      badge: 'Policy Gated',
      color: 'text-sky-400 border-sky-500/30 bg-sky-500/10'
    },
    {
      id: 'failure',
      title: '3. Gateway Failure Handled Gracefully',
      desc: 'Simulates Razorpay bank rail timeout. Catches fault & dispatches fallback UPI link.',
      badge: 'Resilience Demo',
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10'
    },
    {
      id: 'approval',
      title: '4. High-Value Order (>₹5,000)',
      desc: '5 units totaling ₹12,495. Autonomous flow paused for founder authorization.',
      badge: 'Human-in-Loop',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    }
  ];

  async function runSimulation() {
    setRunning(true);
    setCurrentStep(1);
    setFinalResult(null);

    try {
      // Step 1: Discover
      await new Promise(r => setTimeout(r, 600));
      setCurrentStep(2);

      // Step 2: Negotiate
      await new Promise(r => setTimeout(r, 600));

      if (selectedScenario === 'success') {
        const neg = await aiBuyerProtocol.negotiate({
          productId: 'prod_hoodie_01',
          proposedPrice: 2199,
          quantity: 1,
          buyerAgentId: 'Agent_ShoppingBot_v4'
        });

        setCurrentStep(3);
        await new Promise(r => setTimeout(r, 500));

        const checkout = await aiBuyerProtocol.executeAgenticCheckout({
          productId: 'prod_hoodie_01',
          agreedPrice: neg.negotiatedPrice,
          quantity: 1,
          buyerAgentId: 'Agent_ShoppingBot_v4'
        });

        setFinalResult(checkout);

      } else if (selectedScenario === 'greedy') {
        const neg = await aiBuyerProtocol.negotiate({
          productId: 'prod_hoodie_01',
          proposedPrice: 999,
          quantity: 1,
          buyerAgentId: 'BargainHunter_Bot'
        });

        setCurrentStep(3);
        setFinalResult(neg);

      } else if (selectedScenario === 'failure') {
        razorpayService.setSimulatedFailure(true);
        setCurrentStep(3);
        await new Promise(r => setTimeout(r, 500));

        const checkout = await aiBuyerProtocol.executeAgenticCheckout({
          productId: 'prod_hoodie_01',
          agreedPrice: 2499,
          quantity: 1,
          buyerAgentId: 'Resilience_Test_Agent'
        });

        setFinalResult(checkout);

      } else if (selectedScenario === 'approval') {
        setCurrentStep(3);
        await new Promise(r => setTimeout(r, 500));

        const checkout = await aiBuyerProtocol.executeAgenticCheckout({
          productId: 'prod_hoodie_01',
          agreedPrice: 2499,
          quantity: 5,
          buyerAgentId: 'Wholesale_Bot_99'
        });

        setFinalResult(checkout);
      }

    } catch (err) {
      console.error(err);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Intro */}
      <div className="text-center space-y-1">
        <h2 className="text-lg font-bold text-white font-syne">
          AI Buyer Handshake Simulator
        </h2>
        <p className="text-xs text-slate-400 font-sans">
          Simulate an external AI shopping bot purchasing your merchandise via NPCI UAP and AP2 protocols.
        </p>
      </div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {scenarios.map(s => {
          const isSelected = selectedScenario === s.id;
          return (
            <div
              key={s.id}
              onClick={() => !running && setSelectedScenario(s.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#171c27] border-emerald-500/50 shadow-md'
                  : 'bg-[#12161f] border-[#222838] hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${s.color}`}>
                  {s.badge}
                </span>
                {isSelected && <span className="text-[10px] font-mono text-emerald-400">Selected</span>}
              </div>
              <h4 className="text-xs font-bold text-slate-100 font-sans mt-2">
                {s.title}
              </h4>
              <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Action Trigger */}
      <div className="flex items-center justify-center pt-2">
        <button
          onClick={runSimulation}
          disabled={running}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold font-mono text-xs tracking-wider transition-all ${
            !running
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 cursor-pointer shadow-lg'
              : 'bg-[#171c27] text-slate-500 cursor-not-allowed border border-[#222838]'
          }`}
        >
          {running ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>COMMUNICATING WITH AGENT...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>SIMULATE AGENT PURCHASE</span>
            </>
          )}
        </button>
      </div>

      {/* Progressive Step Feedback */}
      {currentStep > 0 && (
        <div className="bg-[#12161f] border border-[#222838] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono border-b border-[#222838] pb-3">
            <span className="text-slate-400">PROTOCOL PROGRESS</span>
            <span className="text-emerald-400 font-bold">
              {currentStep === 1 && '1/3 Discovering Catalog...'}
              {currentStep === 2 && '2/3 Evaluating Price Bounds...'}
              {currentStep === 3 && '3/3 Handshake Finalized'}
            </span>
          </div>

          {/* Result Card */}
          {finalResult && (
            <div className="space-y-3 font-sans text-xs">
              {finalResult.status === 'SUCCESS' && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Purchase Approved & Razorpay Link Created</span>
                  </div>
                  <div className="text-slate-300 space-y-1">
                    <div>Product: <strong className="text-white">{finalResult.product}</strong></div>
                    <div>Agreed Settlement: <strong className="text-emerald-400 font-mono">₹{finalResult.amount.toLocaleString()}</strong></div>
                    <div>Order ID: <span className="font-mono text-[11px] text-slate-400">{finalResult.orderId}</span></div>
                  </div>
                  <a
                    href={finalResult.paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                  >
                    <span>Open Razorpay Payment Link ↗</span>
                  </a>
                </div>
              )}

              {finalResult.status === 'COUNTER_OFFER' && (
                <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Policy Floor Defense Triggered</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Buyer bot offered <span className="line-through text-rose-400 font-mono">₹{finalResult.requestedPrice}</span>. MindOS safety gate rejected the loss and auto-countered at the merchant floor: <strong className="text-emerald-400 font-mono">₹{finalResult.counterPrice}</strong> (15% max discount).
                  </p>
                </div>
              )}

              {finalResult.status === 'FAILOVER_HANDLED' && (
                <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <RefreshCw className="w-4 h-4" />
                    <span>Razorpay Gateway Failover Recovered</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {finalResult.error}. MindOS gracefully intercepted the fault, kept inventory locked, and issued an automated fallback UPI payment link without crashing.
                  </p>
                </div>
              )}

              {finalResult.status === 'AWAITING_FOUNDER_APPROVAL' && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Escalated for Founder Approval</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {finalResult.reason}
                  </p>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  onClick={() => onNavigateTab('audit')}
                  className="text-slate-400 hover:text-emerald-400 font-mono text-[11px] underline"
                >
                  View this action in Audit Log (Step 4) →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
