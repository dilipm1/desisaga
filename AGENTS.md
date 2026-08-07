# desisaga.com — Ecommerce Project

## Domain
- **Domain**: desisaga.com
- **Registrar**: Namecheap
- **Status**: Registered, DNS needs configuration

## Concept
**Desi Saga** — Indian Hindu festival & ritual gift hampers. Pre-curated packages for celebrations and religious ceremonies.

### Product Categories
| Category | Example Products |
|---|---|
| **Diwali Hampers** | Diya set + rangoli + sweets box |
| **Puja Kits** | Complete puja thali with samagri |
| **Wedding Gift Boxes** | Mangalsutra + sindoor + shagun envelope |
| **Housewarming (Griha Pravesh)** | Ganesh idol + coconut + Kalash set |
| **Navratri/Durga Puja** | Garba accessories + navratri puja kit |
| **Raksha Bandhan** | Rakhi set + sweets + gift voucher |

## Tech Stack
- **Framework**: Next.js 16.2.10 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Payments**: Stripe (test mode placeholders for now)
- **Hosting**: Vercel (free tier)
- **Cart**: React Context + localStorage (no database for MVP)
- **Icons**: lucide-react

## Payment Strategy (when ready)
- **Indian customers**: INR via UPI, cards, netbanking (Stripe India, 2% fee)
- **International customers**: USD/GBP via Stripe international (2.9% + $0.30)
- **Requirement**: Indian business entity for Stripe India activation

## Hosting
- **Platform**: Vercel (free tier)
- **Limits**: 100 GB bandwidth/month, 10s serverless timeout
- **SSL**: Automatic via Vercel

## DNS Configuration (Namecheap)
```
Type    Host    Value
CNAME   @       cname.vercel-dns.com
CNAME   www     cname.vercel-dns.com
```

## Architecture
```
desisaga.com → Vercel → Next.js App
                          ├── Landing page (hero, categories, featured)
                          ├── Product catalog (grid, filters, search)
                          ├── Product detail (images, add to cart)
                          ├── Cart (localStorage, quantity controls)
                          ├── Checkout (Stripe Checkout session)
                          └── Success page
```

## Project Structure
```
~/Projects/desisaga/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Landing page
│   │   ├── layout.tsx            ← Root layout (Navbar, Footer, CartProvider)
│   │   ├── products/
│   │   │   ├── page.tsx          ← Product catalog
│   │   │   └── [slug]/page.tsx   ← Product detail
│   │   ├── cart/page.tsx         ← Cart
│   │   └── checkout/
│   │       ├── page.tsx          ← Checkout (Stripe placeholder)
│   │       └── success/page.tsx  ← Order confirmation
│   ├── components/
│   │   ├── Navbar.tsx            ← Sticky nav with cart badge
│   │   ├── Footer.tsx            ← Footer with links
│   │   └── ProductCard.tsx       ← Product card component
│   ├── lib/
│   │   ├── cart.ts               ← Cart context + localStorage
│   │   └── products.ts           ← Product data functions
│   └── types/index.ts            ← TypeScript types
├── data/products.json            ← 8 festival hamper products
├── AGENTS.md                     ← This file
└── SESSION.md                    ← Session history
```

## Build Steps
1. [x] Create Next.js project with `create-next-app`
2. [x] Build landing page (hero, brand story, featured hampers)
3. [x] Build product catalog (grid, category filters)
4. [x] Build product detail (images, description, add to cart)
5. [x] Build cart page (add/remove, quantity, subtotal)
6. [x] Set up Stripe checkout (test mode placeholders)
7. [x] Add sample products (8 festival hampers)
8. [ ] Deploy to Vercel
9. [ ] Connect desisaga.com domain via DNS

## Current Status
- [x] Project concept defined
- [x] Tech stack decided
- [x] Domain registered
- [x] Next.js project created
- [x] Store pages built (6 pages)
- [x] Sample products added (8 hampers)
- [x] Night-of-the-celebration design pass (toran hero, festival calendar, dark theme)
- [x] Dev server verified working on Node 25.9.0 (2026-08-07)
- [x] `npm run build` verified working on Node 25.9.0
- [ ] Deployed to Vercel
- [ ] DNS configured
- [ ] Stripe connected (real payments)

## Design System (2026-08-07)
- **Direction**: "Night of the celebration" — dark ritual canvas, firelight accents
- **Type**: Rozha One (display) · Instrument Sans (body) · Space Mono (dates/countdown)
- **Palette**: night `#1A0B0A`, ember `#2E1210`, parchment `#F7EEDC`, flame `#E9B44C`, marigold `#E8731F`, kumkum `#C2322E`, leaf `#8FAE6B`, line `#422A1C`
- **Signature**: ToranGarland (marigold/mango-leaf doorway swag) at the hero top
- **Hero**: live countdown to the next festival ("Send the festival home.")
- **Structure**: `src/lib/festivals.ts` holds the festival calendar (dates, days-left, ritual items); YearCalendar renders it chronologically
- Copy uses ritual vocabulary (shagun, ritual-ready, samagri) — not generic selling

## Known Issues
- None blocking. `npm run dev` and `npm run build` both verified working on Node 25.9.0 (2026-08-07); the earlier Node 25 + Turbopack Bus error on build did not recur

## Next Steps (when resuming)
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel` from project root
3. Connect desisaga.com domain
4. Configure DNS on Namecheap (CNAME → cname.vercel-dns.com)
5. Set up Stripe account and add real keys
6. Replace placeholder images with real product photos

## User Preferences
- Review at each major checkpoint before proceeding
- Placeholder copy and images for now — real content later
- Stripe in test mode — real payments later
- Mobile-first design (Indian market preference)
- Free hosting for now — dedicated server later if needed
- Performance-conscious — prefers lightweight solutions
