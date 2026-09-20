# Session — 2026-09-20: Ahoy Analytics + Blazer BI + Auth/Authz Consolidation DEPLOYED to Production

## ⚡ RESUME HERE — current state

**Production live at `https://desisaga.com`** (Hetzner CX23 Nuremberg `nbg1`, IP `2.28.69.167`, Kamal + Docker + Puma 8.0.2, Rails 8.1.3.1). Container `85c0d28c` healthy.
- **Full E2E suite**: 20 runs, 113 assertions, 0 failures, 0 errors, 0 skips green (`docs/test-reports/2026-09-20-e2e-regression-analytics-report.md`).
- **Brakeman**: 0 warnings.
- **RuboCop**: 0 offenses across 73 files.
- **Analytics & BI**: `ahoy_matey` (5.5) + `blazer` (3.5) live with 8 starter SQL queries seeded in production. Blazer mounted at `/admin/blazer` (admin authentication required).
- **Auth/Authz**: Unified `Authentication` concern in `ApplicationController`, route helpers consolidated to `/login`, seeds explicitly assign `admin` role.

**Last commits pushed to `origin/main`:**
- `85c0d28` feat: ahoy analytics + blazer bi dashboards + auth/authz fixes
- `11e1b15` docs: v1.1.1 backlog + session + agents — Hetzner deployed, www→apex 301 shipped
- `c697411` fix: root route naming conflict in www constraint
- `077cfef` add explicit root redirect in www constraint
- `ff35259` add www→apex 301 redirect constraint
- `9f7dfcd` ui: calendar to navbar + festival hero image
- `17d015b` option B: own Panchang engine — pre-compute 2026-2030 + 14 bases + regional variants + 23 hampers
- `d80f7f8` fix: Ganesh 2026-08-26→2026-09-14, Raksha 2026-08-22→2026-08-28, Navratri 2026-10-15→2026-10-11, Holi 2027-03-04→2027-03-22 (all Drik-verified)
- `ab81ed3` wave2: pagy (12 storefront / 20 admin, overflow→p1) + full dedup of Product callbacks
- `e4c715e` dev: storefront fixes (Tailwind arbitrary `text-[$ss]`, sort `price.desc`), DB indices, model callbacks, Vercel `ci-cd.yml` removal

### What was done this session (2026-08-31, ~4h, 5 commits)

**1. Storefront polish + Wave 1 (e4c715e)**
- Fixed broken Tailwind in `app/views/pages/home.html.erb:53,57` (`bg-[$marigold]`/`text-[$ss]` → `bg-marigold`/`text-sm`, verified `hover:border-marigold`)
- Fixed `Products#index` sort: whitelist `price.desc` → `case` + `Arel.sql(order_sql)` (verified ASC 1,299→3,499 vs DESC reverse, all 200)
- DB: `db/migrate/20260831010935_add_index_to_products_category_and_feature.rb` (category + featured; slug unique already existed) + `AddRegionToProducts` later
- Product: `before_validation :normalize_slug` (parameterize) + `coerce_array_columns` (comma-split) + `set_currency_default` (INR) — 1-line `find_by_slug!` fix, `images&.first` guard
- Deleted `.github/workflows/ci-cd.yml` (Node/Vercel 37 lines) — Rails `ci.yml` retained; `grep -r vercel .github` 0 after

**2. Wave 2 — Pagy + full dedup (ab81ed3)**
- `Gemfile:20` `pagy ~>9.4`, `ApplicationController:2` `include Pagy::Backend`, `ApplicationHelper:2` `Frontend`
- `Products#index:9` `pagy(scope, limit:12)` + `Admin::Products#index:4` `limit:20`, both `rescue Pagy::OverflowError → page 1`
- Moved final `currency ||= "INR"` tap from `Admin::ProductsController:47` to `Product#set_currency_default` → `product_params` is now pure `permit`
- Views: `products/index.html.erb:8` `pagy.count` + `pagy_nav` when `pages>1`; admin grid adds pagy nav; `application.css:117` night `.pagy-nav` styles
- Live verified with 20 products → 12+8 split, overflow fallback 200

