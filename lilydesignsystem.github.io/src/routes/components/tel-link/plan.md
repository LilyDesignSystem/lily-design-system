# Tel Link — Implementation Plan

## Goal

Implement the Tel Link component: a tel hyperlink for a telephone number.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .tel-link

## Companion Component

- tel-input (Input/View or Input/Link pair)

## Approach

1. Use semantic <a> element with class="tel-link"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <a> with class="tel-link"
- [ ] `aria-label` -- when provided, gives an accessible name that provides more context than the phone number alone (e.g., describing who the number belongs to or its purpose).
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
