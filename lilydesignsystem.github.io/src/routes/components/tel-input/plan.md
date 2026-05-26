# Tel Input — Implementation Plan

## Goal

Implement the Tel Input component: an input for entering a telephone number <input type="tel">.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .tel-input

## Companion Component

- tel-link (Input/View or Input/Link pair)

## Approach

1. Use semantic <input> element with class="tel-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <input> with class="tel-input"
- [ ] `aria-label` -- provides the accessible name for the input, set from the `label` prop
- [ ] Keyboard: Native `<input type="tel">` keyboard behavior applies (Tab to focus, type to enter digits)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