**3. Festival date correctness (d80f7f8)**
- Investigated `lib/festivals.rb:8` — Ganesh `2026-08-26` was 19 days early vs Drik/Taiwan timeanddate `2026-09-14` (Mon), Raksha `08-22` vs `08-28` (Fri), Navratri `10-15` vs `10-11` (Sun), Holi `2027-03-04` vs `2027-03-22` (Mon)
- Updated all 4 + verified `Festivals.next_festival(from:2026-08-31) → Ganesh in 14d` (was Navratri), `year calendar 28 Aug·14 Sep·11 Oct·8 Nov·22 Mar` sorted, `bin/rails test` 12/48 still green

**4. Own Panchang Option B for ALL festivals (17d015b)**
- Choice: **Pre-compute table** (Lahiri ayanamsa) not live API — `data/festivals_generated_2026_2030.json` for 14 bases × 5 years (2026-2030) with 6 Sankranti variants, 5 Ugadi variants, 6 Vaisakhi variants etc. — Drik cross-checked (Adhik Maas 2026 late shift)
- Engine: `lib/panchang_calculator.rb` — `table` loader, `all_for_year`, `next_festival(from:, region:)` (year-wrap, `date_override` for future Jan 14 vs 15 Sankranti split), Meeus stubs `solar_longitude`/`tithi_at_sunrise` ready
- Wrapper: `lib/festivals.rb` — `LEGACY_DATED` kept, `build_dated_for`/`dated`/`dated_festivals(region:)` delegates to calculator, `next_festival(region:)` delegates with fallback
- Model: `Product::CATEGORIES 8→17` (+ Sankranti, Shivratri, Ugadi, Rama Navami, Vaisakhi, Janmashtami, Onam, Dussehra, Chhath Puja) + `REGIONS` + `region` string column + index (`db/migrate/20260831044155`), `Product#in_region` scope, `ApplicationHelper` 9 new emoji/badge, `Admin::_form` region select, `Admin::index` region column, `Pages/Products` controllers region-aware
- Seeds: `db/seeds.rb` 8→23 hampers (Thai Pongal Tamil, Uttarayan Gujarat, Maghi Punjab, Ellu Bella Karnataka, Yugadi/Gudi Padwa, Vaisakhi/Puthandu/Vishu, Shivratri, Rama Navami, Janmashtami, Onam, Dussehra, Chhath)
- Calendar: `app/views/shared/_year_calendar.html.erb:2` now `build_dated_for(Date.current.year)` → 14 cards (was 5), variant alias badges, next-year rollover if all past

**5. UI polish (9f7dfcd)**
- Hero: removed floating `link_to "#calendar"` (awkward centered) — hero now single `Shop` CTA (`app/views/pages/home.html.erb:51`)
- Navbar: added **Calendar** item `app/views/shared/_navbar.html.erb:4` (`["Calendar","/#calendar"]` desktop + mobile) linking to `id="calendar"` (works from any page via `/#calendar`)
- Hero image: new partial `_festival_hero_image.html.erb` — `hidden lg:block absolute right-6 top-1/2 w-[420px] xl:w-[520px] h-[480px]`, per-category Pexels map (Diwali, Ganesh, Janmashtami etc.), `opacity-[0.22]` + night gradients, `animate-float 14s`, `Up next` label, diya accent, `pointer-events-none` — verified `src …236149… Janmashtami` on home 200

**Verification this session (2026-08-31)**
- `bin/rails test` → 12 runs, 48 assertions, 0 failures (×5 runs)
- `brakeman -q` → 0 warnings, `rubocop` → 0 style offenses after ` -a`
- Smoke `curl http://localhost:3000` → `home 200`, `products 200`, `cart 200`, `admin 302→200`, `sort price 1,299→3,499 ASC vs 3,499→1,299 DESC`, `pagy 12+8 split` with 20 fixtures, `next Jan 10 2027 default Makara vs tamil-nadu Thai Pongal` variant alias

