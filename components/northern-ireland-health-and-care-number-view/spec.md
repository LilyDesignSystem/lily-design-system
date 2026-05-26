# Northern Ireland Health And Care Number View — Specification

Single source of truth for spec-driven development of the Northern Ireland Health And Care Number View component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement: a read-only display of Northern Ireland H&C Number.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .northern-ireland-health-and-care-number-view

## Acceptance Criteria

- [ ] Renders <span> with class, aria-label
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Implement all headless and example subproject files

### Backlog

- [ ] Implement tests
- [ ] Implement Blazor headless component
