# Tooltip — Specification

Single source of truth for spec-driven development of the Tooltip component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tooltip component: a small popup showing descriptive text on hover or focus.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tooltip

## Approach

1. Use semantic <div> element with class="tooltip"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="tooltip"
- [ ] `role="tooltip"` -- identifies the element as a tooltip, a popup that displays a description for an element
- [ ] `id={id}` -- used with `aria-describedby` on the trigger element to create an accessible association between the trigger and the tooltip
- [ ] Keyboard: Escape: The consumer should hide the tooltip when Escape is pressed (not built into the component; must be handled by the consumer)
- [ ] Keyboard: The tooltip itself does not receive focus; it is a supplementary description for another element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tooltip to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tooltip.html)
- [ ] Implement HTML headless test (tooltip.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
