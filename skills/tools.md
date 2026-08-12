# Desi Saga — Tools & Environment

> Canonical tooling. When you introduce a new tool, record it here so the team shares one setup.

## Core Toolchain

| Tool | Purpose | Notes |
|---|---|---|
| Node.js 20+ (verified 25.9.0) | Runtime | Use `.mise.toml` for pinning |
| Next.js 16.2.10 | Framework | App Router, TypeScript |
| Tailwind CSS v4 | Styling | Design tokens in `src/app/globals.css` |
| TypeScript 5 | Types | Strict mode |
| ESLint 9 | Lint | `eslint-config-next` |
| Stripe | Payments | Test mode for MVP |
| Vercel | Hosting | Free tier, preview deploys |

## Package Scripts

```bash
npm run dev       # local dev (port 3000)
npm run build     # production build
npm run start     # serve production build
npm run lint      # eslint
```

## AI / MCP Tooling

| Tool | Purpose | Config |
|---|---|---|
| OPencode | AI coding agent | `~/.config/opencode/opencode.json` |
| Glances MCP | System monitoring | `~/.agents/skills/glances-mcp/SKILL.md` |
| YouTube Transcript skill | Fetch video transcripts | `~/.config/opencode/skills/youtube-transcript/` |

## CI/CD (GitHub Actions)

- File: `.github/workflows/ci-cd.yml`
- Jobs: lint-test (checker loop) → deploy (Vercel, main only)
- Review gate: non-author review required (writer/checker separation)

## IDE Recommendations

- **VS Code / Neovim** with ESLint + TypeScript + Tailwind CSS IntelliSense.
- Editor config: 2-space indent, LF line endings (default Next.js).

## Secrets (never commit)

| Secret | Used by |
|---|---|
| `VERCEL_TOKEN` | CI deploy |
| `VERCEL_ORG_ID` | CI deploy |
| `VERCEL_PROJECT_ID` | CI deploy |
| `STRIPE_SECRET_KEY` | Checkout (server) |
| `STRIPE_WEBHOOK_SECRET` | Webhook signature |
