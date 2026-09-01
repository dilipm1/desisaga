# Desi Saga

Indian Hindu festival & ritual gift hampers — desisaga.com.

Ruby on Rails 8.1 · Hotwire (Turbo + Stimulus) · Importmap (no Node build) · Tailwind CSS v4 · SQLite · Solid Cache/Queue/Cable

## Quick start

```sh
bin/setup          # install gems, prepare DB
bin/rails db:seed  # 23 festival hampers (8 base + 15 regional) + admin user
bin/dev            # run the app at http://localhost:3000
```

## What's inside

- `/` — festival hero with live countdown, year calendar (14 bases + regional variants), featured hampers
- `/products` — catalog with category + region filters + keyword search + sort + Pagy (12); `/products/:slug` detail pages
- `/cart` — server-side session cart (quantity +/-, remove, clear) with shipping (Free over ₹999)
- `/checkout` — Stripe test-mode placeholder → demo order success page (shipping parity)
- `/login` — bcrypt session auth (Rails `authentication` generator)
- `/admin/products` — inventory CRUD with region + Pagy (20)
- `lib/panchang_calculator.rb` + `data/festivals_generated_2026_2030.json` — Option B own Panchang (Lahiri, 2026-2030, region variants)

Admin credentials come from `.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`), defaults `admin@desisaga.com` / `desisaga-admin-2026`.

## Tests

```sh
bin/rails test
```

## Deployment

Kamal is preconfigured (`config/deploy.yml`) for **Hetzner CX23 Nuremberg `nbg1` ~€5.49/mo (~₹500+VAT) + Cloudflare** — Majestic Monolith per `docs/plans/hetzner-cx23-majestic-2026-09-01.md:1` and `okf/technical-architecture.md:1`. CX22→CX23 June 15 2026; Singapore CX unavailable (EU-only). VPS IP placeholder at `config/deploy.yml:10` until purchase; `us-chicago-1` ARM hunt runs in parallel. Stripe/ActiveStorage remain stubs until host chosen.
