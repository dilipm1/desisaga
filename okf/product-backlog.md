---
title: Desi Saga — Product Backlog
kind: okf/product-backlog
version: 1.2.0
owner: Product Owner
last_updated: 2026-09-10
status: active
tags: [backlog, moscow, epics, basecamp]
---

# Desi Saga — Product Backlog

> Maintained from a **Product Owner perspective** (MoSCoW). Each Epic is designed as a **graph** (jobs → arrows → shared state). Canonical source: `data/backlog.json`; human-readable mirror: this file. Live view: Basecamp "DesiSaga" project to-do lists + Hill Charts. **Last audit 2026-09-10 v1.2.0 — DS-102 FULL slider groomed (Stimulus+Turbo), DS-601 split into DS-601a/b, Basecamp synced (DS-601a/b created).**

## Priority Legend

- **Must** — MVP cannot launch without it
- **Should** — important but can ship after MVP
- **Could** — nice to have
- **Won't** — explicitly not this cycle (per 2026-09-01: Stripe/deploy/ActiveStorage postponed until host chosen)

## Status Legend (2026-09-01)

- ✅ **Done** — shipped + verified
- 🟡 **In progress** — demo/stub ships, real impl pending
- ⬜ **Backlog** — not started
- ⏸️ **Won't** — stub only, not prioritized this cycle

---

## EPIC-1: Festival Hampers Marketplace

**Graph**: `browse → filter → detail → cart → checkout` — **Hill: shipped** (category+region+search+sort+pagy 12 live; DS-102 FULL slider groomed 2026-09-10)

| ID | Story (PROMPT) | Priority | Status | Acceptance Criteria (DELIVER) | Nodes | Notes |
|---|---|---|---|---|---|---|
| DS-101 | As a user, I can filter hampers by festival (Diwali, Wedding, etc.) | Must | ✅ Done (2026-08-23) | Filter persists across pages, shows correct count | catalog → filter → grid | 17 `CATEGORIES`, 13 `REGIONS`, chips + Pagy preserve `?category=&region=&q=&sort=&page=` (fixed 2026-09-01) |
| DS-102 | As a user, I can set min/max price | Should | ⬜ Backlog | Dual slider filters grid via Turbo Frame (no reload); preserves category/region/q/sort/page + Pagy overflow to p1; URL `?min_price=&max_price=` + No results block | catalog → price → grid | Groomed 2026-09-10 FULL slider (Stimulus + Turbo Frame, debounce 200ms, Pagy params); Basecamp description needs manual update (skipped by sync) |
| DS-103 | As a user, I can search by keyword | Could | ✅ Done (2026-08-23) | Search matches name/description/tags | catalog → search → grid | `Product.search` with `sanitize_sql_like` (fixed 2026-09-01) |
| DS-104 | As a user, I see featured hampers on the landing page | Must | ✅ Done (2026-08-23) | Featured badges render, section populated | catalog → featured → landing | `Product.featured.limit(4)` + hero |
| DS-105 | As a user, I can sort by price/name | Could | ✅ Done (2026-08-31) | Sort control reorders grid | grid → sort → grid | `name` / `price` / `price.desc` whitelist |

## EPIC-2: Ritual Validation & Samagri Coverage

**Graph**: `ritual data → product mapping → verification loop → display` — **Hill: shipped** (23 hampers, ritual mapping live)

| ID | Story (PROMPT) | Priority | Status | Acceptance Criteria (DELIVER) | Nodes | Notes |
|---|---|---|---|---|---|---|
| DS-201 | As a user, I see which rituals each hamper covers | Must | ✅ Done (2026-08-23) | Product card shows ritual icons | ritual data → mapping → card | `category_emoji` / `category_badge_class` (17) |
| DS-202 | As a user, I see what's inside (samagri) before buying | Must | ✅ Done (2026-08-23) | Detail page lists items + quantities | mapping → detail | `ritual_contents` grid + region badge (2026-09-01) |
| DS-203 | As a user, I trust items are ritual-ready | Should | ✅ Done (2026-08-31) | Ritual-check note on detail page | verification → display | "Built for the ritual" pillars + trust bar |
| DS-204 | As the PO, I can add new festival ritual data | Should | ✅ Done (2026-08-31) | `data/festivals_generated_2026_2030.json` is source for calendar | ritual data → calendar | Option B 14 bases 2026-2030 Lahiri + variants; Rama Navami corrected 2026-09-01 |

