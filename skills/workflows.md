# Desi Saga — Workflows

> Git workflow, branching, PR flow, and the AI-assisted development loop. Built on the PROMPT → CONTEXT → LOOP → GRAPH → DELIVER framework.

## 1. Git Workflow (GitHub Flow)

- `main` is always deployable.
- Feature branches: `feature/<short-description>` (or `fix/`, `docs/`).
- Every change ships via a pull request — no direct pushes to `main`.

```bash
git checkout main && git pull
git checkout -b feature/festival-countdown
# ...work...
git add -A && git commit -m "feat: live festival countdown"
git push origin feature/festival-countdown
```

## 2. PR Flow (the graph in action)

```
Story (PROMPT) → Branch (job) → PR → CI Loop (lint/test/build)
  → Non-author Review (checker loop) → PO Gate (human gate) → Merge → Deploy → Ship (DELIVER)
```

1. Open PR against `main` using `.github/pull_request_template.md`.
2. CI runs the checker loop (lint, build, test).
3. Vercel preview deploy generated for PO review.
4. **Non-author** reviews and approves.
5. **PO** accepts the human gate.
6. Merge → CI deploys to production (Vercel).

## 3. Commit Message Conventions

| Prefix | Use |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation |
| `refactor:` | Code change, no behavior change |
| `chore:` | Tooling / maintenance |
| `spec:` | Spec/contract change |

## 4. Cycle Cadence (Basecamp LOOP)

Replace sprints with Basecamp-friendly cycles (2–6 weeks, shaped by appetite). Use Hill Charts for progress, Automatic Check-ins for standups, and Messages for reviews.

| Ceremony | Basecamp Feature | Output |
|---|---|---|
| Backlog grooming | To-dos (reorder lists) + Campfire | Refined, prioritized to-dos |
| Cycle planning | To-dos (assign + due dates) + Hill Charts | Commit to cycle work |
| Daily standup | Automatic Check-ins (daily question) | Progress + blockers |
| Cycle review | Message Board post + Campfire demo | Demo (DELIVER) + feedback |
| Retrospective | Message Board post / Campfire | Action items → next cycle |

## 5. Basecamp Workflow Tips

- **One to-do per story** — title = story summary, description = acceptance criteria + graph nodes.
- **One to-do list per Epic** — name it with the Epic graph, e.g. `EPIC-1: Festival Marketplace (browse → filter → detail → cart → checkout)`.
- **Hill Charts** — update weekly per Epic: bottom-left = "figuring it out", top = "execution clear", over the hill = "shipped".
- **Automatic Check-ins** — set a daily question: "What did you finish yesterday? What are you working on today? Anything blocking you?"
- **Messages** — post cycle goals, retro summaries, and ADR decisions on the Message Board.
- **Docs & Files** — upload `specs/openapi.yaml`, `okf/*.md`, and `docs/knowledge-graph.md` for team access.

## 6. AI-Assisted Development Loop

Use OPencode with the project context files:

1. **PROMPT**: give the AI a well-formed story + acceptance criteria.
2. **CONTEXT**: point it at `AGENTS.md`, `docs/knowledge-graph.md`, `specs/`, `okf/` so it has real state.
3. **LOOP**: let it run lint/build/tests; have it self-check then a human (non-author) reviews.
4. **GRAPH**: break large tasks into steps (jobs) with handoffs; use `skills/workflows.md` to stay structured.
5. **DELIVER**: ship a deployable increment; verify preview; update `docs/knowledge-graph.md` if deps changed.

### YouTube transcript skill usage

For festival/ritual research (e.g., validating samagri from video tutorials):

```yaml
skills:
  - youtube-transcript   # ~/.config/opencode/skills/youtube-transcript/
```

```bash
# Fetch transcript for research
ytranscript get <VIDEO_ID> --languages en --format text
```

## 6. Release Checklist

1. PR merged with passing CI.
2. Preview verified by PO.
3. Production deploy confirmed on Vercel.
4. Smoke-test critical path (catalog → detail → cart → checkout).
5. Update `docs/knowledge-graph.md` + OKF artifacts if changed.
