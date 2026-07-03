# Northern Ireland Health And Care Number Input — Specification

Single source of truth for spec-driven development of the Northern Ireland Health And Care Number Input component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Northern Ireland Health And Care Number Input component: an input for entering a Northern Ireland Health and Care (H&C) Number unique national healthcare identifier.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .northern-ireland-health-and-care-number-input

## Approach

1. Use semantic <input> element with class="northern-ireland-health-and-care-number-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="northern-ireland-health-and-care-number-input"
- [ ] `aria-label` provides accessible name from label prop
- [ ] Pattern: `[0-9]{3} [0-9]{3} [0-9]{4}` (3-3-4 digits)
- [ ] `inputmode="numeric"` for numeric keyboard on mobile
- [ ] `autocomplete="off"` to protect sensitive health identifiers
- [ ] Keyboard: Standard text input keyboard behavior
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Implement HTML headless component
- [x] Implement Svelte headless component
- [x] Implement React headless component
- [x] Implement Vue headless component

### In Progress

- [ ] Add CSS class .northern-ireland-health-and-care-number-input to css-style-sheet-template.css

### Backlog

- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
