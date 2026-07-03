# TextAreaInput — Specification

Single source of truth for spec-driven development of the TextAreaInput component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the TextAreaInput component: a multi-line text input area.

## HTML Tag and CSS Class

- HTML tag: <textarea>
- CSS class: .text-area-input

## Approach

1. Use semantic <textarea> element with class="text-area-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <textarea> with class="text-area-input"
- [ ] `aria-label={label}` -- provides an accessible name for the text-area-input since there is no visible `<label>` element
- [ ] Keyboard: Tab: Moves focus to and from the text-area-input (native browser behavior)
- [ ] Keyboard: All standard text editing keys function normally within the text-area-input (native browser behavior)
- [ ] Keyboard: Enter: Inserts a new line (does not submit forms, unlike single-line inputs)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .text-area-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (text-area-input.html)
- [ ] Implement HTML headless test (text-area-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
