import React, { useState } from 'react';
import { ShoppingBag, ArrowUpRight, CheckCircle2, RefreshCw, ExternalLink, Sparkles } from 'lucide-react';
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
          email: 'customer@neurashade.com'
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Top Stats Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#12161f] border border-[#222838] space-y-1">
          <span className="font-mono text-[10px] text-slate-400 uppercase">Recovered Revenue (AI Loop)</span>
          <div className="font-mono text-2xl font-bold text-emerald-400">
            ₹{totalRecovered.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-300 font-sans">+84% recovery on timeout drops</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12161f] border border-[#222838] space-y-1">
          <span className="font-mono text-[10px] text-slate-400 uppercase">Policy Ceiling Rule</span>
          <div className="font-mono text-2xl font-bold text-white">
            15% Max
          </div>
          <span className="text-[11px] text-slate-400 font-sans">Zero out-of-budget leakage</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#12161f] border border-[#222838] space-y-1">
          <span className="font-mono text-[10px] text-slate-400 uppercase">Payment Rails</span>
          <div className="font-mono text-2xl font-bold text-sky-400">
            Integrated
          </div>
          <span className="text-[11px] text-slate-400 font-sans">Orders & Links APIs Active</span>
        </div>
      </div>

      {/* Cart Recovery Queue */}
      <div className="bg-[#12161f] border border-[#222838] rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222838]">
          <div>
            <h3 className="font-bold text-sm text-white font-sans flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Autonomous Revenue Recovery
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Identifies abandoned checkouts and dispatches dynamic recovery payment links.
            </p>
          </div>

          {totalRecoverable > 0 && (
            <button
              onClick={handleAutoRecoverAll}
              disabled={recovering}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-colors shadow-md cursor-pointer whitespace-nowrap"
            >
              {recovering ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>DISPATCHING LINKS...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>RECOVER ALL (₹{totalRecoverable.toLocaleString()})</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="space-y-2">
          {abandonedCarts.map(cart => (
            <div
              key={cart.id}
              className="p-3.5 rounded-xl bg-[#171c27]/60 border border-[#222838] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div>
                <div className="font-bold text-slate-200">{cart.customerName}</div>
                <div className="text-slate-400 text-[11px]">{cart.productName} • Drop reason: {cart.dropReason}</div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono text-sm font-bold text-white">
                  ₹{cart.amount.toLocaleString()}
                </span>
                {cart.status === 'recovered' ? (
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Recovered (₹{Math.round(cart.amount * 0.9).toLocaleString()})
                  </span>
                ) : (
                  <span className="text-slate-400 text-[11px] font-mono">
                    Pending Action
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Catalog */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-white font-sans">
          Active Brand Merchandise
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {products.map(p => (
            <div
              key={p.id}
              className="bg-[#12161f] border border-[#222838] rounded-2xl p-4 flex flex-col justify-between hover:border-emerald-500/30 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                  <span className="font-mono text-[10px] text-emerald-400">Stock: {p.stock}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200">{p.name}</h4>
                <div className="font-mono text-sm font-bold text-emerald-400">
                  ₹{p.price.toLocaleString()}
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#222838]">
                {generatedLinks[p.id] ? (
                  <a
                    href={generatedLinks[p.id]}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold hover:bg-emerald-500/30"
                  >
                    <span>Open Payment Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => handleCreateDirectLink(p)}
                    className="w-full py-2 rounded-xl bg-[#171c27] hover:bg-[#222838] text-slate-300 text-xs font-mono transition-colors"
                  >
                    Generate Payment Link
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
