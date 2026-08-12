# Desi Saga — API Specs (Contract-First)

> **Context Engineering layer** — these specs are the source of truth for API contracts. Implementation code derives from them (spec-driven development per Martin Fowler). Each spec node feeds the knowledge graph; see `docs/knowledge-graph.md`.

## Status

| Spec | Endpoint | Status |
|---|---|---|
| `openapi.yaml` | Product catalog, cart, checkout, webhook | Draft (contract-first, not yet served) |

## How to Use

1. **Author the contract** in `openapi.yaml` before implementing.
2. **Generate types** from the spec into `src/types/`:
   ```bash
   npm i -D openapi-typescript
   npx openapi-typescript specs/openapi.yaml -o src/types/api.ts
   ```
3. Implement server routes against the contract.
4. On any change, regenerate types and update the knowledge graph.

## Scope (MVP)

- Product catalog (list, get by slug, filter by category)
- Cart operations (add, remove, update quantity)
- Checkout session creation (Stripe test mode)
- Order webhook (payment success)

## Out of Scope (later)

- Auth/user accounts
- Admin/order management API
- Real Stripe keys
