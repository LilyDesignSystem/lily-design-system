# MultiSelectWithExtras — Specification

Single source of truth for spec-driven development of the MultiSelectWithExtras component.

## Goal

A multiple-choice select with content before and after it.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .multi-select-with-extras

## Approach

1. Use the semantic <div> element with class="multi-select-with-extras".
2. Add the ARIA attributes listed in `AGENTS.md`.
3. Implement the keyboard contract listed in `AGENTS.md`.
4. Svelte headless is canonical; other frameworks port its contract in their own idiom.
5. One test per documented behaviour; each must fail if the behaviour is broken.

## Acceptance Criteria

- [ ] Renders <div> wrapper with class="multi-select-with-extras" around a <select multiple>
- [ ] aria-label on the select
- [ ] before/after rendered only when provided
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
