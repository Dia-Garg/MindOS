export const INITIAL_PRODUCTS = [
  {
    id: "prod_hoodie_01",
    name: "Cybernetic Oversized Hoodie (Edition 01)",
    category: "Apparel",
    price: 2499,
    minNegotiatedPrice: 2199, // Lowest price agent can negotiate without human approval
    stock: 28,
    sku: "NS-HD-001",
    description: "320 GSM French Terry, hidden NFC tag with verifiable cryptographic ownership. Designed for deep-work focus.",
    tags: ["hoodie", "streetwear", "heavyweight", "techwear", "cyberpunk"],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "prod_cargo_02",
    name: "Stealth Utility Cargo Pants",
    category: "Apparel",
    price: 2199,
    minNegotiatedPrice: 1999,
    stock: 15,
    sku: "NS-CG-002",
    description: "Water-resistant Cordura construction with magnetic stash pockets and articulated knees for builders on the move.",
    tags: ["cargo", "pants", "tactical", "waterproof", "black"],
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "prod_tee_03",
    name: "Autonomous Agent Hacker Tee",
    category: "Apparel",
    price: 1299,
    minNegotiatedPrice: 1099,
    stock: 45,
    sku: "NS-TE-003",
    description: "100% Supima cotton with high-density reflective cyber glyph print. Pre-shrunk with boxy drop-shoulder silhouette.",
    tags: ["tee", "tshirt", "graphic", "minimal", "white"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "prod_deskmat_04",
    name: "Neural Matrix XXL Desk Mat",
    category: "Workspace",
    price: 899,
    minNegotiatedPrice: 799,
    stock: 60,
    sku: "NS-DM-004",
    description: "900x400mm micro-woven surface with precision glide tracking and high-density anti-fraying stitched edges.",
    tags: ["deskmat", "workspace", "minimalist", "setup", "accessories"],
    image: "https://images.unsplash.com/photo-1616440347437-b1c73416efc2?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "prod_apipass_05",
    name: "MindOS Prompt Engine Pro License",
    category: "Digital",
    price: 1499,
    minNegotiatedPrice: 1299,
    stock: 999,
    sku: "NS-DG-005",
    description: "Digital license key granting 100k autonomous agent execution credits and priority multi-model routing.",
    tags: ["software", "digital", "license", "ai", "developer"],
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60"
  }
];

export const INITIAL_ABANDONED_CARTS = [
  {
    id: "cart_rec_910",
    customerName: "Aarav Sharma",
    email: "aarav.sharma@techcorp.in",
    phone: "+91 98765 43210",
    productId: "prod_hoodie_01",
    productName: "Cybernetic Oversized Hoodie",
    amount: 2499,
    abandonedAt: "18 mins ago",
    dropReason: "Payment page timeout on UPI intent",
    recoveryProbability: "84%",
    status: "pending_agent_action"
  },
  {
    id: "cart_rec_911",
    customerName: "Sneha Patel",
    email: "sneha.p@designlab.io",
    phone: "+91 98234 56789",
    productId: "prod_cargo_02",
    productName: "Stealth Utility Cargo Pants",
    amount: 2199,
    abandonedAt: "42 mins ago",
    dropReason: "Bank OTP screen abandoned",
    recoveryProbability: "71%",
    status: "pending_agent_action"
  },
  {
    id: "cart_rec_912",
    customerName: "Vikram Malhotra",
    email: "vikram@finscale.co",
    phone: "+91 97112 34567",
    productId: "prod_apipass_05",
    productName: "MindOS Prompt Engine Pro License",
    amount: 1499,
    abandonedAt: "2 hours ago",
    dropReason: "International card decline (3DS failed)",
    recoveryProbability: "92%",
    status: "pending_agent_action"
  }
];

export const DEFAULT_MERCHANT_POLICIES = {
  maxDiscountPercent: 15, // Maximum discount AI agent can authorize autonomously
  humanApprovalOrderThreshold: 5000, // Orders above this amount require founder confirmation
  dailyDisbursementCap: 50000, // Max automated payment links per 24 hours
  supportedProtocols: ["UAP_v1", "AP2_2026", "ACP_DRAFT", "x402_HTTP"],
  autoRecoveryEnabled: true,
  requireAuditSignature: true
};

export const INITIAL_AUDIT_LOGS = [
  {
    id: "aud_101",
    timestamp: "10:14:02 AM",
    actor: "External AI Buyer (Agent: ShoppingBot/2.4 via UAP protocol)",
    intent: "DISCOVER_CATALOG",
    action: "Querying products tagged with 'hoodie' and budget <= ₹3000",
    policyCheck: "Passed (Read-only catalog endpoint)",
    status: "SUCCESS",
    details: "Found 1 matching SKU: NS-HD-001 (Stock: 28)"
  },
  {
    id: "aud_102",
    timestamp: "10:14:08 AM",
    actor: "External AI Buyer (ShoppingBot/2.4)",
    intent: "NEGOTIATE_PRICE",
    action: "Requested 12% discount on NS-HD-001 (Offer: ₹2,199)",
    policyCheck: "Passed (12% <= MaxDiscountPolicy 15% threshold)",
    status: "APPROVED_BOUNDED",
    details: "Dynamic counter-offer locked at ₹2,199 for 15 minutes"
  },
  {
    id: "aud_103",
    timestamp: "10:14:15 AM",
    actor: "MindOS Commerce Agent",
    intent: "CREATE_PAYMENT_LINK",
    action: "Calling Razorpay API (POST /v1/payment_links)",
    policyCheck: "Passed (Amount ₹2,199 within daily cap)",
    status: "SUCCESS",
    details: "Created link: plink_agent_7721a9 (Test Mode active)"
  }
];