## EPIC-3: Stripe Payment Integration (India & International) — **STUB ONLY**

**Graph**: `cart → session → webhook → confirm → notify` — **Hill: gray** (figuring out stubs, not executing real Stripe per 2026-09-01: Stripe/ActiveStorage/deploy postponed until host chosen)

| ID | Story (PROMPT) | Priority | Status | Acceptance Criteria (DELIVER) | Nodes | Notes |
|---|---|---|---|---|---|---|
| DS-301 | As a user, I can complete checkout in test mode | Won't | ⬜ Backlog (stub) | Order appears in Stripe dashboard; success page loads | session → webhook → success | Stub only: demo `POST /checkout` clears cart; real Stripe `Checkout Session` postponed |
| DS-302 | As an Indian customer, I can pay INR via UPI/cards | Won't | ⬜ Backlog | Stripe India connected; 2% fee applied | session → UPI → confirm *(human gate)* | Postponed |
| DS-303 | As an international customer, I can pay USD/GBP | Won't | ⬜ Backlog | Stripe international; 2.9% + $0.30 | session → cards → confirm | Postponed |
| DS-304 | As a merchant, I get notified of successful payments | Won't | ⬜ Backlog | Webhook updates order status + email | webhook → notify | Postponed — needs real Stripe + host |
| DS-305 | As a user, I see a clear order confirmation | Must | ✅ Done (2026-08-23) | Success page shows order summary | confirm → success | `checkout/success` + subtotal+shipping+total parity |

## EPIC-4: Hero Experience & Festival Calendar

**Graph**: `festival calendar → countdown state → hero render → calendar loop` — **Hill: shipped** (toran + countdown + 14-base calendar + hero image)