### What was done this session (2026-09-01, ~2h, 4 commits)

**1. Hetzner CX23 Nuremberg production deploy**
- `config/deploy.yml:10` wired to `2.28.69.167` (Hetzner `nbg1` `ubuntu-4gb-nbg1-2`)
- `bin/kamal setup` — Docker installed, image `ghcr.io/dilipm1/desisaga` built/pushed
- `bin/kamal deploy` — container `c697411` healthy on port 80, `kamal-proxy` up with SAN cert for `desisaga.com` + `www.desisaga.com`
- `config/environments/production.rb:89` `host_authorization` exclude `/up` for Kamal proxy health check (committed `a977a5b`)
- `bin/kamal app exec --reuse "bin/rails db:seed"` → `Products: 23` + `Users: 1 admin@desisaga.com`
- DNS propagated: `https://desisaga.com/up` returns HTTP/2 200; `https://desisaga.com/` full page 200

**2. www → apex 301 redirect (industry standard)**
- `config/deploy.yml:18-22` proxy `hosts: [desisaga.com, www.desisaga.com]` — single SAN cert via Let's Encrypt
- `config/routes.rb:2-6` constraint `host: /\Awww\./` with explicit `root` redirect + glob `*path` redirect (preserves full path + query)
- Deploy `c697411`: `curl -I https://www.desisaga.com/` → `301 location: https://desisaga.com/`; `curl -I https://www.desisaga.com/products` → `301 location: https://desisaga.com/products`
- Verified `desisaga.com` → `200 OK`, `www.desisaga.com` → `301 → desisaga.com`

**3. Backlog + Basecamp sync**
- `data/backlog.json:4` → `v1.1.1` + `okf/product-backlog.md:4` mirrored
- Basecamp `48475118` synced: 6 epics 27 todos, DS-406 www→apex shipped, Hill charts updated
- `node scripts/basecamp-sync.mjs` executed successfully

### Files changed this session (for next reader)
```
config/deploy.yml (hosts + proxy SAN)
config/routes.rb (www constraint redirect)
data/backlog.json (v1.1.1 + DS-406)
SESSION.md + AGENTS.md (infra status + www redirect)
docs/plans/hetzner-cx23-majestic-2026-09-01.md (canonical plan)
```

### Next steps for 2026-09-01+ (see `grooming.md:1` for prioritized plan)

1. **Grooming review** — read `grooming.md:1`; confirm Phase 1 order (EPIC-6 DS-601 delegated types → DS-602 buckets → DS-603 events → DS-604 Solid Queue) vs DS-102 slider
2. **Live Meeus stubs** — fill `PanchangCalculator#solar_longitude` / `tithi_at_sunrise` and cross-check vs table in `test/services/panchang_calculator_test.rb`
3. **Oracle hunt** — still Round 6+, now Day 7 — consider GH Actions hunter for 24/7 if desktop off; Day 14 PAYG upgrade still option (parallel to Hetzner)
4. **Stripe** — wire real checkout (demo place-order → Stripe) — still `Won't` until reviewed in grooming
5. **Images** — replace Pexels placeholders with real photos via Active Storage
6. Optional: customer accounts, automated `bin/rails r FestivalSeeder.refresh` via `solid_queue`

### Files changed this session (for next reader — 2026-08-31)
```
data/festivals_generated_2026_2030.json + lib/panchang_calculator.rb (new)
lib/festivals.rb (variant-aware) + app/models/product.rb (17 cats + region + callbacks)
app/controllers/{pages,products,admin/products} + app/helpers/application_helper.rb
app/views/{pages/home, shared/_navbar, shared/_year_calendar, shared/_festival_hero_image (new), admin/products/*}
db/{migrate/*region, schema.rb, seeds.rb} + app/assets/tailwind/application.css (pagy) + Gemfile(pagy)
.github/workflows/ci-cd.yml (deleted)
```

# Session — 2026-08-24: OCI credentials wired, ARM hunter LIVE (waiting for capacity)

## ⚡ RESUME HERE — current state

