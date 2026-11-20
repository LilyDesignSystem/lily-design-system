# MultiSelect — Specification

Single source of truth for spec-driven development of the MultiSelect component.

## Goal

A native select that lets the user choose several options at once.

## HTML Tag and CSS Class

- HTML tag: <select>
- CSS class: .multi-select

## Approach

1. Use the semantic <select> element with class="multi-select".
2. Add the ARIA attributes listed in `AGENTS.md`.
3. Implement the keyboard contract listed in `AGENTS.md`.
4. Svelte headless is canonical; other frameworks port its contract in their own idiom.
5. One test per documented behaviour; each must fail if the behaviour is broken.

## Acceptance Criteria

- [ ] Renders <select multiple> with class="multi-select"
- [ ] Has aria-label
- [ ] `value` array two-way binds
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
