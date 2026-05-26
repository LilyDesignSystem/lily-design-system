# Email Input — Implementation Plan

## Goal

Implement the Email Input component: an input for entering an email address <input type="email">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .email-input

## Companion Component

- email-link (Input/View or Input/Link pair)

## Approach

1. Use semantic <input> element with class="email-input"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="email-input"
- [ ] `aria-label="..."` -- provides an accessible name for the email input since it has no visible `<label>` element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
