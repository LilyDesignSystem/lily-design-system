# Text Input — Implementation Plan

## Goal

Implement the Text Input component: a single-line text input field <input type="text">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .text-input

## Approach

1. Use semantic <input> element with class="text-input"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="text-input"
- [ ] `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
