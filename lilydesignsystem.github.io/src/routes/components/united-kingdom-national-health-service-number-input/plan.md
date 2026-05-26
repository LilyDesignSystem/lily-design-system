# United Kingdom National Health Service Number Input — Implementation Plan

## Goal

Implement the United Kingdom National Health Service Number Input component: an input for entering a UK NHS number.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .united-kingdom-national-health-service-number-input

## Approach

1. Use semantic <input> element with class="united-kingdom-national-health-service-number-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="united-kingdom-national-health-service-number-input"
- [ ] `aria-label` provides accessible name from label prop
- [ ] Keyboard: Standard text input keyboard behavior
- [ ] Keyboard: Users type digits and spaces in the format XXX XXX XXXX
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
