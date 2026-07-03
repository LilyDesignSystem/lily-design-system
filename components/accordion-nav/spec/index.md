# Accordion Nav — Specification

Single source of truth for spec-driven development of the Accordion Nav component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Accordion Nav component: a navigation container for collapsible accordion information.

## HTML Tag and CSS Class

- HTML tag: <nav>
- CSS class: .accordion-nav

## Dependencies

- Requires children: accordion-list, accordion-list-item

## Approach

1. Use semantic <nav> element with class="accordion-nav"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <nav> with class="accordion-nav"
- [ ] `role="region"` -- identifies the accordion as a landmark region
- [ ] `aria-label` -- provides an accessible name for the region, allowing screen readers to announce it
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .accordion-nav to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (accordion-nav.html)
- [ ] Implement HTML headless test (accordion-nav.test.js)
- [ ] Implement child component: accordion-list
- [ ] Implement child component: accordion-list-item

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
