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

### Contingency ladder (DECIDED 2026-08-24: Option 1 for now)
User chose to keep the free-tier hunt (Option 1). Standing checkpoint plan:
- **Day 7** (~2026-08-31): if still dry → add 1 OCPU/6 GB fallback hunter + GitHub Actions hunter for 24/7 coverage (our systemd hunter only runs while the desktop is on — that's the gap; GH Actions cron needs own repo, not a fork)
- **Day 14** (~2026-08-07 Sep): if still dry → PAYG upgrade (card on file, ₹0 within 2/12 A1 limits, jumps capacity queue; set ₹0 budget alert immediately; NO downgrade after)

Research notes (2026-08-24, web): June 15 2026 Oracle silently halved free A1 4/24 → 2/12 (enforcement from Aug 18, some instances disabled — we're already at 2/12 so safe). PAYG also got the same cut (so "upgrade keeps 4/24 free" is dead), but PAYG still gets priority capacity — not guaranteed though (São Paulo report: 1000+ failed attempts even on PAYG). US regions driest; capacity frees in random small windows, often US off-peak. $300 trial credits are NOT a path: trial-created resources get reclaimed at trial end.

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

## Prior session (2026-08-23) — full Next.js → Rails 8.1 conversion
All app work DONE & verified (routes/cart/admin/tests/assets/Docker). Admin login: `admin@desisaga.com` / `desisaga-admin-2026`. Dev server stopped; start with `bin/rails server -p 3000`. Details below.

## What happened this session

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

## 🚧 Waiting on USER (to unblock deploy)

**Oracle Cloud API credentials** (they hit "out of host capacity" in console; automation needs API access):
1. Console → profile icon → **User settings → API keys → Add API Key → Generate API Key Pair**
2. Download private key → save as `~/.oci/oci_api_key.pem` (chmod 600)
3. Paste me: home region (e.g. ap-mumbai-1) · tenancy OCID · user OCID · fingerprint
4. I then: write ~/.oci/config → verify auth → launch grab-arm.sh in background → report when IP lands

**If capacity never frees:** suggest PAYG upgrade (stays free within A1 limits, jumps queue) or Render fallback.

## Next steps after instance lands
1. `bin/kamal setup` (installs Docker, boots proxy, first deploy, Let's Encrypt for desisaga.com)
2. `bin/kamal app exec --reuse "bin/rails db:seed"`
3. Namecheap DNS: A record @ → IP (+ CNAME www)
4. Later: real Stripe, customer accounts, fix .github/workflows/ci-cd.yml (still Node-targeted!)

## Gotchas for next session
- `pkill -f rails` can hang the tool shell (kills own process group) — use `kill -9 $(pgrep -f puma)` carefully or just leave server running
- Per-form CSRF tokens: scraping "first" authenticity_token on a page grabs the WRONG form's token; extract per-form-block (tok.py pattern in /tmp/opencode — recreate if lost)
- /checkout redirects to /products when cart empty (by design)
- Production container 403s on localhost Host header — hosts allowlist is intentional; test with `-H "Host: desisaga.com"`
