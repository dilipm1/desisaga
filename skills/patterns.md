# Desi Saga — Patterns & Anti-Patterns

> Code patterns, architectural decisions, and things to avoid. Anti-patterns matter as much as patterns — especially the "one giant chat" trap from graph engineering.

## Patterns

### 1. Design tokens only in components

Never use raw hex colors in components. Use Tailwind tokens defined in `src/app/globals.css`:

```tsx
// ✅ Good
className="text-parchment bg-ember border-line"

// ❌ Bad
className="text-[#F7EEDC] bg-[#2E1210]"
```

### 2. Domain data separated from components

Static domain data lives in `data/` and is consumed via `src/lib/`:

```
data/products.json → src/lib/products.ts → components/pages
```

### 3. Festival data as the single calendar source

`src/lib/festivals.ts` owns festival dates, ritual items, and countdown logic. Components (FestivalHero, YearCalendar, Navbar) consume it — they never hardcode dates.

### 4. Cart as context + localStorage

`CartProvider` in `src/lib/cart.tsx` wraps the app in `layout.tsx`. Hydration happens on mount to keep SSR markup consistent.

### 5. Writer/checker separation (graph engineering)

Never let the same model/person grade their own work. PR reviewer must be a non-author. Automated loops (lint/test/build) run on every PR.

### 6. Server components by default

Use `"use client"` only where interactivity requires it (cart, countdown, mobile menu, scroll reveals). Keeps payloads small.

### 7. Human gate where mistakes get expensive

Place human approval at the point of no return — PO review before merge, human routing for refunds/complaints, Stripe merchant activation.

## Anti-Patterns

### 1. The "one giant chat"

❌ Doing unbounded work in a single conversation loses context/state and is unreproducible.

✅ Model work as a graph: jobs (nodes), handoffs (arrows), shared state (files). Start Level 1 manual, promote to Level 2 repo-based, then Level 3 tool-automated only when proven.

### 2. Raw colors / magic numbers in components

❌ `bg-[#2E1210]` — breaks theme consistency.

### 3. Hardcoding festival dates

❌ Dates change year to year (lunar calendar). Always go through `festivals.ts`.

### 4. Client components that could be server

❌ `"use client"` on static content — bloats bundle, hurts Lighthouse.

### 5. Committing secrets

❌ `.env` / API keys in git. Use Vercel env vars + GitHub secrets.

### 6. Unreviewed self-merged PRs

❌ Skips the checker loop. Always non-author review.

### 7. Empty retrospectives

❌ A retrospective with no action items means no process change. The LOOP must produce something.
