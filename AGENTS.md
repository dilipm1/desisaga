# desisaga.com — Ecommerce Project

> ## 🔔 FIRST-TIME-OPEN REMINDER
> **Read `SESSION.md` before doing anything.** Last session (2026-08-23) finished the full
> Next.js → Rails 8.1 conversion and prepped deployment. The ONLY pending item:
> **user owes Oracle API credentials** (home region, tenancy OCID, user OCID, API-key
> fingerprint + private key at `~/.oci/oci_api_key.pem`). Once provided →
> run `scripts/oci/grab-arm.sh` non-blocking → on IP: `bin/kamal setup` +
> db:seed + Namecheap DNS → https://desisaga.com live.
> Greet the user with this status unprompted.

## Domain
- **Domain**: desisaga.com
- **Registrar**: Namecheap
- **Status**: Registered, DNS needs configuration

## Concept
**Desi Saga** — Indian Hindu festival & ritual gift hampers. Pre-curated packages for celebrations and religious ceremonies.

### Product Categories
| Category | Example Products |
|---|---|
| **Diwali Hampers** | Diya set + rangoli + sweets box |
| **Puja Kits** | Complete puja thali with samagri |
| **Wedding Gift Boxes** | Mangalsutra + sindoor + shagun envelope |
| **Housewarming (Griha Pravesh)** | Ganesh idol + coconut + Kalash set |
| **Navratri/Durga Puja** | Garba accessories + navratri puja kit |
| **Raksha Bandhan** | Rakhi set + sweets + gift voucher |

## Tech Stack (2026-08-23 — converted from Next.js to Ruby on Rails)
- **Framework**: Ruby on Rails 8.1 (DHH-style defaults)
- **Language**: Ruby 4.0.6 (managed via mise)
- **Frontend**: Hotwire (Turbo + Stimulus) via Importmap — **no Node.js build step**
- **Styling**: Tailwind CSS v4 (`tailwindcss-rails`, theme in `app/assets/tailwind/application.css`)
- **Database**: SQLite (Solid Cache / Solid Queue / Solid Cable)
- **Authentication**: Rails 8 built-in `authentication` generator (bcrypt sessions) — admin Credentials login
- **Cart**: Server-side session cart (`session[:cart]`) — no localStorage
- **Payments**: Stripe test-mode placeholder (demo order placement clears cart)
- **Icons**: Inline SVG helper (`app/helpers/icons_helper.rb`) — no icon gem
- **Fonts**: Rozha One / Instrument Sans / Space Mono via Google Fonts CDN

## Architecture
```
desisaga.com → Rails app (Puma)
                ├── /            PagesController#home (toran hero, festival countdown, year calendar, featured, ritual pillars, trust bar)
                ├── /products    ProductsController#index (category filter chips + search)
                ├── /products/:slug  ProductsController#show (ritual contents, add-to-cart form → Turbo)
                ├── /cart        CartsController#show (quantity +/-, remove, clear — plain forms)
                ├── /checkout    CheckoutsController#show/create (Stripe placeholder → success page)
                ├── /login       SessionsController (email/password; admin lands back at return_to)
                ├── /admin       Admin::BaseController (auth + admin role required, layout "admin")
                │     └── /admin/products  Full CRUD inventory grid
                └── /up          Health check
```

## Project Structure
```
~/Projects/desisaga/
├── app/
│   ├── controllers/              ← Storefront controllers (pages, products, carts, cart_items, checkouts)
│   │   └── admin/                ← Admin area (base_controller with require_admin, products CRUD)
│   ├── models/                   ← Product (SQLite), User (roles), Session, CartItem (value object), Current
│   ├── views/                    ← ERB views + shared partials (_navbar, _footer, _toran_garland, _year_calendar, _product_card, _animated_diya…)
│   ├── javascript/controllers/   ← Stimulus (navbar_controller, reveal_controller)
│   ├── helpers/                  ← ApplicationHelper (format_price, category maps), IconsHelper (lucide SVGs)
│   └── assets/tailwind/          ← Tailwind v4 theme ("night of the celebration" palette)
├── lib/festivals.rb              ← Festival calendar (dates, days_left, next_festival) — autoloaded
├── db/seeds.rb                   ← 8 festival hampers + admin user
├── data/backlog.json             ← Canonical machine-readable backlog
├── specs/                        ← Contract-first API specs (openapi.yaml, README)
├── okf/                          ← Open Knowledge Format (overview, backlog, ADRs, retrospectives, roadmap)
├── docs/                         ← ProjectToDos.md + knowledge-graph.md
├── skills/                       ← Developer standards + AI workflows
├── .github/                      ← PR template + CI/CD workflow (needs update for Rails CI)
└── AGENTS.md                     ← This file
```

## Operating Framework: PROMPT → CONTEXT → LOOP → GRAPH → DELIVER
- **PROMPT** — well-formed user stories in `okf/product-backlog.md` / Basecamp to-dos
- **CONTEXT** — `specs/`, `okf/`, `data/`, `AGENTS.md`, `docs/knowledge-graph.md`
- **LOOP** — writer/checker separation; CI checker loop; Basecamp check-ins + retrospective → action items
- **GRAPH** — every Epic mapped to jobs/arrows/shared state + a Basecamp Hill Chart
- **DELIVER** — shippable increments (deployed previews, merged PRs, released catalogs)

### Backlog Management
- **Tool**: Basecamp 4 project "DesiSaga"
- **Canonical machine-readable backlog**: `data/backlog.json` (single source of truth)
- **Human-readable mirror**: `okf/product-backlog.md`
- **Guide**: `okf/basecamp-guide.md`

