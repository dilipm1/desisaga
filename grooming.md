# Desi Saga — Backlog Grooming Plan (2026-09-01 Post-MVP)

> Created after first MVP deployed to production at `https://desisaga.com` (www→apex 301). Backlog v1.1.1 (6 epics, 27 todos). Use with `data/backlog.json` (source) + `okf/product-backlog.md` (mirror) + Basecamp `48475118`.

## Current State Analysis

**Production Status:**
- ✅ **Live at `https://desisaga.com`** with working www→apex 301 redirect (c697411)
- ✅ **15 stories shipped** (EPIC-1,2,4) - Core marketplace functionality
- ✅ **7 gray stories** (EPIC-3,5) - Stripe & Admin features (stubs only per 2026-09-01 PO)
- ✅ **5 backlog stories** (EPIC-6) - Majestic Monolith tech stack + DS-102 price slider
- ✅ **All tests passing** (12/48 green), `brakeman` 0, `rubocop` 0

**Backlog Health (v1.1.1):**
- **EPIC-1 (Must)**: 5/5 shipped, 1 backlog (DS-102 price slider) — `hill: shipped`
- **EPIC-2 (Must)**: 4/4 shipped — `hill: shipped`
- **EPIC-3 (Won't)**: 1/5 shipped (DS-305), 4 backlog/Won't — `hill: gray` (Stripe stub)
- **EPIC-4 (Must)**: 6/6 shipped incl. DS-406 www→apex — `hill: shipped`
- **EPIC-5 (Won't)**: 0/3 shipped — `hill: gray` (Admin stub, Order postponed)
- **EPIC-6 (Must)**: 0/4 backlog — `hill: gray` (new tech focus)

## Prioritization Framework

### Immediate Priority (Next 2–4 weeks)

**1. EPIC-6: Majestic Monolith Hardening (Must)**
- Why: Foundation for scaling, Basecamp-inspired chassis (`okf/technical-architecture.md:1`)
- Current: 0/4 backlog (DS-601–604)
- Risk: Without this, future growth constrained; delegated types/buckets/events needed before Stripe/orders scale

**2. EPIC-3: Stripe Integration (Won't but stub improvement)**
- Why: Customer expectation, payment is core to ecommerce
- Current: DS-305 shipped (success page), DS-301–304 backlog/Won't (real Checkout/UPI/webhooks postponed)
- Decision: Keep `Won't` per PO until host chosen, but improve demo stub UX (shipping parity done `99_900`)

**3. EPIC-5: Admin & Order Management (Won't)**
- Why: Internal ops
- Current: Admin CRUD shipped, DS-501–503 backlog/Won't (order list/refund pending Stripe)
- Deferred until Stripe/host chosen

### Medium Priority (Next 4–8 weeks)

**4. EPIC-1 DS-102: Price Range Filter (Should)**
- Why: Completes filtering alongside category/region/search/sort+pagy 12
- Current: Backlog; sort `price/price.desc` exists
- Effort: Slider → grid real-time; small but visible UX win

**5. EPIC-6 Subtasks: Bucket + Events (Should)**
- DS-602 bucket access (region/shop scoping), DS-603 events/version history
- Essential for multi-region + audit

## Recommended Grooming Sessions

### Session 1: Technical Architecture (EPIC-6)
- **DS-601** Recording + ProductRecordable delegated type
- **DS-602** Bucket + bucketable access (Shop, Region)
- **DS-603** Events + immutable version history
- **DS-604** Solid Queue polish + Mission Control (`/jobs` admin)
- Questions: concurrent product updates? audit level? multi-region isolation?

### Session 2: User Experience Completion (EPIC-1/2)
- **DS-102** Price range slider
- **DS-203** Ritual-ready trust note enhancement (per-item tick)
- Questions: price granularity? verification detail?

### Session 3: Payment Infrastructure (EPIC-3)
- **DS-301** Enhance demo checkout UX
- **DS-305** Order confirmation improvements
- Questions: payment methods initially? failure handling?

## Implementation Strategy

### Phase 1: Technical Foundation (Weeks 1–4)
1. DS-601 delegated types (Recording → recordable)
2. DS-602 bucket system (region/shop)
3. DS-603 event system (audit trail)
4. DS-604 Solid Queue + Mission Control

### Phase 2: User Experience (Weeks 5–8)
1. DS-102 price range slider
2. DS-203 ritual verification enhancement
3. Polish hero/calendar (DS-406 done)

### Phase 3: Payment Enhancement (Weeks 9–12)
1. DS-301 demo checkout flow
2. DS-305 order confirmation

## Risk Mitigation

- **Technical**: EPIC-6 complexity → split into small increments; slider integration → start simple
- **Business**: Without real Stripe, conversion limited → document limits, plan future; without admin, ops limited → customer-facing first

## Next Steps

### Immediate (This Week)
1. Schedule grooming sessions for EPIC-6 and DS-102
2. Assign story owners
3. Set up testing for new features
4. Update Basecamp priorities

### Short-term (Next 2 Weeks)
1. Begin DS-601
2. Start DS-102
3. Review Stripe demo stub
4. Document decisions

### Medium-term (Next Month)
1. Complete EPIC-6 foundation
2. Ship price slider
3. Improve checkout
4. Prepare next deploy

## Recommendation Summary

**High Priority (Must Do First):**
1. EPIC-6 Technical Foundation — cannot scale without
2. DS-102 Price Range — completes core UX
3. EPIC-3 Payment Enhancement — improves conversion

**Medium Priority:**
1. DS-602/DS-603 Bucket + Events — multi-region + audit

**Low Priority (Defer):**
1. EPIC-5 Admin — until Stripe/host
2. DS-604 Mission Control — nice to have

---
*Backlog refs: `data/backlog.json:1` v1.1.1, `okf/product-backlog.md:1`, `SESSION.md:1`, `AGENTS.md` Current Status. Infra: Hetzner CX23 `nbg1` `2.28.69.167` (`config/deploy.yml:10`), Kamal SAN `desisaga.com + www` (`config/deploy.yml:18`), `config/routes.rb:2` www→apex 301.*
