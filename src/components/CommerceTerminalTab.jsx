import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, CheckCircle2, Clock, Sparkles, RefreshCw, AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_ABANDONED_CARTS } from '../data/mockData';
import { razorpayService } from '../services/razorpay';
import { agentEngine } from '../services/agentEngine';

export default function CommerceTerminalTab({ onNavigateTab, onRevenueUpdate }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [abandonedCarts, setAbandonedCarts] = useState(INITIAL_ABANDONED_CARTS);
  const [recovering, setRecovering] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState({});

  async function handleCreateDirectLink(product) {
    try {
      const link = await razorpayService.createPaymentLink({
        amount: product.price,
        description: `Instant Purchase: ${product.name}`,
        customer: {
          name: 'Direct Customer',
          email: 'customer@brand.co'
        }
      });
      setGeneratedLinks(prev => ({ ...prev, [product.id]: link.short_url }));
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAutoRecoverAll() {
    setRecovering(true);
    try {
      const res = await agentEngine.recoverAllPendingCarts();
      setAbandonedCarts(prev =>
        prev.map(c => ({
          ...c,
          status: 'recovered'
        }))
      );
      if (onRevenueUpdate) onRevenueUpdate(res.totalRecoveredAmount);
    } catch (err) {
      console.error(err);
    } finally {
      setRecovering(false);
    }
  }

  const totalRecoverable = abandonedCarts
    .filter(c => c.status === 'pending_agent_action')
    .reduce((acc, c) => acc + c.amount, 0);

  const totalRecovered = abandonedCarts
    .filter(c => c.status === 'recovered')
    .reduce((acc, c) => acc + Math.round(c.amount * 0.9), 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#12121a] border border-white/10 space-y-1">
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
            Recovered Revenue (AI Loop)
          </div>
          <div className="font-mono text-2xl font-bold text-[#00ff9d]">
            ₹{totalRecovered.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#00ff9d]/70 flex items-center gap-1 font-mono">
            <ArrowUpRight className="w-3 h-3" />
            <span>+84% recovery on timeout drops</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12121a] border border-white/10 space-y-1">
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
            Agent-to-Agent Transactions
          </div>
          <div className="font-mono text-2xl font-bold text-[#4da6ff]">
            14
          </div>
          <div className="text-[11px] text-[#4da6ff]/70 flex items-center gap-1 font-mono">
            <span>UAP / AP2 protocol queries</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12121a] border border-white/10 space-y-1">
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
            Policy Safety Compliance
          </div>
          <div className="font-mono text-2xl font-bold text-[#ffc35a]">
            100%
          </div>
          <div className="text-[11px] text-[#ffc35a]/70 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3 h-3" />
            <span>Zero out-of-budget leakage</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#12121a] border border-white/10 space-y-1">
          <div className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
            Active Catalog SKUs
          </div>
          <div className="font-mono text-2xl font-bold text-white">
            {products.length}
          </div>
          <div className="text-[11px] text-white/50 flex items-center gap-1 font-mono">
            <span>All transactable via Razorpay</span>
          </div>
        </div>
      </div>

      {/* Revenue Recovery Section (Track 3 & Growth Feature) */}
      <div className="bg-[#12121a] border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#00ff9d]" />
              <h3 className="font-syne text-lg font-bold text-white">
                Autonomous Revenue Recovery Agent
              </h3>
            </div>
            <p className="text-xs text-white/60 font-sans mt-0.5">
              Identifies payment failures, UPI timeouts, and dropped checkouts. Evaluates probability and dispatches bounded Razorpay recovery links.
            </p>
          </div>

          {totalRecoverable > 0 && (
            <button
              onClick={handleAutoRecoverAll}
              disabled={recovering}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00ff9d] text-black font-mono font-bold text-xs hover:bg-[#00ff9d]/90 shadow-[0_0_20px_rgba(0,255,157,0.3)] transition-all cursor-pointer"
            >
              {recovering ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>DISPATCHING RECOVERY AGENTS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AUTO-RECOVER ALL (₹{totalRecoverable.toLocaleString()} AT RISK)</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Abandoned Carts Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/40 uppercase text-[10px]">
                <th className="pb-3">Customer</th>
                <th className="pb-3">Product</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Drop Reason</th>
                <th className="pb-3">Recovery Score</th>
                <th className="pb-3 text-right">Status / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {abandonedCarts.map(cart => (
                <tr key={cart.id} className="text-white/80">
                  <td className="py-3.5">
                    <div className="font-bold text-white">{cart.customerName}</div>
                    <div className="text-[10px] text-white/40">{cart.email}</div>
                  </td>
                  <td className="py-3.5">
                    <div>{cart.productName}</div>
                    <div className="text-[10px] text-white/40">{cart.abandonedAt}</div>
                  </td>
                  <td className="py-3.5 font-bold text-white">
                    ₹{cart.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-[#ffc35a]">
                    {cart.dropReason}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20 text-[10px]">
                      {cart.recoveryProbability} High
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    {cart.status === 'recovered' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-[#00ff9d] text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Recovered (₹{Math.round(cart.amount * 0.9)})
                      </span>
                    ) : (
                      <span className="text-white/40 text-[11px]">Pending AI Action</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Catalog & Instant Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-syne text-lg font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#4da6ff]" />
              Merchant Products & Live Inventory
            </h3>
            <p className="text-xs text-white/60 font-sans">
              All items are exposed to external AI buyer agents via the AP2 schema and can be purchased on Razorpay test mode.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('ai-buyer')}
            className="font-mono text-xs text-[#4da6ff] hover:underline flex items-center gap-1"
          >
            <span>Simulate AI Buyer Purchase</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => (
            <div key={p.id} className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all">
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/60">
                    {p.sku}
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/20">
                    Stock: {p.stock}
                  </span>
                </div>
                <h4 className="font-syne text-base font-bold text-white">
                  {p.name}
                </h4>
                <p className="text-xs text-white/60 font-sans line-clamp-2">
                  {p.description}
                </p>
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="font-mono text-lg font-bold text-[#00ff9d]">
                    ₹{p.price.toLocaleString()}
                  </span>
                  <span className="font-mono text-[10px] text-white/40">
                    (Floor: ₹{p.minNegotiatedPrice})
                  </span>
                </div>
              </div>

              <div className="p-4 bg-white/[0.02] border-t border-white/10">
                {generatedLinks[p.id] ? (
                  <a
                    href={generatedLinks[p.id]}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/40 font-mono text-xs font-bold hover:bg-[#00ff9d]/30 transition-all"
                  >
                    <span>Open Razorpay Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => handleCreateDirectLink(p)}
                    className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs font-semibold transition-all"
                  >
                    Generate Test Payment Link
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
