# Button Input — Specification

Single source of truth for spec-driven development of the Button Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Button Input component: an input element of type button for form actions <input type="button">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .button-input

## Approach

1. Use semantic <input> element with class="button-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="button-input"
- [ ] `aria-label={label}` -- optional screen reader label override; when provided, screen readers announce this instead of the `value` text
- [ ] `aria-disabled` -- implicitly managed by the native `disabled` attribute
- [ ] Keyboard: Tab: Focus the button input
- [ ] Keyboard: Enter: Activate the button (native behavior)
- [ ] Keyboard: Space: Activate the button (native behavior)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .button-input to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (button-input.html)
- [ ] Implement HTML headless test (button-input.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
