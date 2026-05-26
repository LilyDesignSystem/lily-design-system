# Tel Input — Specification

Single source of truth for spec-driven development of the Tel Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Tel Input component: an input for entering a telephone number <input type="tel">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .tel-input

## Companion Component

- tel-link (Input/View or Input/Link pair)

## Approach

1. Use semantic <input> element with class="tel-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="tel-input"
- [ ] `aria-label` -- provides the accessible name for the input, set from the `label` prop
- [ ] Keyboard: Native `<input type="tel">` keyboard behavior applies (Tab to focus, type to enter digits)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .tel-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (tel-input.html)
- [ ] Implement HTML headless test (tel-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Verify companion component: tel-link
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
