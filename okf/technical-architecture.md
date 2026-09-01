---
title: Desi Saga — Technical Architecture (Basecamp-inspired)
kind: okf/technical-architecture
version: 1.1.0
owner: Tech Lead
last_updated: 2026-09-01
status: active
tags: [architecture, basecamp, delegated-types, solid-stack, rails8]
---

# Desi Saga — Technical Architecture (Mimicking Basecamp)

> **Goal:** Make Desi Saga a *majestic monolith* like Basecamp — one Rails app, one repo, one deploy (Kamal), SQLite + Solid stack locally, MySQL-ready for SaaS scale, Hotwire throughout. Stripe & deploy infra remain **stubs** per 2026-09-01 decision until hosting choice lands.

## 1. Basecamp (37signals) — what we mimic

### 1.1 The chassis (v3, 2012→now)

Basecamp 3/4/5 all run on **one chassis** — a single Rails monolith (197k LOC) that hasn't been rewritten in 10+ years. Key ideas:

- **Majestic monolith** — one app, one big DB, no microservices. Deployed with **Kamal** (Docker + Traefik + Let's Encrypt) to own hardware (Dell R7625, 196 vCPU, <$20k/5yr) after exiting AWS EKS/RDS in 2023. Median request 19ms vs 67ms before.
- **Delegated Types (Recordings/Recordables)** — instead of STI or polymorphic:
  ```ruby
  # recordings table: tiny, no text columns, just metadata + recordable_type/id + bucket_id + parent_id
  class Recording < ApplicationRecord
    belongs_to :bucket
    belongs_to :parent, class_name: "Recording", optional: true
    delegated_type :recordable, types: %w[Message Comment Document Upload ...]
  end
  # recordables: immutable dumb rows (title, body) — one table per type, no cross-cutting baggage
  ```
  Why: **one query** for timeline (`SELECT * FROM recordings WHERE bucket_id=? ORDER BY updated_at LIMIT 20`), cheap index, easy pagination, uniform `RecordingsController#trash/#archive/#copy` + `RecordingCopier` for any type. Adding a new type = new table, no migration of big table. Events table tracks immutable version history (`recording_id, recordable_id`).

- **Buckets / Bucketables** — access control container. `Project`, `Template`, `Ping` are `bucketable` types of `Bucket`. All recordings live in a bucket. If you can access the bucket, you see its recordings. Same pattern as HEY `Entry → entryable`.

- **Hotwire (Turbo + Stimulus)** — server-rendered, progressive enhancement. `Turbo Drive` + `Frames` + `Streams` + `Stimulus` (37 lines for Basecamp Stacks). No SPA, 2-person teams ship in ≤6 weeks.

- **Database-backed everything** — no Redis by default (since Solid):
  - **DB:** MySQL 8 (Trilogy adapter) in production (Fizzy switched from per-customer SQLite → MySQL Nov 2024 due to replication/routing complexity: `FOR UPDATE SKIP LOCKED` crucial). SQLite for dev/ONCE.
  - **Jobs:** **Solid Queue** (DB, `SELECT ... FOR UPDATE SKIP LOCKED`, `covering index` on `(queue_name, priority)`, 5.6M jobs/day, 1300 polls/s @110µs) replaced 7 gems (`resque, resque-pool, scheduler, pause, supervised_fork, sequential_jobs, scheduled_job`). Separate `queue` DB, Mission Control dashboard.
  - **Cache:** **Solid Cache** (DB, key-based, 1TB cluster), separate `cache` DB.
  - **Cable:** **Solid Cable** (DB), separate `cable` DB.
  - **Search:** originally ElasticSearch, now MySQL full-text where possible.
  - **Other:** Depot (files), Portfolio (avatars), Launchpad (SSO), Queenbee (billing) — extracted engines, dev needs only `script/setup`.

- **Scales by sharding avoidance:** 5M users, 18M jobs/day (HEY: 1/3 on Solid Queue) on vertical MySQL (r6g.8xlarge, 32 vCPU 256GB, 1200 writes/s) + read replicas + PgBouncer. No sharding until 10k writes/s. fizzy’s per-customer SQLite experiment gave `one write per customer` vs `one write per app` but required Beamer replication + Kamal proxy routing — too complex for SaaS, hence MySQL for now. **Takeaway:** stay on single DB as long as possible.

### 1.2 Principles we steal

1. **Rich domain, CRUD controllers, Concerns, Records as state** (no booleans, no service objects sprawl)
2. **Vanilla Rails is plenty** — build before gems
3. **Ship to learn** — prototype quality valid (Tony Burns `basecamp-sync.mjs`)

---

## 2. Desi Saga — current vs target

### 2.1 Current (2026-09-01, Rails 8.1)

```
desisaga.com → Puma (Hotwire Importmap + Tailwind v4)
  ├── products table (SQLite, JSON columns images/tags/ritual_contents, 17 categories + region)
  ├── users/sessions (bcrypt, built-in authentication)
  ├── session[:cart] (no DB)
  ├── Solid Cache/Queue/Cable (4 SQLite DBs per database.yml:26)
  ├── data/festivals_generated_2026_2030.json (Lahiri table, 14 bases)
  └── lib/panchang_calculator.rb + lib/festivals.rb (Option B)
```

Problems vs Basecamp purity:
- No `Recordings` abstraction — `Product` is bespoke, can't add `Article`, `Review`, `QnA` without new tables/controllers. No tree, no immutable versioning.
- No `Bucket` — access is `User#admin?` globally, not per-project/bucket. Cart is cookie, not DB.
- No Events — festival corrections mutate `data/*.json`, no history.
- Solid stack present but separate DBs already (good) — not yet tenanted/region-aware like Basecamp’s `Fizzy` experiment.

### 2.2 Target (Basecamp-mimic, Stripe/deploy stubbed)

```
App (Majestic Monolith, Kamal-ready)
├── Buckets: Shop, Festival, Region (tamil-nadu, gujarat…) — bucketable types
│     └── Recordings (one table: id, bucket_id, parent_id, recordable_type/id, creator_id, position, status, created_at)
│           ├── recordables: ProductVariant, FestivalNote, RitualContent, CartLine (immutable)
│           └── children: recordings under recordings (tree)
├── Events: recording_id, recordable_id, actor_id — history + compare/rollback
├── Buckets control access: bucket.accesses (User bucket-membership, not global admin)
├── Products: become recordables via recordings (delegated_type)
├── Catalog: bucket.recordings.products (one query, paginate, preload recordables)
├── Hotwire: Turbo Frames for filter (category/region chips preserve params via Pagy `params:`), Stimulus price slider
├── DBs: development: 1 SQLite + 3 Solid DBs (already). Production: same 4 SQLite files on volume, MySQL-ready via Trilogy adapter switch (no code change) when we pick host
├── Background: Solid Queue (separate DB `queue`) for festival refresh, seed, email — not RAM
└── Deploy: Kamal `config/deploy.yml` remains placeholder IP, SSL via Kamal proxy (no Vercel)
```

**Why this helps Desi Saga:** Adding `Onam Sadhya` vs `Thai Pongal` becomes a `Recording` copy (pointer to same `recordable`) + new `Bucket` (region), not data duplication. Timeline `Bucket.recordings.order(:date)` replaces 14-table UNION. Export/copy/trash are one controller.

---

## 3. Amended plan (per 2026-09-01: Stripe=Won't, deploy/ActiveStorage postponed)

### 3.1 Backlog amendments (canonical `data/backlog.json`)

- `DS-301/302/303/304` Stripe: `Should → Won't` (stub `CheckoutsController#create` clears cart, `checkout/show` shows subtotal+shipping parity). Keep `DS-305` ✅ done.
- `DS-102` price slider stays `Should` (next tech cycle, no Stripe needed).
- `DS-502/503` order list/refunds: `Won't` until Order recording exists.
- Epic 3 Hill: `white → gray` (figuring out stubs, not executing real Stripe).
- New Epic 6 (tech): **Majestic Monolith Hardening** — recordings/buckets/events + Solid polish, DB-backed jobs. (To be added as `EPIC-6` in next cycle, not yet in Basecamp.)

### 3.2 Next 2-week cycles (tech focus, deploy-agnostic)

**Cycle 1 — Recordings slice (2 weeks, appetite: one Epic)**
- Introduce `Recording` + `ProductRecordable` (delegated_type) alongside existing `products` (no migration of live data yet, dual-write). Keep `Product` as recordable, add `Bucket` (`Shop`, `region`). Tests: `recording_test.rb`.
- Make catalog `Bucket.recordings.products` work for `/products?category=&region=` (preserve existing `ProductsController#index` behavior via recording scope). Pagy stays.
- Result: Adding `FestivalNote` or `Review` later = new table, zero recordings migration.

**Cycle 2 — Events + Tree (2 weeks)**
- Add `Event` (immutable version): every `recordable` create → `Event.create(recording_id, recordable_id)`. UI: product history compare (like Basecamp doc history).
- Tree: `recording.parent_id` (e.g., `Sankranti` parent → 4 regional children). Calendar `_year_calendar.html.erb:2` uses `children` not flat list.

**Cycle 3 — Solid polish (2 weeks)**
- Move festival refresh `PanchangCalculator.all_for_year` to `Solid Queue` job (cron), add `Mission Control` mount at `/jobs` (admin only). Already have `queue` DB, just add job class.

All three cycles **do not** touch `checkout` Stripe or `storage/` (Active Storage) — those stay on Mallard’s “next host” decision. Kamal proxy stays placeholder.

### 3.3 What we *don’t* do until host chosen

- Active Storage (needs volume/NFS choice; Pexels URLs + `FALLBACK_IMAGE` at `app/models/product.rb:48` suffices)
- Real Stripe (needs webhook URL + secrets)
- DB adapter swap (SQLite → MySQL/Trilogy is config-only at `config/database.yml:26`, no model change)

---

## 4. Verification

- `bin/rails test` (recordings/events), `bin/brakeman`, `bin/rubocop`
- `bin/rails test` Hill: gray→white→shipped movement in `data/backlog.json` then manual drag in Basecamp UI (`okf/basecamp-guide.md:108`)
- No deploy required until `config/deploy.yml` host set — `bin/kamal deploy` remains dry-run

## References

- `dev.37signals.com/the-rails-delegated-type-pattern` (chassis)
- `dev.37signals.com/fizzy-infrastructure` (SQLite per-customer vs MySQL)
- `dev.37signals.com/introducing-solid-queue` (DB jobs, `FOR UPDATE SKIP LOCKED`)
- `docs/knowledge-graph.md:8` (Desi Saga shared state, updated 2026-09-01)
