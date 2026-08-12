## Description

Brief summary of changes

## Spec References

- Spec: `specs/openapi.yaml` #/paths/~1checkout~1post
- OKF: `okf/technical-decisions.md` #ADR-003

## Graph Mapping

- **Job(s) implemented**: (e.g., checkout → session → webhook)
- **Shared state touched**: (e.g., `specs/openapi.yaml`, `data/products.json`)
- **Loops exercised**: (e.g., unit tests, lint, build)
- **Human gate**: PO review before merge

## Checklist

- [ ] Code follows TypeScript strict mode
- [ ] Tailwind classes use design tokens (`var(--color-*)`), no raw hex
- [ ] Accessibility: aria-labels on interactive elements
- [ ] Performance: Lighthouse score > 90
- [ ] Tests: unit tests pass, e2e critical path verified
- [ ] Reviewer is NOT the author (writer/checker separation)

## Linked Items

- Basecamp to-do: <link to to-do>
- OKF reference: `okf/product-backlog.md` #DS-101

## Verification

- [ ] Local `npm run lint` passes
- [ ] Local `npm run build` passes
- [ ] Vercel preview verified (link)