| ID | Story (PROMPT) | Priority | Status | Acceptance Criteria (DELIVER) | Nodes | Notes |
|---|---|---|---|---|---|---|
| DS-401 | As a user, I see days until the next festival | Must | ✅ Done (2026-08-23) | Countdown updates daily, matches YearCalendar | calendar → countdown → hero | `PanchangCalculator.next_festival` year-wrap + region alias |
| DS-402 | As a user, I see the ToranGarland signature | Must | ✅ Done (2026-08-07) | Renders at hero top, animates continuously | design → component → hero | `_toran_garland.html.erb` |
| DS-403 | As a user, I see the year of festivals | Must | ✅ Done (2026-08-31) | YearCalendar lists all dated festivals chronologically | calendar → render | 14 bases, variant badges, next-year rollover |
| DS-404 | As a user, I see "occasions, not dates" rituals | Should | ✅ Done (2026-08-31) | Anytime rituals render in separate section | rituals → render | `ANYTIME_RITUALS` (Wedding/Housewarming/Puja) |
| DS-405 | As a user, I can jump from a festival to its products | Must | ✅ Done (2026-08-23) | Card links to filtered product catalog | calendar → link → catalog | Calendar + hero CTA → `products?category=` (preserves filters 2026-09-01) |
| DS-406 | As a user, www.desisaga.com redirects to desisaga.com | Must | ✅ Done (2026-09-01) | www/ 301 → apex; www/* 301 preserves path; SAN cert | dns → proxy → routes → redirect | Kamal proxy `hosts: [apex, www]` + `routes.rb` `constraints(host: /\Awww\./)`; `curl -I https://www.desisaga.com/` → 301 |

## EPIC-5: Admin & Order Management — **STUB ONLY**

**Graph**: `order capture → status → dispatch → deliver` (human gate: refunds) — **Hill: gray** (figuring out stubs, Admin CRUD shipped)

| ID | Story (PROMPT) | Priority | Status | Acceptance Criteria (DELIVER) | Nodes | Notes |
|---|---|---|---|---|---|---|
| DS-501 | As a customer, I can view order status | Could | ⬜ Backlog | Order ID links to Stripe payment status | order → status → view | Needs Order recording — postponed until Stripe/host |
| DS-502 | As an admin, I can list orders | Won't | ⬜ Backlog | Admin route lists orders by date | capture → list | Postponed |
| DS-503 | As an admin, I can issue refunds | Won't | ⬜ Backlog | Refund action + Stripe sync | status → refund *(human gate)* | Postponed |

## EPIC-6: Majestic Monolith Hardening (Basecamp-inspired) — **TECH FOCUS**

**Graph**: `buckets → recordings → recordables → events → copy/move → timeline` — **Hill: gray** (Cycle 1: DS-601a skeleton ~3d + DS-601b dual-write ~4d, groomed 2026-09-10)

> See `okf/technical-architecture.md:1` for full Basecamp mimic: delegated types, immutable recordables, buckets, events, Solid Queue/Cache/Cable, Majestic Monolith.

| ID | Story (PROMPT) | Priority | Status | Acceptance Criteria (DELIVER) | Nodes | Notes |
|---|---|---|---|---|---|---|
| DS-601a | As a dev, I can create a Recording with delegated_type recordable (ProductRecordable skeleton) | Must | ⬜ Backlog | Recording model with `delegated_type :recordable` exists; ProductRecordable migrates clean; tests green, no catalog change | buckets -> recordings -> recordables | Groomed 2026-09-10: split from DS-601, ~3d; Basecamp created 2026-09-10 |
| DS-601b | As a dev, the /products catalog reads via recording scope with dual-write kept | Must | ⬜ Backlog | `bucket.recordings.products` returns catalog; `/products` works via recording scope; dual-write + backfill 23 hampers | recordings -> catalog -> dual-write | Groomed 2026-09-10: split from DS-601, ~4d; Basecamp created 2026-09-10 |
| DS-602 | As a dev, I can scope access by bucket (region/shop) not global admin? | Should | ⬜ Backlog | Bucket `bucketable` types (Shop, Region); `bucket.accesses`; region filter via bucket not `Product.region` string | bucket → access → recordings | Groomed 2026-09-10: bucket access after dual-write, about 4d |
| DS-603 | As a PO, I can see product/festival change history and roll back | Should | ⬜ Backlog | Event `recording_id, recordable_id, actor`; every create writes Event; history compare view | recording → events → history | Groomed 2026-09-10: events and history after buckets, about 3d |
| DS-604 | As a dev, I can run festival refresh + jobs via Solid Queue in separate DB | Could | ⬜ Backlog | Queue job for `PanchangCalculator` refresh; `Mission Control` at `/jobs` (admin); 4 DBs already `config/database.yml:26` | queue → job → poll | Groomed 2026-09-10: queue polish last, about 2d |

---

## 2026-09-10 Audit Summary (Backlog vs Reality v1.2.0)

- **Shipped (✅ 15)**: DS-101,103,104,105,201,202,203,204,305,401,402,403,404,405,406. Catalog 23 hampers (paise), 17 categories, 13 regions, Pagy 12/20, Option B Panchang 14 bases, **Hetzner CX23 nbg1 DEPLOYED**, **www→apex 301**.
- **Won't / Postponed (⏸️ 7)**: DS-301,302,303,304 (Stripe) + DS-501,502,503 (orders) — stubs only until host chosen. Per PO 2026-09-01.
- **Backlog (⬜ 6)**: DS-102 FULL slider + DS-601a/b + DS-602/603/604 tech (Basecamp mimic). Old DS-601 archived in Basecamp (split); DS-102 Basecamp description pending manual update (skipped by sync).
- **Hill Charts**: EPIC-1 shipped, EPIC-2 shipped, EPIC-3 gray, EPIC-4 shipped, EPIC-5 gray, EPIC-6 gray (Cycle 1 groomed 2026-09-10).

## Sizing & Cycles (Kept at 2 weeks per PO 2026-09-01)

- Work in Basecamp-friendly **cycles** (default 2 weeks; scale to 6-week Shape-Up cycles as appetite grows).
- To-do lists = Epics; to-dos = stories, ordered top-to-bottom by MoSCoW priority.
- Use **Hill Charts** per Epic to track progress (gray = figuring out, white = executing, shipped = over the hill).

## Grooming Rules (PO)

1. Every story must have **graph nodes** recorded in its Basecamp to-do description.
2. No story enters a cycle without **acceptance criteria** (DELIVER).
3. Reviewers must be **non-authors** (writer/checker separation).
4. Priority is MoSCoW — re-validate each grooming.
5. Sync `data/backlog.json` → Basecamp with `npm run sync:basecamp` after backlog changes.
