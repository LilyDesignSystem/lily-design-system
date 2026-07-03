# Email Link — Specification

Single source of truth for spec-driven development of the Email Link component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Email Link component: a mailto hyperlink for an email address.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .email-link

## Companion Component

- email-input (Input/View or Input/Link pair)

## Approach

1. Use semantic <a> element with class="email-link"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="email-link"
- [ ] `aria-label="..."` -- optional override for the accessible name when the visible email text alone is insufficient context
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .email-link to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (email-link.html)
- [ ] Implement HTML headless test (email-link.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: email-input
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
