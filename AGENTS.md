# desisaga.com — Ecommerce Project

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

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Styling**: Tailwind CSS + shadcn/ui
- **Payments**: Stripe (test mode placeholders for now)
- **Hosting**: Vercel (free tier)
- **Cart**: React Context + localStorage (no database for MVP)

## Payment Strategy (when ready)
- **Indian customers**: INR via UPI, cards, netbanking (Stripe India, 2% fee)
- **International customers**: USD/GBP via Stripe international (2.9% + $0.30)
- **Requirement**: Indian business entity for Stripe India activation

## Hosting
- **Platform**: Vercel (free tier)
- **Limits**: 100 GB bandwidth/month, 10s serverless timeout
- **SSL**: Automatic via Vercel

## DNS Configuration (Namecheap)
```
Type    Host    Value
CNAME   @       cname.vercel-dns.com
CNAME   www     cname.vercel-dns.com
```

## Architecture
```
desisaga.com → Vercel → Next.js App
                          ├── Landing page
                          ├── Product catalog (grid, filters)
                          ├── Product detail (images, add to cart)
                          ├── Cart (localStorage)
                          ├── Checkout (Stripe Checkout session)
                          └── Success page
```

## Build Steps (planned)
1. Create Next.js project with `create-next-app`
2. Build landing page (hero, brand story, featured hampers)
3. Build product catalog (grid, category filters)
4. Build product detail (images, description, add to cart)
5. Build cart page (add/remove, quantity, subtotal)
6. Set up Stripe checkout (test mode placeholders)
7. Add sample products (6-8 festival hampers with images)
8. Deploy to Vercel
9. Connect desisaga.com domain via DNS

## Current Status
- [x] Project concept defined
- [x] Tech stack decided
- [x] Domain registered
- [ ] Next.js project created
- [ ] Store pages built
- [ ] Sample products added
- [ ] Deployed to Vercel
- [ ] DNS configured
- [ ] Stripe connected (real payments)

## User Preferences
- Review at each major checkpoint before proceeding
- Placeholder copy and images for now — real content later
- Stripe in test mode — real payments later
- Mobile-first design (Indian market preference)
- Free hosting for now — dedicated server later if needed
