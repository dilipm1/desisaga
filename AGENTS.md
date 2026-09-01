# desisaga.com — Ecommerce Project

> ## 🔔 FIRST-TIME-OPEN REMINDER
> **Read `SESSION.md` before doing anything.** Last session (2026-08-31) completed Option B own Panchang engine (pre-compute 2026-2030) + regional variants for all festivals + pagy + Vercel removal + hero/navbar polish. Next pending: Stripe live, image polish, or deploy when Oracle ARM lands. Greet the user with this status unprompted.

## Domain
- **Domain**: desisaga.com
- **Registrar**: Namecheap
- **Status**: Registered, DNS needs configuration

## Concept
**Desi Saga** — Indian Hindu festival & ritual gift hampers. Pre-curated packages for celebrations and religious ceremonies.

### Product Categories
| Category | Example Products | Variant examples |
|---|---|---|
| **Diwali Hampers** | Diya set + rangoli + sweets box | — |
| **Puja Kits** | Complete puja thali with samagri | — |
| **Wedding Gift Boxes** | Mangalsutra + sindoor + shagun envelope | — |
| **Housewarming (Griha Pravesh)** | Ganesh idol + coconut + Kalash set | — |
| **Navratri/Durga Puja** | Garba accessories + navratri puja kit | Garba (Gujarat) · Durga (Bengal) · Golu (TN) |
| **Raksha Bandhan** | Rakhi set + sweets + gift voucher | — |
| **Holi** | Organic gulaal + gujiya | Lathmar (UP) · Dol (Bengal) |
| **Ganesh Chaturthi** | Eco idol + modak | Maharashtra · Karnataka |
| **Sankranti / Pongal** | Harvest hamper | Thai Pongal (TN) · Uttarayan kite (Gujarat) · Maghi Lohri (Punjab) · Ellu Bella (Karnataka) |
| **Ugadi / Yugadi** | Pachadi hamper | Yugadi (Karnataka) · Gudi Padwa (Maharashtra) · Cheti Chand (Sindhi) |
| **Vaisakhi / Solar New Year** | Harvest hamper | Vaisakhi (Punjab) · Puthandu (TN) · Vishu (Kerala) · Bihu (Assam) |
| **Shivratri** | Bilva hamper | — |
| **Rama Navami** | Tulsi + prasad | — |
| **Janmashtami** | Makhan + flute | Gokulashtami/Dahi Handi (MH) |
| **Onam** | Pookalam + sadhya | Kerala Thiruvonam |
| **Dussehra** | Shami + vermillion | Mysore Dasara |
| **Chhath Puja** | Soop + thekua | Bihar |

## Tech Stack (2026-08-31 — Rails 8.1 + Option B Panchang)
- **Framework**: Ruby on Rails 8.1 (DHH-style defaults)
- **Language**: Ruby 4.0.6 (managed via mise)
- **Frontend**: Hotwire (Turbo + Stimulus) via Importmap — **no Node.js build step**
- **Styling**: Tailwind CSS v4 (`tailwindcss-rails`, theme in `app/assets/tailwind/application.css`)
- **Pagination**: Pagy 9.4 (`include Pagy::Backend/Frontend`, 12/storefront 20/admin, overflow → page 1)
- **Database**: SQLite (Solid Cache / Solid Queue / Solid Cable)
- **Authentication**: Rails 8 built-in `authentication` generator (bcrypt sessions) — admin Credentials login
- **Cart**: Server-side session cart (`session[:cart]`) — no localStorage
- **Payments**: Stripe test-mode placeholder (demo order placement clears cart)
- **Festivals**: Own Panchang engine — Option B pre-compute table `data/festivals_generated_2026_2030.json` (Lahiri) + `lib/panchang_calculator.rb` + variant-aware `lib/festivals.rb` (year-wrap, region alias, fallback to legacy)
- **Icons**: Inline SVG helper (`app/helpers/icons_helper.rb`) — no icon gem
- **Fonts**: Rozha One / Instrument Sans / Space Mono via Google Fonts CDN

