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

## Site Map & Navigation

### Storefront Routes (Public)
| URL | Method | Controller#Action | Purpose |
|---|---|---|---|
| `/` | GET | `pages#home` | Hero (toran + countdown) + year calendar + featured grid + ritual pillars + trust bar |
| `/products` | GET | `products#index` | Catalog with category chips, search, sort by name/price |
| `/products?category=Diwali` | GET | `products#index` | Filter by category (8 categories) |
| `/products?q=sweets` | GET | `products#index` | Keyword search (name/description/tags) |
| `/products?sort=name` | GET | `products#index` | Sort: name (A-Z) |
| `/products?sort=price` | GET | `products#index` | Sort: price (low-high) |
| `/products?sort=price.desc` | GET | `products#index` | Sort: price (high-low) |
| `/products/diwali-delight-hamper` | GET | `products#show` | Product detail (ritual contents, add-to-cart) |
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
| `/admin/products` | GET | `admin/products#index` | Inventory grid (table view) |
| `/admin/products` | POST | `admin/products#create` | Create new product |
| `/admin/products/new` | GET | `admin/products#new` | New product form |
| `/admin/products/:id/edit` | GET | `admin/products#edit` | Edit product form |
| `/admin/products/:id` | GET | `admin/products#show` | View product detail |
| `/admin/products/:id` | PATCH/PUT | `admin/products#update` | Update product |
| `/admin/products/:id` | DELETE | `admin/products#destroy` | Delete product (turbo-confirm) |

### Global Navigation (`_navbar.html.erb`)
**Desktop (≥md)**
- Brand: "DESI SAGA" (font-display, links to `/`)
- Shop (links to `/products`)
- Category dropdown: Diwali · Wedding · Puja · Navratri · Raksha Bandhan · Holi · Ganesh Chaturthi · Housewarming
- Cart icon (`icon("shopping-bag")`) → `/cart` with badge showing `cart_count`
- "Sign in" link → `/login` (replaced with user email + dropdown when authenticated)

**Mobile (<md)**
- Hamburger menu (`navbar_controller`) toggles mobile menu
- Cart icon always visible
- Sign in / Sign out always visible

### User-Authenticated Navigation
When signed in, the navbar shows:
- User email address (or display_name) with dropdown
- "Admin" link → `/admin/products` (if `User#admin?`)
- "Sign out" link → DELETE `/logout`

### Footer (`_footer.html.erb`)
- Brand + tagline
- Category links (Diwali, Puja, Wedding, Housewarming, Navratri, Raksha Bandhan, Holi, Ganesh Chaturthi)
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
Admin: /admin → /admin/products → CRUD actions
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

### Category List (`Product::CATEGORIES`)
```
Diwali · Puja · Wedding · Housewarming · Navratri · Raksha Bandhan · Holi · Ganesh Chaturthi
```

### Festival Calendar (`lib/festivals.rb`)
**Dated**: Raksha Bandhan · Ganesh Chaturthi · Navratri · Diwali · Holi
**Anytime**: Wedding · Housewarming · Puja

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
- [x] Security Audit (OWASP Top 10) & Optimization Roadmap (Waves 1-3) completed — 2026-08-27
- [ ] Stripe connected (real payments)
- [ ] Customer-facing signup/OAuth (customers currently browse + cart without accounts)
- [ ] Deployed to a host that runs Rails
- [ ] DNS configured

## Optimization & Security Roadmap

### 🛡️ Security (OWASP Top 10 Status)
- **A01-A07**: All verified secure (Access Control, Crypto, Injection, Auth, Misconfiguration).
- **A04 (Insecure Design)**: Session-based cart is efficient but requires monitoring for cookie size.

### 🚀 Optimization Waves
#### **Wave 1: Security & Stability (Highest Priority)**
- **Data Integrity**: Refactor slugs and array parsing (tags/ritual_contents) into `Product` model callbacks/setters.
- **Database**: Add indices to `products.category` and `products.featured`.

#### **Wave 2: Performance & Quality (Medium Impact)**
- **Pagination**: Integrate `pagy` to handle catalog scaling.
- **Refactoring**: Move complex parameter transformation logic from controllers to models/service objects.

#### **Wave 3: Scaling (Future Proofing)**
- **Cart Migration**: Move from `session[:cart]` to database-backed `Cart` model if complexity grows.
- **Search**: Transition to more robust search if catalog exceeds ~1,000 products.

## Next Steps (when resuming)
1. **Wave 1 Implementation**:
   - [ ] Add database indices for `category` and `featured`.
   - [ ] Refactor `Product` model for slug/array auto-handling.
2. **Oracle Always Free ARM hunt**: user owes API credentials (region/tenancy OCID/user OCID/fingerprint + key at ~/.oci/oci_api_key.pem) → then run `scripts/oci/grab-arm.sh` non-blocking; full context in SESSION.md
3. On instance IP: `bin/kamal setup` → `bin/kamal app exec --reuse "bin/rails db:seed"` → Namecheap DNS A record → live at https://desisaga.com
4. Fix `.github/workflows/ci-cd.yml` for Rails (bundle + db:test:prepare + bin/rails test)
5. Set up Stripe and wire real checkout (replace demo place-order)
6. Replace placeholder images with real product photos (consider Active Storage)
7. Optional: customer accounts, price as integer paise if multi-currency arrives

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
