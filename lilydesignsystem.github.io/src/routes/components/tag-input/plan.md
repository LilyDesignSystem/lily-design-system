# Tag Input — Implementation Plan

## Goal

Implement the Tag Input component: an input for adding and removing tags.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .tag-input

## Approach

1. Use semantic <div> element with class="tag-input"
2. Add ARIA attributes for accessibility
3. Implement keyboard navigation
4. Add vanilla JavaScript for interactive behavior
5. Implement in HTML headless (plain HTML + vanilla JS)
6. Implement in Svelte headless (Svelte 5 + runes)
7. Implement in React, Vue, Blazor headless
8. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="tag-input"
- [ ] `aria-label={label}` -- provides an accessible name for the text input
- [ ] Keyboard: Enter: When the input has a non-empty trimmed value, prevents default form submission, calls `onadd` with the trimmed value, and clears the input
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
