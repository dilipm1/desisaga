---
title: Desi Saga — Basecamp Backlog Guide
kind: okf/basecamp-guide
version: 1.0.0
owner: Product Owner
last_updated: 2026-08-12
status: active
tags: [basecamp, backlog, shape-up, hill-charts, sync]
---

# Desi Saga — Basecamp Backlog Guide

> How to manage the Desi Saga program and product backlog in **Basecamp 4** (DHH / 37signals). Assumes a blank Basecamp project named **"DesiSaga"** already exists.

---

## 1. Why Basecamp?

We chose Basecamp over Jira/Azure DevOps because it combines communication and work tracking in one calm tool:

- **All-in-one**: chat (Campfire), to-dos, schedule, docs, files, Hill Charts.
- **Calm**: no ticket-juggling velocity charts; focus on progress, not busyness.
- **Shape Up friendly**: natural fit for 6-week cycles, appetite, and Hill Charts.
- **PO-first**: to-dos, check-ins, and messages are easy for non-technical stakeholders.

---

## 2. Feature Mapping

| Our Need | Basecamp Feature | Notes |
|---|---|---|
| **Epics** | To-do lists | One list per Epic, named with its graph. |
| **Stories / tasks** | To-dos | One to-do per story; acceptance criteria in description. |
| **Backlog priority** | To-do order | Top of list = highest priority (Must). |
| **Progress tracking** | Hill Charts | One chart per Epic; gray/white/shipped metaphor. |
| **Daily standup** | Automatic Check-ins | Daily "what I did / what's blocking" question. |
| **Cycle planning** | To-dos + Schedule | Assign owners/due dates; milestones on Schedule. |
| **Cycle review** | Message Board + Campfire | Post demo summary, collect feedback. |
| **Retrospective** | Message Board / Campfire | Action items become new to-dos. |
| **Specs / ADRs / docs** | Docs & Files | Upload `specs/`, `okf/`, `docs/` for team access. |
| **Domain data** | Attached files | Products JSON, festival calendar, etc. |

---

## 3. Setup

> ✅ **Verified working 2026-08-12.** Account ID `6199530`, project "DesiSaga" (id `48475118`), 5 Epic to-do lists + 22 to-dos synced via `npm run sync:basecamp`.

### 3.1 Get your Basecamp credentials

1. Go to **https://launchpad.37signals.com/integrations** and create a new integration/app.
2. Note the **Client ID** and **Client Secret**.
3. Run the OAuth 2 flow to get an **Access Token** with the `projects:read`, `todos:write`, and `todos:read` scopes.
4. Find your **Account ID**: call `GET https://launchpad.37signals.com/authorization.json` with the token; the response contains `accounts[].id`.

For personal/server use, you can also generate an OAuth token via the Basecamp web UI (or use a long-lived token stored securely).

### 3.2 Configure environment variables

Copy `.env.example` → `.env` (gitignored) and fill in:

```bash
BASECAMP_ACCOUNT_ID="6199530"
BASECAMP_ACCESS_TOKEN="YOUR_OAUTH_TOKEN"
BASECAMP_PROJECT_NAME="DesiSaga"  # default
```

> The sync script auto-loads `.env` — no manual `export` needed. Access tokens expire in 14 days; renew with the refresh token.

### 3.3 Run the sync

```bash
# Preview what would be created
npm run sync:basecamp -- --dry-run

# Actually create to-do lists and to-dos
npm run sync:basecamp

# Force re-create duplicates (normally skipped)
npm run sync:basecamp -- --force
```

### 3.4 Verified API details

- **API base**: `https://3.basecampapi.com/{ACCOUNT_ID}` (works with Basecamp 4/5)
- **Project dock**: `GET /projects/{id}.json` → `dock[]` contains `todoset`, `message_board`, `schedule`, `vault`
- **To-do lists**: `GET/POST /buckets/{project_id}/todosets/{todoset_id}/todolists.json`
- **To-dos**: `GET/POST /buckets/{project_id}/todolists/{todolist_id}/todos.json`
- **Archive**: `PUT /buckets/{project_id}/recordings/{recording_id}/status/archived.json` (returns 204)
- **Field names**: lists use `title`, to-dos use `content`

---

## 4. Shape Up Adaptation (DHH / 37signals) & Hill Charts

Basecamp was built around **Shape Up**, Ryan Singer's product development method. We adapt it lightly:

