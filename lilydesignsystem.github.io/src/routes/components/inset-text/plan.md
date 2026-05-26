# Inset Text — Implementation Plan

## Goal

Implement the Inset Text component: indented text to distinguish it from surrounding content.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .inset-text

## Approach

1. Use semantic <div> element with class="inset-text"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="inset-text"
- [ ] `role="note"` -- identifies the content as a note or supplementary information, so screen readers announce it with appropriate context.
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
