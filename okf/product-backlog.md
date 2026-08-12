---
title: Desi Saga — Product Backlog
kind: okf/product-backlog
version: 1.0.0
owner: Product Owner
last_updated: 2026-08-12
status: active
tags: [backlog, moscow, epics, basecamp]
---

# Desi Saga — Product Backlog

> Maintained from a **Product Owner perspective** (MoSCoW). Each Epic is designed as a **graph** (jobs → arrows → shared state). Canonical source: `data/backlog.json`; human-readable mirror: this file. Live view: Basecamp "DesiSaga" project to-do lists + Hill Charts.

## Priority Legend

- **Must** — MVP cannot launch without it
- **Should** — important but can ship after MVP
- **Could** — nice to have
- **Won't** — explicitly not this cycle

---

## EPIC-1: Festival Hampers Marketplace

**Graph**: `browse → filter → detail → cart → checkout`

| ID | Story (PROMPT) | Priority | Acceptance Criteria (DELIVER) | Nodes |
|---|---|---|---|---|
| DS-101 | As a user, I can filter hampers by festival (Diwali, Wedding, etc.) | Must | Filter persists across pages, shows correct count | catalog → filter → grid |
| DS-102 | As a user, I can set min/max price | Should | Slider updates grid in real time | catalog → price → grid |
| DS-103 | As a user, I can search by keyword | Could | Search matches name/description/tags | catalog → search → grid |
| DS-104 | As a user, I see featured hampers on the landing page | Must | Featured badges render, section populated | catalog → featured → landing |
| DS-105 | As a user, I can sort by price/name | Could | Sort control reorders grid | grid → sort → grid |

## EPIC-2: Ritual Validation & Samagri Coverage

**Graph**: `ritual data → product mapping → verification loop → display`

| ID | Story (PROMPT) | Priority | Acceptance Criteria (DELIVER) | Nodes |
|---|---|---|---|---|
| DS-201 | As a user, I see which rituals each hamper covers | Must | Product card shows ritual icons | ritual data → mapping → card |
| DS-202 | As a user, I see what's inside (samagri) before buying | Must | Detail page lists items + quantities | mapping → detail |
| DS-203 | As a user, I trust items are ritual-ready | Should | Ritual-check note on detail page | verification → display |
| DS-204 | As the PO, I can add new festival ritual data | Should | data/festivals.json is source for calendar | ritual data → calendar |

## EPIC-3: Stripe Payment Integration (India & International)

**Graph**: `cart → session → webhook → confirm → notify` (human gate: merchant activation)

| ID | Story (PROMPT) | Priority | Acceptance Criteria (DELIVER) | Nodes |
|---|---|---|---|---|
| DS-301 | As a user, I can complete checkout in test mode | Must | Order appears in Stripe dashboard; success page loads | session → webhook → success |
| DS-302 | As an Indian customer, I can pay INR via UPI/cards | Should | Stripe India connected; 2% fee applied | session → UPI → confirm *(human gate)* |
| DS-303 | As an international customer, I can pay USD/GBP | Should | Stripe international; 2.9% + $0.30 | session → cards → confirm |
| DS-304 | As a merchant, I get notified of successful payments | Should | Webhook updates order status + email | webhook → notify |
| DS-305 | As a user, I see a clear order confirmation | Must | Success page shows order summary | confirm → success |

## EPIC-4: Hero Experience & Festival Calendar

**Graph**: `festival calendar → countdown state → hero render → calendar loop`

| ID | Story (PROMPT) | Priority | Acceptance Criteria (DELIVER) | Nodes |
|---|---|---|---|---|
| DS-401 | As a user, I see days until the next festival | Must | Countdown updates daily, matches YearCalendar | calendar → countdown → hero |
| DS-402 | As a user, I see the ToranGarland signature | Must | Renders at hero top, animates continuously | design → component → hero |
| DS-403 | As a user, I see the year of festivals | Must | YearCalendar lists all dated festivals chronologically | calendar → render |
| DS-404 | As a user, I see "occasions, not dates" rituals | Should | Anytime rituals render in separate section | rituals → render |
| DS-405 | As a user, I can jump from a festival to its products | Must | Card links to filtered product catalog | calendar → link → catalog |

## EPIC-5: Admin & Order Management

**Graph**: `order capture → status → dispatch → deliver` (human gate: refunds)

| ID | Story (PROMPT) | Priority | Acceptance Criteria (DELIVER) | Nodes |
|---|---|---|---|---|
| DS-501 | As a customer, I can view order status | Could | Order ID links to Stripe payment status | order → status → view |
| DS-502 | As an admin, I can list orders | Won't (MVP) | Admin route lists orders by date | capture → list |
| DS-503 | As an admin, I can issue refunds | Won't (MVP) | Refund action + Stripe sync | status → refund *(human gate)* |

---

## Sizing & Cycles

- Work in Basecamp-friendly **cycles** (default 2 weeks; scale to 6-week Shape-Up cycles as appetite grows).
- To-do lists = Epics; to-dos = stories, ordered top-to-bottom by MoSCoW priority.
- Use **Hill Charts** per Epic to track progress (gray = figuring out, white = executing, shipped = over the hill).

## Grooming Rules (PO)

1. Every story must have **graph nodes** recorded in its Basecamp to-do description.
2. No story enters a cycle without **acceptance criteria** (DELIVER).
3. Reviewers must be **non-authors** (writer/checker separation).
4. Priority is MoSCoW — re-validate each grooming.
5. Sync `data/backlog.json` → Basecamp with `npm run sync:basecamp` after backlog changes.
