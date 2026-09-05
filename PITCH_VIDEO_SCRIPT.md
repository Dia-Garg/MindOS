# 5-MINUTE PITCH VIDEO SCRIPT
## Project: MindOS Commerce Edition
**Track:** Track 1: AI Growth & Agentic Commerce (Razorpay AI Buildathon)  
**Target Duration:** ~4:30 – 5:00 minutes  
**Format:** Screen recording (browser showing `http://localhost:3000`) + Facecam in bottom corner  

---

### [0:00 – 0:45] ACT 1: The Problem & The Student Founder Reality
**What to show on screen:**  
Start on the landing page (`1. Founder Dump` tab). Have your facecam active and look directly at the camera.

**Spoken Script:**
> *"Hi Razorpay team, I'm a student builder pursuing BTech Computer Science while simultaneously building an apparel and tools brand from scratch.*
>
> *As a solo founder, my single biggest existential bottleneck is bandwidth. I'm juggling OS labs and semester quizzes while trying to run a profitable business. But the commerce landscape in 2026 is rapidly changing: we're seeing the emergence of autonomous AI shopping agents powered by protocols like NPCI's UAP and AP2. Soon, AI buyers—not just humans—will discover, negotiate, and transact on our stores.*
>
> *Razorpay's Buildathon asks: 'How do we make merchants transactable by AI buyers, grow revenue, and ensure every money action is explainable, bounded, and gated?'*
>
> *This is MindOS Commerce Edition — an autonomous merchant operating system and AI buyer gateway built on Razorpay test rails."*

---

### [0:45 – 1:45] ACT 2: The Core Hero — Founder Brain Dump & Automated Action
**What to show on screen:**  
1. Click the preset pill: **`🔥 Recover Carts + BTech Lab`**.
2. Click the **`PROCESS DUMP →`** button.
3. Show the tasks populating and the **Automated Razorpay Action Toast** appearing at the top.

**Spoken Script:**
> *"Let's start where every solo founder starts: raw mental chaos.*
>
> *Here in the Founder Dump terminal, I enter everything on my mind: an OS lab assignment due tomorrow, general anxiety, and a business problem—three customers abandoned checkout today due to UPI intent drop-offs.*
>
> *When I click 'Process Dump', MindOS does two things:*
> *First, it separates noise from leverage, categorizing my tasks into Brand, College, and Personal priorities, with a single Focus of the Day.*
> *Second, and most importantly: it autonomously identifies the commerce intent. Look at this top alert: MindOS detected the checkout drop-offs, calculated recovery probabilities, and autonomously issued Razorpay recovery payment links with bounded 10% micro-discounts—recovering nearly ₹6,000 in GMV without manual intervention.*
>
> *Now, let's look at the external side: how do outside AI buyers purchase from us?"*

---

### [1:45 – 3:15] ACT 3: The AI Buyer Handshake (AP2 Protocol & Bounded Gates)
**What to show on screen:**  
1. Click the tab: **`2. AI Buyer Handshake`**.
2. Show Scenario 1 selected, and click **`SIMULATE AGENT PURCHASE`**.
3. Point to the step progression (1/3 Catalog, 2/3 Price Bounds, 3/3 Settle) and the final Razorpay link.
4. Then, select **Scenario 2 (Greedy Offer)** and click **`SIMULATE AGENT PURCHASE`**.

**Spoken Script:**
> *"Now we move to Track 1's core challenge: making the merchant transactable by autonomous AI buyers.*
>
> *MindOS exposes a machine-readable schema conforming to the AP2 protocol. In Scenario 1, an external shopping agent discovers our Cybernetic Hoodie, priced at ₹2,499. The buyer agent proposes ₹2,199—a 12% discount.*
>
> *When I hit 'Simulate Agent Purchase', watch the handshake:*
> *MindOS parses the schema, validates the 12% request against our merchant's MaxDiscountPolicy of 15%, approves it within bounds, and calls the Razorpay Orders and Payment Links API. Here is the generated Razorpay payment link, ready for settlement.*
>
> *Now, what happens if an adversarial or greedy buyer bot attacks our store?*
> *(Click Scenario 2 & Run)*
> *Here, a bot proposes ₹999—a 60% discount. A naive LLM wrapper might cave and hallucinate. But MindOS has strict mathematical policy gates. It halts the loss, rejects the 60% bid, and autonomously counter-offers with our mathematically optimal floor price of ₹2,124.*
> *The merchant never sells at a loss."*

---

### [3:15 – 4:15] ACT 4: The Buildathon Bar — "Failure Handled Gracefully"
**What to show on screen:**  
1. Select **Scenario 3 (Gateway Failure Handled Gracefully)**.
2. Click **`SIMULATE AGENT PURCHASE`**.
3. Point to the rose-colored alert showing the circuit-breaker catch.

**Spoken Script:**
> *"Now let's address Razorpay's most explicit evaluation criterion: 'Every money action explainable, bounded, and gated. Show one failure handled gracefully.'*
>
> *In production fintech, failures happen. Bank rails drop, connections timeout.*
> *In Scenario 3, we simulate a primary Razorpay bank rail timeout—a 504 Gateway Timeout on payment creation.*
> *(Click Run)*
> *Notice what happens:*
> *The application does not crash. MindOS's resilience circuit breaker intercepts the exception, preserves the locked inventory so stock isn't leaked or double-sold, and automatically routes a fallback UPI payment link with a 10-minute hold reservation.*
> *This is production-grade failure handling, not hackathon demo-ware."*

---

### [4:15 – 5:00] ACT 5: Store, Audit Trail & Closing
**What to show on screen:**  
1. Click **`3. Store & Recovery`** (show active merchandise and recovered carts).
2. Click **`4. Audit Log`** (show the cryptographic ledger with timestamps and policy checks).
3. Click **`Export Audit JSON`** (show file downloading).
4. Bring facecam to focus for closing.

**Spoken Script:**
> *"In the Store & Recovery view, we have our active merchandise catalog alongside our autonomous cart recovery queue.*
>
> *And finally, the Audit Log: every single interaction—from catalog queries and discount evaluations to Razorpay API payloads and failover retries—is permanently logged with cryptographic timestamps and policy gate statuses.*
> *Judges can click 'Export Audit JSON' to inspect the full deterministic receipt.*
>
> *We have a 100% passing test suite across all 7 protocol and policy tests, zero-dependency mock mode for instant evaluation, and live Razorpay API support.*
>
> *MindOS proves that with agentic commerce protocols, bounded verification, and Razorpay's payment infrastructure, even a solo student builder can run an autonomous, multi-channel commerce brand.*
>
> *Thank you, and I look forward to meeting the team in Bangalore!"*

---

### 💡 PRO-TIPS FOR RECORDING:
1. **Loom / OBS Settings:** 1080p, 60fps. Ensure your mic audio is crisp and background noise is minimal.
2. **Pacing:** Speak with calm confidence. Don't rush. The script is designed to comfortably take 4 minutes and 40 seconds at a natural speaking speed.
3. **Tabs to have open in advance:**
   - Tab 1: `http://localhost:3000` (MindOS app)
   - Tab 2: Your GitHub repository with the code and README
