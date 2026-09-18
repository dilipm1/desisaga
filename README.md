# Desi Saga — Product Management & OKF Engineering Showcase

[![Production](https://img.shields.io/badge/Live-desisaga.com-10b981?style=flat-square)](https://desisaga.com)
[![Framework](https://img.shields.io/badge/Rails-8.1-CC0000?style=flat-square&logo=rubyonrails)](https://rubyonrails.org/)
[![OKF](https://img.shields.io/badge/Standard-Open_Knowledge_Format_(OKF)-4285F4?style=flat-square)](./okf/)
[![Backlog](https://img.shields.io/badge/Backlog-6_Epics_|_28_Stories-f59e0b?style=flat-square)](./data/backlog.json)
[![Architecture](https://img.shields.io/badge/Architecture-Majestic_Monolith-8b5cf6?style=flat-square)](./okf/technical-architecture.md)

> **Live Production Application**: [https://desisaga.com](https://desisaga.com)  
> **Repository**: [https://github.com/dilipm1/desisaga](https://github.com/dilipm1/desisaga)

---

## 🎯 Executive Summary & Showcase Purpose

**Desi Saga** is an end-to-end ecommerce platform for Indian Hindu festival & ritual gift hampers, engineered to showcase **Technical Product Leadership, modern Product Management (PO/PM) artifacts, and Google-standard Open Knowledge Format (OKF) implementations**.

This repository demonstrates how structured knowledge architecture bridges **product strategy, stakeholder alignment, human engineering teams, and autonomous AI coding agents**.

```
                           ┌────────────────────────────────────────┐
                           │    Open Knowledge Format (OKF) Core    │
                           │  YAML Frontmatter + Markdown Metadata  │
                           └──────────────────┬─────────────────────┘
                                              │
       ┌───────────────────────────────┬──────┴────────────────────────┬───────────────────────────────┐
       ▼                               ▼                               ▼                               ▼
┌──────────────┐              ┌─────────────────┐             ┌─────────────────┐             ┌─────────────────┐
│   PRODUCT    │              │    TECHNICAL    │             │  ARCHITECTURE   │             │   AI AGENTIC    │
│  MANAGEMENT  │              │  SPECIFICATION  │             │   & DECISIONS   │             │   WORKFLOWS     │
├──────────────┤              ├─────────────────┤             ├─────────────────┤             ├─────────────────┤
│ • 6 Epics    │              │ • OpenAPI 3.0   │             │ • Architecture  │             │ • Zero-shot     │
│ • 28 Stories │              │   Contracts     │             │   Decision      │   Context       │
│ • MoSCoW     │              │ • Schema Specs  │             │   Records (ADR) │             │ • Prompt → Loop │
│ • HillCharts │              │ • Boundary Sync │             │ • Retrospectives│             │ • Deterministic │
└──────────────┘              └─────────────────┘             └─────────────────┘             └─────────────────┘
```

---

## 🏛️ Open Knowledge Format (OKF) & Knowledge Architecture

The repository adheres to **Open Knowledge Format (OKF)** — a universal, vendor-neutral markdown + YAML metadata specification designed for AI agentic development and high-velocity engineering teams.

### Knowledge Taxonomy & Directory Structure

```
desisaga/
├── okf/                           # Open Knowledge Format Root
│   ├── project-overview.md        # Vision, mission, problem space, value proposition
│   ├── product-backlog.md         # Human-readable backlog mirror with MoSCoW priorities
│   ├── technical-architecture.md  # System design, data models, state machines
│   ├── technical-decisions.md     # Architecture Decision Records (ADRs) with trade-offs
│   ├── onboarding.md              # Zero-setup agent/human developer onboarding guide
│   ├── basecamp-guide.md          # Dual-track sync guide for stakeholder management
│   ├── retrospectives/            # Sprint retrospectives & continuous improvement logs
│   └── roadmaps/                  # Multi-quarter strategic product roadmaps
├── specs/                         # Contract-First Engineering
│   ├── openapi.yaml               # Complete OpenAPI 3.0 REST specification
│   └── README.md                  # Contract testing & payload verification guide
├── data/                          # Canonical Machine-Readable State
│   ├── backlog.json               # Single source of truth (6 Epics, 28 Stories, Hill Charts)
│   └── festivals_generated_2026_2030.json # Astronomical panchang pre-compute dataset
├── docs/                          # Living operational documentation & plans
│   ├── knowledge-graph.md         # Semantic relationship graph across code & product entities
│   └── plans/                     # Infrastructure & migration execution runbooks
├── skills/                        # Autonomous AI agent operational workflows & skills
└── AGENTS.md                      # AI Operating Guide (PROMPT → CONTEXT → LOOP → GRAPH → DELIVER)
```

---

## 📋 Product Management & Product Owner (PO) Highlights

### 1. Dual-Track Backlog Management (Single Source of Truth)
- **Canonical Machine-Readable Backlog (`data/backlog.json`)**: Structured schema tracking versions, Epics, User Stories, Acceptance Criteria, dependencies, priority matrices (Must/Should/Could/Won't), and release states.
- **Human & Stakeholder Mirror (`okf/product-backlog.md`)**: Formatted for executive review, sprint planning, and non-technical stakeholders.
- **Basecamp 4 Integration**: Hill Chart tracking to visualize confidence and movement from "Figuring it out" to "Making it happen".

### 2. Epic & User Story Breakdown
| Epic ID | Epic Title | Focus Area | Status |
|---|---|---|---|
| **EPIC-1** | Festival Hampers Marketplace | Catalog discovery, multi-filter, search, Pagy pagination | Shipped |
| **EPIC-2** | Shopping Cart & Checkout | Session-based cart, dynamic shipping tier (₹999 threshold), checkout | Shipped |
| **EPIC-3** | Payments & Orders | Payment gateway integration (Stripe test stubbed), order confirmation | Next Wave |
| **EPIC-4** | Festival Calendar & Engine | Vedic astronomical Panchang engine (Lahiri ayanamsa), regional variants | Shipped |
| **EPIC-5** | Admin & Inventory Control | Full inventory CRUD, region management, role-based auth | Shipped |
| **EPIC-6** | Customer Experience & Trust | Ritual details, cultural curation, responsiveness, performance audits | In Progress |

### 3. Contract-First Development (`specs/openapi.yaml`)
- Every endpoint, parameter, response schema, and error condition is specified upfront.
- Decouples frontend and backend delivery, eliminates integration drift, and allows automated mock generation.

### 4. Architecture Decision Records (ADRs)
Documented trade-offs balancing speed-to-market, operational complexity, and unit economics:
- **ADR-001**: Migration from Next.js 16 to Rails 8.1 "Majestic Monolith" (eliminated Node build toolchain sprawl).
- **ADR-002**: Session-based cart (`session[:cart]`) with shipping parity over premature microservice databases.
- **ADR-003**: In-house Vedic Panchang calculation engine (Option B Lahiri table + Meeus astronomical models) to power real-time festival countdowns across 12 Indian states.
- **ADR-004**: Deployment on dedicated Hetzner VPS (`nbg1`) via Kamal + Docker + Cloudflare SSL (achieving <€6/mo operating costs with sub-50ms TTFB).

---

## 🤖 AI Agentic Operating Framework

This project was developed using the **PROMPT → CONTEXT → LOOP → GRAPH → DELIVER** framework:

1. **PROMPT**: Rigorous User Stories with explicit Acceptance Criteria.
2. **CONTEXT**: Loaded dynamically via `okf/`, `specs/`, and `data/` without hallucination.
3. **LOOP**: Writer/Checker separation with automated testing (`bin/rails test`) and Brakeman security scans.
4. **GRAPH**: Dependency mapping connecting business goals to code units via `docs/knowledge-graph.md`.
5. **DELIVER**: Incremental, deployable increments running live in production.

---

## 🛠️ Technology Stack & Architecture

- **Backend**: Ruby on Rails 8.1 (Ruby 4.0.6) — Majestic Monolith
- **Frontend**: Hotwire (Turbo Drive / Turbo Frames + Stimulus.js) via Importmap (**Zero Node.js dependency**)
- **Styling**: Tailwind CSS v4 (Custom "Night of the Celebration" Indian ritual design system)
- **Database & Cache**: SQLite (Solid Cache / Solid Queue / Solid Cable)
- **Pagination**: Pagy 9.4 (high-performance lightweight pagination)
- **Astronomical Engine**: Custom Ruby Vedic Panchang Engine (Lahiri ayanamsa, regional aliases)
- **Deployment & DevOps**: Kamal 2, Docker, Hetzner CX23 (`nbg1`), Cloudflare (SSL/CDN, apex 301 redirection)

---

## 🚀 Quickstart & Local Development

### Prerequisites
- Ruby 4.0.6 (managed via `mise` or `rbenv`)
- SQLite 3

### Setup & Run
```bash
# Clone the repository
git clone https://github.com/dilipm1/desisaga.git
cd desisaga

# Run automated setup (installs gems, sets up database)
bin/setup

# Seed sample data (23 hampers: 8 base + 15 regional variants + admin credentials)
bin/rails db:seed

# Start the local development server
bin/dev
```

Visit `http://localhost:3000` in your browser.

### Test Suite & Code Quality
```bash
# Run unit & integration tests
bin/rails test

# Run security scanner
bin/brakeman

# Run style linter
bin/rubocop
```

### Admin Access (Local)
- **URL**: `http://localhost:3000/login`
- **Default Email**: `admin@desisaga.com`
- **Default Password**: `desisaga-admin-2026`

---

## 🌐 Production & Infrastructure

- **Live URL**: [https://desisaga.com](https://desisaga.com) (Canonical apex domain, `www` automatically 301-redirected)
- **Host**: Hetzner CX23 Nuremberg (`nbg1`) running Kamal with Puma 8.1.3
- **Security**: 0 Brakeman vulnerabilities, rate-limited auth sessions, encrypted credentials.

---

## 👤 Author & Showcase Context

Crafted by **Dilip M** as a demonstration of:
- **Technical Product Management / Product Ownership (PO/PM)**
- **Open Knowledge Format (OKF)** architecture
- **Contract-First System Design**
- **Modern Rails 8.1 Monolithic Engineering**
- **Human-AI Agentic Collaboration Workflows**

*For recruiter inquiries, collaboration, or architectural walk-throughs, please connect via GitHub or LinkedIn.*
