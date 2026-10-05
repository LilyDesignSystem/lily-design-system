# EmptyState — Specification

Single source of truth for spec-driven development of the EmptyState component.

## Goal

A container for the nothing-here-yet state of a list, table, search or inbox.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .empty-state

## Approach

1. Use the semantic <div> element with class="empty-state".
2. Add the ARIA attributes listed in `AGENTS.md`.
3. Implement the keyboard contract listed in `AGENTS.md`.
4. Svelte headless is canonical; other frameworks port its contract in their own idiom.
5. One test per documented behaviour; each must fail if the behaviour is broken.

## Acceptance Criteria

- [ ] Renders <div> with class="empty-state"
- [ ] Labelled group only when label is given
- [ ] Not a live region
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Component directory with index.md, AGENTS.md, spec/index.md
- [x] Svelte headless implementation, tests and story (canonical)

### Backlog

- [ ] Ports to the other headless frameworks
- [ ] Registry, CSS template and example-app demos
