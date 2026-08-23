# Session — 2026-08-24: OCI credentials wired, ARM hunter LIVE (waiting for capacity)

## ⚡ RESUME HERE — current state

**The ARM hunt is RUNNING in the background** (`scripts/oci/grab-arm.sh`, launched via setsid+nohup, log at `/tmp/opencode/arm-hunt.log`). It cycles all 3 Chicago ADs every ~10 min trying to grab a 2 OCPU / 12 GB Always Free instance (Oracle cut A1 free limits from 4/24 → 2/12; script defaults updated).

**On success the script**: writes public IP to `scripts/oci/arm-instance-ip.txt` AND fires `notify-send -u critical` desktop ping, then exits.

**Check status anytime**: `tail -20 /tmp/opencode/arm-hunt.log && cat scripts/oci/arm-instance-ip.txt 2>/dev/null`

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

### Contingency (if hunt starves for days)
Upgrade tenancy to Pay-As-You-Go (card on file, ₹0 within A1 limits, jumps capacity queue). User saw console banner: free A1 limits now 2 OCPU/12 GB — already accounted for.

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