**The ARM hunt runs as a systemd user service** (`~/.config/systemd/user/desisaga-hunt.service`): auto-restarts on crash, starts at login, logs to `scripts/oci/hunt.log`. Hunting 2 OCPU / 12 GB Always Free A1 across all 3 Chicago ADs.

**Watch it in the Omarchy bar**: `⏳ R<n>` widget (right section) = hunting · `✅ UP` = instance won · `⛔ OFF` = stopped. **Left-click**: floating terminal with live log + restart help. **Right-click**: restart hunt. Refreshes every 30 s.

**Manual control**:
```bash
scripts/oci/hunt-status.sh      # one-line JSON state
scripts/oci/hunt-restart.sh     # safe restart (systemd-aware)
scripts/oci/hunt-watch.sh       # status + live tail
systemctl --user stop|start|restart desisaga-hunt
```

**On success**: IP lands in `scripts/oci/arm-instance-ip.txt` + `notify-send` fires + widget flips to `✅ UP`. cloud-init now baked into the launch (opens OS iptables 22/80/443 at first boot — anti-brick), and the script probes SSH reachability before declaring victory.

### Wired & verified 2026-08-24
- **Committed `5e8dc72`**: full Rails conversion + OCI tooling as one atomic checkpoint (215 files; master.key/.env/sqlite verified excluded via Rails .gitignore).
- **Network landmine found & fixed in cross-check**: the reused signup-era `free-vcn` had NO internet route (empty route table) — hunter would have won an unreachable instance. Created IGW + `0.0.0.0/0` route on subnet's RT + opened security-list ports **22/80/443** (Phase 4 console task done early). Only OS-level iptables remains post-launch.
- `~/.oci/config` (0600) — user/tenancy OCIDs + fingerprint `0d:dc:4a:9c:…`, region **us-chicago-1**, key at `~/.oci/oci_api_key.pem`. Auth verified via API.
- OCI CLI reinstalled PERSISTENTLY at `~/.local/share/oci-venv` → symlink `~/.local/bin/oci` (v3.90.3). Old /tmp venv died with reboot — don't repeat that.
- Script hardened: OCID parsed from launch response (not laggy list), public-IP retry loop, bootstrap route-table bug fixed (was passing VCN OCID as rt-id), subnet route sanity warning at startup, OUT/ERR temp cleanup.
- CLI quirks learned: empty list results render as ZERO output exit 0; `--sort-by` needs uppercase TIMECREATED; `pkill -f` with pattern present in own cmdline hangs the tool shell — kill by PID.

