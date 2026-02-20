# RouteDrop - P2P Parcel Delivery Marketplace

RouteDrop is a peer-to-peer parcel delivery marketplace that connects senders with verified travelers heading to the same destination. Think of it as "BlaBlaCar for parcels" -- leveraging existing commuter and intercity travel routes to offer fast, affordable, and trust-driven deliveries across India.

## How It Works

1. **Senders** search for travelers heading to their destination city, compare profiles/pricing, and book a delivery with escrow-protected payments.
2. **Travelers** post their upcoming trips (origin, destination, date, vehicle type, trunk space) and earn money by carrying parcels along their route.
3. **Deliveries** are tracked in real-time through four milestones: Picked Up, In Transit, Reached Destination, and Delivered (OTP-verified).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with tabbed search bar ("Send a Parcel" / "Post a Trip"), how-it-works steps, trust signals, and CTAs |
| `/send` | Sender flow -- search results showing available traveler cards with ratings, trunk space, price, and a checkout flow with escrow payment |
| `/travel` | Traveler flow -- post a trip form and active trips dashboard showing incoming parcel requests from senders |
| `/track` | Delivery tracker -- vertical milestone-based tracker with live status updates and OTP confirmation |

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4, shadcn/ui
- **Fonts:** Inter (body) + Space Grotesk (headings)
- **Icons:** Lucide React
- **Language:** TypeScript

## Design System

- **Primary:** Deep Navy Blue -- used for headers, primary buttons, and key UI anchors
- **Secondary/Accent:** Trustmark Green -- used for CTAs, success states, and trust indicators
- **Neutrals:** Soft blue-tinted grays for backgrounds, borders, and muted text
- **Mobile-first:** Designed for 90%+ mobile usage with responsive desktop enhancements

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
app/
  page.tsx              # Landing page
  send/page.tsx         # Sender search results + booking
  travel/page.tsx       # Traveler post trip + dashboard
  track/page.tsx        # Delivery milestone tracker
  layout.tsx            # Root layout with fonts & metadata
  globals.css           # Tailwind v4 theme tokens

components/
  header.tsx            # Responsive nav header
  footer.tsx            # Site footer
  landing/              # Landing page sections (hero, how-it-works, trust, CTA)
  sender/               # Sender booking flow components
  traveler/             # Traveler trip posting & dashboard components
  tracker/              # Milestone delivery tracker components
  ui/                   # shadcn/ui primitives
```

## License

Private -- All rights reserved.