| Shape Up Concept | Our Translation |
|---|---|
| **6-week cycles** | Start with 2-week cycles; move to 6-week "big bets" once the team is stable. |
| **Appetite** | PO decides how long we're willing to spend on a bet, then scopes work to fit. |
| **Pitch** | A well-formed Epic description + graph + acceptance criteria = the pitch. Stored in `okf/product-backlog.md`. |
| **Betting table** | Before each cycle, the team bets on which Epics to ship. Chosen Epics get to-dos assigned. |
| **Hill Charts** | One per Epic To-do list. Bottom-left = "figuring it out" (gray); top = "execution clear" (white); over the hill = "shipped". |
| **Scope hammering** | If a story won't fit the cycle appetite, cut it or push it — don't extend the cycle. |
| **Cool-down** | After each cycle, keep 1–2 days unscheduled for cleanup, refactors, and process improvements. |

### How to set up Hill Charts in Basecamp (Web UI)

Because Basecamp's public API manages to-dos and lists (which we automated via `npm run sync:basecamp`), **Hill Charts are set up and updated directly in the Basecamp web app**:

1. Open your **DesiSaga** project in Basecamp.
2. Click on **To-dos**.
3. You will see the 5 Epic lists we synced (`EPIC-1: Festival Hampers Marketplace`, etc.).
4. Click on an Epic list (e.g., `EPIC-4: Hero Experience & Festival Calendar`).
5. At the top of the list view, click **Turn on Hill Chart** (or click the Hill Chart icon).
6. **Add Scopes (Dots)** representing the key milestones or graph nodes for that Epic:
   - For Epic 4, scopes could be: `Countdown timer`, `ToranGarland SVG`, `YearCalendar chronological view`.
7. **Position the dots**:
   - **On the left side (The Gray / Figuring it out):** We are still researching, designing, or figuring out how to implement it.
   - **On the top / right side (The White / Execution clear):** We know exactly what to do and are just writing code.
   - **Over the hill (Done):** Shipped and verified.

Update your Hill Chart positions weekly during cycle review.

---

## 5. PO Workflow (Weekly)

### Monday — Backlog grooming
1. Open Basecamp "DesiSaga" → To-dos.
2. Reorder to-dos within each Epic list (top = Must).
3. Review Hill Charts; update status where design has become clear (gray → white).
4. Edit `data/backlog.json` if priorities change.
5. Run `npm run sync:basecamp` to push changes.

### Cycle start — Planning / Betting
1. Choose the Epics that fit the cycle appetite.
2. Assign to-dos to owners and set due dates.
3. Add key dates to the Basecamp Schedule (review, deploy, retro).
4. Post the cycle goal on the Message Board.

### Daily — Automatic Check-in
Basecamp asks the team:
> "What did you finish yesterday? What are you working on today? Anything blocking you?"

The PO scans answers for stuck arrows in the graph.

### Cycle end — Review + Retro
1. **Review**: demo shippable increments; post a Message with links to previews/PRs.
2. **Retro**: Campfire or Message post with:
   - What went well
   - What could be better
   - Action items (each becomes a to-do)
3. Update Hill Charts: shipped items go over the hill.

---

## 6. Rules of the Road

1. **One to-do per story** — never stack multiple stories in a single to-do.
2. **Acceptance criteria in the description** — the DELIVER step must be explicit.
3. **Graph nodes in every story** — record jobs/arrows so the team sees the workflow.
4. **Writer/checker separation** — the person who codes a PR is never the final reviewer.
5. **No ticket without a human gate where mistakes get expensive** — PO review, refunds, Stripe activation.
6. **Sync after backlog changes** — `data/backlog.json` is source; Basecamp is the live view.

---

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| `Missing BASECAMP_ACCOUNT_ID` | Export the env var; see §3.1. |
| `Project "DesiSaga" not found` | Check `BASECAMP_PROJECT_NAME` matches exactly, or rename the Basecamp project. |
| Duplicates created | Re-run without `--force`; the script skips to-dos whose title starts with the story ID. |
| Rate limited (429) | Basecamp allows ~50 requests per 10 seconds; the script already sleeps 250ms between calls. Wait and retry. |
| OAuth token expired | Refresh via the OAuth flow or regenerate in the Basecamp UI. |
| To-do descriptions look plain | Basecamp supports HTML in descriptions; the sync script formats criteria as a bulleted list. |

---

## 8. References

- [Basecamp 3/4 API docs](https://github.com/basecamp/bc3-api)
- [Shape Up by Ryan Singer](https://basecamp.com/shapeup)
- [Desi Saga Product Backlog](./product-backlog.md)
- [Desi Saga Roadmap](./roadmaps/roadmap.md)
- [Sync script](../../scripts/basecamp-sync.mjs)
- [Canonical backlog JSON](../../data/backlog.json)