### Next steps once IP lands
1. `ssh ubuntu@IP` (key already authorized by script) · wait for cloud-init
2. Open ports TWICE: OCI Security List (22/80/443) AND Ubuntu's iptables/ufw (Oracle images ship locked down)
3. Fix GHCR token first: `gh auth refresh -s write:packages` (current token can't push)
4. Update `config/deploy.yml` proxy hosts/servers with the real IP → `bin/kamal setup`
5. `bin/kamal app exec --reuse "bin/rails db:seed"` → Namecheap DNS (A @ → IP, CNAME www) → https://desisaga.com live

### Shape alternation added (2026-08-24 afternoon)
User asked whether varying image/shape helps vs only rotating ADs. Answer: **image = no** (placement checks shape CPU/RAM only; images live in block storage), **shape size = YES** (fragmented host capacity fits 1 OCPU/6 GB far more often than 2/12), AD = already covered. So `grab-arm.sh` now **alternates each round between 2 OCPU/12 GB and 1 OCPU/6 GB** (even rounds full, odd rounds half — same API volume, no extra throttle risk). A 1/6 win is upsizeable later: stop → edit shape → 2/12 → start (resize itself retryable; instance stays ours). Env `OCPUS`+`MEMORY_GB` together pin one size (systemd unit sets neither → alternation active). Verified live: Round 1 ran 2/12 across all 3 ADs; reduced-size win logs an upsize hint. Note: restart resets the round counter to 1 (cumulative denials/throttles unaffected).

### Non-big-3 free options sweep (2026-08-24)
- **Serv00** (Poland, non-profit): genuinely free forever — 3 GB SSD, unlimited transfer, 512 MB RAM, SSH + 15 system processes, 10 MySQL DBs, EU-hosted, 170k users. BUT FreeBSD (no Docker/Kamal), 512 MB RAM → not viable for Rails prod.
- **EUserv VS2-free** (Germany): free forever container VPS (~1 vCPU/1 GB) but **IPv6-only** (needs Cloudflare proxy/DNS64+NAT64), monthly manual extension required, LowEndTalk reports one-time €2.40 extension fee + "nearly unusable" performance. Emergency only.
- **IBM Cloud Lite**: 256 MB-class, effectively dead as VM option. **Alibaba**: promo trials only, no permanent free VPS.
- **Trials (not free)**: DO $200/60d · Vultr $100–250/30d · Linode/Akamai $100/60d · AccuWin Windows 30d.
- ⚠️ **Avoid**: GratisVPS/VPSWala-style "free VPS" listicle sites — affiliate bait, unverifiable, often scams.
- **Wildcard discussed**: home-server + Cloudflare Tunnel (₹0, uses desktop) — power/reliability unsuited to a storefront; noted only.
- Multiple independent 2026 roundups (infrafree.dev, klymentiev, 1vps.com) converge: **only Oracle A1 and GCP e2-micro are truly free-forever VMs; everything else is trials or PaaS**. Our hunt remains optimal.

### Big-3 cloud free-tier deep check (2026-08-24, user asked for thorough verify)
- **AWS** — overhauled July 15, 2025: old 12-month free EC2 is GONE for new accounts. Now credit-based: $100 signup + up to $100 earned, **Free plan dies at 6 months / credit exhaustion → account AUTO-CLOSES** (90-day grace, data deleted). 30+ always-free services (Lambda 1M req, DynamoDB 25 GB, CloudFront 1 TB) but **NO always-free VM**. Dead end for hosting desisaga.
- **Azure** — unchanged: $200/30 days + **12-month B1s VM (750 hr/mo ≈ 1 VM 24/7)** + 65+ always-free (Functions 1M, Cosmos DB 1000 RU/s+25 GB). B1s = 1 vCPU/1 GB — real VM but tiny; hard cliff at month 12 (~$8/mo after).
- **GCP** — unchanged & confirmed Aug 2026 docs: **e2-micro ALWAYS FREE forever** (us-west1/central1/east1 ONLY), 30 GB standard disk, but **1 GB/month egress** (official docs) — fatal for a store. External IPs not included in free tier (billable ~$3–4/mo extra). Cloud Run 2M req/mo always-free is nice but serverless (no SQLite persistence without paid Cloud SQL).
- **Standing conclusion unchanged**: nothing in big-3 beats Oracle A1 (2 OCPU/12 GB/200 GB/10 TB egress/forever). GCP e2-micro is the only permanent free VM but unusable for desisaga traffic-wise.

### Forum intelligence sweep (2026-08-24 evening)
Cross-referenced Reddit r/oraclecloud, Oracle forums/docs, hitrov/oci-arm-host-capacity, terminalbytes, vpsrankings:
- **⚠️ CORRECTION to contingency ladder**: Oracle support update (2026-06-21) says **PAYG/Enterprise tenancies are NOT hit by the 2/12 cut** — PAYG keeps **4 OCPU/24 GB** free allowance. Combined with priority capacity and many "first-try success after upgrade" reports → Day-14 PAYG path is now strictly better than assumed (double RAM + queue jump).
- **Valid combos under new quota**: one 2/12 instance OR two 1/6 instances (or 1+4/1+8 splits ≤ 2/12 total).
- Official Oracle doc levers for Out-of-host-capacity: change shape ✓ (done), change AD ✓ (done), change/don't-specify fault domain (creation: leave unspecified per docs; FD rotation is a documented trick mainly for RESIZES).
- Debunked/no-effect: image switching (placement ignores images), boot-volume size tricks, ORM-stack-vs-direct-launch (same LaunchInstance API underneath).
- Risky/ToS-violating, avoid: parallel per-AD sessions (429 risk), multiple Oracle accounts (ban), GitHub Actions infinite cron (GH ToS — hitrov repo warns explicitly), console auto-clicker gimmicks.
- Post-win survival notes: Always Free idle instances get REAPED (~7 days idle → stop → reclaim); `baunilha/neveridledocker` exists as anti-reaper. desisaga traffic + Solid Queue should keep us "active", but remember the 7-day rule.
- Aug 18 enforcement wave disabled some within-quota A1 instances (Frankfurt reports) — once we WIN, expect possible re-review; keep usage clearly active.

### Contingency ladder (DECIDED 2026-08-24: Option 1 for now)
User chose to keep the free-tier hunt (Option 1). Standing checkpoint plan:
- **Day 7** (~2026-08-31): if still dry → add 1 OCPU/6 GB fallback hunter + GitHub Actions hunter for 24/7 coverage (our systemd hunter only runs while the desktop is on — that's the gap; GH Actions cron needs own repo, not a fork)
- **Day 14** (~2026-08-07 Sep): if still dry → PAYG upgrade (card on file, ₹0 within 2/12 A1 limits, jumps capacity queue; set ₹0 budget alert immediately; NO downgrade after)

Research notes (2026-08-24, web): June 15 2026 Oracle silently halved free A1 4/24 → 2/12 (enforcement from Aug 18, some instances disabled — we're already at 2/12 so safe). PAYG also got the same cut (so "upgrade keeps 4/24 free" is dead), but PAYG still gets priority capacity — not guaranteed though (São Paulo report: 1000+ failed attempts even on PAYG). US regions driest; capacity frees in random small windows, often US off-peak. $300 trial credits are NOT a path: trial-created resources get reclaimed at trial end.
<br>
### Free VPS research report (non-Oracle, 2026-08-24 web search)
**Context: desisaga needs a real VM (Rails + SQLite + Kamal/Docker + persistent disk). PaaS "free tiers" mostly fail on ephemeral filesystems / cold starts / no Docker.**

| Provider | Free offer | Verdict for desisaga |
|---|---|---|
| **Oracle ARM A1** (current) | 2 OCPU/12 GB, 200 GB storage, 10 TB egress, forever | 🏆 Still by far the best deal in cloud — worth the lottery wait |
| **Oracle AMD E2.1.Micro ×2** | 2× (1/8 OCPU/1 GB), forever, same tenancy | Fallback: instantly available (no lottery usually) but 1 GB RAM is very tight for Rails+Docker; keep as emergency option |
| **GCP e2-micro** | 1 VM (0.25 vCPU/1 GB), 30 GB disk, forever, US regions only | Only other permanent free VM from a major cloud; 1 GB egress/month kills an ecommerce site |
| **Render free** | 512 MB web service, 750 hr/mo, sleeps after 15 min (was 30), no custom domains on free | Ephemeral FS + cold starts + no custom domain = dealbreakers |
| **Koyeb free** | As of Aug 2026: database-only (Postgres 5 hr/mo); compute free tier REMOVED (was 512 MB) | Dead for us |
| **Fly.io** | Free tier removed Oct 2024; new accounts get 2-hour trial only | Dead for us |
| **Railway** | $5 one-time trial credit | Trial only |
| **AWS/Azure** | 12-month trials (t2.micro/B1s) + credits | Trials, not forever; reclaim after |
| **Cloudflare Workers/Pages** | 100k req/day free | Serverless edge — can't run Rails/SQLite |
| **Vercel/Netlify** | Generous static/serverless | No Rails |
| **Serv00** | 3 GB space, 512 MB RAM, SSH, FreeBSD, forever | Web hosting niche; no Docker, not for Rails+Kamal |
| **EUserv VS2-Free** | 1 vCPU/1 GB, IPv6-ONLY | Needs tunneling; German; sketchy availability |
| **Glitch / Alwaysdata / HelioHost** | Small always-free app hosting | Node/PHP-focused, tiny limits; not for production Rails |
| **Hetzner/DO/Vultr** | Not free (€4–6/mo trials aside) | The honest paid fallback if Oracle never pays out |

**Bottom line**: Oracle ARM remains the only free option that actually fits desisaga (RAM + persistent disk + Docker + custom domain + real egress). Everything else is either dead, a trial, sleeps, or can't run Rails+SQLite. If the lottery fails by Day 14: PAYG first (still ₹0), a €4/mo Hetzner CX22 as the paid escape hatch.

---

### Prior session (2026-08-23) — full Next.js → Rails 8.1 conversion
All app work DONE & verified (routes/cart/admin/tests/assets/Docker). Admin login: `admin@desisaga.com` / `desisaga-admin-2026`. Dev server stopped; start with `bin/rails server -p 3000`. Details below.

### What happened this session
### 1. Complete rewrite: Next.js → Ruby on Rails 8.1 (DHH-style)
- Deleted ALL Next.js code (src/, package.json, configs). Kept docs/, okf/, specs/, skills/, data/backlog.json.
- Fresh Rails 8.1.3 app generated at repo root (`rails new --css=tailwind --skip-git`, then rsynced).
- Ruby 4.0.6 via mise; OCI CLI installed at `~/.local/bin/oci` (venv at /tmp/opencode/oci-venv — REINSTALL if /tmp cleared).

### 2. Stack
- Hotwire (Turbo+Stimulus) via Importmap — NO Node build step
- Tailwind v4 via tailwindcss-rails (theme in `app/assets/tailwind/application.css`)
- SQLite + Solid Cache/Queue/Cable · Puma · Kamal 2 scaffolded

### 3. Features ported 1:1 from Next.js
| Route | What |
|---|---|
| `/` | Toran-garland hero w/ live festival countdown (`lib/festivals.rb`), year calendar, featured grid, ritual pillars, trust bar |
| `/products` | Category chips + search (`Product.search` scope) |
| `/products/:slug` | Detail + ritual contents + add-to-cart (Turbo form) |
| `/cart` | Server-side session cart (`session[:cart]`), qty +/-/remove/clear as plain forms |
| `/checkout` | Stripe test-mode placeholder → demo order → "Shubh Labh!" success page |
| `/login` | Rails 8 `authentication` generator (bcrypt, signed cookie, sessions table) |
| `/admin/products` | Full CRUD grid, turbo-confirm deletes, per-form CSRF safe |

### 4. Key files created
- `lib/festivals.rb` (autoloaded; DATED_FESTIVALS/ANYTIME_RITUALS/days_left/next_festival)
- `app/models/{product,user,cart_item,current}.rb` — Product has json columns images/tags/ritual_contents, `to_param` = slug
- `app/controllers/application_controller.rb` — NO auth include; cart helpers; **current_user resumes session from cookie** (bug fix below)
- `app/controllers/admin/base_controller.rb` (include Authentication + require_admin, layout "admin")
- Views: ERB partials in `app/views/shared/` (_navbar _footer _toran_garland _spinning_mandala _floating_rangoli _animated_diya _year_calendar _product_card)
- `app/helpers/icons_helper.rb` — inline lucide SVGs (no icon gem)
- Stimulus: navbar_controller (mobile menu), reveal_controller (scroll reveal)
- `db/seeds.rb` — 8 hampers + admin user from ENV
- Design system intact: night palette (#1A0B0A/#2E1210/#F7EEDC/#E9B44C…), Rozha One/Instrument Sans/Space Mono via Google Fonts CDN

### 5. Bugs found & fixed (smoke test caught these)
| Bug | Fix |
|---|---|
| Admin CRUD used `find(id)` but routes carry SLUG (`to_param`) | `find_by!(slug:)` in Admin::ProductsController#set_product |
| `images.first` crashed when images nil | `images&.first` in Product#primary_image |
| Navbar showed "Sign in" even after login — ApplicationController's `current_user` read Current.session but never resumed it from cookie (concern only included in Sessions/Admin controllers) | `current_user` now does `Current.session \|\|= Session.find_by(id: cookies.signed[:session_id])` — verified over HTTP on /, /products, /cart |
| Fixture products.yml had duplicate blank slugs → all tests errored | Wrote 2 valid fixtures; suite green |

### 6. Verification status (2026-08-23)
- ✅ All routes smoke-tested live (200s; /admin/* 302 without cookie, 200 with; /nope → styled 404)
- ✅ Cart flow end-to-end over curl incl. per-form CSRF token extraction (/tmp/opencode/tok.py)
- ✅ Admin login bad creds rejected, good creds reach inventory; create+delete product verified over HTTP
- ✅ Signed-in state ("Sign out" + Admin link) asserted on public pages after fix
- ✅ `bin/rails test`: 12 runs, 48 assertions, 0 failures
- ✅ `RAILS_ENV=production assets:precompile` OK
- ✅ Docker image builds AND boots locally (prod mode): `/` 200, `/up` green (needs Host: desisaga.com header — hosts allowlist)

### 7. Deploy prep (DONE, waiting on server)
- `config/deploy.yml`: service desisaga, image ghcr.io/dilipm1/desisaga, proxy ssl host desisaga.com, volume desisaga_storage:/rails/storage, env injects ADMIN_EMAIL/ADMIN_PASSWORD(+RAILS_MASTER_KEY secret)
- `config/environments/production.rb`: force_ssl + assume_ssl ON, config.hosts = [desisaga.com, www.desisaga.com]
- `.kamal/secrets`: RAILS_MASTER_KEY=$(cat config/master.key); ADMIN_PASSWORD from .env; KAMAL_REGISTRY_PASSWORD expected as env var
- Registry decision: GHCR (gh logged in as dilipm1, but token LACKS write:packages scope — needs `gh auth refresh -s write:packages`)
- User rejected paid VPS for now → chose Oracle Always Free ARM route
- **`scripts/oci/grab-arm.sh`** written + syntax-checked: bootstraps VCN/subnet if absent, cycles all ADs, retries "Out of host capacity" forever w/ jittered ~5min backoff, writes IP to scripts/oci/arm-instance-ip.txt. Env overrides: OCPUS/MEMORY_GB/RETRY_SECONDS. Run non-blocking: `nohup scripts/oci/grab-arm.sh > /tmp/opencode/arm-hunt.log 2>&1 &`
- Fallback option discussed, not built: Render free tier (ephemeral disk caveat)

---

### 8. 🚧 Waiting on USER (to unblock deploy)

**Oracle Cloud API credentials** (they hit "out of host capacity" in console; automation needs API access):
1. Console → profile icon → **User settings → API keys → Add API Key → Generate API Key Pair**
2. Download private key → save as `~/.oci/oci_api_key.pem` (chmod 600)
3. Paste me: home region (e.g. ap-mumbai-1) · tenancy OCID · user OCID · fingerprint
4. I then: write ~/.oci/config → verify auth → launch grab-arm.sh in background → report when IP lands
5. 

**If capacity never frees:** suggest PAYG upgrade (stays free within A1 limits, jumps queue) or Render fallback.

### 9. Next steps after instance lands
1. `bin/kamal setup` (installs Docker, boots proxy, first deploy, Let's Encrypt for desisaga.com)
2. `bin/kamal app exec --reuse "bin/rails db:seed"`
3. Namecheap DNS: A record @ → IP (+ CNAME www)
4. Later: real Stripe, customer accounts, fix .github/workflows/ci-cd.yml (still Node-targeted!)

### 10. Gotchas for next session
- `pkill -f rails` can hang the tool shell (kills own process group) — use `kill -9 $(pgrep -f puma)` carefully or just leave server running
- Per-form CSRF tokens: scraping "first" authenticity_token on a page grabs the WRONG form's token; extract per-form-block (tok.py pattern in /tmp/opencode — recreate if lost)
- /checkout redirects to /products when cart empty (by design)
- Production container 403s on localhost Host header — hosts allowlist is intentional; test with `-H "Host: desisaga.com"`
