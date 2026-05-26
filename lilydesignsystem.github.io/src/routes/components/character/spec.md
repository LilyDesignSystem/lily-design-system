# Character — Specification

Single source of truth for spec-driven development of the Character component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Character component: a single character display element.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .character

## Approach

1. Use semantic <span> element with class="character"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="character"
- [ ] `role="img"` -- applied when the character is meaningful (decorative is false), indicating the span represents an image-like glyph
- [ ] `role="presentation"` -- applied when `decorative` is true, removing semantic meaning
- [ ] `aria-label` -- provides the accessible name for meaningful characters; omitted when decorative
- [ ] `aria-hidden="true"` -- applied when `decorative` is true, hiding the element from the accessibility tree
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .character to css-style-sheet-template.css

### In Progress

- [ ] Implement HTML headless component (character.html)
- [ ] Implement HTML headless test (character.test.js)

### Backlog

- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Add integration tests with parent/child components
- [ ] Cross-check against css-style-sheet-template.css
