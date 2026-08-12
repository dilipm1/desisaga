---
title: Desi Saga — Project Overview
kind: okf/project-overview
version: 1.0.0
owner: Product Owner
last_updated: 2026-08-12
status: active
tags: [ecommerce, festival, gifting, mvp]
---

# Desi Saga — Project Overview

## Metadata

| Field | Value |
|---|---|
| **Product** | Desi Saga (desisaga.com) |
| **Concept** | Indian Hindu festival & ritual gift hampers |
| **Mission** | Deliver ritual-ready hampers before every Indian festival, packed with authentic samagri and delivered on time. |
| **Vision** | India's most trusted platform for festival & ritual gift hampers. |
| **Stage** | MVP (pre-launch) |
| **Model** | DTC ecommerce, Stripe payments, no database for MVP |

## Context

Indian festivals are calendar-driven events. Gifting during festivals is a deep cultural ritual (shagun, samagri, aashirwad). Existing options are generic gift shops or last-minute chaos. Desi Saga pre-curates hampers so the customer never assembles a hamper manually.

### Who it serves

- **Primary**: NRIs and urban Indians sending festival gifts home to family.
- **Secondary**: Families hosting pujas/ceremonies needing a complete kit.

### Problem being solved

1. Festival dates move (lunar calendar) — people forget.
2. Assembling ritual-ready items is time-consuming and error-prone.
3. Generic gift boxes miss the ritual details that matter.

## Decisions

- **Tech**: Next.js 16 (App Router), Tailwind CSS v4, Stripe, Vercel — lightweight, mobile-first, no heavy backend for MVP.
- **Cart**: React Context + localStorage (no database) — fastest path to launch.
- **Design**: "Night of the celebration" — dark ritual canvas, firelight accents.
- **Payments**: Stripe test mode now; India (INR/UPI) + International (USD/GBP) later.

## Implementation (current state)

| Area | Status |
|---|---|
| Landing page (hero, calendar, featured) | ✅ Done |
| Product catalog (8 hampers, filters) | ✅ Done |
| Product detail + add to cart | ✅ Done |
| Cart page (qty, subtotal) | ✅ Done |
| Checkout (Stripe placeholder) | ✅ Done |
| Festival calendar + countdown | ✅ Done |
| Deploy to Vercel | ⏳ Pending |
| DNS (desisaga.com) | ⏳ Pending |
| Real Stripe keys | ⏳ Pending |

## Success Metrics

| Metric | Target |
|---|---|
| Lead time (story → prod) | < 3 days |
| Spec adherence | > 90% |
| Knowledge uptime (onboarding) | < 1 day |
| On-time delivery rate | > 95% |
| GMV per festival season | TBD after launch |

## References

- [Project ToDos & Roadmap](../docs/ProjectToDos.md)
- [Knowledge Graph](../docs/knowledge-graph.md)
- [Technical Decisions](./technical-decisions.md)
- [Product Backlog](./product-backlog.md)
- [Onboarding](./onboarding.md)
- [AGENTS.md](../AGENTS.md)
