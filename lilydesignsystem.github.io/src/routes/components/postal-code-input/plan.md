# Postal Code Input — Implementation Plan

## Goal

Implement the Postal Code Input component: an input for entering a postal or ZIP code.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .postal-code-input

## Companion Component

- postal-code-view (Input/View or Input/Link pair)

## Approach

1. Use semantic <input> element with class="postal-code-input"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="postal-code-input"
- [ ] `aria-label={label}` -- provides an accessible name for the input since no visible `<label>` element is included
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