## Architecture
```
desisaga.com → Rails app (Puma)
                ├── /            PagesController#home (toran hero w/ festival image + countdown → variant-aware, year calendar (14 bases), featured (4), ritual pillars, trust bar)
                ├── /products    ProductsController#index (category + region chips + search + sort + pagy)
                ├── /products/:slug  ProductsController#show (ritual contents, add-to-cart form → Turbo)
                ├── /cart        CartsController#show (quantity +/-, remove, clear — plain forms)
                ├── /checkout    CheckoutsController#show/create (Stripe placeholder → success page)
                ├── /login       SessionsController (email/password; admin lands back at return_to)
                ├── /admin       Admin::BaseController (auth + admin role required, layout "admin")
                │     └── /admin/products  Full CRUD inventory grid (region column, pagy)
                └── /up          Health check
```

## Site Map & Navigation

### Storefront Routes (Public)
| URL | Method | Controller#Action | Purpose |
|---|---|---|---|
| `/` | GET | `pages#home` | Hero (toran + countdown + festival image) + year calendar (14 bases) + featured grid + ritual pillars + trust bar |
| `/products` | GET | `products#index` | Catalog with category chips, region filter, search, sort, pagy 12 |
| `/products?category=Diwali` | GET | `products#index` | Filter by category (17 categories) |
| `/products?region=tamil-nadu` | GET | `products#index` | Filter by region variant (e.g., Sankranti/Pongal) |
| `/products?q=sweets` | GET | `products#index` | Keyword search (name/description/tags) |
| `/products?sort=name` | GET | `products#index` | Sort: name (A-Z) |
| `/products?sort=price` | GET | `products#index` | Sort: price (low-high) |
| `/products?sort=price.desc` | GET | `products#index` | Sort: price (high-low) |
| `/products/diwali-delight-hamper` | GET | `products#show` | Product detail (ritual contents, region badge, add-to-cart) |
| `/cart` | GET | `carts#show` | Cart view (qty +/-, remove, clear) |
| `/cart` | DELETE | `carts#destroy` | Clear entire cart |
| `/cart_items` | POST | `cart_items#create` | Add product to cart |
| `/cart_items/:id` | PATCH/PUT | `cart_items#update` | Update quantity |
| `/cart_items/:id` | DELETE | `cart_items#destroy` | Remove single item |
| `/checkout` | GET | `checkouts#show` | Checkout page (redirects to /products if cart empty) |
| `/checkout` | POST | `checkouts#create` | Place demo order, clears cart, redirects to success |
| `/checkout/success` | GET | `checkouts#success` | "Shubh Labh!" confirmation page |
| `/login` | GET | `sessions#new` | Login form (rate-limited at 10/3min) |
| `/session/new` | GET | `sessions#new` | Alias for /login |
| `/session` | POST | `sessions#create` | Authenticate (creates signed session_id cookie) |
| `/logout` | DELETE | `sessions#destroy` | Terminate session |
| `/up` | GET | (rails health) | Health check (200 OK) |
| `/passwords/new` | GET | `passwords#new` | Request password reset |
| `/passwords` | POST | `passwords#create` | Send password reset email |
| `/passwords/:token/edit` | GET | `passwords#edit` | Reset password form |
| `/passwords/:token` | PATCH | `passwords#update` | Update password |

### Admin Routes (Require admin role)
| URL | Method | Controller#Action | Purpose |
|---|---|---|---|
| `/admin` | GET | `admin/products#index` | Redirects to /admin/products |
| `/admin/products` | GET | `admin/products#index` | Inventory grid (table + region + pagy 20) |
| `/admin/products` | POST | `admin/products#create` | Create new product |
| `/admin/products/new` | GET | `admin/products#new` | New product form (category + region select) |
| `/admin/products/:id/edit` | GET | `admin/products#edit` | Edit product form |
| `/admin/products/:id` | GET | `admin/products#show` | View product detail |
| `/admin/products/:id` | PATCH/PUT | `admin/products#update` | Update product |
| `/admin/products/:id` | DELETE | `admin/products#destroy` | Delete product (turbo-confirm) |

