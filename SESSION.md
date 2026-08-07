# Session — 2026-08-07: Night-of-the-Celebration Design Pass

## What happened
- Ran the Anthropic `frontend-design` skill (`npx skills use`), applied it to the landing page + store shell
- Flipped the site from cream/saffron to a dark "night of the celebration" canvas (approved direction)
- New type system: Rozha One (display), Instrument Sans (body), Space Mono (dates/countdown) via `next/font/google`
- New palette tokens in `globals.css`: night `#1A0B0A`, ember `#2E1210`, flame `#E9B44C`, marigold `#E8731F`, kumkum `#C2322E`, parchment `#F7EEDC`, leaf `#8FAE6B`, line `#422A1C`
- Hero rebuilt around "Send the festival home." with a live countdown to the next festival + ritual-item chips
- Signature element: `ToranGarland` — marigold & mango-leaf SVG doorway swag that sways at the hero top
- New `src/lib/festivals.ts` (dates, days-left, ritual items) and `YearCalendar` section rendering the year chronologically (real dates as numbering)
- New `Reveal` scroll-triggered reveal component (IntersectionObserver, reduced-motion safe)
- Dark-restyled Navbar (persistent "Raksha Bandhan · 15d" countdown chip), Footer, ProductCard, and all 6 pages
- CTA/button system moved to flame (`bg-flame text-night`) with mono date-stamp data treatment
- Fixed 4 `react-hooks/set-state-in-effect` lint errors (lazy state init, derived scroll state, deterministic particles, one justified eslint-disable for localStorage hydration in cart.tsx)
- `npm run build` now succeeds on Node 25.9.0 (previous Bus error gone) — verified pages 200 + DOM/font/token checks via headless Chromium

## Files changed
| File | Change |
|---|---|
| `src/app/globals.css` | Night palette tokens, font tokens, flame gradient, night glow shadows, reveal animation |
| `src/app/layout.tsx` | Loads Rozha One / Instrument Sans / Space Mono; dark body; ToranGarland moved out |
| `src/lib/festivals.ts` | NEW — festival calendar (dates, days-left, ritual items) + `useNextFestival` |
| `src/components/FestiveHero.tsx` | ToranGarland signature upgrade, deterministic FloatingRangoli, FestivalCountdown |
| `src/components/FestivalHero.tsx` | Rebuilt night hero (countdown date-stamp, ritual chips) |
| `src/components/YearCalendar.tsx` | NEW — chronological festival calendar + anytime rituals |
| `src/components/Reveal.tsx` | NEW — scroll reveal wrapper |
| `src/app/page.tsx` | Rebuilt sections (hero, calendar, season hampers, built-for-the-ritual, trust) |
| `src/components/Navbar.tsx` / `Footer.tsx` / `ProductCard.tsx` | Dark restyle + countdown chip |
| inner pages (products, detail, cart, checkout, success) | Dark surfaces, flame CTAs |
| `AGENTS.md` / `SESSION.md` | Design system + status updates |

## Notes / next
- Images still placeholders (Pexels) — real product photos later
- Copy now uses ritual vocabulary (shagun, ritual-ready, samagri)

## Follow-up — 2026-08-07 (live review)
- Ran `npm run dev` — server bound to http://localhost:3000 and served HTTP 200 (the old "doesn't bind to port 3000" issue did not recur)
- User reviewed in browser: "It looks a bit better now" — approved
- `useNextFestival`/`YearCalendar` reworked to use a `useToday()` clock (30-min tick) so the countdown stays live on static deploys instead of freezing at build time
- Committed the night-redesign + session docs

---

# Session — 2026-07-15: Full Build Session

## What happened
- Started in dock-setup-backup folder, migrated context to ~/Projects/desisaga
- Created Next.js 16 project with TypeScript, Tailwind, App Router
- Built complete store with 6 pages and 8 sample products
- Git initialized with 2 commits
- Dev server has port binding issue (Node.js 25 + Turbopack) — needs investigation

## What was built
| File | Description |
|---|---|
| `src/app/page.tsx` | Landing page — hero, category grid, featured hampers, trust bar |
| `src/app/products/page.tsx` | Product catalog — grid, category filters, search |
| `src/app/products/[slug]/page.tsx` | Product detail — image, description, add to cart |
| `src/app/cart/page.tsx` | Cart — quantity controls, subtotal, free shipping threshold |
| `src/app/checkout/page.tsx` | Checkout — Stripe placeholder (test mode pending) |
| `src/app/checkout/success/page.tsx` | Order confirmation |
| `src/app/layout.tsx` | Root layout — Navbar, Footer, CartProvider |
| `src/components/Navbar.tsx` | Sticky nav with cart badge, mobile menu |
| `src/components/Footer.tsx` | Footer with shop/festival/support links |
| `src/components/ProductCard.tsx` | Product card with emoji, price, category |
| `src/lib/cart.ts` | Cart context with localStorage persistence |
| `src/lib/products.ts` | Product data functions (getAll, getBySlug, etc.) |
| `src/types/index.ts` | TypeScript types (Product, CartItem, Cart) |
| `data/products.json` | 8 festival hamper products |
| `AGENTS.md` | Full project context |
| `SESSION.md` | This file |

## Git commits
1. `b3d3d77` — Initial Next.js project setup
2. `bedd7f6` — Add store pages, cart, product catalog, and components

## Sample products (8 total)
1. Diwali Delight Hamper — ₹2,499
2. Complete Puja Kit — ₹1,899
3. Wedding Blessing Box — ₹3,499
4. Griha Pravesh Set — ₹2,799
5. Navratri Celebration Pack — ₹1,999
6. Raksha Bandhan Special — ₹1,499
7. Holi Colors Gift Box — ₹1,299
8. Ganesh Chaturthi Kit — ₹2,199

## Tech stack
- Next.js 16.2.10 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- Stripe (installed, test mode placeholders)
- lucide-react (icons)
- Cart: React Context + localStorage

## Known issue
- `npm run dev` starts but doesn't bind to port 3000
- `npm run build` crashes with Bus error (Node.js 25 + Turbopack)
- Likely Node.js 25 compatibility — Vercel uses Node 20, should work there
- Investigation needed: try `--turbo false` or use Node 20 LTS

## Next steps (when resuming)
1. Fix dev server issue (or deploy directly to Vercel)
2. Install Vercel CLI: `npm i -g vercel`
3. Deploy: `vercel` from project root
4. Connect desisaga.com domain
5. Configure DNS on Namecheap (CNAME → cname.vercel-dns.com)
6. Set up Stripe account and add real keys
7. Replace placeholder images with real product photos

## DNS configuration (for later)
```
Type    Host    Value
CNAME   @       cname.vercel-dns.com
CNAME   www     cname.vercel-dns.com
```

## Context from dock-setup-backup
- User's system: Omarchy (Arch Linux), Hyprland, ThinkPad T14
- Browser: qutebrowser for lightweight use, Chromium for heavy sites
- Glances MCP server running for system monitoring
- Performance-conscious user — prefers lightweight solutions
