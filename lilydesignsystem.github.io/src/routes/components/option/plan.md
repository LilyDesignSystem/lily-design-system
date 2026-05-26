# Option — Implementation Plan

## Goal

Implement the Option component: an option element within a select dropdown.

## HTML Tag and CSS Class

- HTML tag: <option>
- CSS class: .option

## Approach

1. Use semantic <option> element with class="option"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte headless (Svelte 5 + runes)
6. Implement in React, Vue, Blazor headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <option> with class="option"
- [ ] Keyboard: Native `<option>` keyboard behavior (managed by parent `<select>`)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
