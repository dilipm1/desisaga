# Desi Saga

Ecommerce store for Indian Hindu festival and ritual gift hampers. Pre-curated
packages for Diwali, weddings, puja kits, housewarming, Navratri, Raksha Bandhan,
and more — designed around a dark "night of the celebration" aesthetic.

## Tech Stack

- **Framework**: Next.js 16 (App Router, TypeScript)
- **Styling**: Tailwind CSS v4
- **Type**: Rozha One (display) · Instrument Sans (body) · Space Mono (dates/countdown)
- **Payments**: Stripe (test mode placeholders)
- **Cart**: React Context + localStorage
- **Icons**: lucide-react

## Pages

- `/` — Landing (toran hero, live festival countdown, year-of-festivals calendar)
- `/products` — Catalog with category filters and search
- `/products/[slug]` — Product detail
- `/cart` — Cart with quantity controls
- `/checkout` — Checkout (Stripe placeholder)
- `/checkout/success` — Order confirmation

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev      # dev server (Turbopack)
npm run build    # production build
npm run start    # serve production build
npm run lint     # eslint
```

## Notes

- Product data lives in `data/products.json`; festival calendar data in `src/lib/festivals.ts`
- Images are placeholders (Pexels) until real product photos are available
- Stripe is installed but payment processing is pending real keys
