import React, { useState } from 'react';
import { Cpu, ArrowRight, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, RefreshCw, ExternalLink, Zap, Terminal } from 'lucide-react';
import { aiBuyerProtocol } from '../services/aiBuyerProtocol';
import { razorpayService } from '../services/razorpay';

export default function AIBuyerSimulatorTab({ onNavigateTab }) {
  const [selectedScenario, setSelectedScenario] = useState('success');
  const [running, setRunning] = useState(false);
  const [stepLogs, setStepLogs] = useState([]);
  const [finalResult, setFinalResult] = useState(null);

  const scenarios = [
    {
      id: 'success',
      title: '1. Standard Agentic Handshake & Purchase',
      desc: 'AI Buyer negotiates Hoodie within 15% discount limit. Order approved & Razorpay payment link issued.',
      badge: 'Happy Path',
      badgeColor: 'border-[#00ff9d]/30 text-[#00ff9d] bg-[#00ff9d]/10'
    },
    {
      id: 'greedy',
      title: '2. Greedy Offer & Bounded Counter-Offer',
      desc: 'Buyer agent bids ₹999 (below cost). Policy gate blocks loss and counters with allowable floor price.',
      badge: 'Policy Gated',
      badgeColor: 'border-[#4da6ff]/30 text-[#4da6ff] bg-[#4da6ff]/10'
    },
    {
      id: 'failure',
      title: '3. Gateway Failure Handled Gracefully',
      desc: 'Simulates a Razorpay bank rail timeout. MindOS catches failure, locks inventory, and issues fallback payment link.',
      badge: 'Razorpay Resilience',
      badgeColor: 'border-[#ff6b9d]/30 text-[#ff6b9d] bg-[#ff6b9d]/10'
    },
    {
      id: 'approval',
      title: '4. High-Value Order & Human-in-the-Loop',
      desc: 'Bulk order exceeding ₹5,000 threshold. MindOS halts autonomous execution and requires founder approval.',
      badge: 'Gated Escalate',
      badgeColor: 'border-[#ffc35a]/30 text-[#ffc35a] bg-[#ffc35a]/10'
    }
  ];

  async function runSimulation() {
    setRunning(true);
    setStepLogs([]);
    setFinalResult(null);

    const appendLog = (step, detail, status = 'info') => {
      setStepLogs(prev => [...prev, { step, detail, status, time: new Date().toLocaleTimeString() }]);
    };

    try {
      // Step 1: AP2 / UAP Protocol Discovery
      appendLog('1. Discovery Handshake', 'AI Buyer initiating AP2 protocol handshake with MindOS gateway (/catalog.json)...');
      await new Promise(r => setTimeout(r, 600));

      const catalog = await aiBuyerProtocol.discoverCatalog({ query: 'hoodie' });
      appendLog('2. Schema Received', `Found SKU NS-HD-001 "${catalog.items[0].name}" (List Price: ₹${catalog.items[0].listPrice})`);
      await new Promise(r => setTimeout(r, 600));

      if (selectedScenario === 'success') {
        // Step 2: Negotiation within policy
        appendLog('3. Price Negotiation', 'Buyer proposes ₹2,199 (12% discount) for single unit...');
        await new Promise(r => setTimeout(r, 600));

        const neg = await aiBuyerProtocol.negotiate({
          productId: 'prod_hoodie_01',
          proposedPrice: 2199,
          quantity: 1,
          buyerAgentId: 'Agent_ShoppingBot_v4'
        });

        appendLog('4. Policy Gate Check', `Offer ₹2,199 evaluated against MaxDiscountPolicy (15%). Result: ${neg.status}`, 'success');
        await new Promise(r => setTimeout(r, 600));

        // Step 3: Checkout
        appendLog('5. Razorpay Checkout', 'Initiating Razorpay test order creation (POST /v1/orders)...');
        await new Promise(r => setTimeout(r, 600));

        const checkout = await aiBuyerProtocol.executeAgenticCheckout({
          productId: 'prod_hoodie_01',
          agreedPrice: neg.negotiatedPrice,
          quantity: 1,
          buyerAgentId: 'Agent_ShoppingBot_v4'
        });

        appendLog('6. Order Settled', `Razorpay Order ${checkout.orderId} & Payment Link created! Short URL: ${checkout.paymentUrl}`, 'success');
        setFinalResult(checkout);

      } else if (selectedScenario === 'greedy') {
        // Scenario 2: Greedy offer
        appendLog('3. Aggressive Negotiation', 'Buyer bot bids aggressive price: ₹999 (60% discount)...');
        await new Promise(r => setTimeout(r, 600));

        const neg = await aiBuyerProtocol.negotiate({
          productId: 'prod_hoodie_01',
          proposedPrice: 999,
          quantity: 1,
          buyerAgentId: 'BargainHunter_Bot'
        });

        appendLog('4. Policy Gate Blocked', `Requested discount (60%) violates policy limit (15%). Floor price enforced: ₹${neg.counterPrice}`, 'warning');
        await new Promise(r => setTimeout(r, 600));

        appendLog('5. Autonomous Counter-Offer', `Counter-offer dispatched to buyer bot: ₹${neg.counterPrice} with 15-minute validity token.`, 'info');
        setFinalResult(neg);

      } else if (selectedScenario === 'failure') {
        // Scenario 3: Failure handling (Razorpay Requirement!)
        appendLog('3. Arming Simulated Failure', 'Configuring Razorpay mock adapter to trigger GATEWAY_TIMEOUT on payment execution...');
        razorpayService.setSimulatedFailure(true);
        await new Promise(r => setTimeout(r, 600));

        appendLog('4. Negotiating Item', 'Handshake completed for Cybernetic Hoodie at standard price ₹2,499...');
        await new Promise(r => setTimeout(r, 600));

        appendLog('5. Executing Checkout Rail', 'Calling Razorpay Bank Rail (POST /v1/orders)...');
        await new Promise(r => setTimeout(r, 600));

        const checkout = await aiBuyerProtocol.executeAgenticCheckout({
          productId: 'prod_hoodie_01',
          agreedPrice: 2499,
          quantity: 1,
          buyerAgentId: 'Resilience_Test_Agent'
        });

        appendLog('6. Graceful Recovery Triggered', `Primary rail failed gracefully without crash! MindOS caught exception and triggered fallback: "${checkout.fallbackAction}"`, 'success');
        setFinalResult(checkout);

      } else if (selectedScenario === 'approval') {
        // Scenario 4: Human in the loop
        appendLog('3. Bulk Order Request', 'Buyer agent attempts to buy 5 hoodies totaling ₹12,495...');
        await new Promise(r => setTimeout(r, 600));

        appendLog('4. Threshold Verification', 'Comparing ₹12,495 against autonomous threshold ₹5,000...');
        await new Promise(r => setTimeout(r, 600));

        const checkout = await aiBuyerProtocol.executeAgenticCheckout({
          productId: 'prod_hoodie_01',
          agreedPrice: 2499,
          quantity: 5,
          buyerAgentId: 'Wholesale_Bot_99'
        });

        appendLog('5. Gated for Founder Approval', checkout.reason, 'warning');
        setFinalResult(checkout);
      }

    } catch (err) {
      appendLog('Error', err.message, 'error');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#4da6ff]" />
              <h2 className="font-syne text-xl font-bold text-white">
                Agentic Commerce & AI Buyer Simulator
              </h2>
            </div>
            <p className="text-sm text-white/60 mt-1 font-sans max-w-2xl">
              Demonstrates end-to-end agent-to-agent commerce compliant with NPCI UAP and AP2 protocols. External AI shopping agents query the catalog, negotiate within merchant bounds, and execute payments via Razorpay test APIs.
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('audit')}
            className="font-mono text-xs text-[#ffc35a] hover:underline flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit Trail</span>
          </button>
        </div>

        {/* Scenario Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {scenarios.map(s => (
            <div
              key={s.id}
              onClick={() => {
                if (!running) setSelectedScenario(s.id);
              }}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                selectedScenario === s.id
                  ? 'bg-[#4da6ff]/10 border-[#4da6ff]/50 shadow-[0_0_15px_rgba(77,166,255,0.2)]'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20'
              }`}
            >
              <div>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded border font-bold ${s.badgeColor}`}>
                  {s.badge}
                </span>
                <h4 className="font-mono text-xs font-bold text-white mt-2.5">
                  {s.title}
                </h4>
                <p className="text-[11px] text-white/50 font-sans mt-1">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/10">
          <div className="font-mono text-xs text-white/50">
            Selected: <span className="text-[#4da6ff] font-bold">{scenarios.find(s => s.id === selectedScenario)?.title}</span>
          </div>
          <button
            onClick={runSimulation}
            disabled={running}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs font-bold tracking-wider transition-all ${
              !running
                ? 'bg-[#4da6ff] text-black hover:bg-[#4da6ff]/90 shadow-[0_0_20px_rgba(77,166,255,0.3)] cursor-pointer'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            {running ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>RUNNING PROTOCOL HANDSHAKE...</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5" />
                <span>RUN AGENTIC SIMULATION</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Terminal Output & Live Step Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Step-by-Step Execution Feed */}
        <div className="lg:col-span-2 bg-[#0c0c14] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs">
              <div className="flex items-center gap-2 text-white/60">
                <Terminal className="w-4 h-4 text-[#00ff9d]" />
                <span>AGENTIC COMMERCE EVENT STREAM</span>
              </div>
              <span className="text-[10px] text-white/40">PROTOCOL: AP2-2026.1</span>
            </div>

            <div className="py-4 space-y-3 font-mono text-xs min-h-[260px]">
              {stepLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-white/30 space-y-2">
                  <Cpu className="w-8 h-8 opacity-40" />
                  <p>Select a scenario above and click "Run Agentic Simulation"</p>
                </div>
              ) : (
                stepLogs.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 animate-fade-slide">
                    <span className="text-white/30 text-[10px] whitespace-nowrap mt-0.5">{log.time}</span>
                    <div className="flex-1">
                      <span className={`font-bold ${
                        log.status === 'success' ? 'text-[#00ff9d]' :
                        log.status === 'warning' ? 'text-[#ffc35a]' :
                        log.status === 'error' ? 'text-[#ff4d4d]' : 'text-[#4da6ff]'
                      }`}>
                        [{log.step}]
                      </span>{' '}
                      <span className="text-white/80">{log.detail}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-white/10 font-mono text-[10px] text-white/40 flex justify-between">
            <span>AUDIT PROVENANCE: SHA256-RECORDED</span>
            <span>GATEWAY: RAZORPAY TESTNET</span>
          </div>
        </div>

        {/* Result & Razorpay Artifact Card */}
        <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="pb-3 border-b border-white/10 font-mono text-xs font-bold text-white">
            TRANSACTION ARTIFACT
          </div>

          {!finalResult ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-4 text-white/30">
              <ShieldCheck className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-xs">Run a simulation to generate verified Razorpay checkout artifacts and policy receipts.</p>
            </div>
          ) : (
            <div className="space-y-4 font-mono text-xs animate-fade-slide">
              {finalResult.status === 'SUCCESS' && (
                <div className="p-4 rounded-xl bg-[#00ff9d]/10 border border-[#00ff9d]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#00ff9d] font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>ORDER CREATED & BOUNDED</span>
                  </div>
                  <div className="text-[11px] text-white/80 space-y-1">
                    <div>Product: <span className="text-white font-bold">{finalResult.product}</span></div>
                    <div>Settled Amount: <span className="text-[#00ff9d] font-bold">₹{finalResult.amount}</span></div>
                    <div>Razorpay Order ID: <span className="text-white/60">{finalResult.orderId}</span></div>
                  </div>
                  <a
                    href={finalResult.paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 block text-center py-2 px-3 rounded-lg bg-[#00ff9d] text-black font-bold text-xs hover:bg-[#00ff9d]/90 shadow-lg"
                  >
                    Open Razorpay Payment Link ↗
                  </a>
                </div>
              )}

              {finalResult.status === 'COUNTER_OFFER' && (
                <div className="p-4 rounded-xl bg-[#ffc35a]/10 border border-[#ffc35a]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#ffc35a] font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>POLICY COUNTER-OFFER</span>
                  </div>
                  <div className="text-[11px] text-white/80 space-y-1">
                    <div>Requested: <span className="text-[#ff4d4d] line-through">₹{finalResult.requestedPrice}</span></div>
                    <div>Bounded Floor: <span className="text-[#00ff9d] font-bold">₹{finalResult.counterPrice}</span></div>
                    <div>Max Discount: <span className="text-white">15% Max Policy</span></div>
                  </div>
                  <p className="text-[10px] text-white/60 italic pt-1">
                    "{finalResult.reason}"
                  </p>
                </div>
              )}

              {finalResult.status === 'FAILOVER_HANDLED' && (
                <div className="p-4 rounded-xl bg-[#ff6b9d]/10 border border-[#ff6b9d]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#ff6b9d] font-bold">
                    <RefreshCw className="w-4 h-4" />
                    <span>FAILOVER RECOVERY ACTIVATED</span>
                  </div>
                  <div className="text-[11px] text-white/80 space-y-1">
                    <div>Failure Cause: <span className="text-[#ff4d4d] font-semibold">{finalResult.error}</span></div>
                    <div>Resilience Action: <span className="text-[#00ff9d] font-semibold">{finalResult.fallbackAction}</span></div>
                    <div>Inventory Status: <span className="text-white">Preserved (0 leak)</span></div>
                  </div>
                </div>
              )}

              {finalResult.status === 'AWAITING_FOUNDER_APPROVAL' && (
                <div className="p-4 rounded-xl bg-[#4da6ff]/10 border border-[#4da6ff]/30 space-y-2">
                  <div className="flex items-center gap-2 text-[#4da6ff] font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>HUMAN-IN-THE-LOOP REQUIRED</span>
                  </div>
                  <div className="text-[11px] text-white/80">
                    <p className="text-[11px]">{finalResult.reason}</p>
                    <p className="mt-2 text-[10px] text-white/50">Queued in Founder Approval Inbox with bounded timeout.</p>
                  </div>
                </div>
              )}

              <button
                onClick={() => onNavigateTab('audit')}
                className="w-full text-center py-2 text-[11px] text-[#ffc35a] hover:underline flex items-center justify-center gap-1"
              >
                <span>Inspect full cryptographic audit entry</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
