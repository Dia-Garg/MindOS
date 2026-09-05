import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, CheckCircle2, Clock, RefreshCw, ExternalLink, ShieldCheck, Tag, Plus } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_ABANDONED_CARTS } from '../data/mockData.js';
import { razorpayService } from '../services/razorpay.js';
import { agentEngine } from '../services/agentEngine.js';

export default function CommerceTerminalTab({ onNavigateTab, onRevenueUpdate }) {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [abandonedCarts, setAbandonedCarts] = useState(INITIAL_ABANDONED_CARTS);
  const [recovering, setRecovering] = useState(false);
  const [generatedLinks, setGeneratedLinks] = useState({});

  async function handleCreateDirectLink(product) {
    try {
      const link = await razorpayService.createPaymentLink({
        amount: product.price,
        description: `Direct Purchase: ${product.name}`,
        customer: {
          name: 'Direct Customer',
          email: 'customer@neurashade.internal'
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
    <div className="space-y-6">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 block">RECOVERED GMV (AI LOOP)</span>
          <div className="text-2xl font-semibold text-zinc-100 font-mono tracking-tight">
            ₹{totalRecovered.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-400 font-medium inline-flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" />
            84.2% recovery rate
          </span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 block">AGENT-MEDIATED SESSIONS</span>
          <div className="text-2xl font-semibold text-zinc-100 font-mono tracking-tight">
            18
          </div>
          <span className="text-[11px] text-zinc-400">
            AP2 Protocol handshakes
          </span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 block">POLICY CEILING COMPLIANCE</span>
          <div className="text-2xl font-semibold text-zinc-100 font-mono tracking-tight">
            100%
          </div>
          <span className="text-[11px] text-zinc-400">
            ≤15% Discount rule active
          </span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-1">
          <span className="text-[11px] font-mono text-zinc-400 block">TRANSACTABLE SKUS</span>
          <div className="text-2xl font-semibold text-zinc-100 font-mono tracking-tight">
            {products.length}
          </div>
          <span className="text-[11px] text-zinc-400">
            Razorpay Test Rails active
          </span>
        </div>
      </div>

      {/* Revenue Recovery Workbench */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Autonomous Revenue Recovery Queue
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Tracks payment timeouts and dropped checkouts. Dispatches dynamic Razorpay recovery payment links with policy-bounded micro-discounts.
            </p>
          </div>

          {totalRecoverable > 0 && (
            <button
              onClick={handleAutoRecoverAll}
              disabled={recovering}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-medium transition-colors"
            >
              {recovering ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching Recovery Links...</span>
                </>
              ) : (
                <>
                  <span>Auto-Recover Batch (₹{totalRecoverable.toLocaleString()})</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/40 text-[11px] text-zinc-400 font-mono">
                <th className="py-3 px-5 font-normal">CUSTOMER</th>
                <th className="py-3 px-4 font-normal">ABANDONED ITEM</th>
                <th className="py-3 px-4 font-normal">AMOUNT</th>
                <th className="py-3 px-4 font-normal">DIAGNOSED DROP REASON</th>
                <th className="py-3 px-4 font-normal">RECOVERY PROBABILITY</th>
                <th className="py-3 px-5 font-normal text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {abandonedCarts.map(cart => (
                <tr key={cart.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-medium text-zinc-200">{cart.customerName}</div>
                    <div className="text-[11px] text-zinc-400 font-mono">{cart.email}</div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300">
                    <div>{cart.productName}</div>
                    <div className="text-[11px] text-zinc-400">{cart.abandonedAt}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-zinc-200">
                    ₹{cart.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-zinc-300 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                      {cart.dropReason}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400 font-mono text-[11px]">
                      {cart.recoveryProbability} High
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {cart.status === 'recovered' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-medium text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Link Dispatched (₹{Math.round(cart.amount * 0.9).toLocaleString()})
                      </span>
                    ) : (
                      <span className="text-zinc-400 text-xs">
                        Pending Autonomous Dispatch
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Catalog & Payment Links */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Active Merchandise Catalog
            </h3>
            <p className="text-xs text-zinc-400">
              Transactable directly or via AP2 Agent Protocol queries.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('ai-buyer')}
            className="text-xs text-zinc-400 hover:text-zinc-200 hover:underline flex items-center gap-1"
          >
            <span>Simulate Agent Purchase →</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div
              key={p.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                    {p.sku}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Stock: {p.stock}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-zinc-200">
                  {p.name}
                </h4>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>
                <div className="pt-2 flex items-baseline gap-2">
                  <span className="text-base font-semibold text-zinc-100 font-mono">
                    ₹{p.price.toLocaleString()}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    Floor: ₹{p.minNegotiatedPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-zinc-800/80">
                {generatedLinks[p.id] ? (
                  <a
                    href={generatedLinks[p.id]}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                  >
                    <span>View Razorpay Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => handleCreateDirectLink(p)}
                    className="w-full py-1.5 px-3 rounded-lg bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-700/60 transition-colors"
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
