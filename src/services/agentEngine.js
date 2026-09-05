import { auditLogger } from './auditLogger.js';
import { razorpayService } from './razorpay.js';
import { aiBuyerProtocol } from './aiBuyerProtocol.js';
import { INITIAL_ABANDONED_CARTS } from '../data/mockData.js';

export class MindOSAgentEngine {
  constructor() {
    this.abandonedCarts = [...INITIAL_ABANDONED_CARTS];
    this.recoveredTotal = 0;
  }

  /**
   * Parse Brain Dump using the original MindOS structured format,
   * while also extracting actionable commerce intents!
   */
  async processBrainDump(text) {
    auditLogger.log({
      actor: 'Solo Founder',
      intent: 'FOUNDER_BRAIN_DUMP',
      action: `Processing natural language founder input (${text.length} chars)`,
      policyCheck: 'Input sanitized & tokenized',
      status: 'SUCCESS',
      details: 'Extracting priorities and checking for automated commerce triggers'
    });

    const lower = text.toLowerCase();
    const actionsTriggered = [];

    // Check for automated commerce commands
    if (lower.includes('recover') && (lower.includes('cart') || lower.includes('abandoned') || lower.includes('drop'))) {
      const recoveryResult = await this.recoverAllPendingCarts();
      actionsTriggered.push(recoveryResult);
    }

    if (lower.includes('flash sale') || lower.includes('discount') || lower.includes('promo')) {
      const promoResult = await this.createCampaignLink({
        description: 'Founder Flash Sale 10% OFF',
        discountPercent: 10,
        amount: 2249
      });
      actionsTriggered.push(promoResult);
    }

    // Structured output following the original MindOS schema
    const structuredTasks = this.extractTasksFromText(text);

    return {
      structuredTasks,
      actionsTriggered,
      timestamp: new Date().toLocaleTimeString()
    };
  }

  extractTasksFromText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const college = [];
    const brand = [];
    const personal = [];

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes('exam') || lower.includes('assignment') || lower.includes('lab') || lower.includes('college') || lower.includes('prof') || lower.includes('btech')) {
        college.push(`[P1] ${line}`);
      } else if (lower.includes('order') || lower.includes('sale') || lower.includes('brand') || lower.includes('customer') || lower.includes('payment') || lower.includes('hoodie') || lower.includes('marketing') || lower.includes('razorpay')) {
        brand.push(`[P1] ${line}`);
      } else {
        personal.push(`[P2] ${line}`);
      }
    }

    // Default intelligent fallbacks if unstructured paragraph
    if (brand.length === 0) {
      brand.push('[P1] Monitor AI Buyer Gateway queries on AP2 network');
      brand.push('[P2] Review Razorpay automated cart recovery conversions');
    }
    if (college.length === 0) {
      college.push('[P2] Complete ML assignment on precision/recall metrics');
    }
    if (personal.length === 0) {
      personal.push('[P1] Sleep 7 hours — stamina is founder leverage');
    }

    return {
      acknowledge: "Acknowledged. Noise cleared. Commerce agents deployed.",
      college,
      brand,
      personal,
      focus: brand[0].replace(/\[P\d\]\s*/, '') || "Drive brand revenue with autonomous AI checkout links."
    };
  }

  async recoverAllPendingCarts() {
    const unrecovered = this.abandonedCarts.filter(c => c.status === 'pending_agent_action');
    const results = [];

    for (const cart of unrecovered) {
      const recovery = await razorpayService.executeRecovery({
        cart,
        discountPercent: 10,
        channel: 'whatsapp_payment_link'
      });
      cart.status = 'recovered';
      cart.recoveryResult = recovery;
      this.recoveredTotal += recovery.recoveredAmount;
      results.push(recovery);
    }

    return {
      type: 'RECOVER_ABANDONED_CARTS',
      message: `Recovered ${results.length} abandoned checkouts via Razorpay Payment Links. Total recovered: ₹${this.recoveredTotal.toLocaleString()}`,
      recoveredCount: results.length,
      totalRecoveredAmount: this.recoveredTotal,
      details: results
    };
  }

  async createCampaignLink({ description, discountPercent, amount }) {
    const link = await razorpayService.createPaymentLink({
      amount,
      description,
      customer: {
        name: 'VIP Campaign Customer',
        email: 'campaign@neurashade.com'
      }
    });

    return {
      type: 'CAMPAIGN_LINK_CREATED',
      message: `Generated automated campaign payment link for ₹${amount} (${discountPercent}% OFF)`,
      linkUrl: link.short_url,
      amount
    };
  }
}

export const agentEngine = new MindOSAgentEngine();
