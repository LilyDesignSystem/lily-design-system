# Tel Link — Specification

Single source of truth for spec-driven development of the Tel Link component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tel Link component: a tel hyperlink for a telephone number.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .tel-link

## Companion Component

- tel-input (Input/View or Input/Link pair)

## Approach

1. Use semantic <a> element with class="tel-link"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="tel-link"
- [ ] `aria-label` -- when provided, gives an accessible name that provides more context than the phone number alone (e.g., describing who the number belongs to or its purpose).
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tel-link to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tel-link.html)
- [ ] Implement HTML headless test (tel-link.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: tel-input
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
