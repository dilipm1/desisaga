# desisaga.com — Project ToDos & Roadmap

## Project Vision
**Desi Saga** — Indian Hindu festival & ritual gift hampers. Pre-curated packages for celebrations and religious ceremonies. Mission: Deliver ritual-ready hampers before every Indian festival, packed with authentic samagri and delivered on time.

---

## Operating Framework: PROMPT → CONTEXT → LOOP → GRAPH → DELIVER

> **Source insight** (Greg Isenberg, "Why Graph Engineering will 10x your Claude/Codex"): Prompt engineering is how you ask AI a better question. Context engineering is how you give AI better information. **Graph engineering** is how you design the work around the AI so it lives as a *managed workflow* instead of one giant chat. Jobs connected by arrows, with shared state moving between them.

### How this project runs on the framework

| Step | Definition | Desi Saga application |
|---|---|---|
| **PROMPT** | Ask AI a better question | User stories written with explicit "given/when/then" + acceptance criteria in Basecamp to-dos. Every task starts from a well-formed prompt. |
| **CONTEXT** | Give AI better information | `specs/` (contracts), `okf/` (knowledge), `data/products.json` (domain data), `AGENTS.md` (project context). Knowledge graph of components → files → decisions. |
| **LOOP** | Feedback cycles that raise quality | Separate writer from checker (never let one model grade its own work). Human gate where mistakes get expensive. Basecamp check-ins + retrospective → action items → process change. |
| **GRAPH** | Managed workflow of jobs + arrows + state | Each Epic/Feature is designed as a graph: jobs (steps), arrows (handoffs), shared state (specs, OKF artifacts, test results). Level 1 manual → Level 2 repo-based → Level 3 tool-automated. |
| **DELIVER** | Tangible output, not chat responses | Shippable product increments: deployed preview URL, merged PR, released hamper catalog, Stripe-enabled checkout. |

### Three Levels of Graph Implementation (Maturity Model)

| Level | Pattern | Tooling | When to adopt |
|---|---|---|---|
| **L1 — Manual lanes** | Draw jobs + arrows on Excalidraw/tldraw/whiteboard | No code | Prove the workflow structure before automating |
| **L2 — Repo-based** | Each step writes its own file; paper trail; reusable | Claude Code / Codex / OPencode skills, `docs/`, `specs/`, `okf/` | Workflow proven at L1; needs traceability |
| **L3 — Tool-automated** | State checkpoints, human-in-the-loop, service integration | LangGraph / n8n / Make.com / CI pipelines | Repeatable high-volume work; connects to Slack/email/CRM |

**Rule:** Draw and run the graph manually first. Add automation only once the structure proves itself. Aim for the **smallest graph that raises quality**; place the **human gate where mistakes get expensive**.

---

## Phase 1: Foundations (Week 1)

### 1.1 Create `specs/` Directory (Context Engineering — Contracts)
- [ ] Add OpenAPI/TypeScript API schemas
- [ ] Define contract-first endpoints for:
  - Product catalog search/filter
  - Cart management (add/remove/update)
  - Stripe Checkout session creation
  - Order webhooks
- [ ] Generate TypeScript types from specs
- [ ] Document each spec as a **node in the knowledge graph** (job: "api contract", arrows: which components consume it)

### 1.2 Create `okf/` Directory (Open Knowledge Format — Shared State)
- [ ] `project-overview.md` — Project summary, goals, success metrics
  - Vision: Ritual-ready hampers delivered before celebration
  - Success metrics: Lead time < 3 days, spec adherence > 90%, knowledge uptime < 1 day for onboarding
- [ ] `product-backlog.md` — Prioritized feature backlog using MoSCoW
- [ ] `technical-decisions.md` — ADR-style decision records (each ADR = a job with state)
  - Example: "Why Next.js App Router over Pages Router?"
  - Example: "Why localStorage cart over database for MVP?"
- [ ] `onboarding.md` — Developer onboarding guide
  - Project setup: `npm install`, `npm run dev`
  - Directory structure overview
  - Code conventions (TypeScript, Tailwind, commit messages)
- [ ] `retrospectives/` — Sprint retrospective notes (LOOP: each retrospective feeds the next sprint)

### 1.3 Create `skills/` Directory (Developer Industry Standards + AI Workflows)
- [ ] `skills/index.md` — Overview of developer capabilities, tech stack
- [ ] `skills/profiles/` — Individual developer profiles
  - Expertise areas, preferred tools, contribution guidelines
- [ ] `skills/tools.md` — Recommended tooling, IDE configs, CI/CD
- [ ] `skills/patterns.md` — Code patterns, architectural decisions, anti-patterns
  - **Anti-pattern:** the "one giant chat" — unbounded single-conversation work that loses state
- [ ] `skills/workflows.md` — Git workflows, branching strategies, PR templates
- [ ] `skills/youtube-transcript/` — AI transcript skill (fetches video content as context for research, e.g. festival ritual tutorials) — *created 2026-08-12*

### 1.4 Product Vision Statement
- [ ] Craft one-sentence vision: "India's most trusted platform for festival & ritual gift hampers"
- [ ] Define target metrics:
  - GMV (Gross Merchandise Value) target per festival season
  - Customer retention rate (repeat festival gifting)
  - On-time delivery rate (target: 95%+)

### 1.5 Draw the Delivery Graph (L1 Manual)
- [ ] Map the full product delivery flow as a graph on Excalidraw:
  ```
  Story (PROMPT) → Context Load (specs + okf + data) → Implement (job) → Test (checker loop) → Review (human gate) → Deploy → PO Accept → Ship
  ```
- [ ] Identify which steps need **human gates** (review, PO accept) vs automated loops (lint, test, build)
- [ ] Confirm the **smallest graph** that covers MVP delivery end-to-end

---

## Phase 2: Backlog Structure (Week 2)

### 2.1 Basecamp "DesiSaga" Project Setup
- [ ] Create the Basecamp 4 project **"DesiSaga"** (blank project already created)
- [ ] Build the following to-do lists (each Epic = a Graph = a to-do list):
  - **EPIC-1**: Festival Hampers Marketplace *(graph: browse → filter → detail → cart → checkout)*
  - **EPIC-2**: Ritual Validation & Samagri Coverage *(graph: ritual data → product mapping → verification loop → display)*
  - **EPIC-3**: Stripe Payment Integration (India & International) *(graph: cart → session → webhook → confirm → notify, with human gate at merchant activation)*
  - **EPIC-4**: Hero Experience & Countdown *(graph: festival calendar → countdown state → hero render → calendar loop)*
  - **EPIC-5**: Admin & Order Management *(graph: order capture → status → dispatch → deliver, with human gate for refunds)*
- [ ] Add one **Hill Chart** per Epic (gray = uncertain design, white = clear execution, over the top = shipped)
- [ ] Set up **Automatic Check-ins** (daily "what did you do / what's blocking") to replace the daily standup
- [ ] Upload `specs/`, `okf/`, and `docs/` into **Docs & Files** so Basecamp is the team's context hub
- [ ] Sync the canonical backlog via `scripts/basecamp-sync.mjs` (`npm run sync:basecamp`)

### 2.2 Feature/Story Creation (well-formed PROMPTs → Basecamp to-dos)
| Epic | Feature | User Story (PROMPT) | Priority | Acceptance Criteria (DELIVER) | Graph Nodes |
|---|---|---|---|---|---|
| 1 | Multi-festival search | As a user, I can filter hampers by festival (Diwali, Wedding, etc.) | Must | Filter persists across page filters, shows correct count | catalog → filter → grid |
| 1 | Price range filter | As a user, I can set min/max price | Should | Slider updates product grid in real-time | catalog → price → grid |
| 2 | Ritual items validation | As a user, I see which rituals each hamper covers | Must | Each product card shows ritual icons | ritual data → mapping → card |
| 3 | Stripe test mode | As a user, I can complete checkout in test mode | Must | Order appears in Stripe dashboard, success page loads | cart → session → webhook → success |
| 3 | Stripe India | As an Indian customer, I can pay in INR via UPI/cards | Should | Stripe India account connected, 2% fee applied | session → UPI → confirm *(human gate: merchant activation)* |
| 4 | Live countdown | As a user, I see days until next festival | Must | Countdown updates daily, matches YearCalendar | calendar → countdown → hero |
| 4 | ToranGarland hero | As a user, I see the signature doorway garland | Must | Renders at hero top, animates continuously | design → component → hero |
| 5 | Order tracking | As a customer, I can view order status | Could | Order ID links to Stripe payment status | order → status → view |

> To-dos are created in Basecamp from `data/backlog.json` (source of truth) via the sync script — or pasted manually from this table.

### 2.3 Basecamp Backlog Organization (graph-aware)
- [ ] **To-do lists** = Epics (one list per Epic graph)
- [ ] **To-dos** = stories, ordered top-to-bottom by MoSCoW priority (top = Must)
- [ ] **Assignees + due dates** set at cycle planning
- [ ] **Hill Charts** = the "GRAPH" progress view — mark "in the gray" while the design is uncertain, "in the white" while execution is clear
- [ ] **Campfire** = the conversation layer (replace email/standup chat)
- [ ] Enable the **Check rule** (via review workflow, not Basecamp itself): no story ships without a non-author reviewer

### 2.4 PR Template with Spec + Graph References
Create `.github/pull_request_template.md`:
```
## Description
Brief summary of changes

## Spec References
- Spec: specs/openapi.yaml #/paths/~1checkout~1post
- OKF: okf/technical-decisions.md #Stripe-integration

## Graph Mapping
- Job(s) implemented: checkout → session → webhook
- Shared state touched: specs/openapi.yaml, data/products.json
- Loops exercised: unit tests, lint, build
- Human gate: PO review before merge

## Checklist
- [ ] Code follows TypeScript strict mode
- [ ] Tailwind classes use design tokens (var(--color-...))
- [ ] Accessibility: aria-labels on interactive elements
- [ ] Performance: Lighthouse score > 90
- [ ] Tests: unit tests pass, e2e critical path verified
- [ ] Reviewer is NOT the author (writer/checker separation)

## Linked Items
- Basecamp to-do: <link to to-do>
- OKF reference: okf/product-backlog.md #DS-101
```

---

## Phase 3: Workflow Integration (Week 3-4)

### 3.1 GitHub Actions CI/CD Pipeline (the automated LOOP)
Create `.github/workflows/ci-cd.yml`:
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  lint-test:            # ← CHECKER LOOP
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test

  deploy:               # ← DELIVER (human gate upstream in PR review)
    needs: lint-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v3
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: .
          alias-domains: desisaga.com
```
- [ ] Add a **review-request check** job: block merge until a non-author reviewer approves

### 3.2 Vercel Preview Deployments
- [ ] Configure `vercel.json` for preview deploys:
```json
{
  "previewDeployBody": {
    "name": "PR-${{ github.run_number }}"
  },
  "git": {
    "projectOriginBranch": "main"
  }
}
```
- [ ] Each PR auto-deploys to `desisaga-xyz.vercel.app`
- [ ] PO tests preview, leaves comments, marks as reviewed (human gate)

### 3.3 Stripe Webhook Integration (event-driven graph edge)
- [ ] Set up Stripe webhook endpoint: `https://desisaga.vercel.app/api/webhook`
- [ ] Events: `checkout.session.completed`, `payment_intent.succeeded`
- [ ] Webhook handler updates order status, triggers success page
- [ ] Test with Stripe's webhook test mode
- [ ] Document the webhook as an **edge in the order graph**: cart → session → webhook → success page

### 3.4 Knowledge Graph of Dependencies (shared state map)
Create `docs/knowledge-graph.md`:
```
Component Dependency Map (jobs + arrows + state):
- src/app/layout.tsx → CartProvider (cart context)          | state: cart in localStorage
- src/lib/cart.tsx → localStorage (persisted across reloads)  | state: cart items + total
- src/lib/festivals.ts → useNextFestival (live countdown)    | state: today (30-min tick)
- src/components/YearCalendar → useToday (30-min tick clock)  | state: daysLeft per festival
- src/components/FestivalHero → useNextFestival (daysLeft)    | state: next festival
- src/lib/products.ts → data/products.json (8 hampers)        | state: product catalog
- src/components/ProductCard → CATEGORY_BG (category styling) | state: category → style map
- src/app/checkout/page.tsx → Stripe Checkout Session         | state: session id
- src/app/success/page.tsx → Webhook confirmation             | state: order status
```
- [ ] Maintain this graph as **living shared state** — update it every sprint (see 4.4)

### 3.5 Domain Graphs (ready-made DELIVER patterns)
Design each as a Level-1 manual graph first, promote to L2/L3 as volume grows:

- **Festival Calendar Graph** (EPIC-4): `calendar data → daysLeft loop → hero countdown → YearCalendar render → category link`
- **Product/Order Graph** (EPIC-1, 3, 5): `browse → filter → detail → add-to-cart → checkout session → webhook → confirm → dispatch → deliver`
- **Customer Support Graph** (future): `classify issue → check order context → search FAQ/ritual docs → draft reply → checker (accuracy/tone) → route refunds/angry customers to human`
- **Content Creation Graph** (future): `research festival → thesis → ritual examples → hook → copy → checker on specificity → branch into titles/thumbnails/captions`

---

## Phase 4: Optimization (Ongoing) — the LOOP

### 4.1 Sprint Rituals (PO Perspective, graph-aware)
| Activity | Frequency | Owner | Output |
|---|---|---|---|---|
| **Backlog Grooming** | Every Monday 10 AM | PO + Lead Dev | Prioritized to-dos, refined stories, updated graph edges + Hill Charts |
| **Cycle Planning** | Start of cycle | PO + Dev Team | Cycle goal, committed to-dos, assigned graph nodes |
| **Check-in (standup)** | Daily via Basecamp | Dev Team | Progress updates, blockers (which arrows are stuck) |
| **Cycle Review** | End of cycle | PO + Stakeholders | Demo (DELIVER), feedback captured |
| **Retrospective** | End of cycle | Dev Team | Action items → feed next cycle (the LOOP) |

### 4.2 Key Success Metrics Dashboard
Track in Basecamp (check-ins, to-do completion, Hill Chart movement):
- **Lead Time**: Story creation → production deploy (target: < 3 days avg)
- **Cycle Time**: To-do started → done (target: < 2 days avg)
- **Spec Adherence**: % of stories built against defined specs (target: > 90%)
- **Deployment Frequency**: Weekly releases to Vercel
- **Mean Time to Recovery**: On failed deploy, time to restore (target: < 1 hour)
- **Graph Coverage**: % of active Epics with a documented jobs/arrows/state map + Hill Chart (target: 100%)
- **Checker Separation**: % of PRs reviewed by a non-author (target: 100%)

### 4.3 Continuous Improvement Loop (the glue)
```
Retrospective → Action Items → Process Change → Next Cycle → Measure Impact
```
- Every retrospective produces **actionable process changes** (not just notes)
- Each change is a **small graph upgrade**: smallest change that raises quality
- Track the loop's effectiveness with the metrics dashboard above
- New action items are added as Basecamp to-dos so they don't get lost

### 4.4 Backlog Maintenance Routine (Weekly)
- [ ] Review to-do completion rates + Hill Chart movement
- [ ] Re-run `npm run sync:basecamp` after backlog.json changes (keeps Basecamp to-dos in sync)
- [ ] Update OKF artifacts after each cycle (shared state stays fresh)
- [ ] Refresh skills/profiles based on new hires/transfers
- [ ] Retire deprecated specs, add new ones
- [ ] Update knowledge graph with any component changes (edges + state)
- [ ] Re-draw the delivery graph if any job/arrow/human-gate changed

---

## Immediate Next Actions (Start Here)

### Today:
1. [ ] **Create docs/ProjectToDos.md** ← *You are here*
2. [ ] Set up GitHub repo with initial structure
3. [ ] Invite team members, assign roles (PO, Lead Dev, Designer)
4. [ ] Draw the L1 delivery graph on Excalidraw (story → review → deploy → ship)

### This Week:
1. [x] Set up Basecamp "DesiSaga" project: create 5 Epic to-do lists *(done 2026-08-12; Hill Charts guided in `okf/basecamp-guide.md`)*
2. [ ] Create first feature story: "Live festival countdown on hero" (a 3-node graph)
3. [ ] Set up GitHub Actions CI pipeline (basic lint + build) — the first automated loop
4. [ ] Onboard first developer to the `skills/` directory structure
5. [ ] Confirm PO review as the **human gate** in the PR workflow
6. [x] Run `npm run sync:basecamp` with credentials to populate the live backlog *(done 2026-08-12 — 5 lists, 22 to-dos)*

### This Month:
1. [ ] Full delivery cycle: Plan → Develop → Review → Deploy → Retrospective (one full loop)
2. [ ] Integrate Stripe test mode checkout
3. [ ] Deploy to Vercel with custom domain desisaga.com
4. [ ] Conduct first cycle retrospective, capture action items → feed cycle 2
5. [ ] Promote the delivery graph from L1 (manual) to L2 (repo-based) once stable

---

## Quick Reference: Key Commands

```bash
# Development
npm run dev        # Start local dev server (port 3000)
npm run build      # Build for production
npm run lint       # Run ESLint
npm test           # Run test suite

# Deployment
vercel             # Deploy to Vercel
vercel --prod      # Production deploy

# Git workflow
git checkout -b feature/DESCRIPTION  # Create feature branch (a job node)
git checkout main && git pull        # Update main
git push origin feature/DESCRIPTION  # Push feature
# PR: Create pull request → checker review → PO human gate → merge to main

# AI research (transcript skill)
# skills/youtube-transcript  → fetch + analyze video content for ritual/festival research

# Backlog sync (Basecamp)
npm run sync:basecamp    # Push data/backlog.json → Basecamp to-do lists
```

---

## Appendix: Framework Cheat Sheet (from video analysis)

- **Prompt Engineering** = how you ask AI a better question (PROMPT)
- **Context Engineering** = how you give AI better information (CONTEXT)
- **Graph Engineering** = how you design the work around the AI so it lives as a managed workflow instead of one giant chat (GRAPH)
- **Jobs** = the steps a workflow performs (nodes)
- **Arrows** = the handoffs between jobs (edges)
- **Shared state** = what the system knows so far, flowing along the arrows
- **Knowledge graphs** = how information connects (help AI reason across relationships)
- **Agent graphs** = how work should move (planner → researcher → skeptic → synthesizer → human)
- **Human gate** = where a human approves before proceeding (place where mistakes get expensive)
- **Smallest graph that raises quality** = do not over-engineer; automate only proven structures
