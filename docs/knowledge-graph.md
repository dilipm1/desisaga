# Desi Saga — Knowledge Graph of Dependencies

> **Shared state map** — tracks the jobs (components/steps), arrows (handoffs/edges), and shared state (data flowing along the edges) of the Desi Saga product. Update this document every sprint (see `docs/ProjectToDos.md` §4.4).

## Component Dependency Map

```
src/app/layout.tsx ──→ Providers (SessionProvider client wrapper) │ state: NextAuth session
src/app/layout.tsx ──→ CartProvider (cart context)          │ state: cart in localStorage
src/lib/cart.tsx ────→ localStorage (persisted across reloads)  │ state: cart items + total
src/lib/festivals.ts ─→ useNextFestival (live countdown)    │ state: today (30-min tick)
src/components/YearCalendar ─→ useToday (30-min tick clock) │ state: daysLeft per festival
src/components/FestivalHero ─→ useNextFestival (daysLeft)   │ state: next festival
src/lib/products.ts ───→ data/products.json (8 hampers)     │ state: product catalog
src/components/ProductCard ─→ CATEGORY_BG (category styling)│ state: category → style map
src/app/checkout/page.tsx ─→ Stripe Checkout Session        │ state: session id
src/app/success/page.tsx ──→ Webhook confirmation           │ state: order status
src/lib/authOptions.ts ─→ Google + admin Credentials providers │ state: JWT w/ role claim
src/app/api/auth/[...nextauth]/route.ts ─→ authOptions      │ state: session cookie
src/components/Navbar.tsx ─→ useSession (auth state UI)      │ state: session.user + role
src/app/admin/login ─→ signIn("admin") ─→ Credentials provider │ state: role=admin session
src/app/admin/products ─→ src/lib/api/products.ts ─→ /api/admin/products │ state: product list
src/app/api/admin/products/route.ts ─→ data/products.json (fs) │ state: product catalog (read/write)
```

## Graph Representation

```mermaid
graph LR
    A[layout.tsx] --> AP[providers.tsx SessionProvider]
    AP --> B[CartProvider]
    B --> C[cart.tsx]
    C -->|localStorage| D[Cart State]
    E[festivals.ts] --> F[useNextFestival]
    E --> G[useToday]
    G -->|30-min tick| H[daysLeft]
    F --> I[FestivalHero]
    H --> J[YearCalendar]
    K[products.ts] --> L[data/products.json]
    K --> M[ProductCard]
    L -->|catalog| N[Category styles]
    O[checkout/page.tsx] --> P[Stripe Session]
    Q[success/page.tsx] --> R[Webhook Confirmation]
    AO[authOptions.ts] --> AR[api/auth/[...nextauth]]
    AR -->|session cookie| AU[useSession]
    AU --> NB[Navbar auth UI]
    AL[admin/login] -->|signIn admin| AO
    APG[admin/products] --> APIP[api/admin/products]
    AAD[admin/add] -->|POST| APIP
    APIP -->|fs read/write| L
```

## Shared State Inventory

| State | Source | Consumers | Persistence |
|---|---|---|---|
| Cart items + total | `src/lib/cart.tsx` | Navbar badge, Cart page | localStorage (`desisaga-cart`) |
| Today (30-min tick) | `src/lib/festivals.ts` `useToday` | YearCalendar, FestivalHero | ephemeral (client clock) |
| Next festival + days left | `getNextFestival` | Navbar chip, FestivalHero, countdown | computed at render |
| Product catalog | `data/products.json` | products page, ProductCard, detail page | static import (read) |
| Product catalog (admin writes) | `/api/admin/products` route | admin grid, add form | fs write to products.json |
| Category → style/emoji/gradient | `src/lib/constants.ts` | ProductCard, category filters | static import |
| Checkout session | Stripe (test mode) | checkout page, success page | Stripe-hosted |
| Auth session (user + role) | NextAuth (`authOptions`) | Navbar, admin pages | JWT session cookie |
| Admin credentials | `.env` (ADMIN_EMAIL/ADMIN_PASSWORD) | Credentials provider | env vars |

## Arrows (Handoffs)

| From | To | Trigger |
|---|---|---|
| Browse products → Detail | `products/[slug]/page.tsx` | click product card |
| Detail → Cart | `addItem(product)` | click "Add to cart" |
| Cart → Checkout | `/checkout` | click "Proceed to checkout" |
| Checkout → Stripe | `createCheckoutSession` | submit checkout form |
| Stripe → Success | webhook `checkout.session.completed` | payment succeeds |
| Festival calendar → Category | `?category=<name>` link | click festival/ritual card |
| Footer/Navbar → Google login | `/login` → Google OAuth → callback | click "Sign in" |
| Admin login → Inventory | `/admin/login` → Credentials → `/admin/products` | successful admin auth |
| Add form → Catalog | POST `/api/admin/products` → products.json | submit add-product form |
| Inventory → Catalog removal | DELETE `/api/admin/products?id=` | click delete + confirm |

## Change Log

| Date | Change | Author |
|---|---|---|
| 2026-08-19 | Added auth graph (authOptions → NextAuth route → session → Navbar) and admin inventory graph (admin pages → CRUD API → products.json) | — |
| 2026-08-12 | Initial knowledge graph created from existing components | — |
