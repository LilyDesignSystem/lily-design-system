# Grail Layout Bottom Footer — Specification

Single source of truth for spec-driven development of the Grail Layout Bottom Footer component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Grail Layout Bottom Footer component: grail layout bottom footer full width with <footer> tag.

## HTML Tag and CSS Class

- HTML tag: <footer>
- CSS class: .grail-layout-bottom-footer

## Dependencies

- Requires parent: grail-layout

## Approach

1. Use semantic <footer> element with class="grail-layout-bottom-footer"
2. Implement in HTML headless (plain HTML + vanilla JS)
3. Implement in Svelte headless (Svelte 5 + runes)
4. Implement in React, Vue, Blazor headless
5. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <footer> with class="grail-layout-bottom-footer"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .grail-layout-bottom-footer to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (grail-layout-bottom-footer.html)
- [ ] Implement HTML headless test (grail-layout-bottom-footer.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
