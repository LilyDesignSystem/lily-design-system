# Hint — Implementation Plan

## Goal

Implement the Hint component: hint text providing guidance for a form field.

## HTML Tag and CSS Class

- HTML tag: <span>
- CSS class: .hint

## Approach

1. Use semantic <span> element with class="hint"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <span> with class="hint"
- [ ] `id={id}` -- provides a target for `aria-describedby` on the associated form control
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
