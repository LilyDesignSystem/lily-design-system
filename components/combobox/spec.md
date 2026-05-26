# Combobox — Specification

Single source of truth for spec-driven development of the Combobox component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Combobox component: a text input combined with a dropdown list for filtering options.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .combobox

## Approach

1. Use semantic <div> element with class="combobox"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="combobox"
- [ ] `role="combobox"` -- on the `<input>`, identifies it as a combobox widget.
- [ ] `aria-label` -- provides an accessible name for both the input and the listbox.
- [ ] `aria-expanded` -- reflects the `open` state, telling screen readers whether the dropdown is visible.
- [ ] `aria-controls` -- links the input to its associated listbox by ID.
- [ ] `aria-autocomplete="list"` -- indicates the input provides autocomplete suggestions via a list.
- [ ] `role="listbox"` -- on the dropdown container, identifies it as a list of selectable options.
- [ ] Keyboard: Escape: Closes the dropdown listbox.
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .combobox to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (combobox.html)
- [ ] Implement HTML headless test (combobox.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
