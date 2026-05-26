# URL Input — Implementation Plan

## Goal

Implement the URL Input component: an input for entering a URL <input type="url">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .url-input

## Approach

1. Use semantic <input> element with class="url-input"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="url-input"
- [ ] `aria-label={label}` -- provides the accessible name for the URL input since no visible label element is associated
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
