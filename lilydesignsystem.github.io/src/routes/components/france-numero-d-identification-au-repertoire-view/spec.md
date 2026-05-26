# France Numero D Identification Au Repertoire View — Specification

Single source of truth for spec-driven development of the France Numero D Identification Au Repertoire View component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the France Numero D Identification Au Repertoire View component: a read-only display of a France NIR unique national healthcare identifier.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .france-numero-d-identification-au-repertoire-view

## Approach

1. Use semantic <span> element with class="france-numero-d-identification-au-repertoire-view"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="france-numero-d-identification-au-repertoire-view"
- [ ] `aria-label` -- provides the accessible name from the `label` prop so screen readers can announce the purpose of the displayed number
- [ ] Keyboard: None -- this is a passive display-only component
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .france-numero-d-identification-au-repertoire-view to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (france-numero-d-identification-au-repertoire-view.html)
- [ ] Implement HTML headless test (france-numero-d-identification-au-repertoire-view.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