## Build Steps
1. [x] Create project (originally Next.js, 2026-08-07)
2. [x] Landing page (hero, brand story, featured hampers)
3. [x] Product catalog (grid, category filters, search)
4. [x] Product detail (images, description, add to cart)
5. [x] Cart page (add/remove, quantity, subtotal)
6. [x] Checkout placeholder (Stripe test mode)
7. [x] Sample products (8 festival hampers)
8. [x] Authentication (admin email/password sessions)
9. [x] Admin inventory management (grid + full CRUD)
10. [x] **Full conversion Next.js → Ruby on Rails 8.1** — 2026-08-23 (products migrated from JSON file to SQLite)
11. [ ] Deploy (Kamal to a VPS, or Fly.io/Render — Vercel does not host Rails)
12. [ ] Connect desisaga.com domain via DNS

## Current Status
- [x] Rails 8.1 app verified: all storefront routes 200, cart flow end-to-end (add → view → checkout → success), admin login (bad creds rejected, good creds reach `/admin/products`), admin create/delete product verified over HTTP — 2026-08-23
- [x] `bin/rails test` — 12 runs, 48 assertions, 0 failures
- [x] Production assets precompile verified (Tailwind v4 build)
- [ ] Stripe connected (real payments)
- [ ] Customer-facing signup/OAuth (customers currently browse + cart without accounts)
- [ ] Deployed to a host that runs Rails
- [ ] DNS configured

## Authentication & Admin Inventory (Rails port 2026-08-23)
- **Mechanism**: Rails 8 `rails generate authentication` — bcrypt-hashed passwords, signed `session_id` cookie, `sessions` table (user_agent/ip), password reset mailer scaffolded
- **Login**: `/login` (single login for customers & staff; admin role unlocks `/admin`)
- **Roles**: `User#admin?` returns true if `role == "admin"` OR `email_address == ENV["ADMIN_EMAIL"]`
- **Admin credentials**: seeded from `.env` — `ADMIN_EMAIL` (default `admin@desisaga.com`) / `ADMIN_PASSWORD` (default `desisaga-admin-2026`) — change before production
- **Admin area**: `/admin/products` — table grid with edit/delete (turbo confirm), new/edit form incl. ritualContents/samagri comma-list fields
- **Authorization**: `Admin::BaseController#require_admin`; non-admins redirected to `/login`

## Design System (unchanged through the port)
- **Direction**: "Night of the celebration" — dark ritual canvas, firelight accents
- **Type**: Rozha One (display) · Instrument Sans (body) · Space Mono (dates/countdown)
- **Palette**: night `#1A0B0A`, ember `#2E1210`, parchment `#F7EEDC`, flame `#E9B44C`, marigold `#E8731F`, kumkum `#C2322E`, leaf `#8FAE6B`, line `#422A1C`
- **Signature**: ToranGarland (marigold/mango-leaf doorway swag) at the hero top — now an ERB/SVG partial
- **Hero**: live days-until countdown to the next festival ("Send the festival home.")
- **Structure**: `lib/festivals.rb` holds the festival calendar (dates, days-left, ritual items); YearCalendar partial renders it chronologically
- Copy uses ritual vocabulary (shagun, ritual-ready, samagri) — not generic selling

## Known Issues
- None blocking. Dev server (`setsid bin/rails server -p 3000`) and production assets both verified 2026-08-23.
- **Google OAuth removed in the port**: the old NextAuth Google sign-in is gone; customers have no account system yet (browse/cart work anonymously). Add OmniAuth later if needed.
- **`.env` carries over**: old GOOGLE_CLIENT_* keys are unused now; only ADMIN_EMAIL/ADMIN_PASSWORD matter.
- **CI workflow** (`.github/workflows/ci-cd.yml`) still targets Node/Next.js — needs a Rails CI job before next PR merge.

## Next Steps (when resuming)
1. **Oracle Always Free ARM hunt**: user owes API credentials (region/tenancy OCID/user OCID/fingerprint + key at ~/.oci/oci_api_key.pem) → then run `scripts/oci/grab-arm.sh` non-blocking; full context in SESSION.md
2. On instance IP: `bin/kamal setup` → `bin/kamal app exec --reuse "bin/rails db:seed"` → Namecheap DNS A record → live at https://desisaga.com
3. Fix `.github/workflows/ci-cd.yml` for Rails (bundle + db:test:prepare + bin/rails test)
4. Set up Stripe and wire real checkout (replace demo place-order)
5. Replace placeholder images with real product photos (consider Active Storage)
6. Optional: customer accounts, price as integer paise if multi-currency arrives

## Deployment Plan (drafted 2026-08-18, revised for Rails 2026-08-23)
- Vercel plan is obsolete — Vercel cannot run Rails. Use Kamal (bundled with Rails 8) against any Ubuntu VPS, or Fly.io.
- SQLite lives on the VPS disk; daily `sqlite3 .backup` or Litestream streaming replication is sufficient at MVP scale.
- When ready, Namecheap DNS points at the chosen host (A record for VPS IP).
- Automatic HTTPS via Kamal's built-in Let's Encrypt proxy.

## User Preferences
- Review at each major checkpoint before proceeding
- Placeholder copy and images for now — real content later
- Stripe in test mode — real payments later
- Mobile-first design (Indian market preference)
- Performance-conscious — prefers lightweight solutions (Importmap, no Node, SQLite)
