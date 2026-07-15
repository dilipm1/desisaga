# Session — 2026-07-15: Project Setup & Planning

## What happened
- User bought domain desisaga.com on Namecheap
- Decided on Indian Hindu festival & ritual gift hamper ecommerce business
- Tech stack chosen: Next.js + Tailwind + shadcn/ui + Stripe (test mode)
- Hosting: Vercel free tier
- Project folder created at ~/Projects/desisaga

## Key decisions
1. **Domain**: desisaga.com on Namecheap
2. **Products**: Festival gift hampers (Diwali, Puja, Wedding, Housewarming, Navratri, Rakhi)
3. **Payments**: Stripe — INR for Indian customers, USD/GBP for international
4. **Hosting**: Vercel free tier (100 GB bandwidth, auto SSL)
5. **MVP**: No database — products in JSON, cart in localStorage
6. **Design**: Mobile-first, responsive
7. **Approach**: Step-by-step with user review at each checkpoint

## Stripe pricing (when ready)
- Indian domestic (UPI, cards): 2% fee
- International (US/UK cards): 2.9% + $0.30
- Requires Indian business entity for Stripe India

## Build steps planned
1. Create Next.js project
2. Landing page
3. Product catalog
4. Product detail
5. Cart
6. Stripe checkout (test mode)
7. Sample products
8. Deploy to Vercel
9. DNS configuration

## Context from previous session (dock-setup-backup)
- User's system: Omarchy (Arch Linux), Hyprland, ThinkPad T14
- Browser: qutebrowser for lightweight use, Chromium for heavy sites
- Glances MCP server running for system monitoring
- Performance-conscious user — prefers lightweight solutions
