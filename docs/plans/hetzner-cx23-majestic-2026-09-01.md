# Plan — Hetzner CX23 Majestic Tier 1 (Nuremberg nbg1 EU + Cloudflare) + Oracle Hunt — 2026-09-01 — CORRECTED

> **Frozen in-repo** per PO decision 2026-09-01: in-repo only (no `~/.agent/plans`). **CORRECTED 2026-09-01 19:45 UTC:** CX22 is deprecated (replaced by **CX23** June 15 2026 price adjustment `https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment`); Singapore `sgp1` does NOT offer CX/CAX (EU-only) — Singapore only has CPX/CCX at 20-40% premium and 0.5-8TB traffic. **Cheapest Majestic is Nuremberg `nbg1` CX23.** Stripe + ActiveStorage + deploy pipeline remain stubs until host chosen.

## Decision — CORRECTED

**Tier 1: Hetzner Cloud CX23 Nuremberg `nbg1` (EU) ~€5.49/mo (~₹500 + VAT) + €0.60 IPv4 + Cloudflare free CDN, Kamal Docker+Traefik+Let's Encrypt.** Oracle hunt continues in parallel on `us-chicago-1` (not `ap-mumbai-1`) per correction 2026-09-01 Step 5 revisit later.

- **Previous error:** Singapore CX22 €4.35 assumed same price; actually **CX22 no longer sold**, **CX23 is €3.99→€5.49** in EU (Helsinki/Nuremberg) per `cloudtally.eu/blog/hetzner-june-2026-price-increase` (+38%), Singapore CX not available — you'd pay `CPX11` ~€19.49 in SG. EU+Cloudflare is the industry standard DHH demos.
- **Why Nuremberg now:** Cheapest Majestic that mimics Basecamp, SQLite on persisted volume `storage:/rails/storage` at `config/database.yml:26`. Raw EU 120-180ms to Delhi, but **Cloudflare Mumbai PoP → ~60-80ms effective** for cached assets. Fly `bom1` Mumbai is 20ms but loses Kamal + costs $0.12/GB India egress. See `okf/technical-architecture.md:1` for chassis.

## Architecture snapshot (from `okf/technical-architecture.md:1`)

```
Desi Saga (Rails 8.1, Hotwire Importmap, Tailwind v4)
  → Puma + Solid Cache/Queue/Cable (4 SQLite DBs at config/database.yml:26)
  → products (23 hampers, 17 categories, 13 regions) + lib/panchang_calculator.rb + lib/festivals.rb (Option B 14 bases)
  → Next: Buckets → Recordings → recordables (EPIC-6) delegated_type, Events, parent_id tree
  → Deploy: Kamal → Hetzner CX23 nbg1 → volume desisaga_storage:/rails/storage → proxy ssl host desisaga.com
```

## Purchase links (exact, CORRECTED)

1. **Console to buy CX23:** `https://console.hetzner.cloud/` → **New Project** `desisaga` → **Add Server** → **Location → Nuremberg `nbg1`** (or Falkenstein `fsn1` if nbg1 out of stock) → **Image → Ubuntu 24.04** → **Type → Shared vCPU → CX23** (2 vCPU / 4GB / **40GB** / 20TB) → **SSH key → Add SSH key** (your `~/.ssh/id_ed25519.pub`) → **Create**.
2. **Pricing (new June 15 2026):** `https://www.hetzner.com/cloud/` → **Cost-Optimized** → **CX23** row shows **€5.49** (EU) — see `https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment` table CX23 `0.0064/3.99 → 0.0088/5.49`.
3. **Deploy guide:** `https://community.hetzner.com/tutorials/deploy-rails-8-app-on-hetzner-with-kamal/`

## Execution (2-week cycle, ~3h)

**Step 1 — Hetzner project (10m)** — Done 2026-09-01: `nBG-IP = 2.28.69.167` (CX23 nbg1, Ubuntu 24.04, `ubuntu-4gb-nbg1-2` `7.0.0-30-generic`). Firewall 22/80/443 open (verified `ssh root@2.28.69.167 ok`).

**IP wire 2026-09-01:** `config/deploy.yml:10` updated `hosts: [2.28.69.167]` (Kamal web).

**Step 2 — DNS + Cloudflare (10m)** — Namecheap → Cloudflare NS or add **A `@ → nBG-IP`**, `www → @`, proxy ☁️ on. Caches `public/assets`.

**Step 3 — Kamal config (no deploy yet)** — `config/deploy.yml:10` `hosts: [nBG-IP]`, `proxy.host: desisaga.com` + `www`, `registry: ghcr.io/dilipm1/desisaga` + `.kamal/secrets` (`RAILS_MASTER_KEY`, `KAMAL_REGISTRY_PASSWORD` via `gh auth refresh -s write:packages`).

**Step 4 — Deploy (15m)** — `git` clean → `bin/kamal setup` (Docker, Let’s Encrypt) → `curl -H "Host: desisaga.com" http://<nBG-IP>/up` green → `bin/kamal app exec --reuse "bin/rails db:seed"`.

**Step 5 — Hunt (deferred revisit)** — `systemctl --user status desisaga-hunt` stays `us-chicago-1` (600+ denials). If IP lands in `scripts/oci/arm-instance-ip.txt`, decide: keep Hetzner prod + Oracle staging, or migrate hosts.

## What stays stubbed (per 2026-09-01)

- Stripe `app/controllers/checkouts_controller.rb:8` demo only (`EPIC-3` Won't)
- ActiveStorage `app/models/product.rb:48` `FALLBACK_IMAGE` stays (no `storage/` volume choice yet)
- `EPIC-5` orders Won't

## Verification

- `bin/rails test` 12/48, `bin/brakeman` 0, `https://desisaga.com/up` green, `dig desisaga.com A` → nBG-IP.
- Backlog `data/backlog.json:4` v1.1.0 + `okf/product-backlog.md:4` + Basecamp `48475118` 6 lists 26 todos synced.

## References

- `okf/technical-architecture.md:1` (Basecamp delegated types, Solid Queue `FOR UPDATE SKIP LOCKED`)
- `docs/knowledge-graph.md:8` (shared state, updated 2026-09-01)
- `SESSION.md:7` / `AGENTS.md:10` (next steps)
- Price adjustment: `https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment` + `https://cloudtally.eu/blog/hetzner-june-2026-price-increase`
