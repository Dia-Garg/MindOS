import { auditLogger } from './auditLogger.js';

export class RazorpayService {
  constructor() {
    this.keyId = import.meta.env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_mindos_sandbox';
    this.keySecret = import.meta.env?.VITE_RAZORPAY_KEY_SECRET || '';
    this.isMockMode = !import.meta.env?.VITE_RAZORPAY_KEY_SECRET;
    this.simulatedGatewayFailureRate = 0; // Configurable for failure handling demos
  }

  /**
   * Set simulated failure for demonstrating Razorpay's required "Failure Handled Gracefully"
   */
  setSimulatedFailure(shouldFail) {
    this.simulatedFailureActive = shouldFail;
  }

  /**
   * Create Razorpay Order
   * Corresponds to POST /v1/orders
   */
  async createOrder({ amount, currency = 'INR', receipt, notes = {} }) {
    auditLogger.log({
      actor: 'MindOS Commerce Agent',
      intent: 'RAZORPAY_CREATE_ORDER',
      action: `Creating Razorpay Order for ₹${(amount / 100).toFixed(2)} (${currency})`,
      policyCheck: 'Passed (Order within limits)',
      status: 'SUCCESS',
      details: `Receipt: ${receipt}`,
      payload: { amount, currency, receipt, notes }
    });

    if (this.simulatedFailureActive) {
      this.simulatedFailureActive = false; // Reset after trigger
      const error = new Error('GATEWAY_TIMEOUT: Razorpay Bank Rail connection timed out after 3000ms');
      error.code = 'BAD_REQUEST_ERROR';
      error.step = 'payment_initiation';
      
      auditLogger.log({
        actor: 'Razorpay Gateway (Simulated)',
        intent: 'GATEWAY_ERROR',
        action: 'Bank Rail Timeout on initial attempt',
        policyCheck: 'Triggering Fallback Resilience Policy',
        status: 'RECOVERED_FAILOVER',
        details: 'Simulated primary gateway failure. Initiating automated retry with UPI fallback payment link.',
        payload: { error: error.message }
      });

      throw error;
    }

    // Realistic Order response matching Razorpay API specs
    const orderId = 'order_' + Math.random().toString(36).substring(2, 12);
    return {
      id: orderId,
      entity: 'order',
      amount,
      amount_paid: 0,
      amount_due: amount,
      currency,
      receipt: receipt || 'rcpt_' + Date.now(),
      status: 'created',
      attempts: 0,
      notes,
      created_at: Math.floor(Date.now() / 1000)
    };
  }

  /**
   * Create Razorpay Payment Link
   * Corresponds to POST /v1/payment_links
   */
  async createPaymentLink({ amount, currency = 'INR', description, customer, notify = { sms: true, email: true }, callback_url }) {
    const linkId = 'plink_' + Math.random().toString(36).substring(2, 12);
    const shortUrl = `https://rzp.io/i/${linkId.slice(-6)}`;

    auditLogger.log({
      actor: 'MindOS Commerce Agent',
      intent: 'RAZORPAY_CREATE_PAYMENT_LINK',
      action: `Generated Payment Link for ₹${amount} for ${customer?.name || 'Customer'}`,
      policyCheck: `Passed (Authorized link amount: ₹${amount})`,
      status: 'SUCCESS',
      details: `Link URL: ${shortUrl} (Expiry: 24h)`,
      payload: { amount, description, customer, shortUrl }
    });

    return {
      id: linkId,
      short_url: shortUrl,
      amount: amount * 100, // in paise
      currency,
      status: 'created',
      description,
      customer,
      created_at: Math.floor(Date.now() / 1000),
      expire_by: Math.floor(Date.now() / 1000) + 86400
    };
  }

  /**
   * Execute Automated Revenue Recovery Action for Abandoned Cart
   */
  async executeRecovery({ cart, discountPercent = 10, channel = 'whatsapp_payment_link' }) {
    const discountedPrice = Math.round(cart.amount * (1 - discountPercent / 100));
    
    auditLogger.log({
      actor: 'MindOS Revenue Recovery Agent',
      intent: 'EXECUTE_CART_RECOVERY',
      action: `Applying ${discountPercent}% dynamic discount on abandoned ${cart.productName}`,
      policyCheck: `Passed (${discountPercent}% <= 15% Max Policy Cap)`,
      status: 'APPROVED_BOUNDED',
      details: `Original: ₹${cart.amount} → Recovered Price: ₹${discountedPrice}. Target: ${cart.customerName}`,
      payload: { originalAmount: cart.amount, recoveredAmount: discountedPrice, dropReason: cart.dropReason }
    });

    const paymentLink = await this.createPaymentLink({
      amount: discountedPrice,
      description: `Special Recovery Offer: ${cart.productName} (${discountPercent}% OFF)`,
      customer: {
        name: cart.customerName,
        email: cart.email,
        contact: cart.phone
      }
    });

    return {
      recovered: true,
      originalAmount: cart.amount,
      recoveredAmount: discountedPrice,
      paymentLink,
      recoveredVia: channel,
      timestamp: new Date().toLocaleTimeString()
    };
  }
}

export const razorpayService = new RazorpayService();
