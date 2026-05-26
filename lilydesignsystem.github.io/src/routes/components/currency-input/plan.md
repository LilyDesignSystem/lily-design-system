# Currency Input — Implementation Plan

## Goal

Implement the Currency Input component: a locale-aware currency input with automatic formatting, symbols, separators.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .currency-input

## Approach

1. Use semantic <input> element with class="currency-input"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="currency-input"
- [ ] `aria-label={label}` -- provides an accessible name describing the purpose of the currency input
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
