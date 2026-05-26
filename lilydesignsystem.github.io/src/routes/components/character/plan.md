# Character — Implementation Plan

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
