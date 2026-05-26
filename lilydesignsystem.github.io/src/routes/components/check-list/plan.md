# Check List — Implementation Plan

## Goal

Implement the Check List component: an ordered list of check list item components.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .check-list

## Dependencies

- Requires children: check-list-item

## Approach

1. Use semantic <ol> element with class="check-list"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="check-list"
- [ ] `role="list"` -- explicit list role on the `<ul>` ensures assistive technologies treat it as a list
- [ ] `aria-label` -- optional accessible name describing the purpose of the checklist
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
