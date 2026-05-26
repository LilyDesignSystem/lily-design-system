# Don't List — Implementation Plan

## Goal

Implement the Don't List component: a guideline list of discouraged dont-list-item components.

## HTML Tag and CSS Class

- HTML tag: <ol>
- CSS class: .dont-list

## Dependencies

- Requires children: dont-list-item

## Approach

1. Use semantic <ol> element with class="dont-list"
2. Add ARIA attributes for accessibility
3. Implement in HTML headless (plain HTML + vanilla JS)
4. Implement in Svelte headless (Svelte 5 + runes)
5. Implement in React, Vue, Blazor headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <ol> with class="dont-list"
- [ ] `role="list"` -- explicitly declares list semantics on the `<ul>`, ensuring assistive technology announces it as a list
- [ ] `aria-label={label}` -- provides an accessible name for the list (defaults to "Don't")
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations
