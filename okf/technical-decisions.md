---
title: Desi Saga — Technical Decisions
kind: okf/technical-decisions
version: 1.0.0
owner: Technical Lead / PO
last_updated: 2026-08-12
status: active
tags: [adr, decisions, architecture]
---

# Desi Saga — Technical Decisions (ADR-style)

> **Context** → **Decision** → **Consequences** → **Status**. Add a new ADR when a non-trivial decision is made. Keep the newest on top.

---

## ADR-004: Operating Framework — PROMPT → CONTEXT → LOOP → GRAPH → DELIVER

- **Date**: 2026-08-12
- **Status**: Accepted
- **Context**: The project needed a repeatable way to turn AI-assisted work into managed workflows instead of unbounded single chats. Inspiration: Greg Isenberg, "Why Graph Engineering will 10x your Claude/Codex."
- **Decision**: Adopt the framework as the operating model for delivery:
  - **PROMPT** = well-formed user stories (given/when/then + acceptance criteria).
  - **CONTEXT** = `specs/`, `okf/`, `data/`, `AGENTS.md`, `docs/knowledge-graph.md`.
  - **LOOP** = writer/checker separation; CI checks; Basecamp check-ins + cycle retrospective → action items.
  - **GRAPH** = every Epic mapped to jobs/arrows/shared state; Level 1 manual → Level 2 repo-based → Level 3 tool-automated.
  - **DELIVER** = shippable increments (deployed previews, merged PRs, released catalogs).
- **Consequences**: Requires documentation upkeep; prevents the "one giant chat" trap; adds a bit of overhead per story (graph nodes) that pays off in traceability.

## ADR-003: Contract-First API Specs

- **Date**: 2026-08-12
- **Status**: Accepted
- **Context**: MVP has no server API, but Stripe/webhooks/order flows will need contracts. Fowler's spec-driven development: spec is the source of truth.
- **Decision**: Author `specs/openapi.yaml` contract-first; generate TypeScript types from it; implement routes against the contract.
- **Consequences**: Types stay in sync; easier to add server routes later; requires regeneration discipline on contract change.

## ADR-002: Knowledge Management via OKF

- **Date**: 2026-08-12
- **Status**: Accepted
- **Context**: Team knowledge was scattered (AGENTS.md, SESSION.md, chat). Google's Open Knowledge Format standardizes artifacts with metadata/context/decision/implementation/status.
- **Decision**: Create `okf/` for project overview, product backlog, technical decisions, onboarding, retrospectives, roadmaps. Each document carries YAML frontmatter metadata.
- **Consequences**: Single discoverable source for non-code knowledge; onboarding < 1 day; requires maintenance discipline each sprint.

## ADR-001: Tech Stack (MVP)

- **Date**: 2026-07-15
- **Status**: Accepted
- **Context**: Need a lightweight, mobile-first store; no database; Indian market focus; free hosting.
- **Decision**: Next.js 16 (App Router, TypeScript) + Tailwind CSS v4 + shadcn/ui + Stripe + Vercel + lucide-react. Cart = React Context + localStorage. No database for MVP.
- **Consequences**: Fast to build and deploy; cart not shared across devices; Stripe requires Indian business entity for INR activation (deferred).
