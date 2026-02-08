# 💰 WealthWise – Smart Personal Finance Platform

🔗 **Live Demo:** https://wealthwise-pi-two.vercel.app/  
📂 **GitHub Repository:** https://github.com/Ritesh-iiitn/wealthwise  

WealthWise is a **full-stack personal finance web application** that helps users understand their financial structure, gain meaningful insights, and make informed decisions using real bank account data.  
The platform is designed with a **modern SaaS architecture**, including secure bank integrations and premium subscription billing.

---

## 🚀 Features

### 🔐 Authentication & Security
- Secure user authentication using **Supabase Auth**
- Row Level Security (RLS) to isolate user data
- Server-side protected API routes

---

### 🏦 Bank Account Integration (Plaid)
- Securely connect financial accounts via **Plaid**
- Supports:
  - Checking & Savings
  - Credit Cards
  - Loans (Mortgage, Student Loans)
  - Investments (401k, IRA, CDs, Money Market)
- Real-time account balances and institution metadata

---

### 📊 Financial Overview
- Net worth calculation (assets vs liabilities)
- Liquid cash visibility
- Debt exposure summary
- Account-type breakdown

---

### 🧠 Insights
- Asset vs liability analysis
- Cash vs investment allocation
- Debt concentration insights
- Designed to work even without complete transaction history

---

### ✅ Recommendations (Decision Support)
- System-generated financial recommendations based on account data
- Recommendation types:
  - **Informational**
  - **Warning**
  - **Optimization**
- Converts insights into clear, actionable suggestions

---

### 🎯 Budgets
- Set financial limits and targets
- Track progress using account-level data
- Focus on financial control rather than historical assumptions

---

### 💳 Premium Subscriptions (Stripe)
- Subscription billing using **Stripe Checkout**
- Secure, PCI-compliant payment flow
- Premium access controlled via **Stripe Webhooks**
- Local webhook testing using **Stripe CLI**
- Feature gating based on subscription status

---

## 🛠 Tech Stack

### Frontend
- **Next.js** (App Router, Server Components)
- **TypeScript**
- **Tailwind CSS**

### Backend
- **Next.js API Routes** (Serverless)
- **Supabase** (PostgreSQL, Auth, RLS)

### Integrations
- **Plaid API** – Bank account aggregation
- **Stripe API** – Subscription billing & webhooks

### Deployment
- **Vercel** – Serverless deployment & auto-scaling

---

## 🧩 Architecture Highlights
- Account-centric financial modeling
- Clear separation between:
  - **Overview** → financial state
  - **Insights** → understanding patterns
  - **Recommendations** → decision support
- Secure webhook verification for Stripe
- SaaS-ready subscription architecture

---

## 🧪 Local Development

### Prerequisites
- Node.js
- Supabase project
- Plaid Sandbox keys
- Stripe Test keys
- Stripe CLI (for webhook testing)

### Run Locally
```bash
npm install
npm run dev