### Global Navigation (`_navbar.html.erb`)
**Desktop (≥md)**
- Brand: "DESI SAGA" (font-display, links to `/`)
- Shop (links to `/products`)
- Calendar (links to `/#calendar`)
- Category dropdown: Diwali · Wedding · Puja · Navratri · Raksha Bandhan · Holi · Ganesh Chaturthi · Housewarming + new: Sankranti · Ugadi · Vaisakhi · Shivratri · Onam etc.
- Cart icon (`icon("shopping-bag")`) → `/cart` with badge showing `cart_count`
- "Sign in" link → `/login` (replaced with user email + dropdown when authenticated)

**Mobile (<md)**
- Hamburger menu (`navbar_controller`) toggles mobile menu (Shop All, Diwali, Wedding, Puja, Calendar)
- Cart icon always visible
- Sign in / Sign out always visible

### User-Authenticated Navigation
When signed in, the navbar shows:
- User email address (or display_name) with dropdown
- "Admin" link → `/admin/products` (if `User#admin?`)
- "Sign out" link → DELETE `/logout`

### Footer (`_footer.html.erb`)
- Brand + tagline
- Category links (Diwali, Puja, Wedding, Housewarming, Navratri, Raksha Bandhan, Holi, Ganesh Chaturthi + new 9)
- Shop links (All hampers, Cart)
- Trust elements (★ 4.9/5, 500+ families)

### User Flows
**Browse & Buy (Anonymous)**
```
/ → /products → /products/:slug → POST /cart_items → /cart → /checkout → /checkout/success
```

**Sign In & Admin**
```
/login → POST /session → redirect to / or return_to
Admin: /admin → /admin/products → CRUD actions (region-aware)
```

**Password Reset**
```
/passwords/new → POST /passwords → email with token → /passwords/:token/edit → PATCH /passwords/:token
```

### Cart Flow Detail
1. `POST /cart_items` (product_id) → adds to `session[:cart]` and redirects back
2. `PATCH /cart_items/:id` (quantity) → updates qty; if 0, removes
3. `DELETE /cart_items/:id` → removes item
4. `DELETE /cart` → clears all items
5. `/checkout` → `/checkout/success` (demo order placement)

### Category List (`Product::CATEGORIES` — 17)
```
Diwali · Puja · Wedding · Housewarming · Navratri · Raksha Bandhan · Holi · Ganesh Chaturthi · Sankranti · Shivratri · Ugadi · Rama Navami · Vaisakhi · Janmashtami · Onam · Dussehra · Chhath Puja
```
Regions (`Product::REGIONS`): `tamil-nadu · gujarat · punjab · karnataka · maharashtra · kerala · andhra-pradesh · telangana · west-bengal · bihar · assam · odisha · default`

### Festival Calendar (`lib/festivals.rb` + `lib/panchang_calculator.rb` + `data/festivals_generated_2026_2030.json`)
**Type**: Own Panchang Option B — Lahiri ayanamsa, pre-computed 2026-2030 table + Meeus scaffolding (solar longitude, tithi). Drik cross-checked: Ganesh 2026-09-14, Raksha 2026-08-28, Navratri 2026-10-11, Diwali 2026-11-08, Holi 2027-03-22, Makara 2027-01-15, Ugadi 2027-04-07 etc.
**Dated bases (14)**: Makara Sankranti, Maha Shivratri, Holi, Ugadi, Rama Navami, Vaisakhi, Raksha Bandhan, Janmashtami, Ganesh Chaturthi, Onam, Navratri, Dussehra, Diwali, Chhath Puja
**Anytime (3)**: Wedding · Housewarming · Puja
**Variant handling**: One base → many aliases/hampers per state (e.g., Sankranti = Thai Pongal (TN) vs Uttarayan (Gujarat) vs Maghi (Punjab) — same transit, different ritual/images; Ugadi = Yugadi (KA) vs Gudi Padwa (MH) vs Cheti Chand). `Festivals.next_festival(region:)` + `PanchangCalculator.observation_date` with `date_override` ready for Jan 14 vs 15 split.

