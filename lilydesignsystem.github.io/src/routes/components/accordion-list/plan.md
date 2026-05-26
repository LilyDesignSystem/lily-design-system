# accordion list — Implementation Plan

## Goal

Implement the accordion list component: an ordered list of accordion list item components.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .accordion-list

## Dependencies

- Requires parent: accordion-nav
- Requires children: accordion-list-item

## Approach

1. Use semantic <ol> element with class="accordion-list"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="accordion-list"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
