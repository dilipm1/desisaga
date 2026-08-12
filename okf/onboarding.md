---
title: Desi Saga — Onboarding
kind: okf/onboarding
version: 1.0.0
owner: Technical Lead
last_updated: 2026-08-12
status: active
tags: [onboarding, developer-guide]
---

# Desi Saga — Developer Onboarding

> Goal: get a new developer to a running dev environment in **under a day**.

## 1. Prerequisites

- Node.js 20+ (project verified on 25.9.0)
- Git
- A code editor (VS Code / Neovim recommended)
- (Optional) Vercel account for preview deploys

## 2. Get the code

```bash
git clone git@github.com:<org>/desisaga.git
cd desisaga
npm install
npm run dev
# → http://localhost:3000
```

## 3. Run the checks

```bash
npm run lint    # ESLint
npm run build   # Production build
```

## 4. Directory map

```
desisaga/
├── src/
│   ├── app/          ← Next.js App Router pages (landing, products, cart, checkout)
│   ├── components/   ← UI components (Navbar, Footer, ProductCard, festival visuals)
│   ├── lib/          ← Business logic (cart, products, festivals, format)
│   └── types/        ← TypeScript interfaces
├── data/             ← Static domain data (products.json)
├── specs/            ← Contract-first API specs (openapi.yaml)
├── okf/              ← Open Knowledge Format (overview, backlog, ADRs, retrospectives)
├── docs/             ← ProjectToDos, knowledge graph
├── skills/           ← Developer standards + AI workflow definitions
└── .github/          ← PR template + CI/CD
```

## 5. Conventions

| Topic | Rule |
|---|---|
| Language | TypeScript strict mode |
| Styling | Tailwind design tokens (`var(--color-*)`), never raw hex in components |
| Icons | lucide-react |
| Cart | React Context + localStorage (no DB) |
| Data | Domain data in `data/products.json`, consumed via `src/lib/` |
| Commits | Conventional: `feat:`, `fix:`, `docs:`, `refactor:` |
| PRs | Use `.github/pull_request_template.md`; reviewer ≠ author |

## 6. Where to read first

1. `AGENTS.md` — project context, design system, status
2. `docs/ProjectToDos.md` — operating framework + roadmap
3. `okf/project-overview.md` — what we're building and why
4. `docs/knowledge-graph.md` — how components connect
5. `src/app/page.tsx` — start reading code here

## 7. Design system quick reference

- **Direction**: "Night of the celebration" — dark ritual canvas, firelight accents
- **Palette**: night `#1A0B0A` · ember `#2E1210` · parchment `#F7EEDC` · flame `#E9B44C` · marigold `#E8731F` · kumkum `#C2322E` · leaf `#8FAE6B` · line `#422A1C`
- **Type**: Rozha One (display) · Instrument Sans (body) · Space Mono (dates)
- **Signature**: ToranGarland marigold doorway swag
- **Copy**: Ritual vocabulary (shagun, ritual-ready, samagri)

## 8. Working agreements (PO)

- Every story: acceptance criteria before cycle entry.
- Every PR: reviewer must be non-author (writer/checker separation).
- Every cycle end: retrospective → action items.
- Update `docs/knowledge-graph.md` when component dependencies change.