## Project Structure
```
~/Projects/desisaga/
├── app/
│   ├── controllers/              ← Storefront controllers (pages, products, carts, cart_items, checkouts)
│   │   └── admin/                ← Admin area (base_controller with require_admin, products CRUD with region + pagy)
│   ├── models/                   ← Product (SQLite, CATEGORIES 17 + region, pagy, array callbacks), User (roles), Session, CartItem (value object), Current
│   ├── views/                    ← ERB views + shared partials (_navbar (Calendar item), _footer, _toran_garland, _spinning_mandala, _floating_rangoli, _animated_diya, _year_calendar (14 bases), _product_card, _festival_hero_image)
│   ├── javascript/controllers/   ← Stimulus (navbar_controller, reveal_controller)
│   ├── helpers/                  ← ApplicationHelper (format_price, category maps + 9 new, pagy), IconsHelper (lucide SVGs)
│   └── assets/tailwind/          ← Tailwind v4 theme ("night of the celebration" palette) + .pagy-nav night styles
├── lib/festivals.rb              ← Variant-aware wrapper (LEGACY_DATED fallback, dated/next_festival delegates to PanchangCalculator)
├── lib/panchang_calculator.rb    ← Own engine (table-driven 2026-2030, region alias, Meeus stubs)
├── data/festivals_generated_2026_2030.json ← Pre-compute table (Lahiri) for Option B
├── db/seeds.rb                   ← 23 hampers (8 base + 15 regional variants) + admin user
├── data/backlog.json             ← Canonical machine-readable backlog
├── specs/                        ← Contract-first API specs (openapi.yaml, README)
├── okf/                          ← Open Knowledge Format (overview, backlog, ADRs, retrospectives, roadmap)
├── docs/                         ← ProjectToDos.md + knowledge-graph.md
├── skills/                       ← Developer standards + AI workflows
├── .github/                      ← PR template + CI workflow (ci.yml for Rails, ci-cd.yml Vercel removed)
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
11. [x] **Wave 1: DB indices + model callbacks + Vercel removal + storefront polish** — 2026-08-31 (`e4c715e`)
12. [x] **Wave 2: Pagy pagination + full deduplication** — 2026-08-31 (`ab81ed3`)
13. [x] **Festival Panchang fix + own engine Option B (all festivals)** — 2026-08-31 (`d80f7f8` Ganesh dates, `17d015b` 14-base table + variants)
14. [x] **UI: Calendar to navbar + festival hero image** — 2026-08-31 (`9f7dfcd`)
15. [ ] Deploy (Kamal to a VPS, or Fly.io/Render — Vercel removed)
16. [ ] Connect desisaga.com domain via DNS

## Current Status
- [x] Rails 8.1 app verified: all storefront routes 200, cart flow end-to-end, admin login, admin create/delete with region, `/` hero + calendar (14 bases) + featured — 2026-08-31
- [x] `bin/rails test` — 12 runs, 48 assertions, 0 failures
- [x] Production assets precompile verified (Tailwind v4 build + pagy night styles)
- [x] Security Audit (OWASP Top 10) & Optimization Roadmap (Waves 1-2 done) — pagy verified, brakeman 0, rubocop 0
- [x] Vercel CI removed (`.github/workflows/ci-cd.yml` deleted), Rails `ci.yml` retained
- [x] Festival engine: Own Panchang Option B live, 23 hampers seeded, regional hampers verified (Thai Pongal vs Uttarayan etc.)
- [x] Dev server running at `http://localhost:3000` (PID 150662) — Calendar in navbar, hero image subtle float on right
- [x] Infra decision 2026-09-01 (CORRECTED 19:45 UTC): **Tier 1 Hetzner CX23 Nuremberg `nbg1` ~€5.49/mo (~₹500+VAT) + €0.60 IPv4 + Cloudflare free** — plan `docs/plans/hetzner-cx23-majestic-2026-09-01.md:1`, `okf/technical-architecture.md:1` (Majestic Monolith, delegated types). CX22→CX23 June 15 2026 price adj; Singapore CX unavailable (CPX only). `config/deploy.yml:10` host still placeholder until purchase.
- [x] hunt parallel: `us-chicago-1` (not ap-mumbai-1) — revisit Step 5 later
- [ ] Stripe connected (real payments) — **Won't until host chosen** (`data/backlog.json:4` EPIC-3 gray, `app/controllers/checkouts_controller.rb:8` stub)
- [ ] Customer-facing signup/OAuth (customers currently browse + cart without accounts)
- [ ] ActiveStorage — **postponed until host chosen** (`app/models/product.rb:48` `FALLBACK_IMAGE` stays)
- [ ] Deployed to Hetzner `sgp1` (Kamal `bin/kamal setup` pending IP)
- [ ] DNS configured (Cloudflare A `@ → sGP-IP`)

