# 🚀 RouteDrop — P2P Transit Delivery Marketplace

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-Private-red)](#license)

> **"BlaBlaCar for parcels."** RouteDrop connects daily intercity travelers (e.g., Tumkur → Bengaluru) with senders who need urgent parcels delivered — turning every commute into a trusted, revenue-generating micro-delivery service.

---

## ✨ Core Features

### 📦 For Senders
- **Instant booking** — search verified travelers by route, date, and trunk space
- **Escrow-protected payments** — funds held securely via Razorpay until OTP-confirmed delivery
- **Milestone tracking** — real-time status updates: Picked Up → In Transit → Reached → Delivered
- **Compare & choose** — view traveler ratings, reviews, vehicle type, and pricing before booking

### 🚗 For Travelers
- **Route matching** — post a trip once and receive parcel requests from senders along your route
- **Guaranteed payouts** — earn **80% of the delivery fee**, released automatically on confirmed delivery
- **OTP-based handoff** — secure 6-digit OTP confirms physical parcel delivery, triggering instant payout
- **Flexible capacity** — declare available trunk/boot space per trip

### 🛡️ Trust & Safety
- **Aadhaar KYC verification** — all users verified via mock Aadhaar API before transacting
- **Open-box policy** — senders can request parcel inspection before handoff
- **Escrow payments** — funds never released until delivery is OTP-confirmed by the recipient
- **Platform moderation** — 20% platform fee funds dispute resolution and fraud protection

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5.7 |
| **UI Library** | React 19 + shadcn/ui (Radix UI primitives) |
| **Styling** | Tailwind CSS v4 |
| **Icons** | Lucide React |
| **Authentication** | Supabase Auth |
| **Database** | Supabase (PostgreSQL) |
| **Payments** | Razorpay API (Escrow + Split Payments) |
| **KYC** | Mock Aadhaar Verification API |
| **Analytics** | Vercel Analytics |
| **Forms** | React Hook Form + Zod |

---

## ⚙️ Operational Architecture — How It Works

```
Sender                        Platform                        Traveler
  │                              │                               │
  1. KYC Verification ──────────►│◄───────── KYC Verification   │
     (Aadhaar mock API)          │           (Aadhaar mock API)  │
  │                              │                               │
  2. Route Search ──────────────►│◄────────── Post Trip          │
     (origin, dest, date)        │            (route, space,     │
  │                              │             vehicle)          │
  │                              │                               │
  3. Escrow Payment ────────────►│                               │
     (Razorpay, funds held)      │                               │
  │                              │                               │
  4. Physical Handoff ───────────┼───────────────────────────────►
     (Open-box inspection)       │           Parcel picked up     │
  │                              │           (milestone: In       │
  │                              │            Transit)            │
  │                              │                               │
  5. OTP Delivery Confirmation   │                               │
     Recipient enters OTP ──────►│◄─────── OTP verified          │
  │                              │                               │
  │               Payout Split:  │                               │
  │               80% ──────────────────────────────────────────►│
  │               20% retained ──┘  (Platform fee)               │
```

1. **KYC** — Both senders and travelers complete Aadhaar-based identity verification before transacting.
2. **Route Matching** — Senders search by origin/destination/date; the platform surfaces verified travelers with matching routes.
3. **Escrow Payment** — The sender pays via Razorpay; funds are held in escrow and never released to the traveler until delivery is confirmed.
4. **Physical Handoff & Transit** — The traveler picks up the parcel (open-box inspection available). Milestones update in real time: *Picked Up → In Transit → Reached Destination*.
5. **OTP Delivery & Payout Split** — The recipient confirms delivery with a 6-digit OTP. Escrow releases automatically: **80% to the traveler, 20% to the platform**.

---

## 🚀 Local Development Setup

### Prerequisites

- Node.js ≥ 18
- `npm` (or `pnpm` / `yarn`)
- A [Supabase](https://supabase.com/) project
- A [Razorpay](https://razorpay.com/) test account

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/HEMANTH-S-KUMAR-1/v0-p2-p-delivery-marketplace.git
cd v0-p2-p-delivery-marketplace

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# → Open .env.local and fill in your keys (see below)

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

---

## 🔑 Environment Variables (`.env.local`)

Create a `.env.local` file at the project root using `.env.example` as a template:

```env
# ─────────────────────────────────────────────────────────────
# RouteDrop – Environment Variables
# Copy this file to .env.local and fill in the values.
# ─────────────────────────────────────────────────────────────

# Supabase – find these in your Supabase project Settings › API
# Public URL of your Supabase project (safe to expose client-side)
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co

# Anonymous/public API key for client-side Supabase access
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Service role key – used server-side only; NEVER expose to the client
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Razorpay – find these in the Razorpay Dashboard (Settings › API Keys)
# Your Razorpay Key ID (prefix: rzp_test_ for test mode)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx

# Your Razorpay Key Secret – used to sign API requests server-side only
RAZORPAY_KEY_SECRET=<your-razorpay-key-secret>

# Linked account ID for routing the 20% platform fee via Razorpay Route
RAZORPAY_PLATFORM_ACCOUNT_ID=<linked-account-id-for-platform-fee>
```

> ⚠️ **Never commit `.env.local` to version control.** It is already listed in `.gitignore`.

---

## 📁 Folder Structure

```
v0-p2-p-delivery-marketplace/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth route group
│   │   ├── login/page.tsx        # Login page
│   │   ├── signup/page.tsx       # Sign-up page
│   │   └── layout.tsx            # Shared auth layout
│   ├── api/                      # API Route Handlers
│   │   ├── payments/
│   │   │   ├── create-escrow/route.ts   # Create Razorpay escrow order
│   │   │   └── release-escrow/route.ts  # Release funds on OTP confirm
│   │   └── kyc/
│   │       └── verify/route.ts   # Mock Aadhaar KYC verification
│   ├── dashboard/page.tsx        # User dashboard (bookings & trips)
│   ├── send/page.tsx             # Sender flow: search + booking checkout
│   ├── travel/page.tsx           # Traveler flow: post trip + requests
│   ├── track/page.tsx            # Milestone delivery tracker + OTP
│   ├── layout.tsx                # Root layout (fonts, metadata, providers)
│   └── globals.css               # Tailwind v4 theme tokens & global styles
│
├── components/                   # Reusable UI components
│   ├── landing/                  # Landing page sections
│   │   ├── hero-section.tsx
│   │   ├── how-it-works.tsx
│   │   ├── trust-section.tsx
│   │   └── cta-section.tsx
│   ├── sender/                   # Sender booking flow components
│   ├── traveler/                 # Traveler trip posting & dashboard
│   ├── tracker/                  # Milestone tracker & OTP confirmation
│   ├── header.tsx                # Responsive navigation header
│   ├── footer.tsx                # Site footer
│   ├── theme-provider.tsx        # next-themes provider
│   └── ui/                       # shadcn/ui primitives (Button, Card, etc.)
│
├── hooks/                        # Custom React hooks
├── lib/                          # Utilities & Supabase client helpers
├── supabase/                     # Supabase migrations & config
├── public/                       # Static assets
├── .env.example                  # Environment variable template
├── next.config.mjs               # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

---

## 🗺️ Page Routes

| Route | Description |
|---|---|
| `/` | Landing page — tabbed search ("Send a Parcel" / "Post a Trip"), How It Works, trust signals, CTAs |
| `/(auth)/login` | Email/password login via Supabase Auth |
| `/(auth)/signup` | New user registration + KYC trigger |
| `/send` | Sender flow — traveler search results, profiles, pricing, and escrow checkout |
| `/travel` | Traveler flow — post a trip form, active trips, incoming parcel requests |
| `/track` | Delivery tracker — vertical milestone tracker, live status, OTP confirmation |
| `/dashboard` | User dashboard — booking history, trip history, earnings |

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| **Primary** | Deep Navy Blue | Headers, primary buttons, key UI anchors |
| **Accent** | Trustmark Green | CTAs, success states, trust indicators |
| **Neutrals** | Soft blue-tinted grays | Backgrounds, borders, muted text |
| **Typography** | Inter (body) + Space Grotesk (headings) | — |
| **Responsive** | Mobile-first | Designed for 90%+ mobile usage |

---

## 📄 License

**Private — All rights reserved.**

© 2024 RouteDrop. Unauthorized copying, distribution, or modification of this project is strictly prohibited.
