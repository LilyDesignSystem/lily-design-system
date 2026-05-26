# Espana Tarjeta Sanitaria Individual View — Specification

Single source of truth for spec-driven development of the Espana Tarjeta Sanitaria Individual View component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement: a read-only display of a España Tarjeta Sanitaria Individual (TSI) unique national healthcare identifier.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .espana-tarjeta-sanitaria-individual-view

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

- [ ] Implement tests for all implementations
- [ ] Implement Blazor headless component
