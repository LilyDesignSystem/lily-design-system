# Ireland Individual Health Identifier View — Specification

Single source of truth for spec-driven development of the Ireland Individual Health Identifier View component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement: a read-only display of Ireland Individual Health Identifier (IHI).

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .ireland-individual-health-identifier-view

## Acceptance Criteria

- [ ] Renders <span> with class, aria-label
- [ ] Displays value as text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Implement all headless and example subproject files

### Backlog

- [ ] Implement tests
- [ ] Implement Blazor headless component