## Optimization & Security Roadmap

### 🛡️ Security (OWASP Top 10 Status)
- **A01-A07**: All verified secure (Access Control, Crypto, Injection, Auth, Misconfiguration).
- **A04 (Insecure Design)**: Session-based cart is efficient but requires monitoring for cookie size.

### 🚀 Optimization Waves
#### **Wave 1: Security & Stability (Highest Priority) — DONE 2026-08-31**
- **Data Integrity**: Slugs and array parsing (tags/ritual_contents) into `Product` model callbacks/setters + `currency` default.
- **Database**: Indices added to `products.category`, `products.featured`, `products.region` + `products.slug` unique.

#### **Wave 2: Performance & Quality (Medium Impact) — DONE 2026-08-31**
- **Pagination**: Pagy integrated (storefront 12, admin 20, overflow → p1).
- **Refactoring**: Controller tap split moved fully to model (pure `permit`).

#### **Wave 3: Scaling (Future Proofing)**
- **Cart Migration**: Move from `session[:cart]` to database-backed `Cart` model if complexity grows.
- **Search**: Transition to more robust search if catalog exceeds ~1,000 products.
- **Panchang**: Replace table with live Meeus solar/lunar calc when `lib/panchang_calculator.rb` stubs are filled.

## Next Steps (when resuming)
1. **Live Meeus calc** — fill `PanchangCalculator#solar_longitude` / `tithi_at_sunrise` stubs (Meeus Ch.25/47 + Lahiri) and cross-check against `data/festivals_generated_2026_2030.json` in tests.
2. **Oracle Always Free ARM hunt**: hunt still live (Round 6+, 600+ denials) — run is systemd `desisaga-hunt`; on IP: `bin/kamal setup` → `bin/rails db:seed` → Namecheap DNS → live.
3. **Stripe** — wire real checkout (replace demo place-order).
4. **Images** — replace placeholder Pexels with real product photos (consider Active Storage).
5. **Optional**: customer accounts, price as integer paise if multi-currency arrives.

## Deployment Plan (drafted 2026-08-18, revised for Rails 2026-08-23, Vercel removed 2026-08-31)
- Vercel plan is obsolete — deleted `.github/workflows/ci-cd.yml`. Use Kamal (bundled with Rails 8) against any Ubuntu VPS, or Fly.io. `ci.yml` remains for Rails CI.
- SQLite lives on the VPS disk; daily `sqlite3 .backup` or Litestream streaming replication is sufficient at MVP scale.
- When ready, Namecheap DNS points at the chosen host (A record for VPS IP).
- Automatic HTTPS via Kamal's built-in Let's Encrypt proxy.

## User Preferences
- Review at each major checkpoint before proceeding
- Placeholder copy and images for now — real content later
- Stripe in test mode — real payments later
- Mobile-first design (Indian market preference)
- Performance-conscious — prefers lightweight solutions (Importmap, no Node, SQLite)
