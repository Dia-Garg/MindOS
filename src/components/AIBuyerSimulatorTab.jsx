import React, { useState } from 'react';
import { Cpu, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, ExternalLink, Play, Clock, Code, Lock } from 'lucide-react';
import { aiBuyerProtocol } from '../services/aiBuyerProtocol.js';
import { razorpayService } from '../services/razorpay.js';

export default function AIBuyerSimulatorTab({ onNavigateTab }) {
  const [selectedScenario, setSelectedScenario] = useState('success');
  const [running, setRunning] = useState(false);
  const [stepLogs, setStepLogs] = useState([]);
  const [finalResult, setFinalResult] = useState(null);

  const scenarios = [
    {
      id: 'success',
      code: 'AP2_EXEC_01',
      title: 'Autonomous Price Negotiation & Checkout',
      desc: 'External agent requests 12% discount. Validated against 15% ceiling rule; Razorpay test order generated.',
      tag: 'Standard Flow',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'greedy',
      code: 'AP2_GUARD_02',
      title: 'Loss-Prevention Floor Enforcement',
      desc: 'Adversarial agent bids ₹999 (60% discount). Policy gate rejects bid and returns bounded counter-offer.',
      tag: 'Bounded Gate',
      badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    },
    {
      id: 'failure',
      code: 'AP2_RESIL_03',
      title: 'Gateway Rail Timeout & Graceful Failover',
      desc: 'Simulates 504 bank rail drop. MindOS catches fault, retains inventory lock, and routes fallback payment link.',
      tag: 'Razorpay Resilience',
      badgeClass: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      id: 'approval',
      code: 'AP2_GATE_04',
      title: 'High-Value Order Escalation (Human-in-Loop)',
      desc: 'Bulk purchase (₹12,495) exceeds ₹5,000 threshold. Autonomous flow suspended for supervisor sign-off.',
      tag: 'Compliance Halt',
      badgeClass: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    }
  ];

  async function runSimulation() {
    setRunning(true);
    setStepLogs([]);
    setFinalResult(null);

    const appendLog = (method, endpoint, detail, status = '200 OK', type = 'info') => {
      setStepLogs(prev => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          method,
          endpoint,
          detail,
          status,
          type,
          time: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }
      ]);
    };

    try {
      // Step 1: AP2 Protocol Discovery
      appendLog('GET', '/v1/catalog.json', 'Agent initiating AP2 discovery handshake with machine-readable schema', '200 OK', 'info');
      await new Promise(r => setTimeout(r, 450));

      const catalog = await aiBuyerProtocol.discoverCatalog({ query: 'hoodie' });
      appendLog('INFO', 'SCHEMA_VALIDATED', `Parsed SKU NS-HD-001 "${catalog.items[0].name}" (Base: ₹${catalog.items[0].listPrice})`, 'VALID', 'info');
      await new Promise(r => setTimeout(r, 450));

      if (selectedScenario === 'success') {
        appendLog('POST', '/v1/agent/negotiate', 'Agent proposes ₹2,199 offer (12.0% discount) for single unit', 'PROCESSING', 'info');
        await new Promise(r => setTimeout(r, 450));

        const neg = await aiBuyerProtocol.negotiate({
          productId: 'prod_hoodie_01',
          proposedPrice: 2199,
          quantity: 1,
          buyerAgentId: 'AP2_Client_Agent'
        });

        appendLog('VERIFY', 'POLICY_EVALUATION', 'MaxDiscountPolicy: 12.0% <= 15.0% threshold. Rule status: PASS', '200 OK', 'success');
        await new Promise(r => setTimeout(r, 450));

        appendLog('POST', '/v1/orders', 'Dispatching order payload to Razorpay Testnet API', 'PROCESSING', 'info');
        await new Promise(r => setTimeout(r, 450));

        const checkout = await aiBuyerProtocol.executeAgenticCheckout({
          productId: 'prod_hoodie_01',
          agreedPrice: neg.negotiatedPrice,
          quantity: 1,
          buyerAgentId: 'AP2_Client_Agent'
        });

        appendLog('SETTLE', 'PAYMENT_LINK_ISSUED', `Order ID: ${checkout.orderId} | Shortlink: ${checkout.paymentUrl}`, '201 CREATED', 'success');
        setFinalResult(checkout);

      } else if (selectedScenario === 'greedy') {
        appendLog('POST', '/v1/agent/negotiate', 'Agent submits below-cost bid: ₹999 (60.0% discount requested)', 'PROCESSING', 'info');
        await new Promise(r => setTimeout(r, 450));

        const neg = await aiBuyerProtocol.negotiate({
          productId: 'prod_hoodie_01',
          proposedPrice: 999,
          quantity: 1,
          buyerAgentId: 'BargainHunter_Bot'
        });

        appendLog('REJECT', 'POLICY_VIOLATION', 'MaxDiscountPolicy violation: 60% exceeds 15% merchant cap. Bid blocked.', '422 UNPROCESSABLE', 'warning');
        await new Promise(r => setTimeout(r, 450));

        appendLog('REPLY', 'BOUNDED_COUNTER_OFFER', `Dispatched firm counter-offer at floor: ₹${neg.counterPrice} (Token TTL: 900s)`, '200 OK', 'info');
        setFinalResult(neg);

      } else if (selectedScenario === 'failure') {
        appendLog('CONFIG', 'DEBUG_INJECT', 'Armed simulator: Forcing 504 Gateway Rail Timeout on Razorpay Order Rail', 'ACTIVE', 'warning');
        razorpayService.setSimulatedFailure(true);
        await new Promise(r => setTimeout(r, 450));

        appendLog('POST', '/v1/orders', 'Calling Razorpay Bank Rail with checkout payload', 'CONNECTING', 'info');
        await new Promise(r => setTimeout(r, 500));

        const checkout = await aiBuyerProtocol.executeAgenticCheckout({
          productId: 'prod_hoodie_01',
          agreedPrice: 2499,
          quantity: 1,
          buyerAgentId: 'Resilience_Test_Agent'
        });

        appendLog('CATCH', 'EXCEPTION_INTERCEPTED', 'Caught 504 GATEWAY_TIMEOUT without application crash', 'HANDLED', 'rose');
        await new Promise(r => setTimeout(r, 400));

        appendLog('RECOVER', 'CIRCUIT_BREAKER', 'Triggered fallback: Generated reserved UPI Payment Link; stock lock preserved', 'RECOVERED', 'success');
        setFinalResult(checkout);

      } else if (selectedScenario === 'approval') {
        appendLog('POST', '/v1/agent/checkout', 'Buyer agent attempts bulk purchase: 5 units totaling ₹12,495', 'VALIDATING', 'info');
        await new Promise(r => setTimeout(r, 450));

        appendLog('EVAL', 'THRESHOLD_CHECK', 'Total ₹12,495 exceeds autonomous execution cap (₹5,000)', 'HALT_TRIGGERED', 'warning');
        await new Promise(r => setTimeout(r, 450));

        const checkout = await aiBuyerProtocol.executeAgenticCheckout({
          productId: 'prod_hoodie_01',
          agreedPrice: 2499,
          quantity: 5,
          buyerAgentId: 'Wholesale_Client'
        });

        appendLog('STATUS', 'ESCALATED', checkout.reason, '403 REQUIRES_SUPERVISOR', 'warning');
        setFinalResult(checkout);
      }

    } catch (err) {
      appendLog('ERROR', 'EXCEPTION', err.message, '500 ERROR', 'rose');
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
              <span>PROTOCOL TESTING WORKBENCH</span>
              <span>•</span>
              <span className="text-zinc-300">AP2-2026.1 SPECIFICATION</span>
            </div>
            <h2 className="text-lg font-semibold text-zinc-100 mt-1">
              Autonomous Agent Protocol & Safety Sandbox
            </h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-3xl">
              Simulates external autonomous AI buyers discovering the merchant catalog, negotiating pricing within policy bounds, and generating Razorpay payment orders.
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={running}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              !running
                ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
            }`}
          >
            {running ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Protocol...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Scenario</span>
              </>
            )}
          </button>
        </div>

        {/* Scenario Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {scenarios.map(s => {
            const isSelected = selectedScenario === s.id;
            return (
              <div
                key={s.id}
                onClick={() => !running && setSelectedScenario(s.id)}
                className={`p-4 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-zinc-800/80 border-zinc-600 shadow-sm'
                    : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-zinc-400">{s.code}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${s.badgeClass}`}>
                    {s.tag}
                  </span>
                </div>
                <h4 className="text-xs font-medium text-zinc-200 mt-2 line-clamp-1">
                  {s.title}
                </h4>
                <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Execution Console & Artifact Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Protocol Console (7 cols) */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-300">
              <Code className="w-3.5 h-3.5 text-zinc-400" />
              <span>Protocol Event Stream</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-400">
              ENDPOINT: https://merchant.internal/v1/agent
            </span>
          </div>

          <div className="p-4 space-y-2.5 font-mono text-xs min-h-[360px] max-h-[420px] overflow-y-auto">
            {stepLogs.length === 0 ? (
              <div className="h-72 flex flex-col items-center justify-center text-zinc-400 space-y-2">
                <Clock className="w-6 h-6 text-zinc-400" />
                <p className="text-xs">Select a test scenario and click "Run Scenario"</p>
              </div>
            ) : (
              stepLogs.map(log => (
                <div
                  key={log.id}
                  className="p-2.5 rounded border border-zinc-800/80 bg-zinc-950/40 space-y-1"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        log.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                        log.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                        log.method === 'REJECT' ? 'bg-amber-500/20 text-amber-400' :
                        log.method === 'CATCH' ? 'bg-rose-500/20 text-rose-400' :
                        'bg-zinc-800 text-zinc-300'
                      }`}>
                        {log.method}
                      </span>
                      <span className="text-zinc-300 font-medium">{log.endpoint}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                        log.status.includes('OK') || log.status.includes('CREATED') || log.status === 'VALID' || log.status === 'RECOVERED'
                          ? 'text-emerald-400'
                          : log.status.includes('UNPROCESSABLE') || log.status.includes('HALT') || log.status.includes('403')
                          ? 'text-amber-400'
                          : log.status.includes('500') || log.status.includes('HANDLED')
                          ? 'text-rose-400'
                          : 'text-zinc-400'
                      }`}>
                        {log.status}
                      </span>
                      <span className="text-zinc-400 text-[10px]">{log.time}</span>
                    </div>
                  </div>
                  <p className="text-zinc-300 text-[11px] pl-1 font-sans">
                    {log.detail}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t border-zinc-800/80 bg-zinc-900/40 flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span>AUDIT INTEGRITY: SHA-256</span>
            <span>SIMULATION ADAPTER: RAZORPAY_TEST_v1</span>
          </div>
        </div>

        {/* Transaction & Policy Artifact (5 cols) */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <span className="text-xs font-semibold text-zinc-200">
                Transaction Artifact & Policy Summary
              </span>
              <button
                onClick={() => onNavigateTab('audit')}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 hover:underline"
              >
                Inspect Ledger →
              </button>
            </div>

            {!finalResult ? (
              <div className="py-20 text-center text-zinc-400 text-xs">
                <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
                <p>Run a scenario to inspect the validated Razorpay settlement response and policy receipt.</p>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                {finalResult.status === 'SUCCESS' && (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Order Approved & Created
                      </span>
                      <span className="text-[11px] font-mono text-emerald-400">201 CREATED</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-300">
                      <div className="flex justify-between py-1 border-b border-emerald-500/10">
                        <span className="text-zinc-400">Item:</span>
                        <span className="font-medium text-zinc-100">{finalResult.product}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-500/10">
                        <span className="text-zinc-400">Agreed Settlement:</span>
                        <span className="font-semibold text-emerald-400">₹{finalResult.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-emerald-500/10">
                        <span className="text-zinc-400">Razorpay Order:</span>
                        <span className="font-mono text-zinc-300 text-[11px]">{finalResult.orderId}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Remaining Stock:</span>
                        <span className="font-mono text-zinc-300">{finalResult.remainingStock} units</span>
                      </div>
                    </div>

                    <a
                      href={finalResult.paymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-xs font-medium transition-colors"
                    >
                      <span>Open Razorpay Payment Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}

                {finalResult.status === 'COUNTER_OFFER' && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400">
                        <AlertTriangle className="w-4 h-4" />
                        Loss-Prevention Floor Triggered
                      </span>
                      <span className="text-[11px] font-mono text-amber-400">422 GATED</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-300">
                      <div className="flex justify-between py-1 border-b border-amber-500/10">
                        <span className="text-zinc-400">Agent Requested:</span>
                        <span className="line-through text-rose-400 font-mono">₹{finalResult.requestedPrice}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-amber-500/10">
                        <span className="text-zinc-400">Merchant Floor:</span>
                        <span className="font-semibold text-emerald-400 font-mono">₹{finalResult.counterPrice}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-zinc-400">Max Discount Rule:</span>
                        <span className="text-zinc-300">15.0% Ceiling</span>
                      </div>
                    </div>

                    <p className="text-[11px] text-zinc-400 italic bg-zinc-950/40 p-2.5 rounded border border-zinc-800">
                      "{finalResult.reason}"
                    </p>
                  </div>
                )}

                {finalResult.status === 'FAILOVER_HANDLED' && (
                  <div className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400">
                        <RefreshCw className="w-4 h-4" />
                        Circuit Breaker Handled
                      </span>
                      <span className="text-[11px] font-mono text-rose-400">504 RECOVERED</span>
                    </div>

                    <div className="space-y-1.5 text-xs text-zinc-300">
                      <div className="py-1 border-b border-rose-500/10">
                        <span className="text-zinc-400 block text-[10px]">Cause:</span>
                        <span className="text-rose-300 font-mono text-[11px]">{finalResult.error}</span>
                      </div>
                      <div className="py-1">
                        <span className="text-zinc-400 block text-[10px]">Remediation:</span>
                        <span className="text-zinc-200">{finalResult.fallbackAction}</span>
                      </div>
                    </div>
                  </div>
                )}

                {finalResult.status === 'AWAITING_FOUNDER_APPROVAL' && (
                  <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-400">
                        <Lock className="w-4 h-4" />
                        Escalated to Supervisor
                      </span>
                      <span className="text-[11px] font-mono text-blue-400">403 HALT</span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {finalResult.reason}
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Autonomous token creation halted. Transferred to Founder Approval Queue with 24-hour expiration window.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-zinc-800 text-[11px] text-zinc-400 flex items-center justify-between font-mono">
            <span>POLICY ENGINE: DETERMINISTIC</span>
            <span>SETTLEMENT: ZERO-LEAK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
